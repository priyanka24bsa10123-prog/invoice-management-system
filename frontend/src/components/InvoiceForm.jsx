import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save, X } from 'lucide-react';

const InvoiceForm = ({ editingInvoice, onCloseEdit, onSaveSuccess }) => {
  const [invoice, setInvoice] = useState({
    invoice_number: '',
    customer_name: '',
    date: new Date().toISOString().split('T')[0],
    details: [{ description: '', quantity: 1, unit_price: 0 }]
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingInvoice) {
      setInvoice({
        invoice_number: editingInvoice.invoice_number,
        customer_name: editingInvoice.customer_name,
        date: editingInvoice.date,
        details: editingInvoice.details.map(d => ({
          description: d.description,
          quantity: d.quantity,
          unit_price: d.unit_price
        }))
      });
    } else {
      setInvoice({
        invoice_number: '',
        customer_name: '',
        date: new Date().toISOString().split('T')[0],
        details: [{ description: '', quantity: 1, unit_price: 0 }]
      });
    }
  }, [editingInvoice]);

  const addItem = () => {
    setInvoice({
      ...invoice,
      details: [...invoice.details, { description: '', quantity: 1, unit_price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newDetails = invoice.details.filter((_, i) => i !== index);
    setInvoice({ ...invoice, details: newDetails });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editingInvoice) {
        // Update existing invoice
        await axios.put(`http://127.0.0.1:8000/api/invoices/${editingInvoice.id}`, invoice);
        alert('Invoice Updated Successfully!');
      } else {
        // Create new invoice
        await axios.post('http://127.0.0.1:8000/api/invoices/', invoice);
        alert('Invoice Saved Successfully!');
      }
      
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || 'Error saving invoice. Make sure your backend is running!');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLineTotal = (item) => {
    return (item.quantity * item.unit_price).toFixed(2);
  };

  const calculateTotal = () => {
    return invoice.details.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-8 max-w-5xl mx-auto bg-white shadow-xl rounded-lg border border-gray-200 relative"
    >
      {/* Close button for edit mode */}
      {editingInvoice && (
        <button
          type="button"
          onClick={onCloseEdit}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X size={24} />
        </button>
      )}

      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
      </h2>
      
      {/* Invoice Details Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Invoice Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
            <input 
              type="text" 
              required 
              disabled={!!editingInvoice}
              className="w-full border border-gray-300 p-3 rounded-md bg-white disabled:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={invoice.invoice_number}
              onChange={(e) => setInvoice({...invoice, invoice_number: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input 
              type="text" 
              required 
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={invoice.customer_name}
              onChange={(e) => setInvoice({...invoice, customer_name: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input 
              type="date" 
              required 
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={invoice.date}
              onChange={(e) => setInvoice({...invoice, date: e.target.value})} 
            />
          </div>
        </div>
      </div>

      {/* Line Items Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Line Items</h3>
        <div className="space-y-3 mb-4">
          {invoice.details.map((item, index) => (
            <div key={index} className="flex gap-3 items-end bg-white p-4 rounded-md border border-gray-200 hover:shadow-md transition">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-600">Description</label>
                <input 
                  type="text" 
                  placeholder="Item description" 
                  required 
                  className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={item.description}
                  onChange={(e) => {
                    const d = [...invoice.details];
                    d[index].description = e.target.value;
                    setInvoice({...invoice, details: d});
                  }}
                />
              </div>
              <div className="w-20">
                <label className="text-xs font-medium text-gray-600">Qty</label>
                <input 
                  type="number" 
                  placeholder="Qty" 
                  required
                  min="1"
                  className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={item.quantity}
                  onChange={(e) => {
                    const d = [...invoice.details];
                    d[index].quantity = parseInt(e.target.value) || 1;
                    setInvoice({...invoice, details: d});
                  }}
                />
              </div>
              <div className="w-28">
                <label className="text-xs font-medium text-gray-600">Price</label>
                <input 
                  type="number" 
                  placeholder="Price" 
                  required
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={item.unit_price}
                  onChange={(e) => {
                    const d = [...invoice.details];
                    d[index].unit_price = parseFloat(e.target.value) || 0;
                    setInvoice({...invoice, details: d});
                  }}
                />
              </div>
              <div className="w-24">
                <label className="text-xs font-medium text-gray-600">Total</label>
                <div className="p-2 bg-gray-100 rounded mt-1 text-right font-semibold text-gray-700">
                  ${calculateLineTotal(item)}
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => removeItem(index)} 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Item Button */}
        <button 
          type="button" 
          onClick={addItem} 
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition font-medium"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Total Section */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8 border-2 border-blue-200">
        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-gray-600 mb-2">Total Amount:</p>
            <p className="text-4xl font-bold text-blue-600">${calculateTotal()}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        {editingInvoice && (
          <button 
            type="button" 
            onClick={onCloseEdit} 
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
        )}
        <div className="flex-1"></div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition disabled:bg-blue-400"
        >
          <Save size={18} /> {isLoading ? 'Saving...' : editingInvoice ? 'Update Invoice' : 'Save Invoice'}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;