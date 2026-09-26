// 画面の下の Google AdSense 広告。ID を入れるまでは何も表示しない（場所も取らない）。
// AdSense の管理画面で発行した「パブリッシャー ID」と「広告ユニットの ID」を入れてください。
(function () {
  const ADSENSE_CLIENT = ''; // 例: 'ca-pub-1234567890123456'
  const ADSENSE_SLOT = ''; // 例: '1234567890'
  if (!ADSENSE_CLIENT || !ADSENSE_SLOT) return;

  const shell = document.querySelector('.app-shell');
  if (!shell) return;

  const banner = document.createElement('div');
  banner.className = 'ad-banner';
  const ad = document.createElement('ins');
  ad.className = 'adsbygoogle';
  ad.dataset.adClient = ADSENSE_CLIENT;
  ad.dataset.adSlot = ADSENSE_SLOT;
  ad.dataset.adFormat = 'auto';
  ad.dataset.fullWidthResponsive = 'true';
  banner.append(ad);
  shell.append(banner);

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
  document.head.append(script);

  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    console.error('[ads]', error);
  }
})();
