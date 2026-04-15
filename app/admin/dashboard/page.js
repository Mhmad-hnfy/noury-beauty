"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';

export default function Dashboard() {
    const { t, isRTL } = useStore();
    const [stats, setStats] = useState({
        totalProducts: 4,
        totalOrders: 12,
        totalRevenue: 2450.00
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        if (!supabase) {
            // Mock Stats for Demo Mode
            setStats({
                totalProducts: 4,
                totalOrders: 12,
                totalRevenue: 2450.00
            });
            setRecentOrders([
                { id: 'mock-order-1', customer_name: 'Sarah Ahmed', total_amount: 300, status: 'pending', created_at: new Date().toISOString() },
                { id: 'mock-order-2', customer_name: 'Noor Ali', total_amount: 450, status: 'shipped', created_at: new Date().toISOString() },
                { id: 'mock-order-3', customer_name: 'Laila Mahmoud', total_amount: 1200, status: 'pending', created_at: new Date().toISOString() }
            ]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const { count: productCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            const totalRev = orderData?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

            setStats({
                totalProducts: productCount || 0,
                totalOrders: orderData?.length || 0,
                totalRevenue: totalRev
            });
            setRecentOrders(orderData?.slice(0, 5) || []);
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 border-4 border-[#6d1616] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex flex-col gap-8 md:gap-12 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <StatCard title={t('admin_stats_products')} value={stats.totalProducts} />
                <StatCard title={t('admin_stats_orders')} value={stats.totalOrders} />
                <StatCard title={t('admin_stats_revenue')} value={`${stats.totalRevenue.toFixed(2)} EGP`} />
            </div>

            {/* Recent Activity */}
            <div className="flex flex-col gap-4 md:gap-6">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg md:text-xl font-serif text-black">{t('admin_recent_orders')}</h3>
                    {!supabase && (
                        <span className="text-[9px] bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">
                            Demo Data
                        </span>
                    )}
                </div>
                <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        {recentOrders.length > 0 ? (
                            <table className="w-full text-left text-sm min-w-[600px]">
                                <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    <tr>
                                        <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_id')}</th>
                                        <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_customer')}</th>
                                        <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_total')}</th>
                                        <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_status')}</th>
                                        <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_date')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs opacity-50">#{order.id?.slice(0, 8)}</td>
                                            <td className="px-6 py-4 font-medium">{order.customer_name}</td>
                                            <td className="px-6 py-4">{order.total_amount} EGP</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 ${order.status === 'shipped' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'} text-[9px] font-bold uppercase rounded-sm`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                                </div>
                                <p className="text-gray-400 text-sm font-medium">{t('admin_no_orders')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white p-6 md:p-8 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{title}</h4>
            <div className="text-2xl md:text-3xl font-medium text-black">{value}</div>
        </div>
    );
}
