// =========================================================================
// BLACKSTONE DTF STUDIO - ADMIN & PRINT OS DASHBOARD (admindashboard.js)
// Complete State, Analytics, Orders Queue, Inventory & Supabase Sync
// =========================================================================

// High-resolution lightweight SVG artworks (Transparent PNG / DTF preview)
const IMAGE_MAP = {
  samurai: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="none"/><circle cx="200" cy="200" r="170" fill="%23ef4444"/><polygon points="200,60 320,290 80,290" fill="%23090d16"/><polygon points="200,110 280,270 120,270" fill="%23f97316"/><text x="200" y="340" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-weight="900" font-size="34" letter-spacing="4">BLACKSTONE</text><text x="200" y="375" text-anchor="middle" fill="%23fef08a" font-family="sans-serif" font-weight="800" font-size="18" letter-spacing="3">CYBER SAMURAI</text></svg>`,
  skull: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="none"/><rect x="50" y="50" width="300" height="300" rx="40" fill="%23f97316"/><circle cx="150" cy="180" r="35" fill="%23090d16"/><circle cx="250" cy="180" r="35" fill="%23090d16"/><polygon points="200,210 180,250 220,250" fill="%23090d16"/><text x="200" y="125" text-anchor="middle" fill="%23090d16" font-family="sans-serif" font-weight="900" font-size="42">HUSTLE 26</text><text x="200" y="315" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-weight="900" font-size="22" letter-spacing="2">STREET DIVISION</text></svg>`,
  lion: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="none"/><polygon points="200,40 340,110 290,320 110,320 60,110" fill="%23eab308" stroke="%23fef08a" stroke-width="12"/><text x="200" y="210" text-anchor="middle" fill="%2318181b" font-family="sans-serif" font-weight="900" font-size="48">ROYAL</text><text x="200" y="250" text-anchor="middle" fill="%23090d16" font-family="sans-serif" font-weight="800" font-size="18">CHEST CREST</text></svg>`,
  trishul: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="none"/><circle cx="200" cy="200" r="160" fill="%2318181b" stroke="%23f59e0b" stroke-width="14"/><path d="M200,70 L200,330 M150,110 C150,220 250,220 250,110" stroke="%23f59e0b" stroke-width="14" fill="none"/><text x="200" y="300" text-anchor="middle" fill="%23f59e0b" font-family="sans-serif" font-weight="900" font-size="34">MAHAKAAL</text></svg>`,
  gang: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="%230f172a"/><rect x="25" y="25" width="350" height="350" rx="16" fill="none" stroke="%23ec4899" stroke-dasharray="8 6" stroke-width="4"/><text x="200" y="170" text-anchor="middle" fill="%23ec4899" font-family="sans-serif" font-weight="900" font-size="32">22" GANG SHEET</text><text x="200" y="210" text-anchor="middle" fill="%23f472b6" font-family="sans-serif" font-weight="700" font-size="18">300 DPI AUTO-NESTED</text><text x="200" y="250" text-anchor="middle" fill="%2322d3ee" font-family="sans-serif" font-weight="800" font-size="14">CMYK + DUAL WHITE</text></svg>`,
  cup: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="none"/><rect x="70" y="60" width="260" height="280" rx="24" fill="%2306b6d4"/><text x="200" y="170" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-weight="900" font-size="36">UV DTF WRAP</text><text x="200" y="210" text-anchor="middle" fill="%23cffafe" font-family="sans-serif" font-weight="800" font-size="18">16oz CUP DECAL</text><text x="200" y="260" text-anchor="middle" fill="%23083344" font-family="sans-serif" font-weight="800" font-size="16">WATERPROOF 3D GLOSS</text></svg>`
};

const USD_RATE = 84; // 1 USD = 84 INR currency toggle

// Retrieve owner config from main app if present
const savedOwnerPhone = localStorage.getItem('dtf_owner_wa') || '9876543210';
const savedOwnerYt = localStorage.getItem('dtf_owner_yt') || 'https://youtube.com/@blackkstonefashion?si=q6t18zkHSFFN0Xnh';
const savedOwnerStudioYt = localStorage.getItem('dtf_owner_studio_yt') || 'http://www.youtube.com/@BSfashionstudio-h7z';

const defaultState = {
  currency: 'INR',
  activeTab: 'overview',
  orderFilter: 'ALL',
  productFilter: 'ALL',
  activeArtworkOrderId: null,
  activeCodeTab: 'sql',
  supabaseUrl: 'https://bxdmhbfpprnrcexwxrzh.supabase.co',
  supabaseAnonKey: 'sb_publishable_tGKzE6gt-zcaRpkMD2jhmQ_KmhvkHAL',
  supabaseConnected: false,
  cms: {
    brandName: 'BLACKSTONE DTF STUDIO',
    founder: 'Rajshekhar Chaurasiya',
    supportPhone: `+91 ${savedOwnerPhone}`,
    instagramHandle: '@blackstone2k26',
    founderInstagram: '@rajshekhar_chaurasiya',
    primaryYoutube: savedOwnerYt,
    studioYoutube: savedOwnerStudioYt,
    bannerActive: true,
    announcementText: '🔥 BLACKSTONE 2K26: Commercial Grade DTF Transfers & Custom Apparel (Same-Day Dispatch on orders before 2 PM)!',
    heroHeadline: 'Premium DTF Stickers & Custom Apparel Printing across India',
    heroSubtitle: 'Upload your transparent artwork or order custom oversized tees and hoodies with custom Name, Number, and Logo. Commercial-grade CMYK+W with 50+ wash guarantee.',
    heroCta: 'Explore DTF Catalog →',
    freeShipThreshold: 1499,
    pressTemp: '300°F / 150°C',
    pressTime: '12–15 Sec (Medium-Firm)',
    peelType: 'Instant Cold / Warm Peel',
    builderMargin: '0.25 in',
    builderDpi: '300 DPI',
    rushFeePct: 20
  },
  orders: [
    {
      id: 'DTF-1048',
      date: 'Today, 09:12 AM',
      customer: 'Aarav Streetwear Co.',
      phone: '+91 98201 11223',
      type: 'Custom Gang Sheet',
      spec: '22" × 60" Gang Sheet (x3)',
      linearFeet: 15.0,
      dpiStatus: '300 DPI Verified',
      artworkImg: 'samurai',
      stage: 'In Print Queue',
      totalInr: 2697
    },
    {
      id: 'DTF-1047',
      date: 'Today, 08:45 AM',
      customer: 'Kundan Custom Apparel',
      phone: '+91 91234 55667',
      type: 'Custom Apparel',
      spec: 'Oversized Black Tee (Back Samurai + Front Logo)',
      linearFeet: 8.0,
      dpiStatus: '300 DPI Verified',
      artworkImg: 'skull',
      stage: 'Curing & Cut',
      totalInr: 3398
    },
    {
      id: 'DTF-1046',
      date: 'Yesterday, 06:30 PM',
      customer: 'Royal Enfield Riders Club',
      phone: '+91 99887 77665',
      type: 'UV DTF Sticker',
      spec: 'Helmet & Bike Decals (x50)',
      linearFeet: 7.5,
      dpiStatus: '300 DPI Verified',
      artworkImg: 'cup',
      stage: 'Pending Artwork',
      totalInr: 4250
    },
    {
      id: 'DTF-1045',
      date: 'Yesterday, 04:15 PM',
      customer: 'Velocity Gym & Fitness',
      phone: '+91 97654 32109',
      type: 'Custom Gang Sheet',
      spec: '22" × 240" Wholesale Master Roll',
      linearFeet: 20.0,
      dpiStatus: '300 DPI Verified',
      artworkImg: 'samurai',
      stage: 'Ready to Pack',
      totalInr: 3199
    },
    {
      id: 'DTF-1044',
      date: '07 Nov, 02:50 PM',
      customer: 'NeonVibe Fashion Hub',
      phone: '+91 98112 33445',
      type: 'Ready DTF Sticker',
      spec: 'Cyber Samurai Oversized Back Prints (x25)',
      linearFeet: 12.0,
      dpiStatus: '300 DPI Verified',
      artworkImg: 'samurai',
      stage: 'Shipped',
      totalInr: 2750
    },
    {
      id: 'DTF-1043',
      date: '07 Nov, 11:20 AM',
      customer: 'Mumbai Streetwear Collective',
      phone: '+91 98450 99881',
      type: 'Ready DTF Sticker',
      spec: 'Urban 3D Puff Skull Full Front (x40)',
      linearFeet: 18.0,
      dpiStatus: '300 DPI Verified',
      artworkImg: 'skull',
      stage: 'Shipped',
      totalInr: 3800
    }
  ],
  products: [
    {
      id: 'DTF-101',
      name: 'Blackstone 2K26 Cyber Samurai Back Print',
      category: 'Anime',
      dims: '10" × 12" (Oversized Back) • Cold Peel',
      priceInr: 110,
      imageKey: 'samurai',
      featured: true,
      active: true,
      salesCount: 186
    },
    {
      id: 'DTF-102',
      name: 'Urban Streetwear 3D Puff Skull',
      category: 'Streetwear',
      dims: '8" × 10" (Full Front) • 3D Embossed Ink',
      priceInr: 95,
      imageKey: 'skull',
      featured: true,
      active: true,
      salesCount: 342
    },
    {
      id: 'DTF-103',
      name: 'Golden Royal Lion Chest Crest',
      category: 'Pocket Logos',
      dims: '3.5" × 3.5" (Chest Logo) • Metallic Foil',
      priceInr: 35,
      imageKey: 'lion',
      featured: true,
      active: true,
      salesCount: 420
    },
    {
      id: 'DTF-104',
      name: 'Mahakaal Spiritual Gold Trishul',
      category: 'Typography',
      dims: '8" × 10" (Full Front) • Metallic Gold DTF',
      priceInr: 90,
      imageKey: 'trishul',
      featured: false,
      active: true,
      salesCount: 195
    },
    {
      id: 'GS-02',
      name: 'Custom 22" × 60" DTF Gang Sheet Builder',
      category: 'Custom Gang Sheets',
      dims: '22" × 60" (5 Linear Ft) • Upload PNG/PDF',
      priceInr: 899,
      imageKey: 'gang',
      featured: true,
      active: true,
      salesCount: 280
    },
    {
      id: 'UV-01',
      name: 'Botanical 16oz UV DTF Waterproof Decal',
      category: 'UV DTF Stickers',
      dims: '9.5" × 4.3" Waterproof 3D Gloss Wrap',
      priceInr: 95,
      imageKey: 'cup',
      featured: false,
      active: true,
      salesCount: 110
    }
  ],
  gangSheetTiers: [
    { id: 'GS-1', name: 'Starter Sheet', dims: '22" × 24" (2 Ft)', capacity: 'Fits ~8–10 Logos or 2 Full Fronts', priceInr: 449, costInr: 95, active: true },
    { id: 'GS-2', name: 'Standard Gang Roll', dims: '22" × 60" (5 Ft)', capacity: 'Fits ~22 Logos or 6 Full Fronts', priceInr: 899, costInr: 195, active: true },
    { id: 'GS-3', name: 'Shop Pro Roll', dims: '22" × 120" (10 Ft)', capacity: 'Fits ~45 Logos or 13 Full Fronts', priceInr: 1699, costInr: 360, active: true },
    { id: 'GS-4', name: 'Wholesale Master Roll', dims: '22" × 240" (20 Ft)', capacity: 'Fits ~95 Logos or 26 Full Fronts', priceInr: 3199, costInr: 680, active: true }
  ],
  coupons: [
    { code: 'DTF20', discountPct: 20, uses: 54, active: true },
    { code: 'BLACKSTONE15', discountPct: 15, uses: 128, active: true },
    { code: 'WHOLESALE30', discountPct: 30, uses: 22, active: true }
  ],
  inventory: [
    { id: 'INV-1', name: '22" Matte Cold-Peel PET Film Roll', category: 'Transfer Film', stockPct: 78, unit: '4 Rolls (400m)', minPct: 25, status: 'Healthy' },
    { id: 'INV-2', name: 'Titanium White DTF Pigment Ink (W)', category: 'DTF Ink', stockPct: 22, unit: '2.1 Liters Left', minPct: 25, status: 'Low Stock' },
    { id: 'INV-3', name: 'CMYK High-Vibrancy DTF Ink Set', category: 'DTF Ink', stockPct: 72, unit: '4.8 Liters Total', minPct: 25, status: 'Healthy' },
    { id: 'INV-4', name: 'Fine TPU Hot-Melt Adhesive Powder', category: 'Adhesive Powder', stockPct: 60, unit: '6.0 kg Bag', minPct: 20, status: 'Healthy' },
    { id: 'INV-5', name: 'UV DTF A+B Laminating Film Set', category: 'UV DTF Media', stockPct: 85, unit: '2 Rolls (100m)', minPct: 25, status: 'Healthy' },
    { id: 'INV-6', name: 'Dual-Head XP600/i3200 Printhead Care Kit', category: 'Maintenance', stockPct: 92, unit: 'Capping + Wiper Ready', minPct: 30, status: 'Healthy' }
  ]
};

let state = JSON.parse(JSON.stringify(defaultState));
let revenueChartInstance = null;
let artworkDarkBg = false;
let artworkZoomed = false;
let supabaseClientInstance = null;

// Load saved state from localStorage safely
function loadSavedState() {
  try {
    const raw = localStorage.getItem('dtf_admin_dashboard_state_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      state = Object.assign({}, defaultState, parsed);
    }

    // Sync products with the website's main catalog if present
    const mainCatalog = JSON.parse(localStorage.getItem('blackstone_dtf_catalog') || 'null');
    if (mainCatalog && Array.isArray(mainCatalog) && mainCatalog.length > 0) {
      mainCatalog.forEach(mc => {
        const existing = state.products.find(p => p.id === mc.id);
        if (!existing) {
          state.products.unshift({
            id: mc.id,
            name: mc.name,
            category: mc.category || 'DTF Stickers',
            dims: mc.dimension || '8" × 10"',
            priceInr: mc.price || 99,
            imageKey: 'samurai',
            featured: Boolean(mc.badge),
            active: true,
            salesCount: 15
          });
        }
      });
    }
  } catch (e) {
    console.warn('Dashboard state load warning:', e);
  }
}

function persistState() {
  try {
    localStorage.setItem('dtf_admin_dashboard_state_v1', JSON.stringify(state));
  } catch (e) {
    console.warn('Dashboard state save warning:', e);
  }
}

function formatMoney(amountInr) {
  const num = Number(amountInr) || 0;
  if (state.currency === 'USD') {
    const usd = (num / USD_RATE).toFixed(2);
    return '$' + Number(usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const el = document.createElement('div');
  const colorClasses = type === 'warn'
    ? 'bg-amber-950/95 border-amber-500/50 text-amber-200'
    : type === 'error'
      ? 'bg-rose-950/95 border-rose-500/50 text-rose-200'
      : 'bg-slate-900/95 border-emerald-500/50 text-emerald-200';
  el.className = `pointer-events-auto px-4 py-3 rounded-xl border shadow-xl text-xs font-medium flex items-center justify-between gap-3 transition-all duration-300 ${colorClasses}`;
  el.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white">✕</button>`;
  container.appendChild(el);
  setTimeout(() => {
    if (el && el.parentElement) el.remove();
  }, 3600);
}

