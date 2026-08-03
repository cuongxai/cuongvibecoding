/* =========================================================
   Lil'Sago — Google Analytics 4 + Facebook Pixel
   Điền 2 mã ID bên dưới rồi lưu lại là chạy. Không cần sửa gì khác.
   - GA4: vào analytics.google.com → Admin → Luồng dữ liệu → mã "G-xxxxxxxxxx"
   - FB Pixel: vào business.facebook.com/events_manager → mã Pixel (dãy số)
   ========================================================= */
window.LILSAGO_ANALYTICS = {
  GA_MEASUREMENT_ID: "G-XXXXXXXXXX",   // TODO: thay bằng mã GA4 thật
  FB_PIXEL_ID: "000000000000000"       // TODO: thay bằng mã Facebook Pixel thật
};

(function () {
  const cfg = window.LILSAGO_ANALYTICS;

  /* ----- Google Analytics 4 ----- */
  if (cfg.GA_MEASUREMENT_ID && !cfg.GA_MEASUREMENT_ID.includes("XXXXXXXXXX")) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + cfg.GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", cfg.GA_MEASUREMENT_ID);
  }

  /* ----- Facebook Pixel ----- */
  if (cfg.FB_PIXEL_ID && !/^0+$/.test(cfg.FB_PIXEL_ID)) {
    !function (f, b, e, v, n, t, s2) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s2 = b.getElementsByTagName(e)[0]; s2.parentNode.insertBefore(t, s2);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", cfg.FB_PIXEL_ID);
    fbq("track", "PageView");
  }

  /* ----- Gọi hàm này khi khách đặt bàn thành công (dùng trong booking.js) ----- */
  window.trackBookingSuccess = function (details) {
    if (typeof gtag === "function") {
      gtag("event", "generate_lead", {
        event_category: "booking",
        event_label: "dat_ban_thanh_cong",
        value: details && details.guests ? Number(details.guests) : undefined
      });
    }
    if (typeof fbq === "function") {
      fbq("track", "Lead", { content_name: "Đặt bàn Lil'Sago" });
    }
  };
})();
