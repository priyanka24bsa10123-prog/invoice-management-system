from pydantic import BaseModel
from typing import List
from datetime import date

# This describes a single item on the invoice
class InvoiceDetailBase(BaseModel):
    description: str
    quantity: int
    unit_price: float

# This is the "Receipt" template the waiter was looking for[cite: 1]
class InvoiceDetailResponse(InvoiceDetailBase):
    id: int
    line_total: float # The math (qty * price) happens here[cite: 1]

    class Config:
        from_attributes = True

# This is what the user sends to us
class InvoiceCreate(BaseModel):
    invoice_number: str
    customer_name: str
    date: date
    details: List[InvoiceDetailBase]

# This is the final receipt we show back to the user[cite: 1]
class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    customer_name: str
    date: date
    details: List[InvoiceDetailResponse]
    total_amount: float # The total math happens here[cite: 1]

    class Config:
        from_attributes = True