"use strict";
// navbar search roller js start ----
document.querySelectorAll(".search-roller").forEach((roller) => {
  const track = roller.querySelector(".search-roller-track");
  const items = [...track.children];

  if (items.length <= 1) return;

  // Duplicate first item
  track.appendChild(items[0].cloneNode(true));

  const itemHeight = items[0].offsetHeight;

  let index = 0;
  let total = items.length;

  function next() {
    index++;

    track.style.transition = "transform .9s ease";
    track.style.transform = `translateY(-${index * itemHeight}px)`;

    // Reset when duplicate reached
    if (index === total) {
      track.addEventListener("transitionend", function reset() {
        track.removeEventListener("transitionend", reset);

        track.style.transition = "none";
        track.style.transform = "translateY(0)";

        index = 0;

        // Force reflow
        track.offsetHeight;
      });
    }
  }

  setInterval(next, 2000);
});
// navbar search roller js end --

// navbar sticky search js start----
let lastScroll = 0;

window.addEventListener("load", handleScroll);
window.addEventListener("scroll", handleScroll);

function handleScroll() {
  const scrolling = window.scrollY;
  const header = document.querySelector(".header");
  const home_nav_active = document.querySelector(".home-nav-active");

  lastScroll = scrolling;

  if ((scrolling > 80) & header.classList.contains("home-nav-active")) {
    home_nav_active.classList.add("home-nav");
  } else if ((scrolling < 80) & header.classList.contains("home-nav-active")) {
    home_nav_active.classList.remove("home-nav");
  }
}
// navbar sticky search js end----

// navbar search open js start ---
document.addEventListener("click", function (e) {
  // Close Search
  if (
    e.target.closest(".search-bar-close") ||
    e.target.closest(".search-bar-window-cls-btn")
  ) {
    document.querySelector(".search-bar-wrap")?.classList.remove("active");
    document.body.classList.remove("active");
    return;
  }

  // Open Search
  if (e.target.closest(".navbar-search-open-btn")) {
    document.querySelector(".search-bar-wrap")?.classList.add("active");
    document.body.classList.add("active");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Remove active from search wrap
    document.querySelectorAll(".search-bar-wrap.active").forEach((el) => {
      el.classList.remove("active");
    });

    // Remove active from body
    document.body.classList.remove("active");
  }
});
// navbar search open js end ---

// mobile-menu sidebar js start---
const mobileMenu = document.querySelector(".mobile-menu-wrap");
const mobileMenuContainer = document.querySelector(".mobile-menu-container");

function openMobileMenu(event) {
  event.stopPropagation();
  mobileMenu?.classList.add("active");
  mobileMenuContainer?.classList.add("active");
}

function closeMobileMenu(event) {
  event.stopPropagation();
  mobileMenu?.classList.remove("active");
  mobileMenuContainer?.classList.remove("active");
}

document.querySelectorAll(".app-menu-open").forEach((btn) => {
  btn.addEventListener("click", openMobileMenu);
});

document
  .querySelectorAll(".mobile-menu-close-window-btn, .mobile-menu-close-btn")
  .forEach((btn) => {
    btn.addEventListener("click", closeMobileMenu);
  });

// mobile-menu sidebar js end---

// mobile-menu-tab js start--
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".mobile-menu-tabs-contents");
  const tabs = [...document.querySelectorAll(".mobile-menu-tab")];
  const contents = [...document.querySelectorAll(".mobile-menu-tabs-content")];

  if (!container || !tabs.length || !contents.length) return;

  let isClickScroll = false;
  let scrollTimer;

  const setActive = (id, scroll = true) => {
    const tab = tabs.find((el) => el.hash === `#${id}`);
    if (!tab) return;

    tabs.forEach((el) => el.classList.toggle("active", el === tab));

    if (scroll) {
      tab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  // Tab click
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();

      const target = document.getElementById(tab.hash.slice(1));
      if (!target) return;

      isClickScroll = true;
      setActive(target.id);

      container.scrollTo({
        top: target.offsetTop - container.offsetTop - 12,
        behavior: "smooth",
      });

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isClickScroll = false;
      }, 2000);
    });
  });

  // Content scroll
  const observer = new IntersectionObserver(
    (entries) => {
      if (isClickScroll) return;

      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActive(visible.target.id);
    },
    {
      root: container,
      rootMargin: "-10% 0px -55% 0px",
      threshold: [0.15, 0.3, 0.5, 0.75],
    },
  );

  contents.forEach((content) => observer.observe(content));

  // Initial state
  setActive(
    tabs.find((tab) => tab.classList.contains("active"))?.hash.slice(1) ||
      tabs[0].hash.slice(1),
    false,
  );
});
// mobile-menu-tab js end--

