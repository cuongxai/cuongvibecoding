/* =========================================================
   Lil'Sago · Hotpot & More — Main JS
   ========================================================= */
(function () {
  "use strict";

  /* ----- 6 vị lẩu đặc trưng (theo bộ nhận diện thương hiệu) -----
     Thêm ảnh thật: điền field `img` với đường dẫn assets/img/vi-<ten>.jpg ----- */
  const FLAVORS = [
    { icon: "🥬", name: "Kim chi Hải Sản", role: "Quen thuộc, dễ chọn — vị Hàn Quốc chuẩn cay chua", group: "Khách trẻ, người mới thử", price: "299.000đ", img: "assets/img/vi-kimchi.jpg" },
    { icon: "🌶️", name: "Hải Sản Chua Cay", role: "Cân bằng, phổ thông — tôm, mực, cá viên trong nước chua cay nóng hổi", group: "Nhóm đông khó thống nhất", price: "299.000đ", img: "assets/img/vi-chua-cay.jpg" },
    { icon: "🍶", name: "Sữa Trường Thọ Hải Sản", role: "Nấu từ sữa hạnh nhân, béo nhẹ không ngấy", group: "Gia đình, người thích vị nhẹ", price: "299.000đ", img: "assets/img/vi-truong-tho.jpg" },
    { icon: "🔥", name: "Uyên Ương (2 vị)", role: "Nồi đôi — thích gì chọn nấy, không ai phải nhường ai", group: "Nhóm trẻ, người mê cay", price: "299.000đ", img: "assets/img/vi-tu-xuyen.jpg" },
    { icon: "🍋", name: "Tomyum Hải Sản", role: "Chua cay kiểu Thái, thơm sả ớt", group: "Nhóm bạn, khách thích vị Thái", price: "299.000đ", img: "assets/img/vi-tomyum.jpg" },
    { icon: "🎋", name: "Măng Chua Cá Hú", role: "Vị miền Tây, măng chua thanh mát, cá hú béo mềm", group: "Gia đình, khẩu vị truyền thống", price: "299.000đ", img: "assets/img/vi-mang-chua.jpg" }
  ];

  /* ----- Món thả lẩu (thay giá/ảnh thật của bạn vào đây) ----- */
  const DISHES = [
    { cat: "beef",    icon: "🥩", name: "Thịt Ba Chỉ Bò Mỹ", desc: "Thịt cắt mỏng, xen kẽ mỡ nạc đều đặn — nhúng vài giây là mềm tan, béo nhẹ đầu lưỡi.", price: "79.000đ", img: "assets/img/bo-my.jpg" },
    { cat: "beef",    icon: "🎍", name: "Bò Quết Ống Tre", desc: "Thịt bò xay nhuyễn, quết mịn và nhồi sẵn trong ống tre — thơm mùi bò rõ vị.", price: "49.000đ", img: "assets/img/ba-chi-bo.jpg" },
    { cat: "beef",    icon: "🌋", name: "Thịt Bò Núi Lửa", desc: "Cay vừa, thơm mùi ớt — miếng bò đỏ au hấp dẫn nhìn muốn gắp liền tay.", price: "99.000đ", img: "assets/img/bo-nui-lua.jpg" },
    { cat: "beef",    icon: "❄️", name: "Thịt Bò Hoa Tuyết", desc: "Vân mỡ hoa tuyết xen kẽ giúp thịt tan nhẹ khi nhúng, thơm béo nhưng không ngấy.", price: "99.000đ", img: "assets/img/bo-hoa-tuyet.jpg" },
    { cat: "beef",    icon: "☯️", name: "Thịt Bò Thái Cực Cay 2 Vị", desc: "Mỗi bên một vị cay khác nhau: ớt đỏ tỏi bằm và ớt xanh thơm hăng — thả vào lẩu là \"bung lửa\".", price: "109.000đ", img: "assets/img/bo-sa-te.jpg" },
    { cat: "beef",    icon: "🥩", name: "Thăn Bò Thượng Hạng Aukobe", desc: "Dòng bò cao cấp vân mỡ đẹp, mềm mọng, thơm béo tinh tế — ngon nhất khi nhúng nhanh.", price: "119.000đ", img: "assets/img/lau-tu-xuyen.jpg" },
    { cat: "seafood", icon: "🦐", name: "Set Tôm Tươi", desc: "Tôm tươi dễ gắp, dễ mê — nhúng lẩu là ngọt đậm đà.", price: "99.000đ", img: "assets/img/mon-tom.jpg" },
    { cat: "seafood", icon: "🦑", name: "Set Tôm Mực", desc: "Combo tôm và mực tươi, giòn ngọt tự nhiên — hợp mọi loại nước lẩu.", price: "89.000đ", img: "assets/img/mon-muc.jpg" },
    { cat: "seafood", icon: "🐚", name: "Bào Ngư (3 con)", desc: "3 em bào ngư xịn xò, trình bày sang chảnh như fine-dining.", price: "89.000đ", img: "assets/img/mon-ca-vien.jpg" },
    { cat: "seafood", icon: "🍤", name: "Set Hải Sản Đủ Vị", desc: "Combo đủ đầy gồm tôm, mực, thịt bò, cá hồi và cá viên — món nhúng quốc dân.", price: "79.000đ", img: "assets/img/mon-ngheu.jpg" },
    { cat: "veg",     icon: "🥬", name: "Cải Thảo Đà Lạt", desc: "Mềm ngọt tự nhiên, giúp làm ngọt nước lẩu và bổ sung chất xơ.", price: "35.000đ", img: "assets/img/mon-rau.jpg" },
    { cat: "veg",     icon: "🍄", name: "Nấm Kim Châm", desc: "Sợi nấm trắng muốt, giòn nhẹ — thấm nước lẩu là bung vị ngọt tự nhiên.", price: "35.000đ", img: "assets/img/mon-nam.jpg" },
    { cat: "veg",     icon: "🌽", name: "Bắp Mỹ", desc: "Ngọt thanh, hợp mọi vị lẩu.", price: "35.000đ", img: "assets/img/mon-bap.jpg" },
    { cat: "veg",     icon: "🍢", name: "Đậu Hủ Non", desc: "Mềm béo, thấm vị — món chay thanh đạm cho mọi nồi lẩu.", price: "29.000đ", img: "assets/img/mon-dau-hu.jpg" },
    { cat: "more",    icon: "🍚", name: "Cơm Chiên Hải Sản", desc: "Tôm, mực, hạt bắp, đậu Hà Lan xào cùng cơm hạt dài, thơm khói chảo.", price: "99.000đ", img: "assets/img/mon-com-chien.jpg" },
    { cat: "more",    icon: "🍜", name: "Mì Trứng", desc: "Sợi mì trứng khô vàng ươm, dai nhẹ — nhúng lẩu ngấm nước dùng mà không bị bở.", price: "13.000đ" },
    { cat: "more",    icon: "🥟", name: "Combo Viên Lẩu", desc: "Tổng hợp 7 loại viên lẩu handmade — đầy đặn và chất lượng.", price: "59.000đ", img: "assets/img/mon-vien-tha-lau.jpg" },
    { cat: "more",    icon: "🍮", name: "Kem Sữa Ý Panna Cotta", desc: "Tráng miệng mềm mịn, thanh nhẹ — giải nhiệt sau nồi lẩu nóng.", price: "19.000đ" }
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
