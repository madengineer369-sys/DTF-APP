// =========================================================================
// BLACKSTONE DTF STUDIO - CORE & SHARED JAVASCRIPT (dtf.js)
// =========================================================================

// -------------------------------------------------------------------------
// 1. INDEXED-DB STORAGE ENGINE (PERSISTS UPLOADED STICKER IMAGES & VIDEOS)
// -------------------------------------------------------------------------
const DB_NAME = 'BlackstoneDTFDatabase';
const DB_VERSION = 1;
const MEDIA_STORE = 'dtf_media_files';
let idbInstance = null;
let memoryMediaUrls = {}; // Maps product ID -> { imageUrl, videoUrl }

function openMediaDB() {
    return new Promise((resolve, reject) => {
        if (idbInstance) return resolve(idbInstance);
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(MEDIA_STORE)) {
                db.createObjectStore(MEDIA_STORE, { keyPath: 'id' });
            }
        };
        req.onsuccess = (e) => {
            idbInstance = e.target.result;
            resolve(idbInstance);
        };
        req.onerror = (e) => reject(e.target.error);
    });
}

async function saveMediaToIDB(productId, imageDataUrl, videoBlob) {
    try {
        const db = await openMediaDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(MEDIA_STORE, 'readwrite');
            const store = tx.objectStore(MEDIA_STORE);
            store.put({
                id: productId,
                imageDataUrl: imageDataUrl || '',
                videoBlob: videoBlob || null
            });
            tx.oncomplete = () => resolve(true);
            tx.onerror = (err) => reject(err);
        });
    } catch (e) {
        console.warn('IndexedDB storage fallback:', e);
    }
}

async function loadAllMediaFromIDB() {
    try {
        const db = await openMediaDB();
        return new Promise((resolve) => {
            const tx = db.transaction(MEDIA_STORE, 'readonly');
            const store = tx.objectStore(MEDIA_STORE);
            const req = store.getAll();
            req.onsuccess = () => {
                const records = req.result || [];
                records.forEach(rec => {
                    memoryMediaUrls[rec.id] = {
                        imageUrl: rec.imageDataUrl || '',
                        videoUrl: rec.videoBlob ? URL.createObjectURL(rec.videoBlob) : ''
                    };
                });
                resolve();
            };
            req.onerror = () => resolve();
        });
    } catch (e) {
        console.warn('IndexedDB read warning:', e);
    }
}

async function deleteMediaFromIDB(productId) {
    try {
        const db = await openMediaDB();
        const tx = db.transaction(MEDIA_STORE, 'readwrite');
        tx.objectStore(MEDIA_STORE).delete(productId);
        delete memoryMediaUrls[productId];
    } catch (e) {}
}