function toggleMobileNav() {
  const nav = document.getElementById('sidebarNavContainer');
  if (nav) {
    nav.classList.toggle('hidden');
    nav.classList.toggle('flex');
  }
}

function setCurrency(curr) {
  state.currency = curr;
  const btnINR = document.getElementById('currBtnINR');
  const btnUSD = document.getElementById('currBtnUSD');
  if (btnINR && btnUSD) {
    if (curr === 'INR') {
      btnINR.className = 'px-2.5 py-1 rounded-md font-bold transition bg-[#2563eb] text-black';
      btnUSD.className = 'px-2.5 py-1 rounded-md font-semibold transition text-slate-400 hover:text-white';
    } else {
      btnUSD.className = 'px-2.5 py-1 rounded-md font-bold transition bg-[#2563eb] text-black';
      btnINR.className = 'px-2.5 py-1 rounded-md font-semibold transition text-slate-400 hover:text-white';
    }
  }
  persistState();
  renderAll();
  showToast(`Currency display switched to ${curr}`);
}

function switchTab(tabId) {
  state.activeTab = tabId;
  const tabs = ['overview', 'orders', 'products', 'pricing', 'website', 'inventory', 'supabase'];
  const titles = {
    overview: ['Blackstone DTF Production Pulse & Overview', 'Real-time orders, gang sheet print queue, and commercial DTF telemetry'],
    orders: ['Orders & RIP Print Production Queue', 'Verify 300 DPI transparent PNGs, inspect gang sheets, and update print stages'],
    products: ['Stickers & Custom Cloth Products Catalog', 'Manage DTF transfers, custom oversized tees/hoodies, and UV decals'],
    pricing: ['22" Gang Sheet Builder & Pricing Engine', 'Configure roll dimensions, auto-nesting rules, and compute profit margins'],
    website: ['Storefront CMS, WhatsApp & Social Links', 'Update announcement banners, Instagram/YouTube links, and discount codes'],
    inventory: ['PET Film, CMYK+W Ink & Powder Telemetry', 'Monitor DTF consumables and restock before queue bottlenecks'],
    supabase: ['Supabase PostgreSQL & Cloud Storage Link', 'Connect your Blackstone DTF app to Supabase backend & cloud storage']
  };

  tabs.forEach(t => {
    const section = document.getElementById('tab-' + t);
    const navBtn = document.getElementById('nav-' + t);
    if (section) {
      if (t === tabId) section.classList.remove('hidden');
      else section.classList.add('hidden');
    }
    if (navBtn) {
      if (t === tabId) {
        navBtn.className = 'nav-btn w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition bg-[#2563eb]/15 text-[#2563eb] border border-[#2563eb]/40 shadow-sm';
      } else {
        navBtn.className = 'nav-btn w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 transition';
      }
    }
  });

  const titleEl = document.getElementById('pageHeaderTitle');
  const subEl = document.getElementById('pageHeaderSubtitle');
  if (titleEl && titles[tabId]) titleEl.textContent = titles[tabId][0];
  if (subEl && titles[tabId]) subEl.textContent = titles[tabId][1];

  // Refresh tab content
  if (tabId === 'overview') renderOverview();
  if (tabId === 'orders') renderOrdersTable();
  if (tabId === 'products') renderProductsGrid();
  if (tabId === 'pricing') renderGangSheetPricing();
  if (tabId === 'website') renderWebsiteCMS();
  if (tabId === 'inventory') renderInventory();
  if (tabId === 'supabase') switchCodeTab(state.activeCodeTab || 'sql');

  persistState();
}

