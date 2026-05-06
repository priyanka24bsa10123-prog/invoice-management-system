from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Import your local project files
from . import models, schemas, crud
from .database import SessionLocal, engine

# Initialize the database tables
models.Base.metadata.create_all(bind=engine)

# 1. Define the app object FIRST
app = FastAPI(title="Invoice Management System")

# 2. Add CORS Middleware SECOND (Fixes the 405/Connection errors)
app.add_middleware(
    CORSMiddleware,
    ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Requirement: Create invoice with line items in single request
@app.post("/api/invoices/", response_model=schemas.InvoiceResponse)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    return crud.create_invoice(db=db, invoice=invoice)

# Requirement: Paginated GET requests
@app.get("/api/invoices/", response_model=List[schemas.InvoiceResponse])
def read_invoices(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_invoices(db, skip=skip, limit=limit)

# Get a single invoice by ID
@app.get("/api/invoices/{invoice_id}", response_model=schemas.InvoiceResponse)
def read_invoice(invoice_id: int, db: Session = Depends(get_db)):
    return crud.get_invoice_by_id(db=db, invoice_id=invoice_id)

# Update an invoice
@app.put("/api/invoices/{invoice_id}", response_model=schemas.InvoiceResponse)
def update_invoice(invoice_id: int, invoice_update: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    return crud.update_invoice(db=db, invoice_id=invoice_id, invoice_update=invoice_update)

# Requirement: Delete functionality
@app.delete("/api/invoices/{invoice_id}")
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    db_invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    db.delete(db_invoice)
    db.commit()
    return {"message": "Invoice deleted successfully"}