// cart-drawer js start---
const cartDrawer = document.querySelector(".cart-drawer");
const cartDrawerInner = document.querySelector(".cart-drawer-inner");

function openCartDrawer(event) {
  event.stopPropagation();
  cartDrawer?.classList.add("active");
  cartDrawerInner?.classList.add("active");
}

function closeCartDrawer(event) {
  event.stopPropagation();
  cartDrawer?.classList.remove("active");
  cartDrawerInner?.classList.remove("active");
}

document.querySelectorAll(".cart-drawer-open").forEach((btn) => {
  btn.addEventListener("click", openCartDrawer);
});

document
  .querySelectorAll(".cart-drawer-close-window-btn, .cart-drawer-close-btn")
  .forEach((btn) => {
    btn.addEventListener("click", closeCartDrawer);
  });

// cart-drawer js end---

// cart-drawer ajax js start---
(function () {
  const drawer = document.querySelector(".cart-drawer");
  if (!drawer) return;

  const FREE_SHIPPING_THRESHOLD = 350000; // matches snippets/cart-drawer-new.liquid

  function formatMoney(cents) {
    const format = window.themeMoneyFormat || "${{amount}}";
    const value = Math.max(cents, 0) / 100;
    const [dollars, decimals] = value.toFixed(2).split(".");
    const withComma = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return format
      .replace(/\{\{\s*amount_no_decimals_with_comma_separator\s*\}\}/, withComma)
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/, `${withComma}.${decimals}`)
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/, withComma)
      .replace(/\{\{\s*amount\s*\}\}/, `${withComma}.${decimals}`);
  }

  function updateProgress(totalPrice) {
    const range = drawer.querySelector(".cart-drawer-progress .progress");
    const textEl = drawer.querySelector(".cart-drawer-progress-content .text");
    if (!range) return;

    const percent = Math.min(100, Math.round((totalPrice / FREE_SHIPPING_THRESHOLD) * 100));
    const remaining = FREE_SHIPPING_THRESHOLD - totalPrice;

    range.value = percent;
    range.style.background = `linear-gradient(to right, #d55a3c 0%, #422c26 ${percent}%, rgb(236 219 216) ${percent}%)`;

    if (textEl) {
      textEl.innerHTML =
        remaining > 0
          ? `Add <strong>${formatMoney(remaining)}</strong> more to unlock!`
          : `You've unlocked free shipping!`;
    }
  }

  function updateSummary(cart) {
    const countEl = drawer.querySelector(".cart-drawer-title span");
    if (countEl) {
      countEl.textContent = `(${cart.item_count} item${cart.item_count === 1 ? "" : "s"})`;
    }

    const totalEl = drawer.querySelector(".cart-drawer-total-price");
    if (totalEl) totalEl.textContent = formatMoney(cart.total_price);

    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = cart.item_count;
    });

    drawer.classList.toggle("blank", cart.item_count === 0);

    updateProgress(cart.total_price);
  }

  function upsertRow(item) {
    const items = drawer.querySelector(".cart-drawer-items");
    if (!items) return;

    let row = items.querySelector(`.cart-drawer-item[data-key="${item.key}"]`);

    if (!item.quantity || item.quantity <= 0) {
      row?.remove();
      return;
    }

    if (!row) {
      row = document.createElement("div");
      row.className = "cart-drawer-item";
      row.dataset.key = item.key;
      row.innerHTML = `
        <div class="cart-drawer-item-img">
          <img src="${item.image}" alt="${item.product_title}" width="56" height="56" loading="lazy">
        </div>
        <div class="cart-drawer-item-content-wrap">
          <div class="cart-drawer-item-content-inner">
            <div class="cart-drawer-item-content">
              <a href="${item.url}" class="cart-drawer-item-title">${item.product_title}</a>
              <div class="content-btm">
                <div class="cart-drawer-item-qty-btn-wrap">
                  <button class="cart-drawer-item-qty-btn" data-action="decrease" type="button">-</button>
                  <input type="text" class="cart-drawer-item-qty-input" value="${item.quantity}" readonly>
                  <button class="cart-drawer-item-qty-btn" data-action="increase" type="button">+</button>
                </div>
                <p class="cart-drawer-item-price"></p>
              </div>
            </div>
          </div>
          <div class="cart-drawer-item-remove-btn-wrap">
            <button class="cart-drawer-item-remove-btn" type="button" aria-label="Remove item">
              <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.375 2H0.375C0.275544 2 0.180161 2.03951 0.109835 2.10983C0.0395088 2.18016 0 2.27554 0 2.375C0 2.47446 0.0395088 2.56984 0.109835 2.64017C0.180161 2.71049 0.275544 2.75 0.375 2.75H1V11.875C1 12.1071 1.09219 12.3296 1.25628 12.4937C1.42038 12.6578 1.64294 12.75 1.875 12.75H9.875C10.1071 12.75 10.3296 12.6578 10.4937 12.4937C10.6578 12.3296 10.75 12.1071 10.75 11.875V2.75H11.375C11.4745 2.75 11.5698 2.71049 11.6402 2.64017C11.7105 2.56984 11.75 2.47446 11.75 2.375C11.75 2.27554 11.7105 2.18016 11.6402 2.10983C11.5698 2.03951 11.4745 2 11.375 2ZM10 11.875C10 11.9082 9.98683 11.9399 9.96339 11.9634C9.93995 11.9868 9.90815 12 9.875 12H1.875C1.84185 12 1.81005 11.9868 1.78661 11.9634C1.76317 11.9399 1.75 11.9082 1.75 11.875V2.75H10V11.875ZM3 0.375C3 0.275544 3.03951 0.180161 3.10984 0.109835C3.18016 0.0395088 3.27554 0 3.375 0H8.375C8.47446 0 8.56984 0.0395088 8.64017 0.109835C8.71049 0.180161 8.75 0.275544 8.75 0.375C8.75 0.474456 8.71049 0.569839 8.64017 0.640165C8.56984 0.710491 8.47446 0.75 8.375 0.75H3.375C3.27554 0.75 3.18016 0.710491 3.10984 0.640165C3.03951 0.569839 3 0.474456 3 0.375Z" fill="black"/></svg>
            </button>
          </div>
        </div>
      `;
      items.appendChild(row);
    }

    const qtyInput = row.querySelector(".cart-drawer-item-qty-input");
    if (qtyInput) qtyInput.value = item.quantity;

    const priceEl = row.querySelector(".cart-drawer-item-price");
    if (priceEl) priceEl.textContent = formatMoney(item.final_line_price);
  }

  function changeItem(key, quantity) {
    return fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: key, quantity }),
    })
      .then((res) => res.json())
      .then((cart) => {
        const updated = cart.items.find((i) => i.key === key);
        upsertRow(updated || { key, quantity: 0 });
        updateSummary(cart);
        return cart;
      });
  }

  function openDrawer() {
    drawer.classList.add("active");
    drawer.querySelector(".cart-drawer-inner")?.classList.add("active");
  }

  function addToCart(variantId, btn, quantity) {
    if (!variantId || (btn && btn.disabled)) return;

    // Product card buttons wrap their text in `.btn-label` and carry a
    // `.btn-spinner` so we can show an "Adding..." state; other buttons that
    // reuse this same handler (buy buttons, quick order rows, etc.) don't
    // have that markup, so `label` stays null and they just get disabled.
    const label = btn ? btn.querySelector(".btn-label") : null;
    const originalLabel = label ? label.textContent : null;

    if (btn) {
      btn.disabled = true;
      if (label) {
        btn.classList.add("is-adding");
        label.textContent = window.Theme?.translations?.adding || "Adding...";
      }
    }

    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: variantId, quantity: quantity || 1 }),
    })
      .then((res) => res.json())
      .then(() => fetch("/cart.js"))
      .then((res) => res.json())
      .then((cart) => {
        const added = cart.items.find((i) => i.variant_id === Number(variantId));
        if (added) upsertRow(added);
        updateSummary(cart);
        openDrawer();
      })
      .finally(() => {
        if (btn) {
          btn.disabled = false;
          if (label && originalLabel !== null) {
            btn.classList.remove("is-adding");
            label.textContent = originalLabel;
          }
        }
      });
  }

  // Quantity and remove controls only ever exist inside the drawer itself.
  drawer.addEventListener("click", (e) => {
    const qtyBtn = e.target.closest(".cart-drawer-item-qty-btn");
    const removeBtn = e.target.closest(".cart-drawer-item-remove-btn");

    if (qtyBtn) {
      const row = qtyBtn.closest(".cart-drawer-item");
      const key = row?.dataset.key;
      const input = row?.querySelector(".cart-drawer-item-qty-input");
      if (!key || !input) return;

      let qty = parseInt(input.value, 10) || 1;
      qty = qtyBtn.dataset.action === "increase" ? qty + 1 : qty - 1;
      if (qty < 0) qty = 0;

      qtyBtn.disabled = true;
      changeItem(key, qty).finally(() => {
        qtyBtn.disabled = false;
      });
      return;
    }

    if (removeBtn) {
      const row = removeBtn.closest(".cart-drawer-item");
      const key = row?.dataset.key;
      if (!key) return;

      removeBtn.disabled = true;
      changeItem(key, 0);
    }
  });

  // "Add to cart" buttons can live anywhere on the page (product cards, tabs,
  // the cart drawer's own recommendation slider) - all of them add via AJAX
  // and open this drawer on success, instead of navigating to the cart page.
  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-variant-id]");
    if (!addBtn) return;

    e.preventDefault();
    const qtyInput = addBtn.closest(".product-content-area")?.querySelector(".quantity-count");
    const quantity = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
    addToCart(addBtn.dataset.variantId, addBtn, quantity);
  });
})();
// cart-drawer ajax js end---

