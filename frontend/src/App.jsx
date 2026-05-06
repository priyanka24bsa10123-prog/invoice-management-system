import { useState } from 'react';
import InvoiceForm from './components/InvoiceForm'
import InvoiceList from './components/InvoiceList'

function App() {
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleCloseEdit = () => {
    setEditingInvoice(null);
  };

  const handleSaveSuccess = () => {
    setEditingInvoice(null);
    setRefreshList(!refreshList);
    setShowForm(false);
  };

  return (
    <div className="App">
      {showForm ? (
        <div>
          <InvoiceForm 
            editingInvoice={editingInvoice} 
            onCloseEdit={handleCloseEdit}
            onSaveSuccess={handleSaveSuccess}
          />
          <div className="max-w-4xl mx-auto p-6">
            <button
              onClick={() => setShowForm(false)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Invoices
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-6xl mx-auto p-6">
            <button
              onClick={() => setShowForm(true)}
              className="mb-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
            >
              + New Invoice
            </button>
            <InvoiceList 
              onEdit={handleEdit}
              refreshTrigger={refreshList}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
