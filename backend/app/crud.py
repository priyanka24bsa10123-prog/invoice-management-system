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

def get_invoice_by_id(db: Session, invoice_id: int):
    # Get a single invoice by ID
    invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    # Auto-calculate the total sum of all line items
    invoice.total_amount = sum(item.line_total for item in invoice.details)
    return invoice

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

def update_invoice(db: Session, invoice_id: int, invoice_update: schemas.InvoiceCreate):
    # Get the invoice to update
    db_invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Update invoice fields
    db_invoice.customer_name = invoice_update.customer_name
    db_invoice.date = invoice_update.date
    
    # Delete existing details and create new ones
    db.query(models.InvoiceDetail).filter(models.InvoiceDetail.invoice_id == invoice_id).delete()
    
    # Add updated line items
    for item in invoice_update.details:
        line_total = item.quantity * item.unit_price
        db_detail = models.InvoiceDetail(
            description=item.description,
            quantity=item.quantity,
            unit_price=item.unit_price,
            line_total=line_total,
            invoice_id=db_invoice.id
        )
        db.add(db_detail)
    
    db.commit()
    db.refresh(db_invoice)
    # Calculate final total for response
    db_invoice.total_amount = sum(item.line_total for item in db_invoice.details)
    return db_invoice