// cart-drawer slider js start--
var swiper = new Swiper(".cart-drawer-slider", {
  slidesPerView: 2.1,
  spaceBetween: 5,
  grabCursor: true,
  loop: true,
  speed: 500,
  // autoplay: {
  //   delay: 2500,
  //   disableOnInteraction: false,
  // },
  navigation: {
    nextEl: ".cart-drawer-slider-btn-next",
    prevEl: ".cart-drawer-slider-btn-prev",
  },
});
// cart-drawer slider js end--

// cart-drawer progesss-bar js start--
const progress = document.querySelector(".progress");
progress?.addEventListener("input", function () {
  const value = this.value;
  this.style.background = `linear-gradient(to right, #d55a3c 0%, #422c26 ${value}%,rgb(236 219 216) ${value}%)`;
});
// cart-drawer progesss-bar js end--

// hero slider js start--
var swiper = new Swiper(".hero-slider", {
  slidesPerView: 1,
  grabCursor: true,
  spaceBetween: 16,
  loop: true,
  speed: 1000,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".hero-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".hero-button-next",
    prevEl: ".hero-button-prev",
  },
  breakpoints: {
    1: {
      spaceBetween: 0,
    },
    993: {
      spaceBetween: 16,
    },
  },
});
// hero slider js end--

