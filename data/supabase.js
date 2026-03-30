/**
 * This is a Mock Supabase client for "Local Development".
 * It mimics the behavior of a real database using localStorage.
 */

const getCollection = (key, defaultData = []) => {
    if (typeof window === 'undefined') return defaultData;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
};

const saveCollection = (key, data) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
    }
};

import { products as initialProducts, categories as initialCategories } from './data';

export const db = {
    // Products
    products: {
        list: () => getCollection('nb_products', initialProducts),
        add: (product) => {
            const list = getCollection('nb_products', initialProducts);
            const newList = [{ ...product, id: Date.now() }, ...list];
            saveCollection('nb_products', newList);
            return newList[0];
        },
        delete: (id) => {
            const list = getCollection('nb_products', initialProducts);
            const newList = list.filter(p => p.id !== id);
            saveCollection('nb_products', newList);
        },
        update: (product) => {
            const list = getCollection('nb_products', initialProducts);
            const newList = list.map(p => p.id === product.id ? product : p);
            saveCollection('nb_products', newList);
        }
    },
    // Categories
    categories: {
        list: () => getCollection('nb_categories', initialCategories),
        add: (category) => {
            const list = getCollection('nb_categories', initialCategories);
            const newCat = { ...category, id: Date.now() };
            const newList = [...list, newCat];
            saveCollection('nb_categories', newList);
            return newCat;
        },
        delete: (id) => {
            const list = getCollection('nb_categories', initialCategories);
            const newList = list.filter(c => c.id !== id);
            saveCollection('nb_categories', newList);
        }
    },
    // Orders
    orders: {
        list: () => getCollection('nb_orders', []),
        add: (order) => {
            const list = getCollection('nb_orders', []);
            const newOrder = { ...order, id: `ORD-${Date.now()}`, status: 'انتظار', date: new Date().toLocaleString('ar-EG') };
            const newList = [newOrder, ...list];
            saveCollection('nb_orders', newList);
            return newOrder;
        },
        updateStatus: (id, status) => {
            const list = getCollection('nb_orders', []);
            const newList = list.map(o => o.id === id ? { ...o, status } : o);
            saveCollection('nb_orders', newList);
        },
        delete: (id) => {
            const list = getCollection('nb_orders', []);
            const newList = list.filter(o => o.id !== id);
            saveCollection('nb_orders', newList);
        }
    },
    // Settings
    settings: {
        get: () => getCollection('nb_settings', {
            storeName: 'Noury Beauty',
            contactEmail: 'contact@noury.com',
            shippingFee: 0,
            currency: 'جنيه مصري'
        }),
        update: (newSettings) => saveCollection('nb_settings', newSettings)
    }
};
