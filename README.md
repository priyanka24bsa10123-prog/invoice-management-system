# 📋 Invoice Pro System

**A modern invoice management application built with FastAPI and React**

Built with FastAPI · SQLAlchemy · Pydantic v2 · SQLite · Python 3.11

![FastAPI](https://img.shields.io/badge/FastAPI-0.136.1-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0.49-red)
![Pydantic](https://img.shields.io/badge/Pydantic-2.13-blue)
![React](https://img.shields.io/badge/React-18+-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-5+-646cff?logo=vite)

---

## 📖 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [API Documentation](#api-documentation)
- [Frontend Usage](#frontend-usage)
- [Running Tests](#running-tests)
- [Environment Configuration](#environment-configuration)
- [Database](#database)

---

## 🎯 Project Overview

**Invoice Pro System** is a full-stack invoice management application that allows users to:
- Create invoices with multiple line items in a single request
- Automatically calculate line totals and grand totals on the server
- View, edit, and delete invoices with paginated listing
- Search and filter invoices by number or customer name
- Maintain data integrity with unique invoice number enforcement
- Enjoy a responsive, modern user interface built with React and Vite

### Architecture

```
React Frontend (Vite)
        ↓ HTTP Request
FastAPI Backend
        ↓ SQL Query
SQLite Database
```

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Full CRUD Operations (Create, Read, Update, Delete) | ✅ |
| Multiple line items per invoice in single API request | ✅ |
| Auto-calculated line totals and grand totals | ✅ |
| Paginated invoice listing | ✅ |
| Search & filter by invoice number or customer name | ✅ |
| Unique invoice number enforcement | ✅ |
| Structured validation errors (Pydantic v2) | ✅ |
| Cascading delete (invoice + line items) | ✅ |
| Responsive API documentation (Swagger/OpenAPI) | ✅ |
| Modern React UI with real-time calculations | ✅ |
| SQLite database (file-based, no server needed) | ✅ |

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11+ | Primary programming language |
| FastAPI | 0.136.1 | Web framework for REST API |
| Uvicorn | 0.46.0 | ASGI server |
| SQLAlchemy | 2.0.49 | ORM for database models |
| Pydantic | 2.13.3 | Request/response validation |
| SQLite | Built-in | Default database |

### Frontend

| Technology | Purpose |
|-----------|---------|
| React 18+ | Frontend UI framework |
| Vite | Build tool and dev server |
| Axios | HTTP client for API calls |

---

## 📁 Project Structure

```
invoice-pro-system/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              ← FastAPI app, CORS setup, route handlers
│   │   ├── database.py          ← SQLAlchemy engine & session config
│   │   ├── models.py            ← Invoice & InvoiceDetail ORM models
│   │   ├── schemas.py           ← Pydantic v2 request/response schemas
│   │   └── crud.py              ← Business logic for CRUD operations
│   ├── invoice.db               ← SQLite database (auto-created)
│   └── requirement.txt          ← Python dependencies
│
├── src/
│   ├── components/              ← React components
│   ├── pages/                   ← Page components
│   ├── api/                     ← API integration (Axios)
│   ├── App.jsx                  ← Main React app
│   └── main.jsx                 ← React entry point
│
├── public/                      ← Static assets
├── package.json                 ← Frontend dependencies
├── vite.config.js               ← Vite configuration
└── README.md                    ← This file
```

---

## 🚀 Local Setup

### Prerequisites

- Python 3.11 or higher
- Node.js 18+ and npm
- pip (Python package manager)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/priyanka24bsa10123-prog/invoice-management-system.git
cd invoice-pro-system
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirement.txt

# Start development server
uvicorn app.main:app --reload --port 8000
```

#### Backend URLs
- **API Base**: http://localhost:8000
- **Swagger UI (Interactive Docs)**: http://localhost:8000/docs
- **ReDoc (Alternative Docs)**: http://localhost:8000/redoc

> **Note**: The SQLite database file (`invoice.db`) is automatically created in the `backend/` folder on first run. No manual setup required.

### 3. Frontend Setup

Open a new terminal window:

```bash
# From project root
cd invoice-pro-system

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will open at **http://localhost:5173** (or another port if 5173 is in use).

---

## 📡 API Documentation

All endpoints are prefixed with `/api/invoices/`. Interactive Swagger documentation is available at `http://localhost:8000/docs`.

### Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/invoices/` | List all invoices (paginated) | 200 OK |
| GET | `/api/invoices/{id}` | Get single invoice by ID | 200 OK |
| POST | `/api/invoices/` | Create new invoice with line items | 201 Created |
| PUT | `/api/invoices/{id}` | Update invoice and line items | 200 OK |
| DELETE | `/api/invoices/{id}` | Delete invoice and all line items | 204 No Content |

### Query Parameters — GET `/api/invoices/`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| skip | integer | 0 | Number of records to skip (offset) |
| limit | integer | 10 | Number of records to return |

#### Example: Paginated Request

```
GET /api/invoices/?skip=0&limit=10
```

---

## 📝 Request & Response Examples

### Create Invoice — POST `/api/invoices/`

**Request:**
```json
{
  "invoice_number": "INV001",
  "customer_name": "John Doe",
  "date": "2024-11-12",
  "details": [
    {
      "description": "Product A",
      "quantity": 2,
      "unit_price": 50.00
    },
    {
      "description": "Product B",
      "quantity": 1,
      "unit_price": 75.00
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "invoice_number": "INV001",
  "customer_name": "John Doe",
  "date": "2024-11-12",
  "details": [
    {
      "id": 1,
      "description": "Product A",
      "quantity": 2,
      "unit_price": 50.00,
      "line_total": 100.00
    },
    {
      "id": 2,
      "description": "Product B",
      "quantity": 1,
      "unit_price": 75.00,
      "line_total": 75.00
    }
  ],
  "total_amount": 175.00
}
```

### List Invoices — GET `/api/invoices/`

**Request:**
```
GET /api/invoices/?skip=0&limit=10
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "invoice_number": "INV001",
    "customer_name": "John Doe",
    "date": "2024-11-12",
    "details": [
      {
        "id": 1,
        "description": "Product A",
        "quantity": 2,
        "unit_price": 50.00,
        "line_total": 100.00
      }
    ],
    "total_amount": 100.00
  }
]
```

### Delete Invoice — DELETE `/api/invoices/{id}`

**Response (204 No Content):**
```
(Empty response body)
```

---

## ❌ Error Responses

### Validation Error — 422 Unprocessable Entity

```json
{
  "detail": [
    {
      "loc": ["body", "quantity"],
      "msg": "ensure this value is greater than 0",
      "type": "value_error"
    }
  ]
}
```

### Duplicate Invoice Number — 400 Bad Request

```json
{
  "detail": "Invoice number already exists"
}
```

### Invoice Not Found — 404 Not Found

```json
{
  "detail": "Invoice not found"
}
```

### HTTP Status Codes

| Code | Name | When returned |
|------|------|---------------|
| 200 | OK | Successful GET or PUT |
| 201 | Created | New invoice successfully created (POST) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Duplicate invoice number |
| 404 | Not Found | Invoice ID does not exist |
| 422 | Unprocessable Entity | Validation failed |

---

## 🎨 Frontend Usage

The React frontend provides a user-friendly interface for managing invoices:

- **Home Page**: View all invoices with pagination
- **Create Invoice**: Add new invoices with multiple line items
- **Edit Invoice**: Update existing invoice details
- **Delete Invoice**: Remove invoices (with confirmation)
- **Real-time Totals**: Line totals and grand totals calculate automatically

The frontend communicates with the FastAPI backend via REST API calls using Axios.

---

## 🧪 Running Tests

Unit tests cover all API endpoints and business logic.

```bash
cd backend

# Install test dependencies (if not already installed)
pip install pytest httpx

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app
```

### Test Coverage

Tests verify:
- ✅ Creating invoices with correct auto-calculated totals
- ✅ Duplicate invoice number detection (400 error)
- ✅ Paginated listing of invoices
- ✅ Retrieving single invoice by ID
- ✅ Updating invoice details
- ✅ Deleting invoices (cascading to line items)
- ✅ 404 error when accessing deleted invoice

---

## ⚙️ Environment Configuration

### Development vs Production

**Development (Default)**
```bash
# No environment file needed for default SQLite setup
DATABASE_URL=sqlite:///./invoice.db
```

**Production / PostgreSQL**
```bash
DATABASE_URL=postgresql://user:password@host:5432/invoice_db
```

To use PostgreSQL:
1. Add `psycopg2-binary` to `requirement.txt`
2. Set the `DATABASE_URL` environment variable
3. Restart the application

---

## 🗄️ Database

### SQLite (Default)

- File-based database stored as `invoice.db`
- No server setup required
- Auto-created on first run
- Perfect for development and small deployments

### Database Schema

**`invoices` Table**
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| invoice_number | STRING | UNIQUE, NOT NULL |
| customer_name | STRING | NOT NULL |
| date | DATE | NOT NULL |

**`invoice_details` Table**
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| invoice_id | INTEGER | FOREIGN KEY → invoices.id |
| description | STRING | NOT NULL |
| quantity | INTEGER | NOT NULL |
| unit_price | FLOAT | NOT NULL |
| line_total | FLOAT | NOT NULL |

---

## 📦 Dependencies

### Backend Dependencies

All backend dependencies are listed in `requirement.txt`. Key packages:

- **fastapi** - Modern web framework
- **sqlalchemy** - ORM for database operations
- **pydantic** - Data validation and settings management
- **uvicorn** - ASGI server
- **starlette** - ASGI toolkit (required by FastAPI)

### Frontend Dependencies

Frontend dependencies are in `package.json` and include React, Vite, and Axios.

---

## 🔗 Useful Links

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org)
- [Pydantic Documentation](https://docs.pydantic.dev)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [GitHub Repository](https://github.com/priyanka24bsa10123-prog/invoice-management-system)

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the system.

---