// -------------------------------------------------------------------------
// 2. INITIAL DTF STICKER CATALOG DATASET
// -------------------------------------------------------------------------
const defaultDtfProducts = [
    {
        id: 'DTF-101',
        name: 'Blackstone 2K26 Cyber Samurai Back Print',
        category: 'Anime',
        dimension: '10 x 12 inch (Oversized Back)',
        paint: 'Matte CMYK+White Ink',
        price: 110,
        badge: 'Bestseller',
        hasDemoVideo: true,
        svgGraphic: `<svg viewBox="0 0 120 120" class="w-32 h-32"><circle cx="60" cy="60" r="48" fill="#ef4444"/><path d="M32 75 L60 22 L88 75 Z" fill="#18181b"/><text x="60" y="96" text-anchor="middle" fill="#ffffff" font-family="Bebas Neue" font-size="18" letter-spacing="2">BLACKSTONE</text></svg>`
    },
    {
        id: 'DTF-102',
        name: 'Urban Streetwear 3D Puff Skull',
        category: 'Streetwear',
        dimension: '8 x 10 inch (Full Front)',
        paint: '3D Puff Embossed DTF',
        price: 95,
        badge: '3D Puff Ink',
        hasDemoVideo: true,
        svgGraphic: `<svg viewBox="0 0 120 120" class="w-32 h-32 puff-shadow"><rect x="20" y="20" width="80" height="80" rx="16" fill="#f97316"/><text x="60" y="62" text-anchor="middle" fill="#09090b" font-family="Bebas Neue" font-size="25">HUSTLE 26</text><text x="60" y="82" text-anchor="middle" fill="#ffffff" font-family="Inter" font-weight="800" font-size="9">STREET DIVISION</text></svg>`
    },
    {
        id: 'DTF-103',
        name: 'Golden Royal Lion Chest Crest',
        category: 'Pocket Logos',
        dimension: '3.5 x 3.5 inch (Chest Logo)',
        paint: 'Gold Metallic Foil DTF',
        price: 35,
        badge: 'Metallic Foil',
        hasDemoVideo: false,
        svgGraphic: `<svg viewBox="0 0 120 120" class="w-28 h-28"><polygon points="60,15 100,40 85,95 35,95 20,40" fill="#eab308" stroke="#fef08a" stroke-width="4"/><text x="60" y="68" text-anchor="middle" fill="#18181b" font-family="Bebas Neue" font-size="22">ROYAL</text></svg>`
    },
    {
        id: 'DTF-104',
        name: 'Mahakaal Spiritual Gold Trishul',
        category: 'Typography',
        dimension: '8 x 10 inch (Full Front)',
        paint: 'Gold Metallic Foil DTF',
        price: 90,
        badge: 'Trending in India',
        hasDemoVideo: true,
        svgGraphic: `<svg viewBox="0 0 120 120" class="w-32 h-32"><circle cx="60" cy="60" r="46" fill="#18181b" stroke="#f59e0b" stroke-width="5"/><text x="60" y="68" text-anchor="middle" fill="#f59e0b" font-family="Bebas Neue" font-size="23" letter-spacing="1">MAHAKAAL</text></svg>`
    }
];

// Load catalog from localStorage or fall back to defaults
let dtfProducts = JSON.parse(localStorage.getItem('blackstone_dtf_catalog') || 'null') || defaultDtfProducts;

function saveCatalogToStorage() {
    localStorage.setItem('blackstone_dtf_catalog', JSON.stringify(dtfProducts));
}

// -------------------------------------------------------------------------
// 3. GLOBAL APPLICATION STATE & SETTINGS
// -------------------------------------------------------------------------
let cart = JSON.parse(localStorage.getItem('dtf_india_cart') || '[]');
let ownerWhatsApp = localStorage.getItem('dtf_owner_wa') || '9876543210';
const DEFAULT_YT_CHANNEL = 'https://youtube.com/@blackkstonefashion?si=q6t18zkHSFFN0Xnh';
const DEFAULT_STUDIO_YT_CHANNEL = 'http://www.youtube.com/@BSfashionstudio-h7z';

let savedYt = localStorage.getItem('dtf_owner_yt');
if (!savedYt || !savedYt.includes('@blackkstonefashion')) {
    savedYt = DEFAULT_YT_CHANNEL;
    localStorage.setItem('dtf_owner_yt', DEFAULT_YT_CHANNEL);
}
let ownerYouTubeUrl = savedYt;
let ownerStudioYtUrl = localStorage.getItem('dtf_owner_studio_yt') || DEFAULT_STUDIO_YT_CHANNEL;
let adminSecretPin = localStorage.getItem('dtf_admin_pin') || '1234';

// Persistent Admin Unlock status in sessionStorage
let isAdminUnlocked = sessionStorage.getItem('blackstone_admin_unlocked') === 'true';

// -------------------------------------------------------------------------
// 4. MEDIA UTILITIES & DEMO VIDEO GENERATOR
// -------------------------------------------------------------------------
function getResolvedProductMedia(item) {
    const mem = memoryMediaUrls[item.id] || {};
    const imageUrl = mem.imageUrl || item.externalImageUrl || '';
    const videoUrl = mem.videoUrl || item.externalVideoUrl || '';
    const hasVideo = Boolean(videoUrl || item.hasUploadedVideo || item.hasDemoVideo);
    return { imageUrl, videoUrl, hasVideo };
}

