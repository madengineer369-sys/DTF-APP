// =========================================================================
// BLACKSTONE DTF STUDIO - DTF STICKERS LISTING & CATALOG (list.js)
// =========================================================================

let currentCategory = 'All';
let globalCardBg = 'dark';
let cardQuantities = {};
let cardActiveMediaTab = {}; // productId -> 'image' | 'video'

function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        if (btn.dataset.cat === cat) {
            btn.className = 'cat-btn px-4 py-2 rounded-xl text-xs font-black bg-[#2563eb] text-black whitespace-nowrap transition shadow-md shadow-[#2563eb]/25';
        } else {
            btn.className = 'cat-btn px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap transition border border-slate-800';
        }
    });
    renderCatalog();
}

function setGlobalCardBg(mode) {
    globalCardBg = mode;
    const darkBtn = document.getElementById('bg-dark-btn');
    const lightBtn = document.getElementById('bg-light-btn');
    if (!darkBtn || !lightBtn) return;
    if (mode === 'dark') {
        darkBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-white flex items-center gap-1.5';
        lightBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5';
    } else {
        lightBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-white flex items-center gap-1.5';
        darkBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5';
    }
    renderCatalog();
}

function changeCardQty(id, delta) {
    cardQuantities[id] = Math.max(1, (cardQuantities[id] || 1) + delta);
    const el = document.getElementById(`qty-${id}`);
    if (el) el.textContent = cardQuantities[id];
}

async function toggleCardMediaView(productId, mode) {
    cardActiveMediaTab[productId] = mode;
    const item = dtfProducts.find(x => x.id === productId);
    if (mode === 'video' && item) {
        const media = getResolvedProductMedia(item);
        if (!media.videoUrl && item.hasDemoVideo) {
            showToast('Loading DTF Peel & Press Video Preview...');
            const blob = await createSyntheticDtfDemoVideoBlob(item.name, item.paint);
            if (blob) {
                memoryMediaUrls[item.id] = memoryMediaUrls[item.id] || {};
                memoryMediaUrls[item.id].videoUrl = URL.createObjectURL(blob);
            }
        }
    }
    renderCatalog();
}

