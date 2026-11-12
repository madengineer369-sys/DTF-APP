// =========================================================================
// BLACKSTONE DTF STUDIO - ADMIN PORTAL & STICKER UPLOAD (admin.js)
// =========================================================================

let adminTempImageDataUrl = '';
let adminTempVideoBlob = null;
let adminTempVideoObjUrl = '';

function handleAdminImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const nameEl = document.getElementById('admin-img-filename');
    if (nameEl) nameEl.textContent = file.name;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const maxDim = 700;
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
                if (w > h) { h = Math.round(h * (maxDim / w)); w = maxDim; }
                else { w = Math.round(w * (maxDim / h)); h = maxDim; }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            adminTempImageDataUrl = canvas.toDataURL('image/png', 0.9);
            switchAdminPreviewMedia('image');
            updateAdminLivePreview();
            showToast('Sticker Image ready for preview!');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function handleAdminVideoSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const nameEl = document.getElementById('admin-vid-filename');
    if (nameEl) nameEl.textContent = file.name;
    adminTempVideoBlob = file;
    if (adminTempVideoObjUrl) URL.revokeObjectURL(adminTempVideoObjUrl);
    adminTempVideoObjUrl = URL.createObjectURL(file);
    switchAdminPreviewMedia('video');
    updateAdminLivePreview();
    showToast('Sticker Video loaded into preview!');
}

async function generateDemoCanvasVideoForAdmin() {
    const title = document.getElementById('admin-title')?.value || 'BLACKSTONE DTF';
    const paint = document.getElementById('admin-paint')?.value || '3D Puff Ink';
    showToast('Generating Peel & Press Demo Video...');
    const blob = await createSyntheticDtfDemoVideoBlob(title, paint);
    if (blob) {
        adminTempVideoBlob = blob;
        if (adminTempVideoObjUrl) URL.revokeObjectURL(adminTempVideoObjUrl);
        adminTempVideoObjUrl = URL.createObjectURL(blob);
        const nameEl = document.getElementById('admin-vid-filename');
        if (nameEl) nameEl.textContent = 'dtf-peel-demo.webm (Generated)';
        switchAdminPreviewMedia('video');
        updateAdminLivePreview();
        showToast('Demo Video generated! Check the Live Preview on the right.');
    }
}

function switchAdminPreviewMedia(mode) {
    const tabImg = document.getElementById('adm-prev-tab-img');
    const tabVid = document.getElementById('adm-prev-tab-vid');
    const imgEl = document.getElementById('adm-prev-img-el');
    const vidEl = document.getElementById('adm-prev-vid-el');
    const placeholder = document.getElementById('adm-prev-placeholder');

    if (!tabImg || !tabVid || !imgEl || !vidEl || !placeholder) return;

    if (mode === 'video') {
        tabVid.className = 'px-2.5 py-1 rounded bg-[#2563eb] text-black font-black';
        tabImg.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white font-semibold';
        imgEl.classList.add('hidden');
        placeholder.classList.add('hidden');
        vidEl.classList.remove('hidden');
    } else {
        tabImg.className = 'px-2.5 py-1 rounded bg-[#2563eb] text-black font-black';
        tabVid.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white font-semibold';
        vidEl.classList.add('hidden');
        vidEl.pause();
        const urlInput = document.getElementById('admin-img-url')?.value.trim() || '';
        const activeImg = adminTempImageDataUrl || urlInput;
        if (activeImg) {
            imgEl.src = activeImg;
            imgEl.classList.remove('hidden');
            placeholder.classList.add('hidden');
        } else {
            imgEl.classList.add('hidden');
            placeholder.classList.remove('hidden');
        }
    }
}

