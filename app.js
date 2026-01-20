function moneyBRL(value) {
    const n = Number(value ?? 0);
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseBadgeToDiscountPercent(badge) {
    if (!badge) return null;
    const m = String(badge).match(/(\d+)\s*%/);
    if (!m) return null;
    return Number(m[1]);
}

function calcDiscountPrice(price, badge) {
    const p = parseBadgeToDiscountPercent(badge);
    if (!p) return null;
    const v = Number(price);
    const discounted = v * (1 - p / 100);
    return Math.round(discounted * 100) / 100;
}

function createProductCard(product) {
    const badge = (product.badge || "").trim();
    const discountPrice = calcDiscountPrice(product.price, badge);

    const card = document.createElement("article");
    card.className = "card";
    card.dataset.category = product.category;
    card.dataset.name = product.name.toLowerCase();
    card.dataset.price = String(product.price);

    const media = document.createElement("div");
    media.className = "card__media";

    const img = document.createElement("img");
    img.alt = product.name;
    img.loading = "lazy";
    img.src = product.photos?.[0] || "";

    img.style.cursor = "zoom-in";

    img.addEventListener("click", () => {
        const photos = product.photos || [];
        const current = normalizeSrc(img.src);
        const idx = photos.map(normalizeSrc).indexOf(current);
        openLightbox(photos, idx >= 0 ? idx : 0, product.name);
    });



    media.appendChild(img);

    if (badge) {
        const b = document.createElement("div");
        b.className = "badge";
        b.textContent = badge;
        media.appendChild(b);
    }

    const body = document.createElement("div");
    body.className = "card__body";

    const titleRow = document.createElement("div");
    titleRow.className = "card__title";

    const h3 = document.createElement("h3");
    h3.textContent = product.name;

    const price = document.createElement("div");
    price.className = "price";

    if (discountPrice !== null) {
        price.innerHTML = `
      <span style="text-decoration:line-through; color: var(--muted); font-weight: 800; font-size:.9rem;">
        ${moneyBRL(product.price)}
      </span><br/>
      ${moneyBRL(discountPrice)}
    `;
    } else {
        price.textContent = moneyBRL(product.price);
    }

    titleRow.appendChild(h3);
    titleRow.appendChild(price);

    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = product.description || "";

    const meta = document.createElement("div");
    meta.className = "meta";

    const chipCat = document.createElement("span");
    chipCat.className = "chip";
    chipCat.textContent = product.category === "chaveiros" ? "Chaveiro" : "Plantas & Vasinhos";

    const sold = Number(product.sold ?? 0);
    const chipSold = document.createElement("span");
    chipSold.className = "chip";
    chipSold.textContent = `${sold} venda${sold === 1 ? "" : "s"}`;
    meta.appendChild(chipSold);


    meta.appendChild(chipCat);

    body.appendChild(titleRow);
    body.appendChild(desc);
    body.appendChild(meta);

    const thumbs = document.createElement("div");
    thumbs.className = "thumbs";

    const photos = product.photos || [];
    photos.slice(0, 6).forEach((src, idx) => {
        const t = document.createElement("button");
        t.type = "button";
        t.className = "thumb" + (idx === 0 ? " is-active" : "");
        t.setAttribute("aria-label", `Ver foto ${idx + 1} de ${product.name}`);

        const ti = document.createElement("img");
        ti.alt = "";
        ti.loading = "lazy";
        ti.src = src;

        t.appendChild(ti);

        t.addEventListener("click", () => {
            img.src = src;
            thumbs.querySelectorAll(".thumb").forEach(el => el.classList.remove("is-active"));
            t.classList.add("is-active");
        });

        thumbs.appendChild(t);
    });

    card.appendChild(media);
    card.appendChild(body);
    if (photos.length > 1) card.appendChild(thumbs);

    return card;
}

function renderHome() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const titleEl = document.getElementById("personalTitle");
    const textEl = document.getElementById("personalText");
    const colorsGrid = document.getElementById("colorsGrid");

    if (titleEl && textEl && colorsGrid && STORE.personalization) {
        titleEl.textContent = STORE.personalization.title || "Personalização";
        textEl.textContent = STORE.personalization.text || "";

        colorsGrid.innerHTML = "";
        (STORE.personalization.colors || []).forEach(c => {
            const item = document.createElement("div");
            item.className = "color";

            const sw = document.createElement("div");
            sw.className = "swatch";
            sw.style.background = c.hex;

            const name = document.createElement("div");
            name.className = "color__name";
            name.textContent = c.name;

            item.appendChild(sw);
            item.appendChild(name);
            colorsGrid.appendChild(item);
        });
    }


    const bestWrap = document.getElementById("homeBestSellers");
    if (bestWrap) {
        bestWrap.innerHTML = "";

        const best = (STORE.products || [])
            .slice()
            .sort((a, b) => Number(b.sold ?? 0) - Number(a.sold ?? 0));

        best.slice(0, 6).forEach(p => bestWrap.appendChild(createProductCard(p)));
    }


    const highlightsWrap = document.getElementById("homeHighlights");
    if (highlightsWrap) {
        highlightsWrap.innerHTML = "";
        const picks = (STORE.products || []).filter(p => p.featured).slice(0, 4);
        picks.forEach(p => {
            const mini = document.createElement("a");
            mini.href = "catalogo.html";
            mini.className = "promo";
            mini.innerHTML = `<strong>${p.name}</strong><span class="muted">${moneyBRL(p.price)}</span>`;
            highlightsWrap.appendChild(mini);
        });
    }
}

function renderCatalog() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const grid = document.getElementById("catalogGrid");
    const empty = document.getElementById("emptyState");
    if (!grid) return;

    let activeTab = "chaveiros";
    let query = "";
    let sort = "featured";

    function getFiltered() {
        let list = (STORE.products || []).filter(p => p.category === activeTab);

        if (query) {
            list = list.filter(p => p.name.toLowerCase().includes(query));
        }

        if (sort === "featured") {
            list = list.slice().sort((a, b) => Number(b.featured) - Number(a.featured));
        }
        if (sort === "price_asc") {
            list = list.slice().sort((a, b) => a.price - b.price);
        }
        if (sort === "price_desc") {
            list = list.slice().sort((a, b) => b.price - a.price);
        }
        if (sort === "name_asc") {
            list = list.slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
        }
        return list;
    }

    function paint() {
        grid.innerHTML = "";
        const items = getFiltered();

        if (!items.length) {
            if (empty) empty.hidden = false;
            return;
        }
        if (empty) empty.hidden = true;

        items.forEach(p => grid.appendChild(createProductCard(p)));
    }

    // tabs
    document.querySelectorAll(".tab").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab").forEach(b => {
                b.classList.remove("is-active");
                b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("is-active");
            btn.setAttribute("aria-selected", "true");
            activeTab = btn.dataset.tab;
            paint();
        });
    });

    // search
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            query = String(e.target.value || "").trim().toLowerCase();
            paint();
        });
    }

    // sort
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            sort = String(e.target.value || "featured");
            paint();
        });
    }

    paint();
}

let LB_PHOTOS = [];
let LB_INDEX = 0;
let LB_ALT = "";

function normalizeSrc(src) {
    try {
        return new URL(src, window.location.href).href;
    } catch {
        return String(src || "");
    }
}

function ensureLightboxNav(lightbox) {
    if (!lightbox) return;

    if (!lightbox.querySelector(".lightbox__prev")) {
        const prev = document.createElement("button");
        prev.type = "button";
        prev.className = "lightbox__nav lightbox__prev";
        prev.setAttribute("aria-label", "Imagem anterior");
        prev.innerHTML = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" fill="none" stroke="white" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;
        lightbox.appendChild(prev);
    }

    if (!lightbox.querySelector(".lightbox__next")) {
        const next = document.createElement("button");
        next.type = "button";
        next.className = "lightbox__nav lightbox__next";
        next.setAttribute("aria-label", "Próxima imagem");
        next.innerHTML = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 6l6 6-6 6" fill="none" stroke="white" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;
        lightbox.appendChild(next);
    }
}

