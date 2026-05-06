import { useState } from 'react';
import InvoiceForm from './components/InvoiceForm'
import InvoiceList from './components/InvoiceList'

function App() {
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
  };

  const handleCloseEdit = () => {
    setEditingInvoice(null);
  };

  const handleSaveSuccess = () => {
    setEditingInvoice(null);
    setRefreshList(!refreshList);
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Invoice Pro System</h1>
          <p className="text-gray-600">Manage and track your invoices efficiently</p>
        </div>

        {/* Form Section */}
        <div className="mb-12">
          <InvoiceForm 
            editingInvoice={editingInvoice} 
            onCloseEdit={handleCloseEdit}
            onSaveSuccess={handleSaveSuccess}
          />
        </div>

        {/* Divider */}
        <div className="my-8 border-t-2 border-gray-300"></div>

        {/* List Section */}
        <div>
          <InvoiceList 
            onEdit={handleEdit}
            refreshTrigger={refreshList}
          />
        </div>
      </div>
    </div>
  )
}

export default App
