// 画面の下の Google AdSense 広告。ID を入れるまでは何も表示しない（場所も取らない）。
// AdSense の管理画面で発行した「パブリッシャー ID」と「広告ユニットの ID」を入れてください。
(function () {
  const ADSENSE_CLIENT = ''; // 例: 'ca-pub-1234567890123456'
  const ADSENSE_SLOT = ''; // 例: '1234567890'

  // Android アプリ（Google Play 版の TWA）から開かれたか。TWA は最初の読み込みで referrer が
  // android-app://パッケージ名 になる。読み込み直すと消えるので、見つけたらそのタブの間は覚えておく。
  // アプリ内では AdSense を出さない（AdSense はウェブサイト向けで、アプリ内の広告は AdMob の扱いのため）。
  function isAndroidApp() {
    const key = 'opened-from-android-app';
    const fromApp = document.referrer.startsWith('android-app://');
    try {
      if (fromApp) sessionStorage.setItem(key, '1');
      return fromApp || sessionStorage.getItem(key) === '1';
    } catch {
      return fromApp;
    }
  }
  if (!ADSENSE_CLIENT || !ADSENSE_SLOT) return;
  if (isAndroidApp()) return;

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
