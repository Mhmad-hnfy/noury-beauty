"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';

export default function OrdersManager() {
    const { t, isRTL } = useStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setOrders(data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const { error: updateError } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', id);

            if (updateError) throw updateError;
            
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
            if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
        } catch (err) {
            alert(err.message);
        }
    };
    
    const handleDeleteOrder = async (id) => {
        if (!confirm(isRTL ? "هل أنت متأكد من حذف هذا الطلب؟" : "Are you sure you want to delete this order?")) return;
        
        try {
            setIsDeleting(true);
            const { error: deleteError } = await supabase
                .from('orders')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            setOrders(orders.filter(o => o.id !== id));
            setSelectedOrder(null);
        } catch (err) {
            alert(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-serif text-black">{t('admin_orders')}</h3>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{orders.length} {t('admin_orders')}</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {error && (
                        <div className="p-10 bg-red-50 text-red-600 text-center text-xs font-bold uppercase tracking-widest border-b border-red-100">
                            Database Error: {error}
                        </div>
                    )}
                    {loading ? (
                        <div className="p-20 flex justify-center">
                            <div className="w-8 h-8 border-4 border-[#6d1616] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : orders.length > 0 ? (
                        <table className="w-full text-left text-sm min-w-[900px]">
                            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <tr>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_id')}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_customer')}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "المحافظة" : "Gov."}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "الدفع" : "Payment"}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_total')}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_status')}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_date')}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_product_actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs opacity-50">#{order.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.customer_name}</span>
                                                <span className="text-[10px] text-gray-400">{order.customer_email || order.customer_phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs">{order.governorate || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-gray-100 rounded-sm">
                                                {order.payment_method || 'instapay'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{order.total_amount} EGP</td>
                                        <td className="px-6 py-4">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className={`text-[10px] font-bold uppercase py-1 px-2 rounded-sm border-none focus:ring-0 ${order.status === 'shipped' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-[#6d1616] hover:underline"
                                                >
                                                    {t('view_details')}
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors"
                                                >
                                                    {isRTL ? "حذف" : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-20 text-center text-gray-400 font-medium italic">
                            {t('admin_no_orders')}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedOrder(null)}
                    ></div>
                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-sm shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#6d1616] text-white">
                            <div className="flex flex-col">
                                <h4 className="text-lg font-serif">Order Details #{selectedOrder.id.slice(0, 8)}</h4>
                                <p className="text-[10px] uppercase tracking-widest opacity-70">
                                    {new Date(selectedOrder.created_at).toLocaleString(isRTL ? 'ar-EG' : 'en-US')}
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Customer Info */}
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-4">
                                        <h5 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Customer Info</h5>
                                        <div className="flex flex-col gap-3">
                                            <DetailItem label="Full Name" value={selectedOrder.customer_name} />
                                            <DetailItem label="Email" value={selectedOrder.customer_email || 'No email provided'} />
                                            <DetailItem label="Phones" value={selectedOrder.customer_phone} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <h5 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Shipping Address</h5>
                                        <div className="flex flex-col gap-3">
                                            <DetailItem label="Address" value={selectedOrder.shipping_address} />
                                            <DetailItem label="Governorate" value={selectedOrder.governorate} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <h5 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Payment Info</h5>
                                        <div className="flex flex-col gap-3">
                                            <DetailItem label="Method" value={selectedOrder.payment_method} isUpper />
                                            <DetailItem label="Total Amount" value={`${selectedOrder.total_amount} EGP`} isBold />
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="flex flex-col gap-6">
                                    <h5 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Order Items</h5>
                                    <div className="flex flex-col gap-4">
                                        {(selectedOrder.items || []).map((item, idx) => (
                                            <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-sm border border-gray-100">
                                                <div className="w-16 h-20 bg-white border border-gray-200 rounded-sm overflow-hidden shrink-0">
                                                    <img src={item.image || item.displayImage} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex flex-col justify-center gap-1">
                                                    <h6 className="text-xs font-bold text-gray-900 uppercase">{item.title}</h6>
                                                    <div className="flex items-center gap-1.5">
                                                        {item.selectedColor && (
                                                            <div 
                                                                className="w-2.5 h-2.5 rounded-full border border-gray-200 shadow-sm"
                                                                style={{ backgroundColor: item.selectedColor }}
                                                            />
                                                        )}
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase">{item.selectedColor || 'Standard'}</p>
                                                    </div>
                                                    <p className="text-[11px] font-medium text-black mt-1">
                                                        {item.qty} × {parseFloat(item.price.toString().replace(/[^0-9.]/g, '')).toFixed(2)} EGP
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Update Order Status</label>
                                            <select 
                                                value={selectedOrder.status}
                                                onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                                                className={`w-full h-12 px-4 text-xs font-bold uppercase rounded-sm border border-gray-200 focus:outline-none ${selectedOrder.status === 'shipped' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleDeleteOrder(selectedOrder.id)}
                                            className="w-full h-12 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-colors border border-red-100"
                                        >
                                            Delete This Order Permanentely
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailItem({ label, value, isUpper = false, isBold = false }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
            <span className={`text-sm ${isBold ? 'font-bold' : 'font-medium'} text-gray-900 ${isUpper ? 'uppercase' : ''}`}>{value || '-'}</span>
        </div>
    );
}
