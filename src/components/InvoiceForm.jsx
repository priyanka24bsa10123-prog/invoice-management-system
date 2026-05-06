import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save } from 'lucide-react';

const InvoiceForm = () => {
  const [invoice, setInvoice] = useState({
    invoice_number: '',
    customer_name: '',
    date: new Date().toISOString().split('T')[0],
    details: [{ description: '', quantity: 1, unit_price: 0 }]
  });

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
    try {
      // This sends the master and detail records in one single request
      await axios.post('http://127.0.0.1:8000/api/invoices/', invoice);
      alert('Invoice Saved Successfully!');
    } catch (error) {
      console.error(error);
      alert('Error saving invoice. Make sure your backend is running!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Invoice</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
          <input 
            type="text" required className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
            onChange={(e) => setInvoice({...invoice, invoice_number: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input 
            type="text" required className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
            onChange={(e) => setInvoice({...invoice, customer_name: e.target.value})} 
          />
        </div>
      </div>

      <h3 className="font-semibold mb-3 text-gray-700">Line Items</h3>
      <div className="space-y-3">
        {invoice.details.map((item, index) => (
          <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-md">
            <input 
              type="text" placeholder="Description" required className="flex-1 border p-2 rounded"
              onChange={(e) => {
                const d = [...invoice.details];
                d[index].description = e.target.value;
                setInvoice({...invoice, details: d});
              }}
            />
            <input 
              type="number" placeholder="Qty" className="w-20 border p-2 rounded"
              onChange={(e) => {
                const d = [...invoice.details];
                d[index].quantity = parseInt(e.target.value) || 0;
                setInvoice({...invoice, details: d});
              }}
            />
            <input 
              type="number" placeholder="Price" className="w-32 border p-2 rounded"
              onChange={(e) => {
                const d = [...invoice.details];
                d[index].unit_price = parseFloat(e.target.value) || 0;
                setInvoice({...invoice, details: d});
              }}
            />
            <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t">
        <button type="button" onClick={addItem} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
          <Plus size={18} /> Add Item
        </button>
        <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2 rounded font-bold hover:bg-blue-700 transition">
          <Save size={18} /> Save Invoice
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;