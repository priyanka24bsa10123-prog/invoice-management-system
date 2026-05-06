import React, { useState, useEffect } from 'react';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('http://localhost:8000/api/invoices/')
            .then(res => res.json())
            .then(data => setInvoices(data));
    }, []);

    const filteredInvoices = invoices.filter(inv => 
        inv.customer_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="mt-10 p-4">
            <h2 className="text-2xl font-bold mb-4">Invoice List</h2>
            <input 
                type="text" 
                placeholder="Search by customer..." 
                className="border p-2 mb-4 w-full"
                onChange={(e) => setSearch(e.target.value)}
            />
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Invoice #</th>
                        <th className="border p-2">Customer</th>
                        <th className="border p-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInvoices.map(inv => (
                        <tr key={inv.id}>
                            <td className="border p-2">{inv.invoice_number}</td>
                            <td className="border p-2">{inv.customer_name}</td>
                            <td className="border p-2">{inv.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceList;