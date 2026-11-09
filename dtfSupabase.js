// =========================================================================
// BLACKSTONE DTF STUDIO - SUPABASE LIVE BRIDGE (dtfSupabase.js)
// Auto-connects website storefront & admin with Supabase cloud database
// Project ID: bxdmhbfpprnrcexwxrzh
// =========================================================================

const SUPABASE_PROJECT_URL = 'https://bxdmhbfpprnrcexwxrzh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tGKzE6gt-zcaRpkMD2jhmQ_KmhvkHAL';

let globalSupabaseClient = null;

function getSupabaseClient() {
    if (!globalSupabaseClient && window.supabase && window.supabase.createClient) {
        try {
            globalSupabaseClient = window.supabase.createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);
        } catch (err) {
            console.warn('Supabase initialization warning:', err);
        }
    }
    return globalSupabaseClient;
}

// 1. Fetch live products from Supabase dtf_products
async function fetchSupabaseProducts() {
    const sb = getSupabaseClient();
    if (!sb) return null;
    try {
        const { data, error } = await sb
            .from('dtf_products')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false });
        if (error) {
            console.warn('Supabase products fetch:', error.message);
            return null;
        }
        if (data && data.length > 0) {
            return data.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category || 'DTF Stickers',
                dimension: p.dims || '8 x 10 inch',
                paint: 'Matte CMYK+White Ink',
                price: Number(p.price_inr) || 99,
                badge: p.featured ? 'Featured' : 'Popular',
                externalImageUrl: p.image_url || '',
                hasDemoVideo: false
            }));
        }
    } catch (e) {
        console.warn('Supabase offline or table pending:', e.message);
    }
    return null;
}

// 2. Record new customer order to Supabase dtf_orders
async function sendOrderToSupabase(orderData) {
    const sb = getSupabaseClient();
    if (!sb) return false;
    try {
        const orderId = 'DTF-' + Math.floor(1000 + Math.random() * 9000);
        const { data, error } = await sb
            .from('dtf_orders')
            .insert([{
                id: orderId,
                customer: orderData.customerName || 'Store Customer',
                phone: orderData.phone || '',
                order_type: orderData.orderType || 'DTF Sticker Order',
                spec: orderData.summary || '',
                linear_feet: orderData.linearFeet || 2.0,
                artwork_file_url: orderData.artworkUrl || '',
                dpi_status: '300 DPI Verified',
                stage: 'Pending Artwork',
                total_inr: Number(orderData.total) || 0
            }]);
        if (error) {
            console.warn('Could not record order to Supabase:', error.message);
            return false;
        }
        console.log('Order successfully synced to Supabase dtf_orders:', orderId);
        return true;
    } catch (e) {
        console.warn('Supabase sync error:', e);
        return false;
    }
}

// 3. Save newly uploaded product from admin.js to Supabase dtf_products
async function syncProductToSupabase(product) {
    const sb = getSupabaseClient();
    if (!sb) return false;
    try {
        const { error } = await sb
            .from('dtf_products')
            .upsert([{
                id: product.id,
                name: product.name,
                category: product.category,
                dims: product.dimension,
                price_inr: product.price,
                image_url: product.externalImageUrl || '',
                featured: product.badge === 'Bestseller' || product.badge === 'Featured',
                active: true,
                sales_count: 0
            }]);
        if (error) {
            console.warn('Supabase product sync error:', error.message);
            return false;
        }
        console.log('Product synced to Supabase:', product.name);
        return true;
    } catch (e) {
        console.warn('Supabase sync error:', e);
        return false;
    }
}

// 4. Delete product from Supabase dtf_products
async function deleteProductFromSupabase(productId) {
    const sb = getSupabaseClient();
    if (!sb) return false;
    try {
        await sb.from('dtf_products').delete().eq('id', productId);
        return true;
    } catch (e) {
        return false;
    }
}

// Check live connection on startup
window.addEventListener('DOMContentLoaded', () => {
    const sb = getSupabaseClient();
    if (sb) {
        console.log('Connected to Blackstone DTF Supabase project: bxdmhbfpprnrcexwxrzh');
    }
});

