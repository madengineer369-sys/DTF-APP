// ============================================================
// BLACKSTONE DTF STUDIO - SUPABASE CLIENT HELPER (supabaseClient.js)
// Ready for going live with Supabase PostgreSQL & Cloud Storage
// ============================================================

export const SUPABASE_URL = 'https://bxdmhbfpprnrcexwxrzh.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_tGKzE6gt-zcaRpkMD2jhmQ_KmhvkHAL';

// Initialize Supabase Client (via browser CDN or module)
export function getSupabase() {
  if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return null;
}

// 1. Fetch Storefront Products & Gang Sheet Sizes
export async function loadLiveCatalog() {
  const sb = getSupabase();
  if (!sb) return { products: [], gangSheetSizes: [], settings: null };

  const [productsRes, gangRes, settingsRes] = await Promise.all([
    sb.from('dtf_products').select('*').eq('active', true),
    sb.from('dtf_gang_sheet_sizes').select('*').eq('active', true),
    sb.from('dtf_site_settings').select('*').single()
  ]);

  return {
    products: productsRes.data || [],
    gangSheetSizes: gangRes.data || [],
    settings: settingsRes.data
  };
}

// 2. Submit Customer Order to Supabase Print Queue
export async function submitLiveOrder(orderPayload, artworkFile) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase client not initialized');

  let uploadedArtworkUrl = '';
  if (artworkFile) {
    const filePath = `artworks/${Date.now()}-${artworkFile.name}`;
    const { data: uploadData, error: uploadErr } = await sb.storage
      .from('dtf-artworks')
      .upload(filePath, artworkFile);
    if (!uploadErr) {
      const { data: publicUrlData } = sb.storage.from('dtf-artworks').getPublicUrl(filePath);
      uploadedArtworkUrl = publicUrlData.publicUrl;
    }
  }

  const { data, error } = await sb.from('dtf_orders').insert([{
    id: 'DTF-' + Math.floor(1000 + Math.random() * 9000),
    customer: orderPayload.customerName,
    phone: orderPayload.phone,
    order_type: orderPayload.orderType,
    spec: orderPayload.spec,
    linear_feet: orderPayload.linearFeet || 5.0,
    artwork_file_url: uploadedArtworkUrl,
    dpi_status: '300 DPI Verified',
    stage: 'Pending Artwork',
    total_inr: orderPayload.totalInr
  }]).select();

  return { data, error };
}