// category js start--
var swiper = new Swiper(".category-slider", {
  slidesPerView: "auto",
  spaceBetween: 10,
  grabCursor: true,
  loop: true,
  navigation: {
    nextEl: ".category-button-next",
    prevEl: ".category-button-prev",
  },
});
// category js end--

// count-down js start--
document.querySelectorAll(".countdown").forEach((countdown) => {
  const endDate = new Date(countdown.dataset.end).getTime();

  const daysEl = countdown.querySelector(".countdown-days");
  const hoursEl = countdown.querySelector(".countdown-hours");
  const minutesEl = countdown.querySelector(".countdown-minutes");
  const secondsEl = countdown.querySelector(".countdown-seconds");

  const updateCountdown = () => {
    const remaining = endDate - Date.now();

    if (remaining <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
// count-down js end--

// card slider js start--
var swiper = new Swiper(".card-slider", {
  effect: "coverflow",
  slidesPerView: 1.6,
  centeredSlides: true,
  grabCursor: true,
  spaceBetween: 16,
  loop: true,
  speed: 500,
  autoplay: false,
  coverflowEffect: {
    rotate: 25,
    stretch: 0,
    depth: 150,
    modifier: 1,
    slideShadows: false,
  },
  // autoplay: {
  //   delay: 3500,
  //   disableOnInteraction: false,
  // },
  breakpoints: {
    1: {
      effect: "coverflow",
      slidesPerView: 1.4,
      centeredSlides: true,
      spaceBetween: 24,
    },
    576: {
      effect: "coverflow",
      slidesPerView: 2.2,
      centeredSlides: true,
      spaceBetween: 16,
    },
    768: {
      effect: "slide",
      slidesPerView: 3.2,
      centeredSlides: false,
      spaceBetween: 10,
    },
    993: {
      effect: "slide",
      slidesPerView: 3.8,
      centeredSlides: false,
      spaceBetween: 10,
    },
    1200: {
      effect: "slide",
      slidesPerView: 4.5,
      centeredSlides: false,
      spaceBetween: 10,
    },
  },
});
// card slider js end--

// card slider js start--
var swiper = new Swiper(".explore-slider", {
  slidesPerView: 4.5,
  centeredSlides: false,
  spaceBetween: 10,
  grabCursor: true,
  loop: true,
  speed: 500,
  autoplay: false,
  navigation: {
    nextEl: ".explore-slider-button-next",
    prevEl: ".explore-slider-button-prev",
  },
  breakpoints: {
    1: {
      slidesPerView: 2,
      spaceBetween: 5,
    },
    576: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    993: {
      slidesPerView: 4.5,
      spaceBetween: 10,
    },
  },
});
// card slider js end--

// tab-section js start--
document.querySelectorAll(".tab-section-nav-item").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    document
      .querySelectorAll(".tab-section-nav-item")
      .forEach((el) => el.classList.toggle("active", el === tab));

    document
      .querySelectorAll(".tab-section-panel")
      .forEach((panel) =>
        panel.classList.toggle("active", panel.id === target),
      );
  });
});
// tab-section js end--