function createSyntheticDtfDemoVideoBlob(titleText, paintText) {
    return new Promise((resolve) => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 480;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');
            const stream = canvas.captureStream(30);
            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            const chunks = [];
            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                resolve(blob);
            };
            recorder.start();

            let frame = 0;
            const maxFrames = 75; // 2.5 second loopable video
            const interval = setInterval(() => {
                frame++;
                const progress = frame / maxFrames;

                // Dark fabric texture background
                ctx.fillStyle = '#18181b';
                ctx.fillRect(0, 0, 480, 480);

                // Glowing ring
                ctx.save();
                ctx.translate(240, 220);
                ctx.scale(0.9 + Math.sin(progress * Math.PI * 2) * 0.06, 0.9 + Math.sin(progress * Math.PI * 2) * 0.06);
                ctx.fillStyle = '#f97316';
                ctx.beginPath();
                ctx.arc(0, 0, 110, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 34px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText((titleText || 'BLACKSTONE DTF').substring(0, 14).toUpperCase(), 0, 8);
                ctx.font = 'bold 16px sans-serif';
                ctx.fillStyle = '#09090b';
                ctx.fillText(paintText || 'PEEL & PRESS TESTED', 0, 40);
                ctx.restore();

                // Animated Peel Film Line sweeping across
                const peelY = 80 + progress * 300;
                ctx.strokeStyle = 'rgba(255,255,255,0.65)';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(40, peelY);
                ctx.lineTo(440, peelY - 25);
                ctx.stroke();

                ctx.fillStyle = '#10b981';
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('LIVE DTF HEAT PRESS & PEEL PREVIEW', 240, 445);

                if (frame >= maxFrames) {
                    clearInterval(interval);
                    recorder.stop();
                }
            }, 33);
        } catch (e) {
            resolve(null);
        }
    });
}

// -------------------------------------------------------------------------
// 5. FULLSCREEN MEDIA LIGHTBOX (PHOTO & VIDEO PLAYER)
// -------------------------------------------------------------------------
let activeLightboxItem = null;

