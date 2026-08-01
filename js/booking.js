/* =========================================================
   Lil'Sago — Trang Đặt bàn
   Vòng quay may mắn + lưới khung giờ + VI/EN + gửi form
   ========================================================= */
(function () {
  "use strict";

  /* ----- Cấu hình (giống main.js). Dán URL Apps Script để nhận đơn thật.
     Xem HUONG_DAN_DAT_BAN.md ----- */
  const CONFIG = {
    BOOKING_ENDPOINT: "https://script.google.com/macros/s/AKfycbxs4mhXi7hf1vBOIEMNRhSl5tmQXrniEkeYZ11NDARD87uUDiVo-HHX1yKYvYnrFwupRg/exec"
  };

  /* ----- Phần thưởng vòng quay THẬT (theo poster "Vòng quay may mắn") -----
     Xen kẽ 2 màu đỏ rượu / kem cho giống thiết kế poster. ----- */
  const PRIZES = [
    { label: "Rau nấm dưỡng sinh", color: "#f6ead2" },
    { label: "Thêm 1 lượt quay",   color: "#c8202b" },
    { label: "Tôm phi thúy",       color: "#f6ead2" },
    { label: "Giảm trực tiếp 50K", color: "#c8202b" },
    { label: "Rau nấm dưỡng sinh", color: "#f6ead2" },
    { label: "Thịt bò hoa tuyết",  color: "#c8202b" },
    { label: "Mộc viên bò tươi",   color: "#f6ead2" },
    { label: "Chẻ cá sả ớt",       color: "#c8202b" },
    { label: "1 ly Panna Cotta",   color: "#f6ead2" },
    { label: "Thịt bò núi lửa",    color: "#c8202b" },
    { label: "Mộc viên bò tươi",   color: "#f6ead2" },
    { label: "Tóp mỡ đa giòn",     color: "#c8202b" }
  ];

  /* ----- i18n VI / EN ----- */
  const I18N = {
    vi: {
      promoTitle: "VÒNG QUAY MAY MẮN", promoBadge: "100% trúng thưởng",
      promoSub: "Hoá đơn từ 399K — nhận ngay 1 lượt quay", spin: "QUAY",
      wheelCaption: "🎡 Quay là có quà — đặt bàn để nhận lượt quay",
      bookTitle: "Đặt bàn", lblRestaurant: "Chọn nhà hàng", lblDate: "Ngày đặt",
      lblTime: "Khung giờ", lblGuests: "Số khách", slotsTitle: "KHUNG GIỜ", submit: "ĐẶT BÀN NGAY",
      phName: "Nhập tên của bạn", phPhone: "Số điện thoại", phTime: "Khung giờ đặt",
      seat: "chỗ ngồi", won: "🎉 Bạn nhận được:", needTime: "Vui lòng chọn khung giờ.",
      needInfo: "Vui lòng nhập tên và số điện thoại.",
      okReal: "✅ Cảm ơn bạn! Nhà hàng đã nhận yêu cầu và sẽ gọi xác nhận sớm.",
      okDemo: "✅ (Demo) Đã ghi nhận. Cấu hình Google Sheet để nhận đơn thật — xem HUONG_DAN_DAT_BAN.md.",
      fail: "Gửi chưa thành công. Vui lòng gọi 0908 101 015 giúp nhà hàng nhé.", sending: "Đang gửi..."
    },
    en: {
      promoTitle: "LUCKY WHEEL", promoBadge: "100% win a gift",
      promoSub: "Bill from 399K — get 1 spin", spin: "SPIN",
      wheelCaption: "🎡 Every spin wins — book a table to get a spin",
      bookTitle: "Book a table", lblRestaurant: "Choose restaurant", lblDate: "Date",
      lblTime: "Time slot", lblGuests: "Guests", slotsTitle: "TIME SLOTS", submit: "BOOK NOW",
      phName: "Enter your name", phPhone: "Phone number", phTime: "Pick a time",
      seat: "seats", won: "🎉 You won:", needTime: "Please choose a time slot.",
      needInfo: "Please enter your name and phone number.",
      okReal: "✅ Thank you! We received your request and will call to confirm soon.",
      okDemo: "✅ (Demo) Saved. Connect Google Sheet to receive real bookings — see HUONG_DAN_DAT_BAN.md.",
      fail: "Sending failed. Please call 0908 101 015.", sending: "Sending..."
    }
  };
  let lang = "vi";

  /* ----- Vẽ vòng quay bằng SVG ----- */
  const wheelEl = document.getElementById("wheel");
  const N = PRIZES.length;
  const SEG = 360 / N;
  const CX = 200, CY = 200, R = 196;

  function polar(angleDeg, radius) {
    const a = (angleDeg - 90) * Math.PI / 180; // 0° ở đỉnh
    return [CX + radius * Math.cos(a), CY + radius * Math.sin(a)];
  }

  /* ----- Khung viền bóng loáng + bóng đèn phát sáng (tĩnh, không quay) ----- */
  const N_BULBS = 20;
  function buildFrame() {
    const frame = document.getElementById("wheelFrame");
    if (!frame) return;
    let bulbs = "";
    for (let i = 0; i < N_BULBS; i++) {
      const [bx, by] = polar((360 / N_BULBS) * i, 184);
      // quầng sáng (glow, đổi độ mờ) + bóng đèn (bulb, đổi độ sáng) — cùng data-idx để JS đồng bộ
      bulbs += `<circle class="bulb-glow" data-idx="${i}" cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="9.5" fill="url(#bulbGlow)"/>`
             + `<circle class="bulb" data-idx="${i}" cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="5" fill="#fff4c9" stroke="#a5731c" stroke-width="1.1"/>`
             + `<circle class="bulb-spark" data-idx="${i}" cx="${(bx - 1.4).toFixed(1)}" cy="${(by - 1.4).toFixed(1)}" r="1.6" fill="#fffdf3"/>`;
    }
    frame.innerHTML =
      `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ringF" cx="50%" cy="32%" r="72%">
            <stop offset="0%" stop-color="#6a4326"/><stop offset="45%" stop-color="#301a0f"/><stop offset="100%" stop-color="#110904"/>
          </radialGradient>
          <linearGradient id="glossF" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,255,0.30)"/>
            <stop offset="34%" stop-color="rgba(255,255,255,0)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.28)"/>
          </linearGradient>
          <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(255,236,170,0.95)"/>
            <stop offset="100%" stop-color="rgba(255,226,140,0)"/>
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="200" fill="url(#ringF)"/>
        <circle cx="200" cy="200" r="199" fill="none" stroke="#0b0603" stroke-width="2"/>
        <circle cx="200" cy="200" r="200" fill="url(#glossF)"/>
        <circle cx="200" cy="200" r="167" fill="#150c07"/>
        ${bulbs}
        <circle cx="200" cy="200" r="169" fill="none" stroke="#e8c65a" stroke-width="3.5"/>
        <circle cx="200" cy="200" r="165" fill="none" stroke="rgba(0,0,0,0.55)" stroke-width="1.5"/>
      </svg>`;
  }
  /* ----- Đĩa quay: dùng ẢNH THẬT cắt từ wheel-banner.jpg (đẹp, đúng như poster).
     Nếu thiếu file (chưa upload) → tự vẽ lại bằng SVG làm dự phòng, không vỡ trang. ----- */
  function buildWheel() {
    const test = new Image();
    test.onload = () => {
      wheelEl.style.backgroundImage = "url('assets/img/wheel-disc.png')";
      wheelEl.classList.add("wheel--photo");
    };
    test.onerror = () => buildWheelSVG();
    test.src = "assets/img/wheel-disc.png";
  }
  function buildWheelSVG() {
    let paths = "", labels = "";
    for (let i = 0; i < N; i++) {
      const a0 = i * SEG, a1 = (i + 1) * SEG;
      const [x0, y0] = polar(a0, R);
      const [x1, y1] = polar(a1, R);
      const large = SEG > 180 ? 1 : 0;
      paths += `<path d="M${CX},${CY} L${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z" fill="${PRIZES[i].color}" stroke="#fff" stroke-width="2"/>`;
      const mid = a0 + SEG / 2;
      const tx = polar(mid, R * 0.60)[0], ty = polar(mid, R * 0.60)[1];
      const txtColor = isLight(PRIZES[i].color) ? "#7a1f2b" : "#fff";
      const words = PRIZES[i].label.split(" ");
      let inner;
      if (words.length >= 3) {
        const third = Math.ceil(words.length / 2);
        const l1 = escapeHtml(words.slice(0, third).join(" "));
        const l2 = escapeHtml(words.slice(third).join(" "));
        inner = `<tspan x="${tx.toFixed(2)}" dy="-0.35em">${l1}</tspan><tspan x="${tx.toFixed(2)}" dy="1.1em">${l2}</tspan>`;
      } else {
        inner = escapeHtml(PRIZES[i].label);
      }
      labels += `<text x="${tx.toFixed(2)}" y="${ty.toFixed(2)}" fill="${txtColor}" font-size="11.5" font-weight="800" text-anchor="middle" dominant-baseline="middle" transform="rotate(${mid.toFixed(2)} ${tx.toFixed(2)} ${ty.toFixed(2)})">${inner}</text>`;
    }
    wheelEl.innerHTML =
      `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">${paths}${labels}
        <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#fff" stroke-width="3"/></svg>`;
  }
  function escapeHtml(s) { return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
  function isLight(hex) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 140;
  }

  /* ----- Đèn chạy quanh khung (chase) -----
     Idle: nhấp nháy nhẹ nhàng ngẫu nhiên. Đang quay: chạy đuổi nhanh theo vòng
     (như đèn rạp hát). Trúng thưởng: sáng đồng loạt + nhấp nháy ăn mừng. ----- */
  let chaseTimer = null;
  function getBulbs() { return [...document.querySelectorAll("#wheelFrame .bulb")]; }
  function lightOnly(activeIdx, mod) {
    getBulbs().forEach((b) => b.classList.toggle("is-lit", b.dataset.idx % mod === activeIdx % mod));
  }
  function startChase() {
    stopChase();
    let step = 0;
    chaseTimer = setInterval(() => {
      lightOnly(step, 4); // 1/4 số đèn sáng, chạy vòng quanh — cảm giác đuổi theo chiều quay
      step++;
    }, 70);
  }
  function startIdleTwinkle() {
    stopChase();
    chaseTimer = setInterval(() => {
      getBulbs().forEach((b) => b.classList.toggle("is-lit", Math.random() > 0.5));
    }, 700);
  }
  function celebrateBulbs() {
    stopChase();
    let on = true;
    getBulbs().forEach((b) => b.classList.add("is-lit"));
    chaseTimer = setInterval(() => {
      on = !on;
      getBulbs().forEach((b) => b.classList.toggle("is-lit", on));
    }, 180);
    setTimeout(() => startIdleTwinkle(), 2200);
  }
  function stopChase() {
    if (chaseTimer) clearInterval(chaseTimer);
    chaseTimer = null;
  }

  /* ----- Pháo hoa khi trúng thưởng ----- */
  const FW_COLORS = ["#ffd76a", "#ff6b6b", "#ffedbb", "#e8c65a", "#ff9a5a", "#fff"];
  function spawnFireworkBurst(layer, originXvw, originYvh) {
    const n = 28;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "fw-particle";
      const angle = (360 / n) * i + Math.random() * 8;
      const dist = 70 + Math.random() * 70;
      p.style.setProperty("--angle", angle + "deg");
      p.style.setProperty("--dist", dist + "px");
      p.style.setProperty("--fw-color", FW_COLORS[i % FW_COLORS.length]);
      p.style.left = originXvw + "vw";
      p.style.top = originYvh + "vh";
      layer.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  }
  function launchFireworks() {
    const layer = document.getElementById("fireworksLayer");
    if (!layer) return;
    const origins = [[22, 24], [50, 16], [76, 26]];
    origins.forEach(([x, y], i) => setTimeout(() => spawnFireworkBurst(layer, x, y), i * 220));
  }

  /* ----- Quay ----- */
  const spinBtn = document.getElementById("spinBtn");
  const resultEl = document.getElementById("wheelResult");
  let currentRot = 0, spinning = false;

  function spin() {
    if (spinning) return;
    spinning = true;
    resultEl.hidden = true;
    if (resultEl) resultEl.textContent = "";
    const t = Math.floor(pseudoRandom() * N);
    const midAngle = t * SEG + SEG / 2;
    // Đưa tâm ô trúng lên đỉnh (con trỏ): quay thêm 5 vòng
    const target = 360 * 5 + (360 - midAngle);
    currentRot += target;
    wheelEl.style.transform = `rotate(${currentRot}deg)`;
    spinBtn.disabled = true;
    startChase(); // đèn chạy đuổi trong lúc quay — tăng kịch tính

    setTimeout(() => {
      spinning = false;
      spinBtn.disabled = false;
      if (resultEl) {
        resultEl.textContent = `${I18N[lang].won} ${PRIZES[t].label}`;
        resultEl.hidden = false;
      }
      celebrateBulbs();
      launchFireworks();
    }, 4300);
  }
  // Random không dùng Math.random cố định — đủ ngẫu nhiên cho UI
  function pseudoRandom() { return Math.random(); }
  spinBtn.addEventListener("click", spin);

  /* ----- Lưới khung giờ 10:00 → 19:45 (bước 15 phút) ----- */
  const slotsEl = document.getElementById("slots");
  const timeInput = document.getElementById("fTime");
  const dateInput = document.getElementById("fDate");
  function buildSlots() {
    let html = "";
    for (let m = 10 * 60; m <= 19 * 60 + 45; m += 15) {
      const hh = String(Math.floor(m / 60)).padStart(2, "0");
      const mm = String(m % 60).padStart(2, "0");
      html += `<button type="button" class="slot" data-time="${hh}:${mm}">${hh}:${mm}</button>`;
    }
    slotsEl.innerHTML = html;
  }
  slotsEl?.addEventListener("click", (e) => {
    const b = e.target.closest(".slot");
    if (!b || b.classList.contains("is-past")) return;
    slotsEl.querySelectorAll(".slot").forEach((s) => s.classList.remove("is-active"));
    b.classList.add("is-active");
    timeInput.value = b.dataset.time;
  });

  /* ----- Số khách ----- */
  const guestsSel = document.getElementById("fGuests");
  function buildGuests() {
    let html = "";
    for (let i = 1; i <= 20; i++) {
      html += `<option value="${i}"${i === 4 ? " selected" : ""}>${i} ${I18N[lang].seat}</option>`;
    }
    guestsSel.innerHTML = html;
  }

  /* ----- Ngày mặc định = hôm nay ----- */
  function setDefaultDate() {
    const t = new Date();
    dateInput.value = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
    dateInput.min = dateInput.value;
  }

  /* ----- VI / EN ----- */
  function applyLang() {
    const dict = I18N[lang];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (dict[k] != null) el.textContent = dict[k];
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const k = el.getAttribute("data-i18n-ph");
      if (dict[k] != null) el.placeholder = dict[k];
    });
    buildGuests();
    document.documentElement.lang = lang;
  }
  document.getElementById("langToggle").addEventListener("click", (e) => {
    const b = e.target.closest(".lang");
    if (!b) return;
    lang = b.dataset.lang;
    document.querySelectorAll(".lang").forEach((x) => x.classList.toggle("is-active", x === b));
    applyLang();
  });

  /* ----- Gửi form ----- */
  const form = document.getElementById("bookForm");
  const msg = document.getElementById("bookMsg");
  function showMsg(text, isError) {
    msg.textContent = text;
    msg.classList.toggle("is-error", !!isError);
    msg.hidden = false;
    if (!isError) setTimeout(() => (msg.hidden = true), 9000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dict = I18N[lang];
    const nameInput = form.elements["name"], phoneInput = form.elements["phone"];
    let ok = true;
    [nameInput, phoneInput].forEach((f) => {
      const bad = !f.value.trim();
      f.classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) return showMsg(dict.needInfo, true);
    if (!timeInput.value) return showMsg(dict.needTime, true);

    const wonText = resultEl && !resultEl.hidden ? resultEl.textContent : "";
    const payload = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      restaurant: form.elements["restaurant"].value,
      date: form.elements["date"].value,
      time: form.elements["time"].value,
      guests: form.elements["guests"].value,
      prize: wonText.replace(dict.won, "").trim(),
      source: "dat-ban.html",
      submittedAt: new Date().toISOString()
    };

    const btn = document.getElementById("submitBtn");
    if (!CONFIG.BOOKING_ENDPOINT) {
      form.reset(); setDefaultDate(); buildGuests();
      slotsEl.querySelectorAll(".slot").forEach((s) => s.classList.remove("is-active"));
      timeInput.value = "";
      return showMsg(dict.okDemo);
    }
    try {
      btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = dict.sending;
      await fetch(CONFIG.BOOKING_ENDPOINT, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams(payload).toString()
      });
      form.reset(); setDefaultDate(); buildGuests();
      slotsEl.querySelectorAll(".slot").forEach((s) => s.classList.remove("is-active"));
      timeInput.value = "";
      showMsg(dict.okReal);
    } catch (err) {
      console.error(err); showMsg(dict.fail, true);
    } finally {
      btn.disabled = false; btn.textContent = btn.dataset.label || dict.submit;
    }
  });
  form.addEventListener("input", (e) => e.target.classList?.remove("is-invalid"));

  /* ----- Khởi tạo ----- */
  buildFrame();
  buildWheel();
  buildSlots();
  buildGuests();
  setDefaultDate();
  applyLang();
  startIdleTwinkle();
})();
