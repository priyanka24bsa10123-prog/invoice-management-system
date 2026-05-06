import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, ChevronRight } from 'lucide-react';

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
        await axios.put(`http://127.0.0.1:8000/api/invoices/${editingInvoice.id}`, invoice);
        alert('Invoice Updated Successfully!');
      } else {
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
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {editingInvoice ? 'Edit invoice' : 'New invoice'}
          </h1>
        </div>

        {/* Client Section */}
        <div className="bg-purple-100 rounded-lg p-8 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Client</label>
            <input
              type="text"
              placeholder="Enter client name"
              required
              disabled={!!editingInvoice}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
              value={invoice.customer_name}
              onChange={(e) => setInvoice({...invoice, customer_name: e.target.value})}
            />
          </div>

          {/* Invoice Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Invoice Number</label>
              <input
                type="text"
                placeholder="INV-001"
                required
                disabled={!!editingInvoice}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                value={invoice.invoice_number}
                onChange={(e) => setInvoice({...invoice, invoice_number: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Date</label>
              <input
                type="date"
                required
                disabled={!!editingInvoice}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                value={invoice.date}
                onChange={(e) => setInvoice({...invoice, date: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Line Items Section */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Invoice Items</h2>

          {/* Line Items Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 mb-4 pb-4 border-b-2 border-gray-200">
            <div className="col-span-5">
              <label className="text-sm font-semibold text-gray-700">Description</label>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-semibold text-gray-700">Qty</label>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-semibold text-gray-700">Price</label>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-semibold text-gray-700">Total</label>
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            {invoice.details.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <label className="md:hidden text-xs font-semibold text-gray-600 block mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Item description"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={item.description}
                    onChange={(e) => {
                      const d = [...invoice.details];
                      d[index].description = e.target.value;
                      setInvoice({...invoice, details: d});
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="md:hidden text-xs font-semibold text-gray-600 block mb-1">Qty</label>
                  <input
                    type="number"
                    placeholder="Qty"
                    required
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={item.quantity}
                    onChange={(e) => {
                      const d = [...invoice.details];
                      d[index].quantity = parseInt(e.target.value) || 1;
                      setInvoice({...invoice, details: d});
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="md:hidden text-xs font-semibold text-gray-600 block mb-1">Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={item.unit_price}
                    onChange={(e) => {
                      const d = [...invoice.details];
                      d[index].unit_price = parseFloat(e.target.value) || 0;
                      setInvoice({...invoice, details: d});
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="md:hidden text-xs font-semibold text-gray-600 block mb-1">Total</label>
                  <div className="px-4 py-3 bg-gray-100 rounded-lg text-right font-semibold text-gray-700">
                    ${calculateLineTotal(item)}
                  </div>
                </div>
                <div className="md:col-span-1">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <button
            type="button"
            onClick={addItem}
            className="mt-6 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 font-semibold transition flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add item
          </button>
        </div>

        {/* Total Section */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-sm flex justify-end">
          <div className="w-full md:w-64">
            <div className="flex justify-between mb-4 pb-4 border-b-2 border-gray-200">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">${calculateTotal()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total Amount:</span>
              <span className="text-3xl font-bold text-purple-600">${calculateTotal()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          {editingInvoice && (
            <button
              type="button"
              onClick={onCloseEdit}
              className="px-8 py-3 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center gap-2 disabled:bg-purple-400"
          >
            {isLoading ? 'Saving...' : (
              <>
                {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;