function updateAdminLivePreview() {
    const title = document.getElementById('admin-title')?.value.trim() || 'Your Sticker Title';
    const category = document.getElementById('admin-category')?.value || 'Streetwear';
    const dim = document.getElementById('admin-dimension')?.value.trim() || '8 x 10 inch';
    const paint = document.getElementById('admin-paint')?.value.trim() || 'Matte CMYK+White Ink';
    const price = document.getElementById('admin-price')?.value || '99';
    const badge = document.getElementById('admin-badge')?.value.trim() || 'New Arrival';
    const imgUrlInput = document.getElementById('admin-img-url')?.value.trim() || '';
    const vidUrlInput = document.getElementById('admin-vid-url')?.value.trim() || '';

    const titleEl = document.getElementById('adm-prev-title');
    if (titleEl) titleEl.textContent = title;
    const catEl = document.getElementById('adm-prev-cat');
    if (catEl) catEl.textContent = category;
    const dimEl = document.getElementById('adm-prev-dim');
    if (dimEl) dimEl.textContent = dim;
    const paintEl = document.getElementById('adm-prev-paint');
    if (paintEl) paintEl.textContent = paint;
    const priceEl = document.getElementById('adm-prev-price');
    if (priceEl) priceEl.textContent = `₹${price}`;
    const badgeEl = document.getElementById('adm-prev-badge');
    if (badgeEl) badgeEl.textContent = badge;

    const imgEl = document.getElementById('adm-prev-img-el');
    const placeholder = document.getElementById('adm-prev-placeholder');
    const chosenImg = adminTempImageDataUrl || imgUrlInput;
    if (chosenImg && imgEl && placeholder && document.getElementById('adm-prev-vid-el')?.classList.contains('hidden')) {
        imgEl.src = chosenImg;
        imgEl.classList.remove('hidden');
        placeholder.classList.add('hidden');
    }

    const vidEl = document.getElementById('adm-prev-vid-el');
    const chosenVid = adminTempVideoObjUrl || vidUrlInput;
    if (chosenVid && vidEl && vidEl.src !== chosenVid) {
        vidEl.src = chosenVid;
    }
}

async function handleAdminPublishSticker(event) {
    event.preventDefault();
    const title = document.getElementById('admin-title')?.value.trim();
    const category = document.getElementById('admin-category')?.value;
    const dimension = document.getElementById('admin-dimension')?.value.trim();
    const paint = document.getElementById('admin-paint')?.value.trim();
    const price = parseInt(document.getElementById('admin-price')?.value || '99', 10);
    const badge = document.getElementById('admin-badge')?.value.trim() || 'New Arrival';
    const imgUrlInput = document.getElementById('admin-img-url')?.value.trim() || '';
    const vidUrlInput = document.getElementById('admin-vid-url')?.value.trim() || '';

    const finalImage = adminTempImageDataUrl || imgUrlInput;
    if (!finalImage) {
        showToast('Please upload a DTF Sticker Image (or enter an Image URL) first!');
        return;
    }

    const newId = 'DTF-' + Date.now();

    await saveMediaToIDB(newId, finalImage, adminTempVideoBlob);
    memoryMediaUrls[newId] = {
        imageUrl: finalImage,
        videoUrl: adminTempVideoObjUrl || vidUrlInput || ''
    };

    const newProduct = {
        id: newId,
        name: title,
        category: category,
        dimension: dimension,
        paint: paint,
        price: price,
        badge: badge,
        externalImageUrl: imgUrlInput || '',
        externalVideoUrl: vidUrlInput || '',
        hasUploadedVideo: Boolean(adminTempVideoBlob || vidUrlInput)
    };

    dtfProducts.unshift(newProduct);
    saveCatalogToStorage();

    if (typeof syncProductToSupabase === 'function') {
        syncProductToSupabase(newProduct);
    }

    resetAdminUploadForm();
    renderAdminInventoryTable();
    showToast(`Published "${title}"! Navigating to Customer Website in a moment...`);
    setTimeout(() => {
        window.location.href = 'list.html';
    }, 1200);
}