// image-category-slider js start--
var swiper = new Swiper(".image-category-slider", {
  slidesPerView: 4,
  spaceBetween: 20,
  grabCursor: true,
  loop: false,
  breakpoints: {
    // when window width is >= 320px
    1: {
      spaceBetween: 10,
      slidesPerView: 1.7,
    },
    // when window width is >= 576px
    576: {
      spaceBetween: 10,
      slidesPerView: 2.2,
    },
    // when window width is >= 767px
    768: {
      spaceBetween: 16,
      slidesPerView: 3.3,
    },
    // when window width is >= 993px
    993: {
      spaceBetween: 20,
      slidesPerView: 4,
    },
  },
});
// image-category-slider js end--

// shop-by-brand-slider js start--
var swiper = new Swiper(".shop-by-brand-slider", {
  slidesPerView: 5,
  spaceBetween: 0,
  grabCursor: true,
  loop: true,
  speed: 800,
  navigation: {
    nextEl: ".shop-by-brand-slider .swiper-button-next",
    prevEl: ".shop-by-brand-slider .swiper-button-prev",
  },
  breakpoints: {
    1: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 4,
    },
    993: {
      slidesPerView: 5,
    },
  },
});
// shop-by-brand-slider js end--

// community-review popup js start--
(function () {
  const items = document.querySelectorAll(".community-review-item");
  const popup = document.querySelector(".community-review-popup");

  if (!popup || !items.length) return;

  const slides = [...popup.querySelectorAll(".community-review-popup-slide")];
  const videos = slides.map((slide) =>
    slide.querySelector(".community-review-popup-video"),
  );
  const progressBars = [
    ...popup.querySelectorAll(".community-review-popup-progress-bar"),
  ];
  const prevBtn = popup.querySelector(".community-review-popup-nav-btn.prev");
  const nextBtn = popup.querySelector(".community-review-popup-nav-btn.next");
  const muteBtn = popup.querySelector(".community-review-popup-mute-btn");
  const productImg = popup.querySelector(
    ".community-review-popup-product-img img",
  );
  const productTitle = popup.querySelector(
    ".community-review-popup-product-title",
  );
  const productPrice = popup.querySelector(
    ".community-review-popup-product-price .curr",
  );
  const productPrevPrice = popup.querySelector(
    ".community-review-popup-product-price .prev",
  );

  let current = 0;
  let muted = true;

  function pauseAll() {
    videos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
  }

  function goTo(index) {
    if (index < 0 || index >= slides.length) return;

    pauseAll();
    current = index;

    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));

    progressBars.forEach((bar, i) => {
      bar.classList.toggle("completed", i < index);
      bar.querySelector("i").style.width = i < index ? "100%" : "0%";
    });

    const slide = slides[index];
    productImg.src = slide.dataset.productImg;
    productTitle.textContent = slide.dataset.productTitle;
    productPrice.textContent = slide.dataset.productPrice;
    productPrevPrice.textContent = slide.dataset.productPreviousPrice;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;

    const video = videos[index];
    video.muted = muted;
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  function openPopup(index) {
    document.body.classList.add("active");
    popup.classList.add("active");
    goTo(index);
  }

  function closePopup() {
    popup.classList.remove("active");
    document.body.classList.remove("active");
    pauseAll();
  }

  items.forEach((item) => {
    item.addEventListener("click", () => {
      openPopup(Number(item.dataset.reviewIndex) || 0);
    });
  });

  popup
    .querySelector(".community-review-popup-close-window-btn")
    .addEventListener("click", closePopup);
  popup
    .querySelector(".community-review-popup-close-btn")
    .addEventListener("click", closePopup);

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  muteBtn.addEventListener("click", () => {
    muted = !muted;
    videos[current].muted = muted;
    muteBtn.classList.toggle("unmuted", !muted);
  });

  popup.querySelectorAll(".community-review-popup-share-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href });
      }
    });
  });

  videos.forEach((video, i) => {
    video.addEventListener("timeupdate", () => {
      if (i !== current || !video.duration) return;
      progressBars[i].querySelector("i").style.width =
        (video.currentTime / video.duration) * 100 + "%";
    });

    video.addEventListener("ended", () => {
      if (i === current && current < slides.length - 1) {
        goTo(current + 1);
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (!popup.classList.contains("active")) return;
    if (e.key === "Escape") closePopup();
    if (e.key === "ArrowRight") goTo(current + 1);
    if (e.key === "ArrowLeft") goTo(current - 1);
  });
})();
// community-review popup js end--

// collection-category-slider js start--
var swiper = new Swiper(".collection-category-slider", {
  slidesPerView: "auto",
  spaceBetween: 20,
  grabCursor: true,
  loop: false,
  navigation: {
    nextEl: ".collection-category-button-next",
    prevEl: ".collection-category-button-prev",
  },
  breakpoints: {
    1: {
      spaceBetween: 10,
    },
    576: {
      spaceBetween: 20,
    },
  },
});
// collection-category-slider js end--

// collection filter js start---
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".collection-filter");

  // Filter sidebar
  document
    .querySelectorAll(
      ".filter-open-btn, .filter-window-close-btn, .filter-close-btn",
    )
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = btn.classList.contains("filter-open-btn");

        sidebar?.classList.toggle("active", open);
        document.body.classList.toggle("active", open);
      });
    });

  // Accordion
  document.querySelectorAll(".accordion-toggle-btn").forEach((btn) => {
    const content = btn.nextElementSibling;

    content.style.maxHeight = `${content.scrollHeight}px`;
    btn.parentElement.classList.add("active");

    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("active");

      content.style.maxHeight = content.style.maxHeight
        ? null
        : `${content.scrollHeight}px`;
    });
  });
});
// collection filter js end---

