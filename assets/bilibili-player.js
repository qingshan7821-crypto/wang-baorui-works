(function (root) {
  "use strict";

  function buildBilibiliPlayerUrl(bvid) {
    if (!/^BV[0-9A-Za-z]{10}$/.test(bvid)) {
      throw new TypeError("A valid Bilibili BV id is required");
    }

    const params = new URLSearchParams({
      bvid,
      page: "1",
      high_quality: "1",
      autoplay: "0",
    });
    return `https://player.bilibili.com/player.html?${params.toString()}`;
  }

  root.buildBilibiliPlayerUrl = buildBilibiliPlayerUrl;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { buildBilibiliPlayerUrl };
  }
})(typeof window !== "undefined" ? window : globalThis);