// ==========================================
// TAB 1: OVERVIEW & ANALYTICS
// ==========================================
function renderOverview() {
  const totalRev = state.orders.reduce((sum, o) => sum + (Number(o.totalInr) || 0), 0);
  const totalLinearFt = state.orders.reduce((sum, o) => sum + (Number(o.linearFeet) || 0), 0);
  const pendingArtworkCount = state.orders.filter(o => o.stage === 'Pending Artwork').length;
  const inQueueCount = state.orders.filter(o => o.stage === 'In Print Queue').length;

  // KPI cards
  const kpiRev = document.getElementById('kpiTotalRevenue');
  if (kpiRev) kpiRev.textContent = formatMoney(totalRev);
  const kpiPend = document.getElementById('kpiPendingArtwork');
  if (kpiPend) kpiPend.textContent = `${pendingArtworkCount} Files`;
  const kpiQueue = document.getElementById('kpiQueueLength');
  if (kpiQueue) kpiQueue.textContent = `${totalLinearFt.toFixed(1)} Linear Ft`;
  const kpiProd = document.getElementById('kpiActiveProducts');
  if (kpiProd) kpiProd.textContent = `${state.products.filter(p => p.active).length} Products`;
  const kpiSub = document.getElementById('kpiOrderCountSub');
  if (kpiSub) kpiSub.textContent = `${state.orders.length} active orders`;

  // Render recent orders mini table
  const tbody = document.getElementById('overviewRecentOrdersBody');
  if (tbody) {
    tbody.innerHTML = state.orders.slice(0, 5).map(o => {
      const thumb = IMAGE_MAP[o.artworkImg] || IMAGE_MAP.samurai;
      return `
        <tr class="hover:bg-slate-800/40 border-b border-slate-800/60 transition">
          <td class="py-2.5 px-3 font-mono font-bold text-white flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg checkerboard-dark border border-slate-700 flex items-center justify-center p-0.5 shrink-0">
              <img src="${thumb}" class="max-h-full max-w-full object-contain" alt="${o.id}">
            </div>
            <span>${o.id}</span>
          </td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-slate-100 text-xs">${o.customer}</div>
            <div class="text-[10px] text-slate-400">${o.phone}</div>
          </td>
          <td class="py-2.5 px-3 text-xs text-slate-200">
            <div>${o.spec}</div>
            <span class="text-[10px] text-cyan-300 font-mono">${o.linearFeet} Linear Ft</span>
          </td>
          <td class="py-2.5 px-3">
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full ${o.dpiStatus.includes('Verified') ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'}">${o.dpiStatus}</span>
          </td>
          <td class="py-2.5 px-3">${renderStageBadge(o.stage)}</td>
          <td class="py-2.5 px-3 font-mono font-bold text-emerald-400 text-right">${formatMoney(o.totalInr)}</td>
          <td class="py-2.5 px-3 text-right">
            <button onclick="openArtworkModal('${o.id}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold">Inspect</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Pipeline stages breakdown
  const pipeCont = document.getElementById('overviewPipelineStages');
  if (pipeCont) {
    const stages = ['Pending Artwork', 'In Print Queue', 'Curing & Cut', 'Ready to Pack', 'Shipped'];
    pipeCont.innerHTML = stages.map(st => {
      const count = state.orders.filter(o => o.stage === st).length;
      return `
        <div class="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
          <span class="text-slate-300 flex items-center gap-2">
            ${renderStageBadge(st)}
          </span>
          <span class="font-mono font-bold text-white">${count} orders</span>
        </div>
      `;
    }).join('');
  }

  // Low stock alert list
  const lowStock = state.inventory.filter(i => i.stockPct <= i.minPct);
  const lowCont = document.getElementById('overviewLowStockList');
  if (lowCont) {
    if (lowStock.length === 0) {
      lowCont.innerHTML = `<div class="text-emerald-400 text-[11px] flex items-center gap-1.5"><i data-lucide="check-circle" class="w-3.5 h-3.5"></i> All ink, powder & film levels normal.</div>`;
    } else {
      lowCont.innerHTML = lowStock.map(i => `
        <div class="flex items-center justify-between py-0.5">
          <span class="text-amber-300 font-semibold">• ${i.name}</span>
          <span class="font-mono text-amber-400 font-bold">${i.stockPct}%</span>
        </div>
      `).join('');
    }
  }

  initOrUpdateChart('7d');
  if (window.lucide) lucide.createIcons();
}

function renderStageBadge(stage) {
  const map = {
    'Pending Artwork': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    'In Print Queue': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    'Curing & Cut': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    'Ready to Pack': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    'Shipped': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  };
  const cls = map[stage] || 'bg-slate-800 text-slate-300 border-slate-700';
  return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}">${stage}</span>`;
}

function initOrUpdateChart(range = '7d') {
  const ctx = document.getElementById('revenueChartCanvas');
  if (!ctx || !window.Chart) return;

  const labels7d = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const revData7d = [4800, 7200, 6100, 9400, 8900, 14200, 11800];
  const linearData7d = [22, 34, 28, 45, 41, 68, 54];

  if (revenueChartInstance) {
    revenueChartInstance.destroy();
  }

  revenueChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels7d,
      datasets: [
        {
          label: 'Daily Revenue (₹)',
          data: revData7d,
          backgroundColor: 'rgba(37, 99, 235, 0.85)',
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          label: 'Linear Feet Printed (Ft)',
          data: linearData7d,
          type: 'line',
          borderColor: '#1d4ed8',
          backgroundColor: 'rgba(37, 99, 235, 0.15)',
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(51, 65, 85, 0.25)' },
          ticks: { color: '#94a3b8', font: { size: 11 } }
        },
        y: {
          position: 'left',
          grid: { color: 'rgba(51, 65, 85, 0.25)' },
          ticks: { color: '#94a3b8', font: { size: 11 } }
        },
        y1: {
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#22d3ee', font: { size: 11 } }
        }
      }
    }
  });
}

function updateChartTimeframe(range) {
  ['chartRange7d', 'chartRange30d'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = 'px-2.5 py-1 text-slate-400 hover:text-white rounded-md transition font-medium';
  });
  const activeBtn = document.getElementById(`chartRange${range}`);
  if (activeBtn) activeBtn.className = 'px-2.5 py-1 bg-slate-800 text-white font-bold rounded-md transition';
  initOrUpdateChart(range);
  showToast(`Analytics timeframe set to ${range.toUpperCase()}`);
}

// ==========================================
// TAB 2: ORDERS & RIP PRINT QUEUE
// ==========================================
function setOrderFilter(status) {
  state.orderFilter = status;
  document.querySelectorAll('.order-filter-btn').forEach(btn => {
    if (btn.dataset.status === status) {
      btn.className = 'order-filter-btn px-3 py-1.5 rounded-lg text-xs font-black bg-[#2563eb] text-black transition';
    } else {
      btn.className = 'order-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition';
    }
  });
  renderOrdersTable();
}