// product-slider js start---
var swiper = new Swiper(".product-slider-thumb", {
  direction: "vertical",
  loop: false,
  spaceBetween: 20,
  slidesPerView: 5,
  freeMode: true,
  mousewheel: true,
  breakpoints: {
    // when window width is >= 320px
    1: {
      direction: "horizontal",
      spaceBetween: 10,
      slidesPerView: 4,
    },
    // when window width is >= 576px
    576: {
      direction: "horizontal",
      spaceBetween: 20,
      slidesPerView: 5,
    },
    // when window width is >= 767px
    768: {
      direction: "vertical",
      spaceBetween: 20,
      slidesPerView: 5,
    },
    // when window width is >= 767px
    993: {
      direction: "vertical",
    },
  },
});
window.productSwiper = new Swiper(".product-slider", {
  loop: true,
  autoHeight: true,
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".product-slider-pagination",
    clickable: true,
  },
  thumbs: {
    swiper: swiper,
  },
});
// product-slider js end---

// Product Slider Modal
const productModal = document.querySelector(".product-slider-modal");

document
  .querySelector(".product-slider .swiper-wrapper")
  ?.addEventListener("click", (e) => {
    e.stopPropagation();
    productModal?.classList.add("active");
  });

document
  .querySelector(".product-slider-modal-close")
  ?.addEventListener("click", (e) => {
    e.stopPropagation();
    productModal?.classList.remove("active");
  });

