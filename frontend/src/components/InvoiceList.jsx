import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const InvoiceList = ({ onEdit, refreshTrigger }) => {
    const [invoices, setInvoices] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, [refreshTrigger]);

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/invoices/');
            const data = await response.json();
            setInvoices(data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            alert('Failed to fetch invoices');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/invoices/${id}`);
            alert('Invoice deleted successfully!');
            setDeleteConfirm(null);
            fetchInvoices();
        } catch (error) {
            console.error('Error deleting invoice:', error);
            alert('Failed to delete invoice');
        }
    };

    const handleEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/invoices/${id}`);
            const invoice = await response.json();
            onEdit(invoice);
        } catch (error) {
            console.error('Error fetching invoice:', error);
            alert('Failed to fetch invoice details');
        }
    };

    const filteredInvoices = invoices.filter(inv => 
        inv.customer_name.toLowerCase().includes(search.toLowerCase())
    );

    const calculateTotal = (details) => {
        return details.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Invoices</h2>
                <input 
                    type="text" 
                    placeholder="Search by customer name..." 
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                    <p className="text-lg">Loading invoices...</p>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredInvoices.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
                    <p className="text-lg">No invoices found</p>
                </div>
            )}

            {/* Table */}
            {!isLoading && filteredInvoices.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-900 text-white">
                                    <th className="px-6 py-4 text-left font-semibold">Invoice #</th>
                                    <th className="px-6 py-4 text-left font-semibold">Customer</th>
                                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                                    <th className="px-6 py-4 text-right font-semibold">Total</th>
                                    <th className="px-6 py-4 text-center font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((inv, index) => (
                                    <tr key={inv.id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50 transition`}>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{inv.invoice_number}</td>
                                        <td className="px-6 py-4 text-gray-700">{inv.customer_name}</td>
                                        <td className="px-6 py-4 text-gray-700">{new Date(inv.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right font-bold text-green-600">
                                            ${calculateTotal(inv.details)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleEdit(inv.id)}
                                                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium text-sm"
                                                >
                                                    <Edit2 size={16} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(inv.id)}
                                                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm"
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle size={24} className="text-red-500" />
                            <h3 className="text-xl font-bold text-gray-800">Delete Invoice</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this invoice? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceList;