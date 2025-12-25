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
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightboxImg");

        lightboxImg.src = img.src;
        lightboxImg.alt = product.name;

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
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


    const featuredWrap = document.getElementById("homeFeatured");
    if (featuredWrap) {
        featuredWrap.innerHTML = "";
        const featured = (STORE.products || []).filter(p => p.featured);
        featured.slice(0, 6).forEach(p => featuredWrap.appendChild(createProductCard(p)));
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

    if (document.getElementById("homeFeatured")) renderHome();
    if (document.getElementById("catalogGrid")) renderCatalog();

    const lightbox = document.getElementById("lightbox");
    const closeBtn = document.querySelector(".lightbox__close");

    if (lightbox && closeBtn) {
        closeBtn.addEventListener("click", () => {
            lightbox.classList.remove("is-open");
            lightbox.setAttribute("aria-hidden", "true");
        });

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove("is-open");
                lightbox.setAttribute("aria-hidden", "true");
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                lightbox.classList.remove("is-open");
                lightbox.setAttribute("aria-hidden", "true");
            }
        });
    }

});
