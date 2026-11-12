// =========================================================================
// BLACKSTONE DTF STUDIO - CUSTOM APPAREL & DTF STICKERS (custome.js)
// =========================================================================

let customState = {
    garmentType: 'T-Shirt (With Print)',
    basePrice: 399,
    garmentColorHex: '#18181b',
    garmentColorName: 'Jet Black',
    placement: 'Front Side',
    placementExtra: 0,
    logoFileName: '',
    logoDataUrl: '',
    qty: 1
};

function setCustomGarmentType(typeLabel, basePrice) {
    customState.garmentType = typeLabel;
    customState.basePrice = basePrice;

    const btnTshirt = document.getElementById('gtype-tshirt');
    const btnHoodie = document.getElementById('gtype-hoodie');
    const btnDtf = document.getElementById('gtype-dtf');
    if (btnTshirt && btnHoodie && btnDtf) {
        [btnTshirt, btnHoodie, btnDtf].forEach(b => b.className = 'px-2.5 py-1 rounded-lg font-medium text-slate-400 hover:text-white transition');
    }

    const garmentPath = document.getElementById('garment-path');
    if (garmentPath) {
        if (typeLabel.includes('T-Shirt')) {
            if (btnTshirt) btnTshirt.className = 'px-2.5 py-1 rounded-lg font-black bg-[#2563eb] text-black transition';
            garmentPath.setAttribute('d', 'M85,20 L115,20 C125,40 175,40 185,20 L215,20 L280,75 L250,125 L215,100 L215,295 L85,295 L85,100 L50,125 L20,75 Z');
        } else if (typeLabel.includes('Hoodie')) {
            if (btnHoodie) btnHoodie.className = 'px-2.5 py-1 rounded-lg font-black bg-[#2563eb] text-black transition';
            garmentPath.setAttribute('d', 'M95,25 C110,5 190,5 205,25 L230,30 L285,115 L250,145 L220,95 L220,295 L80,295 L80,95 L50,145 L15,115 L70,30 Z');
        } else {
            if (btnDtf) btnDtf.className = 'px-2.5 py-1 rounded-lg font-black bg-[#2563eb] text-black transition';
            garmentPath.setAttribute('d', 'M45,25 L255,25 L255,295 L45,295 Z');
        }
    }

    updateCustomPreview();
}

function setGarmentColor(hex, colorName) {
    customState.garmentColorHex = hex;
    customState.garmentColorName = colorName;
    const svgEl = document.getElementById('garment-svg');
    if (svgEl) svgEl.setAttribute('fill', hex);
    updateCustomPreview();
}

function setPrintPlacement(sideLabel) {
    customState.placement = sideLabel;
    customState.placementExtra = sideLabel.includes('Both') ? 80 : 0;

    ['place-front', 'place-back', 'place-both'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.className = 'px-3 py-1 rounded-lg font-medium text-slate-400 hover:text-white';
    });
    if (sideLabel.startsWith('Front')) {
        const f = document.getElementById('place-front');
        if (f) f.className = 'px-3 py-1 rounded-lg font-bold bg-slate-800 text-white';
    }
    if (sideLabel.startsWith('Back')) {
        const b = document.getElementById('place-back');
        if (b) b.className = 'px-3 py-1 rounded-lg font-bold bg-slate-800 text-white';
    }
    if (sideLabel.startsWith('Both')) {
        const both = document.getElementById('place-both');
        if (both) both.className = 'px-3 py-1 rounded-lg font-bold bg-slate-800 text-white';
    }

    const placeLabel = document.getElementById('preview-placement-label');
    if (placeLabel) placeLabel.textContent = sideLabel;
    updateCustomPreview();
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    customState.logoFileName = file.name;
    const fileLabel = document.getElementById('logo-file-label');
    if (fileLabel) fileLabel.textContent = `Uploaded: ${file.name}`;
    const clearBtn = document.getElementById('clear-logo-btn');
    if (clearBtn) clearBtn.classList.remove('hidden');

    const reader = new FileReader();
    reader.onload = function(e) {
        customState.logoDataUrl = e.target.result;
        const img = document.getElementById('preview-logo-img');
        if (img) img.src = customState.logoDataUrl;
        const wrap = document.getElementById('preview-logo-wrap');
        if (wrap) wrap.classList.remove('hidden');
        showToast('Custom Logo loaded onto live cloth preview!');
    };
    reader.readAsDataURL(file);
}