productModal?.addEventListener("click", () => {
  productModal.classList.remove("active");
});

// Size Chart Sidebar
const sizeSidebar = document.querySelector(".size-chart-sidebar");
const sizeSidebarInner = document.querySelector(".size-chart-sidebar-inner");

const toggleSizeChart = (open, e) => {
  e?.stopPropagation();

  sizeSidebar?.classList.toggle("active", open);
  sizeSidebarInner?.classList.toggle("active", open);
  document.body.classList.toggle("active", open);
};

document
  .querySelector(".size-sidebar-btn")
  ?.addEventListener("click", (e) => toggleSizeChart(true, e));

document
  .querySelector(".size-chart-sidebar-close-window-btn")
  ?.addEventListener("click", (e) => toggleSizeChart(false, e));

document
  .querySelector(".size-chart-close-btn")
  ?.addEventListener("click", (e) => toggleSizeChart(false, e));

// product accordion--
document.addEventListener("click", ({ target }) => {
  const btn = target.closest(".product-accordion-toggle-btn");
  if (!btn) return;

  const item = btn.closest(".product-accordion-item");
  const content = btn.nextElementSibling;
  const isOpen = item.classList.contains("active");

  document.querySelectorAll(".product-accordion-item.active").forEach((el) => {
    el.classList.remove("active");
    el.querySelector(".product-accordion-item-content").style.maxHeight = null;
  });

  if (!isOpen) {
    item.classList.add("active");
    content.style.maxHeight = `${content.scrollHeight}px`;
  }
});

// open first product-accordion-item by default--
document.querySelectorAll(".product-accordion-items").forEach((group) => {
  const firstItem = group.querySelector(".product-accordion-item");
  if (!firstItem) return;

  firstItem.classList.add("active");
  const content = firstItem.querySelector(".product-accordion-item-content");
  content.style.maxHeight = `${content.scrollHeight}px`;
});

// make it short, dinamic and production ready

// review-tab-section js start--
document.addEventListener("click", ({ target }) => {
  const tab = target.closest(".review-tab-nav-item");
  if (!tab) return;

  const targetId = tab.dataset.reviewTab;

  document
    .querySelectorAll(".review-tab-nav-item, .review-tab-panel")
    .forEach((el) =>
      el.classList.toggle("active", el === tab || el.id === targetId),
    );
});
// review-tab-section js end--

// Sticky Add to Cart
(() => {
  const stickyCart = document.querySelector(".sticky-add-to-cart-section");
  if (!stickyCart) return;

  const updateStickyCart = () => {
    stickyCart.classList.toggle("fixed", window.scrollY > 300);
  };

  updateStickyCart();
  window.addEventListener("scroll", updateStickyCart, { passive: true });
})();

// Footer dropdown responsive accordion js start --
document.addEventListener("DOMContentLoaded", () => {
  const breakpoint = window.matchMedia("(max-width: 992px)");
  const items = document.querySelectorAll(".footer-item");

  const closeItem = (item) => {
    const content = item.querySelector(".footer-content");
    if (!content) return;

    item.classList.remove("active");
    content.style.maxHeight = "0px";
  };

  const openItem = (item) => {
    const content = item.querySelector(".footer-content");
    if (!content) return;

    item.classList.add("active");
    content.style.maxHeight = `${content.scrollHeight}px`;
  };

  const setupAccordion = () => {
    items.forEach((item) => {
      const title = item.querySelector(".footer-item-title");
      const content = item.querySelector(".footer-content");

      if (!title || !content) return;

      // Remove previous inline state
      title.onclick = null;

      if (!breakpoint.matches) {
        item.classList.remove("active");
        content.style.maxHeight = "";
        return;
      }

      // Mobile: close initially
      closeItem(item);

      title.onclick = () => {
        const isActive = item.classList.contains("active");

        // Close others
        items.forEach((otherItem) => {
          if (otherItem !== item) {
            closeItem(otherItem);
          }
        });

        // Toggle current
        isActive ? closeItem(item) : openItem(item);
      };
    });
  };

  setupAccordion();

  // Handle responsive resize
  breakpoint.addEventListener("change", setupAccordion);
});
// Footer dropdown responsive accordion js end --
