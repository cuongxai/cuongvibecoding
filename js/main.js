/* =========================================================
   Lil'Sago · Hotpot & More — Main JS
   ========================================================= */
(function () {
  "use strict";

  /* ----- 6 vị lẩu đặc trưng (theo bộ nhận diện thương hiệu) -----
     Thêm ảnh thật: điền field `img` với đường dẫn assets/img/vi-<ten>.jpg ----- */
  const FLAVORS = [
    { icon: "🥬", name: "Kim chi", role: "Quen thuộc, dễ chọn", group: "Khách trẻ, người mới thử", img: "assets/img/vi-kimchi.jpg" },
    { icon: "🌶️", name: "Chua cay", role: "Cân bằng, phổ thông", group: "Nhóm đông khó thống nhất", img: "assets/img/vi-chua-cay.jpg" },
    { icon: "🍶", name: "Trường Thọ", role: "Dịu, có câu chuyện sữa hạnh nhân", group: "Gia đình, người thích vị nhẹ", img: "assets/img/vi-truong-tho.jpg" },
    { icon: "🔥", name: "Tứ Xuyên", role: "Đậm, cay, kích thích vị giác", group: "Nhóm trẻ, người mê cay", img: "assets/img/vi-tu-xuyen.jpg" },
    { icon: "🍋", name: "Tomyum", role: "Chua cay thơm, dễ nhận biết", group: "Nhóm bạn, khách thích vị Thái", img: "assets/img/vi-tomyum.jpg" },
    { icon: "🎋", name: "Măng chua", role: "Vị Việt, dễ ăn", group: "Gia đình, khẩu vị truyền thống", img: "assets/img/vi-mang-chua.jpg" }
  ];

  /* ----- Món thả lẩu (thay giá/ảnh thật của bạn vào đây) ----- */
  const DISHES = [
    { cat: "beef",    icon: "🥩", name: "Bò Mỹ thái lát", desc: "Vân mỡ đẹp, mềm — phần bò hero để chụp ảnh.", price: "—", img: "assets/img/bo-my.jpg" },
    { cat: "beef",    icon: "🐄", name: "Ba chỉ bò cuộn", desc: "Cuộn tay, nhúng là chín, béo vừa.", price: "—", img: "assets/img/ba-chi-bo.jpg" },
    { cat: "beef",    icon: "🌋", name: "Bò núi lửa", desc: "Xếp hình núi, vân mỡ cực đẹp.", price: "—", img: "assets/img/bo-nui-lua.jpg" },
    { cat: "beef",    icon: "❄️", name: "Bò hoa tuyết", desc: "Vân tuyết mềm tan, xếp trên đá lạnh.", price: "—", img: "assets/img/bo-hoa-tuyet.jpg" },
    { cat: "beef",    icon: "☯️", name: "Bò sả ớt âm dương", desc: "Đĩa đôi sả ớt xanh - đỏ, thơm nồng.", price: "—", img: "assets/img/bo-sa-te.jpg" },
    { cat: "beef",    icon: "🌶️", name: "Sốt sa tế Tứ Xuyên", desc: "Sa tế cay tê kiểu Tứ Xuyên, chấm là mê.", price: "—", img: "assets/img/lau-tu-xuyen.jpg" },
    { cat: "seafood", icon: "🦐", name: "Tôm tươi", desc: "Chắc thịt, ngọt tự nhiên.", price: "—", img: "assets/img/mon-tom.jpg" },
    { cat: "seafood", icon: "🦑", name: "Mực ống", desc: "Giòn sần sật, tươi mỗi ngày.", price: "—", img: "assets/img/mon-muc.jpg" },
    { cat: "seafood", icon: "🐟", name: "Cá viên / chả cá", desc: "Dai ngon, thấm nước lẩu.", price: "—", img: "assets/img/mon-ca-vien.jpg" },
    { cat: "seafood", icon: "🦪", name: "Nghêu sạch", desc: "Ngọt nước, đậm vị biển.", price: "—", img: "assets/img/mon-ngheu.jpg" },
    { cat: "veg",     icon: "🥬", name: "Rau cải các loại", desc: "Giòn ngọt, giải ngán.", price: "—", img: "assets/img/mon-rau.jpg" },
    { cat: "veg",     icon: "🍄", name: "Nấm kim châm", desc: "Giòn, thấm nước lẩu.", price: "—", img: "assets/img/mon-nam.jpg" },
    { cat: "veg",     icon: "🌽", name: "Bắp ngọt", desc: "Ngọt thanh, hợp mọi vị lẩu.", price: "—", img: "assets/img/mon-bap.jpg" },
    { cat: "veg",     icon: "🍢", name: "Đậu hũ &amp; nấm", desc: "Mềm béo, thấm vị.", price: "—", img: "assets/img/mon-dau-hu.jpg" },
    { cat: "more",    icon: "🍚", name: "Cơm chiên", desc: "Món 'more' của Lil'Sago, ăn kèm lẩu.", price: "—", img: "assets/img/mon-com-chien.jpg" },
    { cat: "more",    icon: "🍜", name: "Mì / bún thả lẩu", desc: "No đủ cho cả nhóm.", price: "—", img: "assets/img/mon-mi.jpg" },
    { cat: "more",    icon: "🥟", name: "Viên thả lẩu", desc: "Đa dạng, dễ ăn.", price: "—", img: "assets/img/mon-vien-tha-lau.jpg" },
    { cat: "more",    icon: "🧊", name: "Nước &amp; tráng miệng", desc: "Giải nhiệt sau nồi lẩu nóng.", price: "—", img: "assets/img/mon-trang-mieng.jpg" }
  ];

  /* ----- Địa chỉ nhà hàng (thông tin thật) ----- */
  const BRANCHES = [
    {
      city: "TP. Hồ Chí Minh",
      name: "Lil'Sago · Võ Văn Tần",
      addr: "299 Võ Văn Tần, Phường 5, Quận 3",
      phone: "0908 101 015",
      map: "https://www.google.com/maps/search/?api=1&query=Lil%27Sago+299+Vo+Van+Tan+Quan+3",
      img: "assets/img/mat-tien.jpg"
    }
  ];

  /* ----- Render 6 vị lẩu ----- */
  const menuGrid = document.getElementById("menuGrid");
  if (menuGrid) {
    menuGrid.innerHTML = FLAVORS.map(
      (f) => `
      <article class="flavor-card" data-reveal>
        <div class="flavor-card__icon">${f.img ? `<img src="${f.img}" alt="${f.name}" loading="lazy" onerror="this.remove()" />` : ""}<span>${f.icon}</span></div>
        <h3 class="flavor-card__name">${f.name}</h3>
        <p class="flavor-card__role">${f.role}</p>
        <span class="flavor-card__group">👥 ${f.group}</span>
      </article>`
    ).join("");
  }

  /* ----- Render món thả lẩu (có lọc danh mục) ----- */
  const dishGrid = document.getElementById("dishGrid");
  function renderDishes(cat) {
    if (!dishGrid) return;
    const items = cat === "all" ? DISHES : DISHES.filter((m) => m.cat === cat);
    dishGrid.innerHTML = items
      .map(
        (m) => `
      <article class="menu-card" data-reveal>
        <div class="menu-card__img">${m.img ? `<img src="${m.img}" alt="${m.name}" loading="lazy" onerror="this.remove()" />` : ""}<span>${m.icon}</span></div>
        <div class="menu-card__body">
          <h3 class="menu-card__name">${m.name}</h3>
          <p class="menu-card__desc">${m.desc}</p>
          <div class="menu-card__foot">
            <span class="menu-card__price">${m.price}</span>
            <a class="menu-card__add" href="dat-ban.html" aria-label="Đặt bàn để thử ${m.name}">+</a>
          </div>
        </div>
      </article>`
      )
      .join("");
    observeReveals();
  }

  const tabs = document.getElementById("menuTabs");
  if (tabs) {
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".menu__tab");
      if (!btn) return;
      tabs.querySelectorAll(".menu__tab").forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderDishes(btn.dataset.cat);
    });
  }

  /* ----- Render địa chỉ ----- */
  const branchesGrid = document.getElementById("branchesGrid");
  if (branchesGrid) {
    branchesGrid.innerHTML = BRANCHES.map(
      (b) => `
      <article class="branch-card" data-reveal>
        <a class="branch-card__map" href="${b.map}" target="_blank" rel="noopener" aria-label="Xem bản đồ ${b.name}">${b.img ? `<img src="${b.img}" alt="Mặt tiền ${b.name}" loading="lazy" onerror="this.remove()" />` : ""}<span>📍</span></a>
        <div class="branch-card__body">
          <span class="branch-card__city">${b.city}</span>
          <h3 class="branch-card__name">${b.name}</h3>
          <p class="branch-card__addr">${b.addr}</p>
          <a class="branch-card__phone" href="tel:${b.phone.replace(/\s/g, "")}">☎ ${b.phone}</a>
          <a class="branch-card__link" href="${b.map}" target="_blank" rel="noopener">Chỉ đường trên Google Maps →</a>
        </div>
      </article>`
    ).join("");
  }

  /* ----- Header đổi màu khi cuộn ----- */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ----- Menu mobile ----- */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => nav.classList.toggle("is-open"));
    nav.addEventListener("click", (e) => {
      if (e.target.matches(".nav__link")) nav.classList.remove("is-open");
    });
  }

  /* ----- Cookie banner ----- */
  const cookie = document.getElementById("cookie");
  const COOKIE_KEY = "lilsago_cookie_ok";
  if (cookie && !localStorage.getItem(COOKIE_KEY)) {
    setTimeout(() => (cookie.hidden = false), 800);
  }
  function dismissCookie(save) {
    if (save) localStorage.setItem(COOKIE_KEY, "1");
    if (cookie) cookie.hidden = true;
  }
  document.getElementById("cookieAccept")?.addEventListener("click", () => dismissCookie(true));
  document.getElementById("cookieClose")?.addEventListener("click", () => dismissCookie(false));

  /* ----- Hiệu ứng reveal khi cuộn ----- */
  let io;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    io = io || new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => io.observe(el));
  }

  /* ----- Khởi tạo ----- */
  renderDishes("all");
  document
    .querySelectorAll(".feature, .promo__card, .about__inner, .section__head")
    .forEach((el) => el.setAttribute("data-reveal", ""));
  observeReveals();
})();