function clearUploadedLogo() {
    customState.logoFileName = '';
    customState.logoDataUrl = '';
    const fileInput = document.getElementById('custom-logo-upload');
    if (fileInput) fileInput.value = '';
    const fileLabel = document.getElementById('logo-file-label');
    if (fileLabel) fileLabel.textContent = 'Click to upload your Logo (JPG / PNG)';
    const wrap = document.getElementById('preview-logo-wrap');
    if (wrap) wrap.classList.add('hidden');
    const clearBtn = document.getElementById('clear-logo-btn');
    if (clearBtn) clearBtn.classList.add('hidden');
}

function changeCustomQty(delta) {
    customState.qty = Math.max(1, customState.qty + delta);
    const qtyInput = document.getElementById('custom-qty-input');
    if (qtyInput) qtyInput.value = customState.qty;
}

function calculateCustomUnitPrice() {
    const dimSelect = document.getElementById('custom-dimension-select');
    const paintSelect = document.getElementById('custom-paint-select');
    if (!dimSelect || !paintSelect) return customState.basePrice;
    const dimExtra = parseInt(dimSelect.options[dimSelect.selectedIndex]?.dataset.extra || '0', 10);
    const paintExtra = parseInt(paintSelect.options[paintSelect.selectedIndex]?.dataset.extra || '0', 10);
    return customState.basePrice + dimExtra + paintExtra + customState.placementExtra;
}

function updateCustomPreview() {
    const nameVal = document.getElementById('custom-name-input')?.value.trim() || '';
    const numVal = document.getElementById('custom-number-input')?.value.trim() || '';
    const fontClass = document.getElementById('custom-font-select')?.value || 'font-bebas';
    const nameColor = document.getElementById('custom-name-color')?.value || '#ffffff';
    const numSize = document.getElementById('custom-num-size')?.value || 'text-5xl sm:text-6xl';
    const numColor = document.getElementById('custom-num-color')?.value || '#2563eb';

    const dimSelect = document.getElementById('custom-dimension-select');
    const paintSelect = document.getElementById('custom-paint-select');

    const nameEl = document.getElementById('preview-text-name');
    if (nameEl) {
        nameEl.textContent = nameVal;
        nameEl.className = `${fontClass} text-2xl sm:text-3xl tracking-wider uppercase leading-tight break-words w-full`;
        nameEl.style.color = nameColor;
    }

    const numEl = document.getElementById('preview-text-number');
    if (numEl) {
        numEl.textContent = numVal;
        numEl.className = `font-teko ${numSize} font-bold leading-none mt-0.5`;
        numEl.style.color = numColor;
    }

    const badgeItem = document.getElementById('preview-badge-item');
    if (badgeItem) badgeItem.textContent = `${customState.garmentType} (${customState.garmentColorName})`;
    const badgePaint = document.getElementById('preview-badge-paint');
    if (badgePaint && paintSelect) badgePaint.textContent = paintSelect.value;
    const badgeDim = document.getElementById('preview-badge-dim');
    if (badgeDim && dimSelect) badgeDim.textContent = dimSelect.value;

    const unitPrice = calculateCustomUnitPrice();
    const priceDisplay = document.getElementById('custom-unit-price-display');
    if (priceDisplay) priceDisplay.textContent = `₹${unitPrice}`;
}

function addCustomDesignToCart() {
    const nameVal = document.getElementById('custom-name-input')?.value.trim() || '';
    const numVal = document.getElementById('custom-number-input')?.value.trim() || '';
    const dimVal = document.getElementById('custom-dimension-select')?.value || '';
    const paintVal = document.getElementById('custom-paint-select')?.value || '';
    const notesVal = document.getElementById('custom-notes-input')?.value.trim() || '';
    const unitPrice = calculateCustomUnitPrice();

    if (!nameVal && !numVal && !customState.logoFileName) {
        showToast('Please enter a Name, Number, or upload a Logo first!');
        return;
    }

    cart.push({
        cartItemId: 'CUSTOM-' + Date.now(),
        isCustom: true,
        name: `Custom ${customState.garmentType}`,
        garmentColor: customState.garmentColorName,
        placement: customState.placement,
        dimension: dimVal,
        paint: paintVal,
        customName: nameVal || 'None',
        customNumber: numVal || 'None',
        logoFileName: customState.logoFileName || 'None',
        customNotes: notesVal || 'Standard Placement',
        price: unitPrice,
        qty: customState.qty
    });

    saveAndRefreshCart();
    toggleCartDrawer(true);
    showToast('Custom Cloth Design added to your order cart!');
}

document.addEventListener('DOMContentLoaded', () => {
    updateCustomPreview();
});