function renderCatalog() {
    const searchVal = (document.getElementById('catalog-search')?.value || '').toLowerCase();
    const grid = document.getElementById('sticker-grid');
    if (!grid) return;

    const filtered = dtfProducts.filter(item => {
        const matchesCat = currentCategory === 'All' || item.category === currentCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchVal) ||
            item.dimension.toLowerCase().includes(searchVal) ||
            item.paint.toLowerCase().includes(searchVal);
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <i class="fa-solid fa-magnifying-glass text-3xl text-slate-600"></i>
                <h3 class="text-base font-bold text-white">No matching DTF stickers found</h3>
                <p class="text-xs text-slate-400">Try clearing your search or head over to the Custom Cloth Studio to customize your own.</p>
                <a href="customdtf.html" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-black font-black text-xs shadow-md shadow-[#2563eb]/20">
                    <i class="fa-solid fa-shirt"></i> Open Custom Studio
                </a>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(item => {
        const bgClass = globalCardBg === 'dark' ? 'checkerboard-dark' : 'checkerboard-light';
        const qty = cardQuantities[item.id] || 1;
        const media = getResolvedProductMedia(item);
        const activeMode = cardActiveMediaTab[item.id] || 'image';

        let visualContent = '';
        if (activeMode === 'video' && media.videoUrl) {
            visualContent = `<video src="${media.videoUrl}" controls autoplay muted loop playsinline class="w-full h-full object-cover rounded-xl shadow-lg"></video>`;
        } else if (media.imageUrl) {
            visualContent = `<img src="${media.imageUrl}" alt="${item.name}" onclick="openMediaLightbox('${item.id}', 'image')" class="max-h-44 w-auto object-contain rounded drop-shadow-xl cursor-pointer group-hover:scale-105 transition-transform duration-300" />`;
        } else {
            visualContent = `<div onclick="openMediaLightbox('${item.id}', 'image')" class="cursor-pointer group-hover:scale-110 transition-transform duration-300">${item.svgGraphic || ''}</div>`;
        }

        return `
            <div class="bg-[#050810] border border-slate-800/80 hover:border-[#2563eb]/60 rounded-2xl overflow-hidden flex flex-col justify-between transition group shadow-lg hover:shadow-[#2563eb]/10">
                <div>
                    <!-- Visual Sticker Preview Area (Supports Photo & Video Toggle) -->
                    <div class="relative h-52 ${bgClass} flex items-center justify-center p-3 transition-colors">
                        <span class="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-black/90 border border-[#2563eb]/40 text-[10px] font-bold text-[#2563eb]">
                            ${item.badge}
                        </span>

                        <!-- Photo / Video Switcher Pill on Card -->
                        ${media.hasVideo ? `
                            <div class="absolute bottom-2.5 left-2.5 z-10 flex items-center bg-black/90 border border-slate-700 rounded-lg p-0.5 text-[10px]">
                                <button onclick="toggleCardMediaView('${item.id}', 'image')" class="px-2 py-0.5 rounded font-black transition ${activeMode === 'image' ? 'bg-[#2563eb] text-black' : 'text-slate-400 hover:text-white'}">
                                    <i class="fa-solid fa-image mr-1"></i>Photo
                                </button>
                                <button onclick="toggleCardMediaView('${item.id}', 'video')" class="px-2 py-0.5 rounded font-black transition flex items-center gap-1 ${activeMode === 'video' ? 'bg-[#2563eb] text-black' : 'text-[#2563eb] hover:text-white'}">
                                    <i class="fa-solid fa-play"></i>Video
                                </button>
                            </div>
                        ` : ''}

                        <!-- Fullscreen Zoom Button -->
                        <button onclick="openMediaLightbox('${item.id}', '${activeMode}')" title="Expand Photo & Video" class="absolute bottom-2.5 right-2.5 z-10 w-7 h-7 rounded-lg bg-black/85 hover:bg-slate-800 text-slate-300 hover:text-[#2563eb] border border-slate-700 flex items-center justify-center text-xs">
                            <i class="fa-solid fa-expand"></i>
                        </button>

                        ${visualContent}
                    </div>

                    <!-- Sticker Info: Title, Dimension & Paint -->
                    <div class="p-4 space-y-3">
                        <div class="flex items-start justify-between gap-2">
                            <h3 class="font-bold text-base text-white leading-snug group-hover:text-[#2563eb] transition-colors">${item.name}</h3>
                        </div>
                        
                        <div class="space-y-1.5 text-xs">
                            <div class="flex items-center gap-2 text-slate-300 bg-black/70 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                                <i class="fa-solid fa-ruler-combined text-[#2563eb] w-4 text-center"></i>
                                <span class="text-slate-400">Dimension:</span>
                                <strong class="text-white ml-auto text-right">${item.dimension}</strong>
                            </div>
                            <div class="flex items-center gap-2 text-slate-300 bg-black/70 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                                <i class="fa-solid fa-fill-drip text-[#2563eb] w-4 text-center"></i>
                                <span class="text-slate-400">Paint:</span>
                                <strong class="text-[#2563eb] ml-auto text-right">${item.paint}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Price in INR & Add to Cart Controls -->
                <div class="p-4 pt-0">
                    <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400 block">Price / Sticker</span>
                            <span class="text-xl font-black text-[#2563eb]">₹${item.price}</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <div class="flex items-center bg-black border border-slate-800 rounded-xl p-0.5">
                                <button onclick="changeCardQty('${item.id}', -1)" class="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-300 font-bold text-xs">-</button>
                                <span id="qty-${item.id}" class="w-6 text-center text-xs font-bold text-white">${qty}</span>
                                <button onclick="changeCardQty('${item.id}', 1)" class="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-300 font-bold text-xs">+</button>
                            </div>

                            <button onclick="addCatalogStickerToCart('${item.id}')" class="px-3.5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-black font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-[#2563eb]/20">
                                <i class="fa-solid fa-cart-plus"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function addCatalogStickerToCart(productId) {
    const product = dtfProducts.find(p => p.id === productId);
    if (!product) return;
    const qty = cardQuantities[productId] || 1;

    const existingIndex = cart.findIndex(c => !c.isCustom && c.productId === product.id);
    if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({
            cartItemId: 'ITEM-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            productId: product.id,
            isCustom: false,
            name: product.name,
            dimension: product.dimension,
            paint: product.paint,
            price: product.price,
            qty: qty
        });
    }

    cardQuantities[productId] = 1;
    renderCatalog();
    saveAndRefreshCart();
    showToast(`Added ${qty}x "${product.name}" to your order!`);
}

document.addEventListener('DOMContentLoaded', async () => {
    dtfProducts.forEach(p => { cardQuantities[p.id] = 1; });
    renderCatalog();

    if (typeof fetchSupabaseProducts === 'function') {
        try {
            const cloudProducts = await fetchSupabaseProducts();
            if (cloudProducts && cloudProducts.length > 0) {
                cloudProducts.forEach(cp => {
                    const idx = dtfProducts.findIndex(p => p.id === cp.id);
                    if (idx > -1) {
                        dtfProducts[idx] = Object.assign({}, dtfProducts[idx], cp);
                    } else {
                        dtfProducts.unshift(cp);
                    }
                });
                dtfProducts.forEach(p => { cardQuantities[p.id] = cardQuantities[p.id] || 1; });
                renderCatalog();
            }
        } catch (e) {
            console.warn('Supabase catalog load:', e);
        }
    }
});

