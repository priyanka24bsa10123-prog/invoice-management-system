from sqlalchemy.orm import Session
from . import models, schemas
from fastapi import HTTPException

def get_invoices(db: Session, skip: int = 0, limit: int = 10):
    # Requirement: Support paginated GET requests
    invoices = db.query(models.Invoice).offset(skip).limit(limit).all()
    for inv in invoices:
        # Auto-calculate the total sum of all line items
        inv.total_amount = sum(item.line_total for item in inv.details)
    return invoices

def create_invoice(db: Session, invoice: schemas.InvoiceCreate):
    # Check if invoice number already exists[cite: 1]
    existing = db.query(models.Invoice).filter(models.Invoice.invoice_number == invoice.invoice_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Invoice number already exists")

    # Create the main invoice[cite: 1]
    db_invoice = models.Invoice(
        invoice_number=invoice.invoice_number,
        customer_name=invoice.customer_name,
        date=invoice.date
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)

    # Process and auto-calculate line items[cite: 1]
    for item in invoice.details:
        line_total = item.quantity * item.unit_price # Requirement[cite: 1]
        db_detail = models.InvoiceDetail(
            **item.dict(),
            invoice_id=db_invoice.id,
            line_total=line_total
        )
        db.add(db_detail)
    
    db.commit()
    db.refresh(db_invoice)
    # Calculate final total for response[cite: 1]
    db_invoice.total_amount = sum(item.line_total for item in db_invoice.details)
    return db_invoice