function updateLightbox() {
    const lightbox = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImg");
    if (!lightbox || !img) return;

    const hasMany = LB_PHOTOS.length > 1;
    const prevBtn = lightbox.querySelector(".lightbox__prev");
    const nextBtn = lightbox.querySelector(".lightbox__next");

    if (prevBtn) prevBtn.style.display = hasMany ? "" : "none";
    if (nextBtn) nextBtn.style.display = hasMany ? "" : "none";

    const src = LB_PHOTOS[LB_INDEX] || "";
    img.src = src;
    img.alt = LB_ALT || "";
}

function openLightbox(photos, index, alt) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    if (!lightbox || !lightboxImg) return;

    ensureLightboxNav(lightbox);

    LB_PHOTOS = (photos || []).filter(Boolean);
    LB_ALT = alt || "";
    LB_INDEX = Math.max(0, Math.min(Number(index || 0), LB_PHOTOS.length - 1));

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    updateLightbox();
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
}

function goPrev() {
    if (LB_PHOTOS.length <= 1) return;
    LB_INDEX = (LB_INDEX - 1 + LB_PHOTOS.length) % LB_PHOTOS.length;
    updateLightbox();
}

function goNext() {
    if (LB_PHOTOS.length <= 1) return;
    LB_INDEX = (LB_INDEX + 1) % LB_PHOTOS.length;
    updateLightbox();
}


function setupMobileNav() {
    const btn = document.getElementById("navToggle");
    const nav = document.getElementById("nav");
    if (!btn || !nav) return;

    btn.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // fecha menu ao clicar num link
    nav.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => {
            nav.classList.remove("is-open");
            btn.setAttribute("aria-expanded", "false");
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupMobileNav();

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    if (
        document.getElementById("homeBestSellers") ||
        document.getElementById("homeHighlights") ||
        document.getElementById("colorsGrid")
    ) {
        renderHome();
    }

    if (document.getElementById("catalogGrid")) renderCatalog();

    const lightbox = document.getElementById("lightbox");
    const closeBtn = document.querySelector(".lightbox__close");
    const lightboxImg = document.getElementById("lightboxImg");

    if (lightbox && closeBtn) {
        ensureLightboxNav(lightbox);

        const prevBtn = lightbox.querySelector(".lightbox__prev");
        const nextBtn = lightbox.querySelector(".lightbox__next");

        closeBtn.addEventListener("click", closeLightbox);

        if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); goPrev(); });
        if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); goNext(); });

        lightbox.addEventListener("click", (e) => {
            // clicou fora da imagem => fecha
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener("keydown", (e) => {
            if (!lightbox.classList.contains("is-open")) return;

            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
        });

        // Swipe (mobile)
        if (lightboxImg) {
            let startX = 0;
            let startY = 0;
            let dragging = false;

            lightboxImg.addEventListener("touchstart", (e) => {
                if (!lightbox.classList.contains("is-open")) return;
                const t = e.touches[0];
                startX = t.clientX;
                startY = t.clientY;
                dragging = true;
            }, { passive: true });

            lightboxImg.addEventListener("touchend", (e) => {
                if (!dragging) return;
                dragging = false;

                const t = e.changedTouches[0];
                const dx = t.clientX - startX;
                const dy = t.clientY - startY;

                // evita disparar em scroll vertical
                if (Math.abs(dy) > Math.abs(dx)) return;

                if (dx > 40) goPrev();
                else if (dx < -40) goNext();
            }, { passive: true });
        }
    }
});