function renderOrdersTable() {
  const tbody = document.getElementById('fullOrdersTableBody');
  if (!tbody) return;

  const badgeCount = document.getElementById('navBadgeOrders');
  if (badgeCount) badgeCount.textContent = state.orders.length;

  const search = (document.getElementById('orderSearchInput')?.value || '').toLowerCase();
  const filtered = state.orders.filter(o => {
    const matchFilter = state.orderFilter === 'ALL' || o.stage === state.orderFilter;
    const matchSearch = o.id.toLowerCase().includes(search) ||
      o.customer.toLowerCase().includes(search) ||
      o.spec.toLowerCase().includes(search) ||
      o.phone.toLowerCase().includes(search);
    return matchFilter && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500 text-xs">No orders found matching the filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(o => {
    const thumb = IMAGE_MAP[o.artworkImg] || IMAGE_MAP.samurai;
    return `
      <tr class="border-b border-slate-800/80 hover:bg-slate-800/40 transition">
        <td class="py-3 px-4 font-mono font-bold text-white">
          <div class="hover:text-[#2563eb] cursor-pointer" onclick="openArtworkModal('${o.id}')">${o.id}</div>
          <div class="text-[10px] text-slate-400 font-sans font-normal">${o.date}</div>
        </td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-200 text-xs">${o.customer}</div>
          <a href="https://wa.me/${o.phone.replace(/\D/g, '')}" target="_blank" class="text-[11px] text-[#2563eb] hover:underline flex items-center gap-1">
            <i data-lucide="message-square" class="w-3 h-3"></i> ${o.phone}
          </a>
        </td>
        <td class="py-3 px-4">
          <div class="text-xs text-slate-100 font-medium">${o.spec}</div>
          <span class="text-[10px] text-[#2563eb] font-mono">${o.linearFeet} Linear Ft • ${o.type}</span>
        </td>
        <td class="py-3 px-4">
          <div onclick="openArtworkModal('${o.id}')" class="flex items-center gap-2 cursor-pointer group">
            <div class="w-10 h-10 rounded-lg checkerboard border border-slate-700 flex items-center justify-center p-0.5 shrink-0 group-hover:border-[#2563eb] transition">
              <img src="${thumb}" class="max-h-full max-w-full object-contain rounded" alt="${o.id}">
            </div>
            <div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full ${o.dpiStatus.includes('Verified') ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'}">${o.dpiStatus}</span>
              <div class="text-[10px] text-slate-400 mt-0.5">Click to Preflight</div>
            </div>
          </div>
        </td>
        <td class="py-3 px-4">
          <select onchange="updateOrderStage('${o.id}', this.value)" class="bg-black border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:border-[#2563eb] focus:outline-none">
            <option value="Pending Artwork" ${o.stage === 'Pending Artwork' ? 'selected' : ''}>Pending Artwork</option>
            <option value="In Print Queue" ${o.stage === 'In Print Queue' ? 'selected' : ''}>In Print Queue</option>
            <option value="Curing & Cut" ${o.stage === 'Curing & Cut' ? 'selected' : ''}>Curing & Cut</option>
            <option value="Ready to Pack" ${o.stage === 'Ready to Pack' ? 'selected' : ''}>Ready to Pack</option>
            <option value="Shipped" ${o.stage === 'Shipped' ? 'selected' : ''}>Shipped</option>
          </select>
        </td>
        <td class="py-3 px-4 font-mono font-extrabold text-[#2563eb] text-right">
          ${formatMoney(o.totalInr)}
        </td>
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="advanceOrderNextStage('${o.id}')" title="Advance to Next Stage" class="p-1.5 rounded-lg bg-[#2563eb]/15 text-[#2563eb] hover:bg-[#2563eb] hover:text-black font-bold transition">
              <i data-lucide="arrow-right-circle" class="w-4 h-4"></i>
            </button>
            <button onclick="openArtworkModal('${o.id}')" title="Inspect Preflight" class="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteOrder('${o.id}')" title="Delete Order" class="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function updateOrderStage(orderId, newStage) {
  const o = state.orders.find(x => x.id === orderId);
  if (o) {
    o.stage = newStage;
    persistState();
    renderOrdersTable();
    showToast(`Order ${orderId} moved to stage: ${newStage}`);
  }
}

function advanceOrderNextStage(orderId) {
  const stages = ['Pending Artwork', 'In Print Queue', 'Curing & Cut', 'Ready to Pack', 'Shipped'];
  const o = state.orders.find(x => x.id === orderId);
  if (!o) return;
  const idx = stages.indexOf(o.stage);
  if (idx < stages.length - 1) {
    o.stage = stages[idx + 1];
    persistState();
    renderOrdersTable();
    showToast(`Order ${orderId} advanced to ${o.stage}!`);
  }
}

function deleteOrder(orderId) {
  if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
    state.orders = state.orders.filter(x => x.id !== orderId);
    persistState();
    renderOrdersTable();
    showToast(`Order ${orderId} deleted.`);
  }
}

function openNewOrderModal() {
  const modal = document.getElementById('newOrderModal');
  if (modal) modal.classList.remove('hidden');
}

function closeNewOrderModal() {
  const modal = document.getElementById('newOrderModal');
  if (modal) modal.classList.add('hidden');
}

function submitNewOrder() {
  const custName = document.getElementById('newOrdCustomer')?.value.trim();
  const phone = document.getElementById('newOrdPhone')?.value.trim() || '+91 98765 43210';
  const type = document.getElementById('newOrdType')?.value || 'Custom Gang Sheet';
  const spec = document.getElementById('newOrdSpec')?.value.trim() || '22" × 60" Gang Sheet';
  const feet = parseFloat(document.getElementById('newOrdFeet')?.value || '5.0');
  const total = parseInt(document.getElementById('newOrdTotal')?.value || '899', 10);

  if (!custName) {
    showToast('Please enter customer name', 'warn');
    return;
  }

  const newId = 'DTF-' + Math.floor(1050 + Math.random() * 8900);
  state.orders.unshift({
    id: newId,
    date: 'Just Now',
    customer: custName,
    phone: phone,
    type: type,
    spec: spec,
    linearFeet: feet,
    dpiStatus: '300 DPI Verified',
    artworkImg: 'samurai',
    stage: 'In Print Queue',
    totalInr: total
  });

  persistState();
  closeNewOrderModal();
  renderOrdersTable();
  showToast(`New Order ${newId} created!`);
}

function exportOrdersCSV() {
  const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Type', 'Specification', 'Linear Feet', 'Stage', 'Total (INR)'];
  const rows = state.orders.map(o => [
    o.id,
    o.date,
    `"${o.customer}"`,
    o.phone,
    `"${o.type}"`,
    `"${o.spec}"`,
    o.linearFeet,
    o.stage,
    o.totalInr
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encoded = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encoded);
  link.setAttribute('download', `blackstone_dtf_orders_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Orders exported to CSV!');
}

// Artwork Modal (Preflight & Transparency Checker)
function openArtworkModal(orderId) {
  const o = state.orders.find(x => x.id === orderId);
  if (!o) return;
  state.activeArtworkOrderId = orderId;

  document.getElementById('artModalTitle').textContent = `Preflight: ${o.id} — ${o.customer}`;
  document.getElementById('artModalSub').textContent = `${o.spec} • ${o.linearFeet} Linear Feet (${o.dpiStatus})`;
  const img = document.getElementById('artModalImg');
  if (img) img.src = IMAGE_MAP[o.artworkImg] || IMAGE_MAP.samurai;

  const modal = document.getElementById('artworkModal');
  if (modal) modal.classList.remove('hidden');
}

function closeArtworkModal() {
  const modal = document.getElementById('artworkModal');
  if (modal) modal.classList.add('hidden');
  state.activeArtworkOrderId = null;
}

function toggleArtworkBg() {
  artworkDarkBg = !artworkDarkBg;
  const cont = document.getElementById('artModalPreviewContainer');
  if (cont) {
    if (artworkDarkBg) {
      cont.className = 'checkerboard-dark rounded-xl border border-slate-700 h-64 flex items-center justify-center p-4 relative overflow-hidden';
    } else {
      cont.className = 'checkerboard rounded-xl border border-slate-700 h-64 flex items-center justify-center p-4 relative overflow-hidden';
    }
  }
}

function zoomArtworkPreview() {
  artworkZoomed = !artworkZoomed;
  const img = document.getElementById('artModalImg');
  if (img) {
    if (artworkZoomed) img.classList.add('is-zoomed');
    else img.classList.remove('is-zoomed');
  }
}

function approveArtworkForPrint() {
  if (!state.activeArtworkOrderId) return;
  const o = state.orders.find(x => x.id === state.activeArtworkOrderId);
  if (o) {
    o.dpiStatus = '300 DPI Verified';
    o.stage = 'In Print Queue';
    persistState();
    renderOrdersTable();
    closeArtworkModal();
    showToast(`Artwork for ${o.id} approved and sent to RIP Print Queue!`);
  }
}

function flagArtworkRevision() {
  if (!state.activeArtworkOrderId) return;
  const o = state.orders.find(x => x.id === state.activeArtworkOrderId);
  if (o) {
    o.dpiStatus = 'Revision Requested';
    o.stage = 'Pending Artwork';
    persistState();
    renderOrdersTable();
    closeArtworkModal();
    const waUrl = `https://wa.me/${o.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${o.customer}, regarding Blackstone DTF Order ${o.id}: your uploaded artwork requires revision (transparent PNG background or 300 DPI resolution needed). Please reply here!`)}`;
    window.open(waUrl, '_blank');
    showToast(`Flagged for revision. WhatsApp notification opened.`);
  }
}

// ==========================================
// TAB 3: PRODUCTS & STICKERS CATALOG
// ==========================================
function setProductFilter(cat) {
  state.productFilter = cat;
  document.querySelectorAll('.prod-filter-btn').forEach(btn => {
    if (btn.dataset.cat === cat) {
      btn.className = 'prod-filter-btn px-3 py-1.5 rounded-lg text-xs font-black bg-[#2563eb] text-black transition';
    } else {
      btn.className = 'prod-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition';
    }
  });
  renderProductsGrid();
}

function renderProductsGrid() {
  const container = document.getElementById('productsCatalogGrid');
  if (!container) return;

  const search = (document.getElementById('productSearchInput')?.value || '').toLowerCase();
  const filtered = state.products.filter(p => {
    const matchCat = state.productFilter === 'ALL' || p.category.includes(state.productFilter);
    const matchSearch = p.name.toLowerCase().includes(search) || p.dims.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-span-full py-12 text-center text-slate-500 text-xs">No products found.</div>`;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const img = IMAGE_MAP[p.imageKey] || IMAGE_MAP.samurai;
    return `
      <div class="bg-[#111827] border ${p.active ? 'border-slate-800/90' : 'border-rose-950/60 opacity-60'} rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg hover:border-slate-700 transition group">
        <div>
          <div class="relative h-44 checkerboard-dark rounded-xl flex items-center justify-center p-3 mb-3 overflow-hidden">
            <img src="${img}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300 drop-shadow-xl" alt="${p.name}">
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/85 border border-slate-800 text-[#2563eb]">${p.category}</span>
            ${p.featured ? `<span class="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-500/20 border border-pink-500/40 text-pink-300">Featured</span>` : ''}
          </div>
          <h3 class="font-bold text-sm text-white leading-tight mb-1">${p.name}</h3>
          <p class="text-[11px] text-slate-400">${p.dims}</p>
        </div>

        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Unit Price</span>
            <span class="text-base font-extrabold text-emerald-400">${formatMoney(p.priceInr)}</span>
          </div>

          <div class="flex items-center gap-1.5">
            <button onclick="toggleProductActive('${p.id}')" title="${p.active ? 'Deactivate' : 'Activate'}" class="p-2 rounded-lg ${p.active ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-slate-800 text-slate-400 hover:text-white'} transition text-xs font-semibold">
              <i data-lucide="${p.active ? 'eye' : 'eye-off'}" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="openProductModal('${p.id}')" title="Edit Product" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="deleteProduct('${p.id}')" title="Delete Product" class="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function toggleProductActive(prodId) {
  const p = state.products.find(x => x.id === prodId);
  if (p) {
    p.active = !p.active;
    persistState();
    renderProductsGrid();
    showToast(`Product "${p.name}" is now ${p.active ? 'Active' : 'Hidden'}.`);
  }
}

function openProductModal(editId = '') {
  const title = document.getElementById('prodModalTitle');
  const nameInp = document.getElementById('prodModalName');
  const catInp = document.getElementById('prodModalCat');
  const dimsInp = document.getElementById('prodModalDims');
  const priceInp = document.getElementById('prodModalPrice');
  const featInp = document.getElementById('prodModalFeatured');
  const editIdField = document.getElementById('prodModalEditId');

  if (editId) {
    const p = state.products.find(x => x.id === editId);
    if (!p) return;
    if (title) title.textContent = 'Edit DTF Sticker Product';
    if (nameInp) nameInp.value = p.name;
    if (catInp) catInp.value = p.category;
    if (dimsInp) dimsInp.value = p.dims;
    if (priceInp) priceInp.value = p.priceInr;
    if (featInp) featInp.checked = p.featured;
    if (editIdField) editIdField.value = p.id;
  } else {
    if (title) title.textContent = 'Add New DTF Sticker Product';
    if (nameInp) nameInp.value = '';
    if (catInp) catInp.value = 'DTF Transfers';
    if (dimsInp) dimsInp.value = '8" × 10" (Full Front)';
    if (priceInp) priceInp.value = '99';
    if (featInp) featInp.checked = false;
    if (editIdField) editIdField.value = '';
  }

  const modal = document.getElementById('productModal');
  if (modal) modal.classList.remove('hidden');
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.classList.add('hidden');
}

function saveProductFromModal() {
  const editId = document.getElementById('prodModalEditId')?.value;
  const name = document.getElementById('prodModalName')?.value.trim();
  const category = document.getElementById('prodModalCat')?.value || 'DTF Transfers';
  const dims = document.getElementById('prodModalDims')?.value.trim() || '8" × 10"';
  const price = parseInt(document.getElementById('prodModalPrice')?.value || '99', 10);
  const featured = document.getElementById('prodModalFeatured')?.checked || false;

  if (!name) {
    showToast('Product name is required', 'warn');
    return;
  }

  if (editId) {
    const p = state.products.find(x => x.id === editId);
    if (p) {
      p.name = name;
      p.category = category;
      p.dims = dims;
      p.priceInr = price;
      p.featured = featured;
      showToast(`Updated product "${name}"!`);
    }
  } else {
    const newId = 'DTF-' + Date.now();
    state.products.unshift({
      id: newId,
      name: name,
      category: category,
      dims: dims,
      priceInr: price,
      imageKey: 'samurai',
      featured: featured,
      active: true,
      salesCount: 0
    });
    showToast(`Added new product "${name}" to catalog!`);
  }

  persistState();
  closeProductModal();
  renderProductsGrid();
}

function deleteProduct(prodId) {
  if (confirm('Delete this product from catalog?')) {
    state.products = state.products.filter(x => x.id !== prodId);
    persistState();
    renderProductsGrid();
    showToast('Product removed.');
  }
}

// ==========================================
// TAB 4: GANG SHEET PRICING & PROFIT ENGINE
// ==========================================
function renderGangSheetPricing() {
  const tbody = document.getElementById('gangSheetTiersBody');
  if (!tbody) return;

  tbody.innerHTML = state.gangSheetTiers.map(t => {
    const marginPct = Math.round(((t.priceInr - t.costInr) / t.priceInr) * 100);
    return `
      <tr class="border-b border-slate-800/80 hover:bg-slate-800/40 transition">
        <td class="py-3 px-3 font-bold text-white">${t.name}</td>
        <td class="py-3 px-3 font-mono text-cyan-300 text-xs">${t.dims}</td>
        <td class="py-3 px-3 text-xs text-slate-300">${t.capacity}</td>
        <td class="py-3 px-3 font-mono font-bold text-white">${formatMoney(t.priceInr)}</td>
        <td class="py-3 px-3 font-mono text-xs text-slate-400">${formatMoney(t.costInr)}</td>
        <td class="py-3 px-3 font-mono text-xs font-bold text-emerald-400">${marginPct}% Margin</td>
        <td class="py-3 px-3 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="toggleGangTier('${t.id}')" title="${t.active ? 'Active' : 'Disabled'}" class="px-2 py-1 rounded text-xs font-bold ${t.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}">
              ${t.active ? 'Active' : 'Off'}
            </button>
            <button onclick="deleteGangTier('${t.id}')" class="p-1 rounded text-rose-400 hover:text-rose-300">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Populate size dropdown in profit calculator
  const calcSelect = document.getElementById('calcSheetSizeSelect');
  if (calcSelect) {
    calcSelect.innerHTML = state.gangSheetTiers.map(t => `
      <option value="${t.id}" data-price="${t.priceInr}" data-cost="${t.costInr}">${t.name} (${t.dims}) — ${formatMoney(t.priceInr)}</option>
    `).join('');
  }

  runProfitCalculator();
  if (window.lucide) lucide.createIcons();
}

function toggleGangTier(id) {
  const t = state.gangSheetTiers.find(x => x.id === id);
  if (t) {
    t.active = !t.active;
    persistState();
    renderGangSheetPricing();
  }
}

function deleteGangTier(id) {
  if (confirm('Delete this gang sheet tier?')) {
    state.gangSheetTiers = state.gangSheetTiers.filter(x => x.id !== id);
    persistState();
    renderGangSheetPricing();
    showToast('Tier deleted.');
  }
}

function openGangSizeModal() {
  const modal = document.getElementById('gangSizeModal');
  if (modal) modal.classList.remove('hidden');
}

function closeGangSizeModal() {
  const modal = document.getElementById('gangSizeModal');
  if (modal) modal.classList.add('hidden');
}

function saveNewGangTier() {
  const name = document.getElementById('newTierName')?.value.trim();
  const dims = document.getElementById('newTierDims')?.value.trim();
  const cap = document.getElementById('newTierCap')?.value.trim();
  const price = parseInt(document.getElementById('newTierPrice')?.value || '499', 10);
  const cost = parseInt(document.getElementById('newTierCost')?.value || '100', 10);

  if (!name || !dims) {
    showToast('Name and dimensions are required', 'warn');
    return;
  }

  state.gangSheetTiers.push({
    id: 'GS-' + Date.now(),
    name: name,
    dims: dims,
    capacity: cap || 'Fits multiple gang graphics',
    priceInr: price,
    costInr: cost,
    active: true
  });

  persistState();
  closeGangSizeModal();
  renderGangSheetPricing();
  showToast(`Added Gang Sheet Tier: ${name}`);
}

function runProfitCalculator() {
  const select = document.getElementById('calcSheetSizeSelect');
  const qtyInput = document.getElementById('calcQuantityInput');
  const qty = parseInt(qtyInput?.value || '5', 10);

  let unitPrice = 899;
  let unitCost = 195;

  if (select && select.selectedOptions[0]) {
    unitPrice = parseInt(select.selectedOptions[0].dataset.price || '899', 10);
    unitCost = parseInt(select.selectedOptions[0].dataset.cost || '195', 10);
  }

  // Bulk discount rule: >= 5 sheets get 5% off, >= 10 get 10% off
  let discountPct = 0;
  if (qty >= 10) discountPct = 10;
  else if (qty >= 5) discountPct = 5;

  const discBadge = document.getElementById('calcDiscountBadge');
  if (discBadge) discBadge.value = `${discountPct}% Off (${qty >= 5 ? 'Bulk Tier' : 'None'})`;

  const rawRevenue = unitPrice * qty;
  const customerPays = rawRevenue * (1 - discountPct / 100);
  const totalCost = unitCost * qty;
  const profit = customerPays - totalCost;
  const marginPct = customerPays > 0 ? Math.round((profit / customerPays) * 100) : 0;

  const custTotalEl = document.getElementById('calcCustomerTotal');
  const prodCostEl = document.getElementById('calcProductionCost');
  const netProfitEl = document.getElementById('calcNetProfit');

  if (custTotalEl) custTotalEl.textContent = formatMoney(customerPays);
  if (prodCostEl) prodCostEl.textContent = `-${formatMoney(totalCost)}`;
  if (netProfitEl) netProfitEl.textContent = `${formatMoney(profit)} (${marginPct}%)`;
}

// ==========================================
// TAB 5: WEBSITE CMS & DISCOUNTS
// ==========================================
function renderWebsiteCMS() {
  const brandEl = document.getElementById('cmsBrandName');
  const phoneEl = document.getElementById('cmsSupportPhone');
  const bannerChk = document.getElementById('cmsBannerActive');
  const announceEl = document.getElementById('cmsAnnouncementText');
  const headlineEl = document.getElementById('cmsHeroHeadline');
  const subEl = document.getElementById('cmsHeroSubtitle');
  const ctaEl = document.getElementById('cmsHeroCta');
  const shipEl = document.getElementById('cmsFreeShipInput');
  const tempEl = document.getElementById('cmsPressTemp');
  const timeEl = document.getElementById('cmsPressTime');
  const peelEl = document.getElementById('cmsPeelType');

  if (brandEl) brandEl.value = state.cms.brandName;
  if (phoneEl) phoneEl.value = state.cms.supportPhone;
  if (bannerChk) bannerChk.checked = state.cms.bannerActive;
  if (announceEl) announceEl.value = state.cms.announcementText;
  if (headlineEl) headlineEl.value = state.cms.heroHeadline;
  if (subEl) subEl.value = state.cms.heroSubtitle;
  if (ctaEl) ctaEl.value = state.cms.heroCta;
  if (shipEl) shipEl.value = state.cms.freeShipThreshold;
  if (tempEl) tempEl.value = state.cms.pressTemp;
  if (timeEl) timeEl.value = state.cms.pressTime;
  if (peelEl) peelEl.value = state.cms.peelType;

  // Render Coupons
  const coupCont = document.getElementById('couponsListContainer');
  if (coupCont) {
    coupCont.innerHTML = state.coupons.map(c => `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div>
          <span class="font-mono font-bold text-[#2563eb]">${c.code}</span>
          <span class="ml-2 font-mono text-emerald-400 font-bold">${c.discountPct}% OFF</span>
          <span class="ml-2 text-[10px] text-slate-400 font-mono">(${c.uses} uses)</span>
        </div>
        <div class="flex items-center gap-1.5">
          <button onclick="toggleCoupon('${c.code}')" class="px-2 py-0.5 rounded text-[10px] font-bold ${c.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}">
            ${c.active ? 'Active' : 'Off'}
          </button>
          <button onclick="deleteCoupon('${c.code}')" class="p-1 rounded text-rose-400 hover:text-rose-300">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  if (window.lucide) lucide.createIcons();
}

function saveWebsiteCMS() {
  state.cms.brandName = document.getElementById('cmsBrandName')?.value.trim() || state.cms.brandName;
  state.cms.supportPhone = document.getElementById('cmsSupportPhone')?.value.trim() || state.cms.supportPhone;
  state.cms.bannerActive = document.getElementById('cmsBannerActive')?.checked ?? true;
  state.cms.announcementText = document.getElementById('cmsAnnouncementText')?.value.trim() || state.cms.announcementText;
  state.cms.heroHeadline = document.getElementById('cmsHeroHeadline')?.value.trim() || state.cms.heroHeadline;
  state.cms.heroSubtitle = document.getElementById('cmsHeroSubtitle')?.value.trim() || state.cms.heroSubtitle;
  state.cms.heroCta = document.getElementById('cmsHeroCta')?.value.trim() || state.cms.heroCta;
  state.cms.freeShipThreshold = parseInt(document.getElementById('cmsFreeShipInput')?.value || '1499', 10);
  state.cms.pressTemp = document.getElementById('cmsPressTemp')?.value.trim() || state.cms.pressTemp;
  state.cms.pressTime = document.getElementById('cmsPressTime')?.value.trim() || state.cms.pressTime;
  state.cms.peelType = document.getElementById('cmsPeelType')?.value.trim() || state.cms.peelType;

  // Sync phone back to main app localStorage if changed
  const rawDigits = state.cms.supportPhone.replace(/\D/g, '');
  if (rawDigits.length >= 10) {
    localStorage.setItem('dtf_owner_wa', rawDigits.slice(-10));
  }

  persistState();
  showToast('Website CMS, branding & heat press parameters saved!');
}

function addDiscountCoupon() {
  const code = document.getElementById('newCouponCode')?.value.trim().toUpperCase();
  const disc = parseInt(document.getElementById('newCouponPct')?.value || '15', 10);

  if (!code) {
    showToast('Coupon code is required', 'warn');
    return;
  }

  state.coupons.push({
    code: code,
    discountPct: disc,
    uses: 0,
    active: true
  });

  document.getElementById('newCouponCode').value = '';
  persistState();
  renderWebsiteCMS();
  showToast(`Discount coupon ${code} added!`);
}

function toggleCoupon(code) {
  const c = state.coupons.find(x => x.code === code);
  if (c) {
    c.active = !c.active;
    persistState();
    renderWebsiteCMS();
  }
}

function deleteCoupon(code) {
  state.coupons = state.coupons.filter(x => x.code !== code);
  persistState();
  renderWebsiteCMS();
  showToast(`Coupon ${code} removed.`);
}

function openStorefrontPreviewModal() {
  const modal = document.getElementById('storefrontPreviewModal');
  if (!modal) return;
  modal.classList.remove('hidden');

  const banner = document.getElementById('prevStoreBanner');
  if (banner) {
    if (state.cms.bannerActive) {
      banner.classList.remove('hidden');
      banner.textContent = state.cms.announcementText;
    } else {
      banner.classList.add('hidden');
    }
  }

  const brand = document.getElementById('prevStoreBrand');
  if (brand) brand.textContent = state.cms.brandName;
  const head = document.getElementById('prevStoreHeadline');
  if (head) head.textContent = state.cms.heroHeadline;
  const sub = document.getElementById('prevStoreSub');
  if (sub) sub.textContent = state.cms.heroSubtitle;
  const cta = document.getElementById('prevStoreCta');
  if (cta) cta.textContent = state.cms.heroCta;

  const grid = document.getElementById('prevStoreProducts');
  if (grid) {
    grid.innerHTML = state.products.filter(p => p.active).slice(0, 4).map(p => {
      const img = IMAGE_MAP[p.imageKey] || IMAGE_MAP.samurai;
      return `
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div class="h-28 checkerboard-dark rounded-lg flex items-center justify-center p-2 mb-2">
            <img src="${img}" class="max-h-full max-w-full object-contain" alt="${p.name}">
          </div>
          <div>
            <div class="font-bold text-xs text-white leading-tight">${p.name}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">${p.dims}</div>
          </div>
          <div class="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between">
            <span class="text-xs font-black text-[#2563eb]">${formatMoney(p.priceInr)}</span>
            <span class="text-[10px] font-black px-2 py-0.5 rounded bg-[#2563eb] text-black">Add</span>
          </div>
        </div>
      `;
    }).join('');
  }
}

function closeStorefrontPreviewModal() {
  const modal = document.getElementById('storefrontPreviewModal');
  if (modal) modal.classList.add('hidden');
}

// ==========================================
// TAB 6: RAW MATERIALS & INVENTORY
// ==========================================
function renderInventory() {
  const container = document.getElementById('inventoryGridContainer');
  if (!container) return;

  container.innerHTML = state.inventory.map(i => {
    const isLow = i.stockPct <= i.minPct;
    return `
      <div class="bg-[#111827] border ${isLow ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800/90'} rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isLow ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-300'}">${i.category}</span>
            <span class="text-xs font-bold ${isLow ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}">${i.status}</span>
          </div>
          <h3 class="font-bold text-sm text-white">${i.name}</h3>
          <p class="text-xs text-slate-400 font-mono mt-0.5">${i.unit}</p>
        </div>

        <div>
          <div class="flex items-center justify-between text-xs font-mono mb-1">
            <span class="text-slate-400">Tank Capacity</span>
            <span class="${isLow ? 'text-amber-400 font-bold' : 'text-white'}">${i.stockPct}%</span>
          </div>
          <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500 ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}" style="width: ${i.stockPct}%"></div>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1">
            <button onclick="adjustInventory('${i.id}', -5)" class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs">-5%</button>
            <button onclick="adjustInventory('${i.id}', 10)" class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs">+10%</button>
          </div>
          <button onclick="adjustInventory('${i.id}', 100 - ${i.stockPct})" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">
            Full Refill
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function adjustInventory(id, delta) {
  const item = state.inventory.find(x => x.id === id);
  if (item) {
    item.stockPct = Math.max(0, Math.min(100, item.stockPct + delta));
    item.status = item.stockPct <= item.minPct ? 'Low Stock' : 'Healthy';
    persistState();
    renderInventory();
    showToast(`Updated ${item.name}: ${item.stockPct}%`);
  }
}

function restockAllLowItems() {
  state.inventory.forEach(i => {
    if (i.stockPct <= i.minPct) {
      i.stockPct = 100;
      i.status = 'Healthy';
    }
  });
  persistState();
  renderInventory();
  showToast('All consumable tanks & rolls fully restocked!');
}

// ==========================================
// TAB 7: SUPABASE DATABASE & INTEGRATION
// ==========================================
const SUPABASE_SQL_SCHEMA = `-- ============================================================
-- SUPABASE POSTGRESQL SCHEMA FOR BLACKSTONE DTF STUDIO
-- Paste this into your Supabase SQL Editor and click "Run"
-- ============================================================

-- 1. Storefront & Production Settings
CREATE TABLE IF NOT EXISTS public.dtf_site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  brand_name TEXT NOT NULL DEFAULT 'BLACKSTONE DTF STUDIO',
  founder TEXT DEFAULT 'Rajshekhar Chaurasiya',
  support_phone TEXT DEFAULT '+91 9876543210',
  banner_active BOOLEAN DEFAULT true,
  announcement_text TEXT,
  hero_headline TEXT,
  hero_subtitle TEXT,
  hero_cta TEXT,
  free_ship_threshold NUMERIC DEFAULT 1499,
  press_temp TEXT DEFAULT '300°F / 150°C',
  press_time TEXT DEFAULT '12–15 Sec',
  peel_type TEXT DEFAULT 'Instant Cold/Warm Peel',
  builder_margin TEXT DEFAULT '0.25 in',
  builder_dpi TEXT DEFAULT '300 DPI',
  rush_fee_pct NUMERIC DEFAULT 20,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Custom Gang Sheet Size Tiers (22" Roll Width)
CREATE TABLE IF NOT EXISTS public.dtf_gang_sheet_sizes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dims TEXT NOT NULL,
  capacity TEXT,
  price_inr NUMERIC NOT NULL,
  cost_inr NUMERIC DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Website DTF Sticker & Custom Apparel Catalog
CREATE TABLE IF NOT EXISTS public.dtf_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  dims TEXT,
  price_inr NUMERIC NOT NULL,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  sales_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Customer Orders & RIP Print Queue
CREATE TABLE IF NOT EXISTS public.dtf_orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  phone TEXT,
  order_type TEXT NOT NULL,
  spec TEXT NOT NULL,
  linear_feet NUMERIC DEFAULT 5.0,
  artwork_file_url TEXT,
  dpi_status TEXT DEFAULT 'Pending Check',
  stage TEXT DEFAULT 'Pending Artwork',
  total_inr NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Discount Coupons
CREATE TABLE IF NOT EXISTS public.dtf_coupons (
  code TEXT PRIMARY KEY,
  discount_pct INT NOT NULL,
  uses INT DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- 6. Consumables & Machine Inventory
CREATE TABLE IF NOT EXISTS public.dtf_inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock_pct INT NOT NULL DEFAULT 100,
  unit TEXT,
  min_pct INT DEFAULT 25
);

-- Enable Row Level Security
ALTER TABLE public.dtf_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dtf_gang_sheet_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dtf_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dtf_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public storefront can view active products"
  ON public.dtf_products FOR SELECT USING (active = true);

CREATE POLICY "Public storefront can view active gang sheet tiers"
  ON public.dtf_gang_sheet_sizes FOR SELECT USING (active = true);

CREATE POLICY "Public storefront can submit new orders"
  ON public.dtf_orders FOR INSERT WITH CHECK (true);
`;

const SUPABASE_FRONTEND_JS = `// ============================================================
// BLACKSTONE DTF STUDIO - SUPABASE CLIENT HELPER (supabaseClient.js)
// Ready for going live with Supabase PostgreSQL & Cloud Storage
// ============================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

const SUPABASE_URL = 'https://bxdmhbfpprnrcexwxrzh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tGKzE6gt-zcaRpkMD2jhmQ_KmhvkHAL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. Fetch Storefront Products & Gang Sheet Sizes
export async function loadLiveCatalog() {
  const [productsRes, gangRes, settingsRes] = await Promise.all([
    supabase.from('dtf_products').select('*').eq('active', true),
    supabase.from('dtf_gang_sheet_sizes').select('*').eq('active', true),
    supabase.from('dtf_site_settings').select('*').single()
  ]);
  return {
    products: productsRes.data || [],
    gangSheetSizes: gangRes.data || [],
    settings: settingsRes.data
  };
}

// 2. Submit Customer Order to Supabase Print Queue
export async function submitLiveOrder(orderPayload, artworkFile) {
  let uploadedArtworkUrl = '';
  if (artworkFile) {
    const filePath = \`artworks/\${Date.now()}-\${artworkFile.name}\`;
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('dtf-artworks')
      .upload(filePath, artworkFile);
    if (!uploadErr) {
      const { data: publicUrlData } = supabase.storage.from('dtf-artworks').getPublicUrl(filePath);
      uploadedArtworkUrl = publicUrlData.publicUrl;
    }
  }

  const { data, error } = await supabase.from('dtf_orders').insert([{
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
`;

function switchCodeTab(tab) {
  state.activeCodeTab = tab;
  const sqlBtn = document.getElementById('codeTabSql');
  const jsBtn = document.getElementById('codeTabJs');
  const display = document.getElementById('supabaseCodeDisplay');
  if (!display) return;

  if (tab === 'sql') {
    if (sqlBtn) sqlBtn.className = 'px-3 py-1 rounded-md font-bold bg-[#2563eb] text-black';
    if (jsBtn) jsBtn.className = 'px-3 py-1 rounded-md font-semibold text-slate-400 hover:text-white';
    display.textContent = SUPABASE_SQL_SCHEMA;
  } else {
    if (jsBtn) jsBtn.className = 'px-3 py-1 rounded-md font-bold bg-[#2563eb] text-black';
    if (sqlBtn) sqlBtn.className = 'px-3 py-1 rounded-md font-semibold text-slate-400 hover:text-white';
    display.textContent = SUPABASE_FRONTEND_JS;
  }
}

function copyActiveCodeSnippet() {
  const display = document.getElementById('supabaseCodeDisplay');
  if (!display) return;
  const text = display.textContent;
  const temp = document.createElement('textarea');
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  temp.remove();

  const label = document.getElementById('copyBtnLabel');
  if (label) label.textContent = 'Copied to Clipboard!';
  setTimeout(() => {
    if (label) label.textContent = 'Copy Code';
  }, 2200);
  showToast('Code snippet copied! Paste directly into Supabase SQL Editor.');
}

function logSupabaseEvent(msg) {
  const container = document.getElementById('supabaseSyncLog');
  if (!container) return;
  const div = document.createElement('div');
  div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function connectSupabaseClient(silent = false) {
  const urlInput = document.getElementById('sbUrlInput');
  const keyInput = document.getElementById('sbKeyInput');
  const url = (urlInput?.value.trim()) || state.supabaseUrl || 'https://bxdmhbfpprnrcexwxrzh.supabase.co';
  const key = (keyInput?.value.trim()) || state.supabaseAnonKey || 'sb_publishable_tGKzE6gt-zcaRpkMD2jhmQ_KmhvkHAL';

  if (urlInput && !urlInput.value) urlInput.value = url;
  if (keyInput && !keyInput.value) keyInput.value = key;

  if (!url || !key) {
    if (!silent) showToast('Please provide both Supabase URL and Anon Key', 'warn');
    return;
  }

  try {
    if (window.supabase && window.supabase.createClient) {
      supabaseClientInstance = window.supabase.createClient(url, key);
      state.supabaseUrl = url;
      state.supabaseAnonKey = key;
      state.supabaseConnected = true;

      const dot = document.getElementById('supabaseStatusDot');
      const text = document.getElementById('supabaseStatusText');
      if (dot) dot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
      if (text) text.textContent = 'Supabase: Connected';

      persistState();
      logSupabaseEvent(`Connected client to ${url}`);
      if (!silent) showToast('Supabase Client connected successfully!');
    } else {
      if (!silent) showToast('Supabase library loaded in fallback mode.', 'warn');
    }
  } catch (err) {
    logSupabaseEvent(`Connection error: ${err.message}`);
    if (!silent) showToast(`Connection failed: ${err.message}`, 'error');
  }
}

async function syncAllStateToSupabase() {
  if (!supabaseClientInstance && state.supabaseUrl && state.supabaseAnonKey) {
    connectSupabaseClient();
  }

  if (!supabaseClientInstance) {
    showToast('Please connect your Supabase credentials first', 'warn');
    return;
  }

  logSupabaseEvent('Starting full state sync to Supabase PostgreSQL...');
  showToast('Syncing data to Supabase...');

  try {
    // 1. Sync Products
    const { error: prodErr } = await supabaseClientInstance.from('dtf_products').upsert(
      state.products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        dims: p.dims,
        price_inr: p.priceInr,
        featured: p.featured,
        active: p.active,
        sales_count: p.salesCount
      }))
    );
    if (prodErr) throw prodErr;
    logSupabaseEvent(`Pushed ${state.products.length} products to dtf_products.`);

    // 2. Sync Gang Sizes
    const { error: gangErr } = await supabaseClientInstance.from('dtf_gang_sheet_sizes').upsert(
      state.gangSheetTiers.map(g => ({
        id: g.id,
        name: g.name,
        dims: g.dims,
        capacity: g.capacity,
        price_inr: g.priceInr,
        cost_inr: g.costInr,
        active: g.active
      }))
    );
    if (gangErr) throw gangErr;
    logSupabaseEvent(`Pushed ${state.gangSheetTiers.length} sizes to dtf_gang_sheet_sizes.`);

    // 3. Sync Orders
    const { error: ordErr } = await supabaseClientInstance.from('dtf_orders').upsert(
      state.orders.map(o => ({
        id: o.id,
        customer: o.customer,
        phone: o.phone,
        order_type: o.type,
        spec: o.spec,
        linear_feet: o.linearFeet,
        dpi_status: o.dpiStatus,
        stage: o.stage,
        total_inr: o.totalInr
      }))
    );
    if (ordErr) throw ordErr;
    logSupabaseEvent(`Pushed ${state.orders.length} orders to dtf_orders.`);

    logSupabaseEvent('All tables successfully synced to Supabase!');
    showToast('All tables successfully synced to Supabase PostgreSQL!');
  } catch (err) {
    logSupabaseEvent(`Sync Error: ${err.message}`);
    showToast(`Sync failed: ${err.message}. Ensure SQL Schema is created first!`, 'error');
  }
}

function exportFullDatabaseJSON() {
  const payload = {
    exportDate: new Date().toISOString(),
    store: state.cms.brandName,
    founder: state.cms.founder,
    orders: state.orders,
    products: state.products,
    gangSheetTiers: state.gangSheetTiers,
    inventory: state.inventory,
    coupons: state.coupons,
    settings: state.cms
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `blackstone_dtf_database_seed_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Downloaded full database seed JSON backup!');
}

// Render entire dashboard
function renderAll() {
  const storeNameEl = document.getElementById('sidebarStoreName');
  if (storeNameEl) storeNameEl.textContent = state.cms.brandName;

  const urlInput = document.getElementById('sbUrlInput');
  if (urlInput && state.supabaseUrl) urlInput.value = state.supabaseUrl;

  const keyInput = document.getElementById('sbKeyInput');
  if (keyInput && state.supabaseAnonKey) keyInput.value = state.supabaseAnonKey;

  switchTab(state.activeTab || 'overview');
}

// ==========================================
// ADMIN PIN GATEWAY FOR ADMINDASHBOARD
// ==========================================
function checkAdminAuth() {
  const isUnlocked = sessionStorage.getItem('blackstone_admin_unlocked') === 'true';
  const lockScreen = document.getElementById('adminAuthLockScreen');
  if (lockScreen) {
    if (isUnlocked) {
      lockScreen.classList.add('hidden');
    } else {
      lockScreen.classList.remove('hidden');
      const input = document.getElementById('dashboardPinInput');
      if (input) setTimeout(() => input.focus(), 150);
    }
  }
}

function verifyDashboardPin(event) {
  if (event) event.preventDefault();
  const savedPin = localStorage.getItem('dtf_admin_pin') || '1234';
  const entered = document.getElementById('dashboardPinInput')?.value.trim();
  if (entered === savedPin) {
    sessionStorage.setItem('blackstone_admin_unlocked', 'true');
    const lockScreen = document.getElementById('adminAuthLockScreen');
    if (lockScreen) lockScreen.classList.add('hidden');
    showToast('Admin Panel Unlocked! Welcome to Blackstone OS.');
  } else {
    showToast('Incorrect Admin PIN! Default PIN is 1234.', 'error');
  }
}

function lockDashboardSession() {
  sessionStorage.removeItem('blackstone_admin_unlocked');
  showToast('Admin session locked.');
  setTimeout(() => {
    window.location.href = 'list.html';
  }, 300);
}

// ==========================================
// DARK / LIGHT BACKGROUND THEME CONTROLLER (BLUE & WHITE EDITION)
// ==========================================
function getSiteTheme() {
  return localStorage.getItem('blackstone_site_theme') || 'light';
}

function setSiteTheme(mode) {
  if (mode !== 'light' && mode !== 'dark') mode = 'light';
  localStorage.setItem('blackstone_site_theme', mode);
  applySiteTheme(mode);
}

function applySiteTheme(mode) {
  const isLight = mode === 'light';
  const root = document.documentElement;
  const body = document.body;

  if (isLight) {
    root.classList.add('light');
    root.classList.remove('dark');
    if (body) body.classList.add('light-mode');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
    if (body) body.classList.remove('light-mode');
  }

  // Update Admin Dashboard toggle pill buttons
  const darkBtn = document.getElementById('adminThemeDarkBtn');
  const lightBtn = document.getElementById('adminThemeLightBtn');
  if (darkBtn && lightBtn) {
    if (isLight) {
      darkBtn.className = 'px-2 py-1 rounded-md font-semibold transition flex items-center gap-1 text-slate-500 hover:text-blue-600 text-[11px]';
      lightBtn.className = 'px-2 py-1 rounded-md font-black transition flex items-center gap-1 bg-blue-600 text-white text-[11px] shadow-sm';
    } else {
      darkBtn.className = 'px-2 py-1 rounded-md font-black transition flex items-center gap-1 bg-blue-600 text-white text-[11px] shadow-sm';
      lightBtn.className = 'px-2 py-1 rounded-md font-semibold transition flex items-center gap-1 text-slate-400 hover:text-white text-[11px]';
    }
  }

  const wsDarkBtn = document.getElementById('adminWsDarkBtn');
  const wsLightBtn = document.getElementById('adminWsLightBtn');
  if (wsDarkBtn && wsLightBtn) {
    if (isLight) {
      wsDarkBtn.className = 'px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1.5 text-slate-500 hover:text-blue-600';
      wsLightBtn.className = 'px-2.5 py-1 rounded-md font-black transition flex items-center gap-1.5 bg-blue-600 text-white shadow-sm';
    } else {
      wsDarkBtn.className = 'px-2.5 py-1 rounded-md font-black transition flex items-center gap-1.5 bg-blue-600 text-white shadow-sm';
      wsLightBtn.className = 'px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1.5 text-slate-400 hover:text-white';
    }
  }

  if (window.lucide) lucide.createIcons();
}

window.getSiteTheme = getSiteTheme;
window.setSiteTheme = setSiteTheme;
window.applySiteTheme = applySiteTheme;

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  applySiteTheme(getSiteTheme());
  checkAdminAuth();
  loadSavedState();
  renderAll();
  if (state.supabaseUrl && state.supabaseAnonKey) {
    connectSupabaseClient(true);
  }
  if (window.lucide) lucide.createIcons();
});
