// 画面の下の Google AdSense 広告。ID を入れるまでは何も表示しない（場所も取らない）。
// AdSense の管理画面で発行した「パブリッシャー ID」と「広告ユニットの ID」を入れてください。
(function () {
  const ADSENSE_CLIENT = 'ca-pub-0807456611167337'; // 例: 'ca-pub-1234567890123456'
  const ADSENSE_SLOT = '3841836724'; // 例: '1234567890'

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

  const shell = document.querySelector('.bottom-dock');
  if (!shell) return;

  const banner = document.createElement('div');
  banner.className = 'ad-banner';
  const ad = document.createElement('ins');
  ad.className = 'adsbygoogle';
  ad.dataset.adClient = ADSENSE_CLIENT;
  ad.dataset.adSlot = ADSENSE_SLOT;
  ad.dataset.adFormat = 'horizontal';
  banner.append(ad);
  shell.insertBefore(banner, shell.firstChild);

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
  document.head.append(script);

  // 広告を読み出せない時（ブロック・未配信・時間切れ）は、空白を残さず、広告の枠ごと消す
  const removeBanner = () => banner.remove();
  script.onerror = removeBanner;
  new MutationObserver(() => {
    if (ad.dataset.adStatus === 'unfilled') removeBanner();
  }).observe(ad, { attributes: true, attributeFilter: ['data-ad-status'] });
  setTimeout(() => {
    if (ad.dataset.adStatus !== 'filled') removeBanner();
  }, 15000);

  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    console.error('[ads]', error);
    removeBanner();
  }
})();