function resetAdminUploadForm() {
    const form = document.getElementById('admin-upload-form');
    if (form) form.reset();
    adminTempImageDataUrl = '';
    adminTempVideoBlob = null;
    adminTempVideoObjUrl = '';

    const imgName = document.getElementById('admin-img-filename');
    if (imgName) imgName.textContent = 'Click to Choose Image File';
    const vidName = document.getElementById('admin-vid-filename');
    if (vidName) vidName.textContent = 'Click to Choose Video File';
    const imgEl = document.getElementById('adm-prev-img-el');
    if (imgEl) imgEl.classList.add('hidden');
    const vidEl = document.getElementById('adm-prev-vid-el');
    if (vidEl) vidEl.classList.add('hidden');
    const placeholder = document.getElementById('adm-prev-placeholder');
    if (placeholder) placeholder.classList.remove('hidden');

    switchAdminPreviewMedia('image');
    updateAdminLivePreview();
}

function renderAdminInventoryTable() {
    const tbody = document.getElementById('admin-inventory-tbody');
    const countEl = document.getElementById('admin-total-count');
    if (countEl) countEl.textContent = dtfProducts.length;
    if (!tbody) return;

    tbody.innerHTML = dtfProducts.map(item => {
        const media = getResolvedProductMedia(item);
        return `
            <tr class="hover:bg-slate-950/60 transition">
                <td class="py-3 px-3">
                    <div class="flex items-center gap-2">
                        <div class="w-12 h-12 rounded-xl checkerboard-dark border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 p-1">
                            ${media.imageUrl
                                ? `<img src="${media.imageUrl}" class="max-h-full max-w-full object-contain rounded" alt="${item.name}">`
                                : `<div class="scale-50">${item.svgGraphic || ''}</div>`
                            }
                        </div>
                        ${media.hasVideo
                            ? `<span class="px-2 py-0.5 rounded bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[10px] font-bold"><i class="fa-solid fa-video mr-1"></i>Video</span>`
                            : `<span class="text-[10px] text-slate-500">Image Only</span>`
                        }
                    </div>
                </td>
                <td class="py-3 px-3">
                    <div class="font-bold text-white">${item.name}</div>
                    <div class="text-[11px] text-slate-400">${item.category} • <span class="text-[#2563eb] font-semibold">${item.badge}</span></div>
                </td>
                <td class="py-3 px-3 text-xs">
                    <div class="text-slate-200 font-medium">${item.dimension}</div>
                    <div class="text-[#2563eb] text-[11px] font-semibold">${item.paint}</div>
                </td>
                <td class="py-3 px-3">
                    <div class="flex items-center gap-1">
                        <span class="text-[#2563eb] font-black">₹</span>
                        <input type="number" value="${item.price}" onchange="adminUpdateStickerPrice('${item.id}', this.value)" class="w-20 px-2 py-1 rounded-lg bg-black border border-slate-700 text-white font-black text-xs focus:border-[#2563eb] focus:outline-none">
                    </div>
                </td>
                <td class="py-3 px-3 text-right">
                    <button onclick="adminDeleteSticker('${item.id}')" class="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition">
                        <i class="fa-solid fa-trash-can mr-1"></i>Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function adminUpdateStickerPrice(productId, newPrice) {
    const p = dtfProducts.find(x => x.id === productId);
    if (!p) return;
    p.price = Math.max(1, parseInt(newPrice || '1', 10));
    saveCatalogToStorage();
    renderAdminInventoryTable();
    showToast(`Updated price for "${p.name}" to ₹${p.price}`);
}

async function adminDeleteSticker(productId) {
    dtfProducts = dtfProducts.filter(x => x.id !== productId);
    await deleteMediaFromIDB(productId);
    if (typeof deleteProductFromSupabase === 'function') {
        deleteProductFromSupabase(productId);
    }
    saveCatalogToStorage();
    renderAdminInventoryTable();
    showToast('Sticker removed from catalog.');
}

document.addEventListener('DOMContentLoaded', () => {
    if (!isAdminUnlocked) {
        const modal = document.getElementById('admin-pin-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            const pinInput = document.getElementById('admin-pin-input');
            if (pinInput) setTimeout(() => pinInput.focus(), 150);
        }
    }
    renderAdminInventoryTable();
    updateAdminLivePreview();
});