async function openMediaLightbox(productId, initialTab) {
    const item = dtfProducts.find(x => x.id === productId);
    if (!item) return;
    activeLightboxItem = item;

    const lbCategory = document.getElementById('lb-category');
    if (lbCategory) lbCategory.textContent = `${item.category} • ${item.badge}`;
    const lbTitle = document.getElementById('lb-title');
    if (lbTitle) lbTitle.textContent = item.name;
    const lbDim = document.getElementById('lb-dim');
    if (lbDim) lbDim.textContent = item.dimension;
    const lbPaint = document.getElementById('lb-paint');
    if (lbPaint) lbPaint.textContent = item.paint;
    const lbPrice = document.getElementById('lb-price');
    if (lbPrice) lbPrice.textContent = `₹${item.price}`;

    const media = getResolvedProductMedia(item);
    const imgContainer = document.getElementById('lb-img-container');
    if (imgContainer) {
        if (media.imageUrl) {
            imgContainer.innerHTML = `<img src="${media.imageUrl}" alt="${item.name}" class="max-h-80 w-auto object-contain rounded-xl shadow-2xl" />`;
        } else {
            imgContainer.innerHTML = `<div class="scale-150">${item.svgGraphic || ''}</div>`;
        }
    }

    const vidTabBtn = document.getElementById('lb-tab-vid');
    if (vidTabBtn) {
        if (media.hasVideo) {
            vidTabBtn.classList.remove('hidden');
        } else {
            vidTabBtn.classList.add('hidden');
        }
    }

    const addBtn = document.getElementById('lb-add-btn');
    if (addBtn) {
        addBtn.onclick = () => {
            if (typeof addCatalogStickerToCart === 'function') {
                addCatalogStickerToCart(item.id);
            }
            closeMediaLightbox();
        };
    }

    const modal = document.getElementById('media-lightbox-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    await switchLightboxTab(initialTab === 'video' && media.hasVideo ? 'video' : 'image');
}

async function switchLightboxTab(tab) {
    if (!activeLightboxItem) return;
    const imgContainer = document.getElementById('lb-img-container');
    const vidContainer = document.getElementById('lb-vid-container');
    const videoPlayer = document.getElementById('lb-video-player');
    const tabImgBtn = document.getElementById('lb-tab-img');
    const tabVidBtn = document.getElementById('lb-tab-vid');

    if (!imgContainer || !vidContainer || !videoPlayer || !tabImgBtn || !tabVidBtn) return;

    if (tab === 'video') {
        tabVidBtn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-pink-600 text-white flex items-center gap-1.5';
        tabImgBtn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5';
        imgContainer.classList.add('hidden');
        vidContainer.classList.remove('hidden');
        vidContainer.classList.add('flex');

        let media = getResolvedProductMedia(activeLightboxItem);
        if (!media.videoUrl && activeLightboxItem.hasDemoVideo) {
            const blob = await createSyntheticDtfDemoVideoBlob(activeLightboxItem.name, activeLightboxItem.paint);
            if (blob) {
                memoryMediaUrls[activeLightboxItem.id] = memoryMediaUrls[activeLightboxItem.id] || {};
                memoryMediaUrls[activeLightboxItem.id].videoUrl = URL.createObjectURL(blob);
                media = getResolvedProductMedia(activeLightboxItem);
            }
        }
        if (media.videoUrl) {
            videoPlayer.src = media.videoUrl;
            videoPlayer.play().catch(() => {});
        }
    } else {
        tabImgBtn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-[#78cde2] text-black flex items-center gap-1.5';
        tabVidBtn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5';
        videoPlayer.pause();
        vidContainer.classList.add('hidden');
        vidContainer.classList.remove('flex');
        imgContainer.classList.remove('hidden');
    }
}

function closeMediaLightbox() {
    const modal = document.getElementById('media-lightbox-modal');
    const videoPlayer = document.getElementById('lb-video-player');
    if (videoPlayer) videoPlayer.pause();
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// -------------------------------------------------------------------------
// 6. SHOPPING CART MANAGEMENT
// -------------------------------------------------------------------------
function saveAndRefreshCart() {
    localStorage.setItem('dtf_india_cart', JSON.stringify(cart));
    renderCart();
}

function updateCartItemQty(cartItemId, delta) {
    const idx = cart.findIndex(item => item.cartItemId === cartItemId);
    if (idx === -1) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
    }
    saveAndRefreshCart();
}

function removeCartItem(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    saveAndRefreshCart();
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    let totalQty = 0;
    let grandTotal = 0;

    cart.forEach(item => {
        totalQty += item.qty;
        grandTotal += item.price * item.qty;
    });

    const badge = document.getElementById('cart-badge-count');
    if (badge) badge.textContent = totalQty;
    const headerTot = document.getElementById('header-cart-total');
    if (headerTot) headerTot.textContent = `₹${grandTotal}`;
    const sumQty = document.getElementById('cart-summary-qty');
    if (sumQty) sumQty.textContent = totalQty;
    const subTot = document.getElementById('cart-subtotal');
    if (subTot) subTot.textContent = `₹${grandTotal}`;
    const grandTot = document.getElementById('cart-grand-total');
    if (grandTot) grandTot.textContent = `₹${grandTotal}`;

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
                <div class="w-12 h-12 rounded-full bg-slate-900 text-slate-500 mx-auto flex items-center justify-center text-xl">
                    <i class="fa-solid fa-cart-shopping"></i>
                </div>
                <div class="text-sm font-bold text-white">Your DTF Order Cart is Empty</div>
                <p class="text-xs text-slate-400">Add ready-to-print DTF stickers or customise your cloth with Name, Logo & Number.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map((item, idx) => {
        const itemTotal = item.price * item.qty;
        return `
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                <div class="flex items-start justify-between gap-2">
                    <div>
                        <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded ${item.isCustom ? 'bg-[#78cde2]/15 text-[#78cde2] border border-[#78cde2]/30' : 'bg-slate-800 text-slate-300'}">
                            ${item.isCustom ? 'Custom Cloth Studio' : 'Ready DTF Sticker'}
                        </span>
                        <h4 class="font-bold text-sm text-white mt-1">${idx + 1}. ${item.name}</h4>
                    </div>
                    <button onclick="removeCartItem('${item.cartItemId}')" class="text-slate-500 hover:text-rose-400 text-xs p-1" title="Remove Item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>

                <div class="text-[11px] text-slate-300 space-y-1 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                    <div><span class="text-slate-400">Dimension:</span> <strong class="text-white">${item.dimension}</strong></div>
                    <div><span class="text-slate-400">Paint/Ink:</span> <strong class="text-[#78cde2]">${item.paint}</strong></div>
                    ${item.isCustom ? `
                        <div><span class="text-slate-400">Cloth Color & Side:</span> <strong class="text-white">${item.garmentColor} (${item.placement})</strong></div>
                        <div><span class="text-slate-400">Custom Name:</span> <strong class="text-[#78cde2]">${item.customName}</strong> | <span class="text-slate-400">No:</span> <strong class="text-[#78cde2]">${item.customNumber}</strong></div>
                        <div><span class="text-slate-400">Logo File (JPG/PNG):</span> <strong class="text-emerald-300">${item.logoFileName}</strong></div>
                        ${item.customNotes ? `<div class="text-slate-400 italic">"${item.customNotes}"</div>` : ''}
                    ` : ''}
                </div>

                <div class="flex items-center justify-between pt-1">
                    <div class="text-xs text-slate-400">
                        ₹${item.price} × ${item.qty} = <strong class="text-sm text-[#78cde2]">₹${itemTotal}</strong>
                    </div>
                    <div class="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
                        <button onclick="updateCartItemQty('${item.cartItemId}', -1)" class="w-6 h-6 rounded hover:bg-slate-800 text-xs font-bold text-white">-</button>
                        <span class="w-7 text-center text-xs font-bold text-white">${item.qty}</span>
                        <button onclick="updateCartItemQty('${item.cartItemId}', 1)" class="w-6 h-6 rounded hover:bg-slate-800 text-xs font-bold text-white">+</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (!drawer || !backdrop) return;
    if (open) {
        backdrop.classList.remove('hidden');
        drawer.classList.remove('translate-x-full');
    } else {
        backdrop.classList.add('hidden');
        drawer.classList.add('translate-x-full');
    }
}

// -------------------------------------------------------------------------
// 7. STORE SETTINGS & WHATSAPP BUSINESS INTEGRATION
// -------------------------------------------------------------------------
function toggleWaSettingsModal() {
    const modal = document.getElementById('wa-settings-modal');
    if (!modal) return;
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
    const waInput = document.getElementById('owner-wa-input');
    if (waInput) waInput.value = ownerWhatsApp;
    const ytInput = document.getElementById('owner-yt-input');
    if (ytInput) ytInput.value = ownerYouTubeUrl;
    const studioInput = document.getElementById('owner-yt-studio-input');
    if (studioInput) studioInput.value = ownerStudioYtUrl;
    const pinInput = document.getElementById('owner-pin-input');
    if (pinInput) pinInput.value = adminSecretPin;
}

function saveOwnerSettings() {
    const waEl = document.getElementById('owner-wa-input');
    const rawWa = waEl ? waEl.value.replace(/\D/g, '') : '';
    const ytVal = document.getElementById('owner-yt-input')?.value.trim() || DEFAULT_YT_CHANNEL;
    const studioYtVal = document.getElementById('owner-yt-studio-input')?.value.trim() || DEFAULT_STUDIO_YT_CHANNEL;
    const pinVal = document.getElementById('owner-pin-input')?.value.trim() || '1234';

    if (rawWa.length !== 10) {
        showToast('Please enter a valid 10-digit Indian WhatsApp number');
        return;
    }
    ownerWhatsApp = rawWa;
    ownerYouTubeUrl = ytVal;
    ownerStudioYtUrl = studioYtVal;
    adminSecretPin = pinVal;

    localStorage.setItem('dtf_owner_wa', ownerWhatsApp);
    localStorage.setItem('dtf_owner_yt', ownerYouTubeUrl);
    localStorage.setItem('dtf_owner_studio_yt', ownerStudioYtUrl);
    localStorage.setItem('dtf_admin_pin', adminSecretPin);

    applySocialAndWaLinks();
    toggleWaSettingsModal();
    showToast('WhatsApp number, YouTube channels & Admin PIN saved!');
}

function applySocialAndWaLinks() {
    const disp = document.getElementById('header-wa-display');
    if (disp) disp.textContent = `+91 ${ownerWhatsApp}`;

    ['top-youtube-link', 'hero-youtube-link', 'footer-youtube-link'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.href = ownerYouTubeUrl;
    });
    ['top-youtube-studio-link', 'hero-youtube-studio-link', 'footer-youtube-studio-link'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.href = ownerStudioYtUrl;
    });
}

function buildWhatsAppOrderMessage() {
    const custName = document.getElementById('cust-name')?.value.trim() || 'Walk-in Customer';
    const custPhone = document.getElementById('cust-phone')?.value.trim() || 'Not Provided';
    const custPincode = document.getElementById('cust-pincode')?.value.trim() || 'N/A';
    const custAddress = document.getElementById('cust-address')?.value.trim() || 'N/A';

    const orderId = 'BS-' + Math.floor(100000 + Math.random() * 900000);
    let msg = `*BLACKSTONE DTF STUDIO - NEW ORDER*\n`;
    msg += `*Order ID:* ${orderId}\n`;
    msg += `----------------------------------\n`;
    msg += `*Customer:* ${custName}\n`;
    msg += `*Phone:* ${custPhone}\n`;
    msg += `*Delivery Address:* ${custAddress} (Pin: ${custPincode})\n`;
    msg += `----------------------------------\n`;
    msg += `*ORDER PRODUCT LIST:*\n\n`;

    let grandTotal = 0;
    let totalPieces = 0;
    let hasUploadedLogo = false;

    cart.forEach((item, index) => {
        const subTotal = item.price * item.qty;
        grandTotal += subTotal;
        totalPieces += item.qty;

        msg += `*${index + 1}. ${item.name}*\n`;
        msg += `   • Dimension: ${item.dimension}\n`;
        msg += `   • Paint/Ink: ${item.paint}\n`;

        if (item.isCustom) {
            msg += `   • Cloth Color & Side: ${item.garmentColor} (${item.placement})\n`;
            msg += `   • Custom Name (Text): ${item.customName}\n`;
            msg += `   • Custom Number: ${item.customNumber}\n`;
            msg += `   • Custom Logo (JPG/PNG): ${item.logoFileName !== 'None' ? item.logoFileName + ' (Sending file in chat next)' : 'None'}\n`;
            msg += `   • Design Notes: ${item.customNotes}\n`;
            if (item.logoFileName !== 'None') hasUploadedLogo = true;
        }

        msg += `   • Qty & Price: ${item.qty} pcs x ₹${item.price} = *₹${subTotal}*\n\n`;
    });

    msg += `----------------------------------\n`;
    msg += `*Total Quantity:* ${totalPieces} pcs\n`;
    msg += `*GRAND TOTAL PAYABLE: ₹${grandTotal}*\n`;
    msg += `----------------------------------\n`;
    if (hasUploadedLogo) {
        msg += `*Note:* I am attaching my custom Logo JPG/PNG file right below in this chat.\n`;
    }
    msg += `Please confirm my order and share your UPI QR Code / payment details.`;

    return msg;
}

function placeOrderOnWhatsApp(previewOnly) {
    if (cart.length === 0) {
        showToast('Your cart is empty! Add stickers or a custom cloth design first.');
        return;
    }

    const custName = document.getElementById('cust-name')?.value.trim();
    const custPhone = document.getElementById('cust-phone')?.value.trim();

    if (!previewOnly && (!custName || !custPhone)) {
        showToast('Please enter your Name & Mobile Number inside the cart before ordering!');
        document.getElementById('cust-name')?.focus();
        return;
    }

    const message = buildWhatsAppOrderMessage();
    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/91${ownerWhatsApp}?text=${encodedMsg}`;

    const modWa = document.getElementById('modal-target-wa');
    if (modWa) modWa.textContent = `+91 ${ownerWhatsApp}`;
    const previewBox = document.getElementById('wa-message-preview-box');
    if (previewBox) previewBox.textContent = message;
    const directLink = document.getElementById('wa-direct-launch-link');
    if (directLink) directLink.href = waUrl;

    const previewModal = document.getElementById('wa-preview-modal');
    if (previewModal) {
        previewModal.classList.remove('hidden');
        previewModal.classList.add('flex');
    }

    if (!previewOnly) {
        if (typeof sendOrderToSupabase === 'function') {
            const total = cart.reduce((sum, item) => sum + (Number(item.price) * (item.qty || 1)), 0);
            const summary = cart.map(i => `${i.qty}x ${i.name} (${i.dimension})`).join('; ');
            sendOrderToSupabase({
                customerName: custName,
                phone: custPhone,
                orderType: cart.some(i => i.isCustom) ? 'Custom Apparel' : 'DTF Stickers',
                summary: summary,
                total: total
            });
        }
        window.open(waUrl, '_blank');
    }
}

function closeWaPreviewModal() {
    const previewModal = document.getElementById('wa-preview-modal');
    if (previewModal) {
        previewModal.classList.add('hidden');
        previewModal.classList.remove('flex');
    }
}

function copyOrderText() {
    const text = document.getElementById('wa-message-preview-box')?.textContent || '';
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('Order invoice copied to clipboard!');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-msg');
    if (!toast || !msg) return;
    msg.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0', 'pointer-events-none');
    }, 3000);
}

// -------------------------------------------------------------------------
// 8. ADMIN PIN ACCESS GUARD
// -------------------------------------------------------------------------
function handleAdminNavClick() {
    if (isAdminUnlocked) {
        window.location.href = 'ADMINDASHBOARD.html';
    } else {
        const modal = document.getElementById('admin-pin-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            const pinInput = document.getElementById('admin-pin-input');
            if (pinInput) {
                pinInput.value = '';
                setTimeout(() => pinInput.focus(), 100);
            }
        }
    }
}

function closeAdminPinModal() {
    const modal = document.getElementById('admin-pin-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function verifyAdminPinSubmit(e) {
    if (e) e.preventDefault();
    const entered = document.getElementById('admin-pin-input')?.value.trim();
    if (entered === adminSecretPin) {
        isAdminUnlocked = true;
        sessionStorage.setItem('blackstone_admin_unlocked', 'true');
        const lockIcon = document.getElementById('admin-lock-icon');
        if (lockIcon) lockIcon.className = 'fa-solid fa-lock-open text-emerald-400 text-xs';
        closeAdminPinModal();
        showToast('Admin Panel Unlocked! Loading Blackstone OS...');
        setTimeout(() => {
            window.location.href = 'ADMINDASHBOARD.html';
        }, 300);
    } else {
        showToast('Incorrect Admin PIN! Default PIN is 1234.');
    }
}

function lockAdminSession() {
    isAdminUnlocked = false;
    sessionStorage.removeItem('blackstone_admin_unlocked');
    const lockIcon = document.getElementById('admin-lock-icon');
    if (lockIcon) lockIcon.className = 'fa-solid fa-lock text-xs';
    showToast('Admin session locked.');
    setTimeout(() => {
        window.location.href = 'list.html';
    }, 300);
}

// -------------------------------------------------------------------------
// 8.5. DARK / LIGHT BACKGROUND THEME CONTROLLER (BLUE & WHITE EDITION)
// -------------------------------------------------------------------------
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

    // Update Storefront toggle pill buttons if present
    const darkBtn = document.getElementById('theme-dark-btn');
    const lightBtn = document.getElementById('theme-light-btn');
    if (darkBtn && lightBtn) {
        if (isLight) {
            darkBtn.className = 'px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-blue-600 transition flex items-center gap-1.5';
            lightBtn.className = 'px-2 sm:px-2.5 py-1 rounded-lg text-xs font-black transition flex items-center gap-1.5 bg-blue-600 text-white shadow-sm';
        } else {
            darkBtn.className = 'px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-blue-600 text-white shadow-sm';
            lightBtn.className = 'px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1.5';
        }
    }
}

window.getSiteTheme = getSiteTheme;
window.setSiteTheme = setSiteTheme;
window.applySiteTheme = applySiteTheme;

// -------------------------------------------------------------------------
// 9. COMMON INITIALIZATION ON EVERY PAGE
// -------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    applySiteTheme(getSiteTheme());
    applySocialAndWaLinks();
    await loadAllMediaFromIDB();
    renderCart();

    const lockIcon = document.getElementById('admin-lock-icon');
    if (lockIcon && isAdminUnlocked) {
        lockIcon.className = 'fa-solid fa-lock-open text-emerald-400 text-xs';
    }
});

