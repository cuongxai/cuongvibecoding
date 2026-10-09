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
  /* =========================================================
     MÃ NGUỒN KHÁCH — chạy trên MỌI trang, nhớ suốt phiên truy cập
     ---------------------------------------------------------
     Vì sao đặt ở đây chứ không đặt trong booking.js: khách bấm link
     TikTok có ?utm_source=tt nhưng thường vào trang chủ trước, rồi mới
     bấm "Đặt bàn". Nếu chỉ bắt ở trang đặt bàn thì tham số đã mất,
     mọi đơn đều bị ghi là WEB. File này nạp trên mọi trang nên bắt
     được ngay lần chạm đầu tiên và giữ lại trong sessionStorage.

     Cách gắn link cho từng kênh:
       Bio TikTok      → https://lilsago.vercel.app/?utm_source=tt
       Quảng cáo FB/IG → https://lilsago.vercel.app/?utm_source=fb&utm_campaign=ten-chien-dich
       Google Maps     → https://lilsago.vercel.app/?utm_source=gm
       Zalo OA         → https://lilsago.vercel.app/?utm_source=zalo
       Khách giới thiệu→ https://lilsago.vercel.app/?utm_source=ref
     ========================================================= */
  window.LILSAGO_TRACK = (function () {
    const KEY = "lilsago_src";

    const q = {};
    location.search.replace(/^\?/, "").split("&").forEach(function (p) {
      const kv = p.split("=");
      if (kv[0]) q[decodeURIComponent(kv[0]).toLowerCase()] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
    });

    function fromReferrer() {
      const r = (document.referrer || "").toLowerCase();
      if (!r || r.indexOf(location.host) > -1) return "";   // bỏ qua điều hướng nội bộ
      if (/tiktok/.test(r)) return "tt";
      if (/facebook|instagram|fb\.com/.test(r)) return "fb";
      if (/zalo/.test(r)) return "zalo";
      /* Tách Google Maps khỏi tìm kiếm Google. Trước đây gộp chung thành "gm"
         nên mọi khách tìm thấy nhà hàng qua tìm kiếm đều bị ghi là Google Maps —
         nhìn số cứ tưởng hồ sơ Maps hiệu quả, trong khi công đó là của SEO.
         Hai kênh này cần hai việc khác hẳn nhau, không được lẫn. */
      if (/google\.[a-z.]+\/maps|maps\.google|maps\.app\.goo\.gl|goo\.gl\/maps/.test(r)) return "gm";
      if (/google\./.test(r)) return "seo";
      return "";
    }

    function chuanHoa(raw) {
      const s = String(raw || "").toLowerCase().trim();
      if (!s) return "";
      if (["gm", "seo", "fb", "tt", "zalo", "ref", "web", "walkin"].indexOf(s) > -1) return s.toUpperCase();
      if (/tiktok/.test(s)) return "TT";
      // "ig"/"meta" chỉ tính là nguồn khi đứng một mình — trước đây bắt theo chuỗi
      // con nên utm_source kiểu "signage" cũng bị gán nhầm thành FB.
      if (/facebook|instagram|fbclid|^ig$|^meta$/.test(s)) return "FB";
      if (/zalo|oa/.test(s)) return "ZALO";
      if (/^seo$|organic|search/.test(s)) return "SEO";
      if (/google|maps|gmb|gbp/.test(s)) return "GM";
      if (/ref|gioithieu|referral/.test(s)) return "REF";
      return "WEB";
    }

    let saved = {};
    try { saved = JSON.parse(sessionStorage.getItem(KEY) || "{}"); } catch (e) {}

    // Thứ tự ưu tiên: utm trên URL hiện tại > giá trị đã lưu trong phiên > suy từ referrer
    const utmHienTai = q.utm_source || q.src || q.source || "";
    const rawSource   = utmHienTai || saved.rawSource || fromReferrer() || "";
    const campaign    = q.utm_campaign || q.campaign || saved.campaign || "";

    const out = {
      source: chuanHoa(rawSource) || "WEB",
      rawSource: rawSource,
      campaign: campaign,
      landing: saved.landing || location.pathname.split("/").pop() || "index.html"
    };

    try { sessionStorage.setItem(KEY, JSON.stringify(out)); } catch (e) {}
    return out;
  })();


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
