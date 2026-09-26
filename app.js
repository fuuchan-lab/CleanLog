const categories = [
  { key: 'tobacco', label: 'タバコ', labelEn: 'Cigarettes', color: '#3b82f6' },
  { key: 'can', label: '缶・瓶', labelEn: 'Cans & Bottles', color: '#14a9a7' },
  { key: 'foodWaste', label: '生ごみ', labelEn: 'Food Waste', color: '#7ea843' },
  { key: 'toy', label: 'おもちゃ', labelEn: 'Toys', color: '#c86079' },
  { key: 'fireworks', label: '花火', labelEn: 'Fireworks', color: '#ef9b73' },
  { key: 'crumbs', label: '食べかす', labelEn: 'Food Scraps', color: '#e1a43a' },
  { key: 'candy', label: '飴・ガム', labelEn: 'Candy & Gum', color: '#7c6ae1' },
];

const records = [
  {
    id: 1,
    category: 'tobacco',
    title: 'タバコの吸い殻',
    time: '9:14',
    date: '2026/09/12',
    place: '公園入口',
    lat: 35.6813,
    lng: 139.7654,
    image: '',
  },
  {
    id: 2,
    category: 'can',
    title: '空き缶',
    time: '10:42',
    date: '2026/09/11',
    place: '歩道脇',
    lat: 35.6828,
    lng: 139.7694,
    image: '',
  },
  {
    id: 3,
    category: 'foodWaste',
    title: '生ごみ',
    time: '11:05',
    date: '2026/09/10',
    place: 'ベンチ横',
    lat: 35.6799,
    lng: 139.7683,
    image: '',
  },
  {
    id: 4,
    category: 'candy',
    title: '飴の袋',
    time: '12:30',
    date: '2026/09/09',
    place: '階段の下',
    lat: 35.6806,
    lng: 139.7742,
    image: '',
  },
];

const categoryMap = Object.fromEntries(categories.map((category) => [category.key, category]));
categoryMap.unclassified = {
  key: 'unclassified',
  label: '分類未設定',
  labelEn: 'Unclassified',
  color: '#a86b43',
};

const recordList = document.getElementById('recordList');
const detailSheet = document.getElementById('detailSheet');
const detailImage = document.getElementById('detailImage');
const detailCategoryBadge = document.getElementById('detailCategoryBadge');
const detailTitle = document.getElementById('detailTitle');
const detailPlace = document.getElementById('detailPlace');
const detailDate = document.getElementById('detailDate');
const detailTime = document.getElementById('detailTime');
const detailNotes = document.getElementById('detailNotes');
const closeDetailButton = document.getElementById('closeDetail');
const editDetailButton = document.getElementById('editDetailButton');
const deleteDetailButton = document.getElementById('deleteDetailButton');
const detailEditForm = document.getElementById('detailEditForm');
const detailCategoryInput = document.getElementById('detailCategoryInput');
const detailDateTimeInput = document.getElementById('detailDateTimeInput');
const updateDetailButton = document.getElementById('updateDetailButton');
const cancelDetailEditButton = document.getElementById('cancelDetailEditButton');
const useCurrentLocationForDetailButton = document.getElementById('useCurrentLocationForDetailButton');
const detailLocationStatusText = document.getElementById('detailLocationStatusText');
const addRecordButton = document.getElementById('addRecordButton');
const addRecordLabel = document.getElementById('addRecordLabel');
const locateButton = document.getElementById('locateButton');
const albumButton = document.getElementById('albumButton');
const albumInput = document.getElementById('albumInput');
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsModal = document.getElementById('closeSettingsModal');
const settingsCategoryList = document.getElementById('settingsCategoryList');
const categoryCount = document.getElementById('categoryCount');
const categoryForm = document.getElementById('categoryForm');
const categoryNameInput = document.getElementById('categoryNameInput');
const categoryColorInput = document.getElementById('categoryColorInput');
const recordCategoryInput = document.getElementById('recordCategory');
const recordDateTimeInput = document.getElementById('recordDateTime');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const locationStatusText = document.getElementById('locationStatusText');
const locationHintText = document.getElementById('locationHintText');
const useCurrentLocationForRecordButton = document.getElementById('useCurrentLocationForRecordButton');
const recordModal = document.getElementById('recordModal');
const closeRecordModal = document.getElementById('closeRecordModal');
const recordForm = document.getElementById('recordForm');
const saveRecordButton = document.getElementById('saveRecordButton');
const googleLoginButton = document.getElementById('googleLoginButton');
const googleLoginText = document.getElementById('googleLoginText');
const googleMark = document.querySelector('.google-mark');
const googleMarkInner = document.querySelector('.google-mark-inner');
const accountModal = document.getElementById('accountModal');
const closeAccountModal = document.getElementById('closeAccountModal');
const accountModalEmail = document.getElementById('accountModalEmail');
const switchAccountButton = document.getElementById('switchAccountButton');
const signOutButton = document.getElementById('signOutButton');
const languageSelect = document.getElementById('languageSelect');
const themeSelect = document.getElementById('themeSelect');
const exportDriveButton = document.getElementById('exportDriveButton');
const exportDeviceButton = document.getElementById('exportDeviceButton');
const exportNote = document.getElementById('exportNote');
const exportStatus = document.getElementById('exportStatus');
const devicesLoadButton = document.getElementById('devicesLoadButton');
const devicesCount = document.getElementById('devicesCount');
const devicesList = document.getElementById('devicesList');
const devicesNote = document.getElementById('devicesNote');
const devicesStatus = document.getElementById('devicesStatus');
const dateRangeButton = document.getElementById('dateRangeButton');
const dateRangeValue = document.getElementById('dateRangeValue');
const rangeCountValue = document.getElementById('rangeCountValue');
const densityValue = document.getElementById('densityValue');
const dateRangeModal = document.getElementById('dateRangeModal');
const closeDateRangeModal = document.getElementById('closeDateRangeModal');
const dateRangeForm = document.getElementById('dateRangeForm');
const startDateInput = document.getElementById('startDateInput');
const endDateInput = document.getElementById('endDateInput');
const startCalendar = document.getElementById('startCalendar');
const endCalendar = document.getElementById('endCalendar');

const driveConfig = {
  folderName: 'CleanLog',
  // Google Cloud Console > APIとサービス > 認証情報 で発行した
  // OAuth クライアントID（ウェブアプリケーション）に置き換えてください。
  clientId: '632134832719-kj2419t3d9ltfko0i70o11g9ssuj2j69.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile',
};

let isGoogleLoggedIn = false;
let driveAccessToken = null;
let driveFolderId = null;
let driveTokenClient = null;
let driveUserAvatarUrl = null;
let driveUserEmail = null;
const driveImageUrlCache = new Map();
let activeCategoryKeys = [...categories.map((category) => category.key), 'unclassified'];
let currentLanguage = localStorage.getItem('cleanlog-language') || (navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en');
let selectedPhotoFile = null;
let selectedPhotoLocation = null;
let selectedPhotoSource = 'camera';
let activeDetailRecord = null;
let pendingDetailLocation = null;
let isExporting = false;
let isDeviceLimited = false;
let devicesLoaded = false;
let lastDevices = [];

const dateRange = {
  start: '',
  end: '',
};

const translations = {
  ja: {
    appTagline: 'ゴミ拾い記録帳', settings: '設定', login: 'ログイン', connected: 'Google\n接続中',
    recordPeriod: '記録期間', periodCount: '期間/地図中の数', density: 'ごみ密度 (個/km²)',
    map: 'ごみ分布マップ', addRecord: '新しい記録を追加', capture: '撮影', categories: 'ごみの種類',
    recent: '最近の記録', periodFilter: '期間指定', details: '記録詳細', close: '閉じる',
    newRecord: '新しいごみ記録', selectType: '種類を選択', type: '種類', capturedAt: '撮影日時', photo: '写真',
    locationHint: '正確な位置情報が必要な場合は、端末のカメラアプリで撮影してから、地図上の🖼️ボタン(アルバムから選択)でその写真を選んでください。',
    saveTo: '保存先', driveFolder: 'Google Drive の CleanLog フォルダー', saveDrive: 'Drive に保存',
    selectPeriod: '期間を選択', startDate: '開始日', endDate: '終了日', showPeriod: 'この期間で表示',
    language: '言語/Language', newType: '新しい種類', color: '色', addType: '種類を追加', exampleType: '例：段ボール',
    installTitle: 'デバイスへのインストール方法', installDescription: '下のQRコードをスマートフォンで読み取ってアクセスしてください。',
    android: 'Android', androidGuide: 'Chromeでアクセスし、メニューから「ホーム画面に追加」または「アプリをインストール」を選択してください。',
    ios: 'iPhone / iPad', iosGuide: 'Safariでアクセスし、共有ボタンから「ホーム画面に追加」を選択してください。', qrAlt: 'アクセス先のQRコード',
    previousMonth: '前の月', nextMonth: '次の月', update: '更新', delete: '削除', edit: '編集', cancel: 'キャンセル', useCurrentLocation: '現在位置を記録',
    detailButton: '記録詳細を見る',
    loginAlert: 'Googleアカウントでログインしました。写真とデータは Google Drive の CleanLog フォルダーに保存されます。',
    savedAlert: '写真とデータを Google Drive の CleanLog フォルダーに保存しました。',
    privacyPolicy: 'プライバシーポリシー',
    account: 'アカウント', switchAccount: 'アカウントを切り替え', signOut: 'ログアウト',
    connecting: '接続中…',
    clientIdMissingAlert: 'Google Drive連携用のクライアントIDが未設定です。app.js の driveConfig.clientId を設定してください。',
    loginFailedAlert: 'Googleへのログインに失敗しました。もう一度お試しください。',
    signInFirstAlert: '先にGoogleでログインしてください。',
    signInBeforeCaptureAlert: '記録を撮る前に、Googleでログインしてください。続けてログイン画面を開きます。ログイン後、もう一度ボタンを押してください。',
    saveFailedAlert: 'Google Driveへの保存に失敗しました。もう一度お試しください。',
    savingToDrive: '保存中…',
    updateFailedAlert: 'Google Driveへの更新の反映に失敗しました。',
    deleteFailedAlert: 'Google Drive上のファイル削除に失敗しました。',
    themeTitle: '画面の配色', themeAuto: '自動（端末の設定に合わせる）', themeLight: 'ライト', themeDark: 'ダーク',
    exportTitle: 'データのエクスポート',
    exportHelp: '記録を Excel ファイル・写真・データ（JSON）にまとめて書き出します。Google Drive の CleanLog フォルダーの中に書き出しごとのフォルダーを作って保存するか、この端末に ZIP でダウンロードできます。',
    exportDrive: 'Google Drive に保存', exportDevice: 'この端末にダウンロード（ZIP）', exportBusy: '書き出し中…',
    exportNeedLogin: 'Google にログインすると使えます（右上の「ログイン」）。', exportNoRecords: '書き出す記録がまだありません。',
    exportDone: '保存しました: ', exportOpen: 'Google Drive で開く',
    exportFailed: '書き出せませんでした。通信状況とログイン状態を確認して、もう一度お試しください。',
    devicesTitle: '登録済みの端末（最大{max}台）',
    devicesHelp: 'この共有アカウントで使っている端末です。使わなくなった端末を解除すると、新しい端末を登録できます（解除した端末が保存した記録は残ります）。',
    devicesLoad: '一覧を表示', devicesLoading: '読み込み中…', devicesCount: '{n} / {max} 台',
    devicesThis: 'この端末', devicesOver: '上限外', devicesRegistered: '登録: {time}', devicesRemove: '解除',
    devicesConfirmRemove: '「{name}」の登録を解除しますか？（その端末は、枠が空いていれば次にログインした時に再び登録されます）',
    devicesNeedLogin: 'ログインすると表示できます。', devicesFailed: '読み込めませんでした。通信状況を確認してください。',
    deviceLimitAlert: 'この共有アカウントで使える端末（{max}台）に達しているため、この端末では記録の表示・保存ができません。使っていない端末を、設定の「登録済みの端末」で解除してください。',
    deviceLimitNote: '端末の上限（{max}台）に達しているため、この端末では記録の表示・保存ができません。下の一覧で使っていない端末を解除してください。',
    accountShared: '同じアカウントでログインした端末（最大{max}台）の記録は、このフォルダーに集約されます。',
    helpTitle: '使い方（ヘルプ）', helpSubtitle: '撮影・地図・エクスポート・端末の管理などの説明',
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
  },
  en: {
    appTagline: 'Clean-up Logbook', settings: 'Settings', login: 'Log in', connected: 'Google\nConnected',
    recordPeriod: 'Record period', periodCount: 'Records in period & map view', density: 'Waste density (items/km²)',
    map: 'Waste distribution map', addRecord: 'Add new record', capture: 'Capture', categories: 'Waste types', all: 'Show all',
    recent: 'Recent records', periodFilter: 'Filter by period', details: 'Record details', close: 'Close',
    recordTitle: 'Record title', place: 'Place', notes: 'The waste condition and type are recorded from the photo and location.',
    newRecord: 'New waste record', selectType: 'Select type', type: 'Type', capturedAt: 'Captured at', photo: 'Photo',
    locationHint: 'For an accurate location, take the photo with your device’s camera app first, then use the 🖼️ button on the map (choose from album) to pick that photo.',
    saveTo: 'Save to', driveFolder: 'Google Drive CleanLog folder', saveDrive: 'Save to Drive',
    selectPeriod: 'Select period', startDate: 'Start date', endDate: 'End date', showPeriod: 'Show this period',
    language: '言語/Language', newType: 'New type', color: 'Color', addType: 'Add type', exampleType: 'e.g. Cardboard',
    installTitle: 'How to install on your device', installDescription: 'Scan the QR code below with your smartphone to open CleanLog.',
    android: 'Android', androidGuide: 'Open this page in Chrome, then choose “Add to Home screen” or “Install app” from the menu.',
    ios: 'iPhone / iPad', iosGuide: 'Open this page in Safari, tap the Share button, then choose “Add to Home Screen”.', qrAlt: 'QR code for this app',
    previousMonth: 'Previous month', nextMonth: 'Next month', update: 'Update', delete: 'Delete', edit: 'Edit', cancel: 'Cancel', useCurrentLocation: 'Record current location',
    detailButton: 'View record details',
    loginAlert: 'You are now signed in with Google. Photos and data will be saved to the CleanLog folder.',
    savedAlert: 'The photo and data were saved to the CleanLog folder in Google Drive.',
    privacyPolicy: 'Privacy policy',
    account: 'Account', switchAccount: 'Switch account', signOut: 'Sign out',
    connecting: 'Connecting…',
    clientIdMissingAlert: 'The Google Drive client ID is not configured. Please set driveConfig.clientId in app.js.',
    loginFailedAlert: 'Failed to sign in with Google. Please try again.',
    signInFirstAlert: 'Please sign in with Google first.',
    signInBeforeCaptureAlert: 'Please sign in with Google before taking a record. We’ll open the sign-in screen now — press the button again once you’re signed in.',
    saveFailedAlert: 'Failed to save to Google Drive. Please try again.',
    savingToDrive: 'Saving…',
    updateFailedAlert: 'Failed to sync the update to Google Drive.',
    deleteFailedAlert: 'Failed to remove the file from Google Drive.',
    themeTitle: 'Appearance', themeAuto: 'Auto (follow device)', themeLight: 'Light', themeDark: 'Dark',
    exportTitle: 'Export data',
    exportHelp: 'Bundles your records as an Excel file, photos and data (JSON). Save it to a new folder inside the CleanLog folder in Google Drive, or download it to this device as a ZIP.',
    exportDrive: 'Save to Google Drive', exportDevice: 'Download to this device (ZIP)', exportBusy: 'Exporting…',
    exportNeedLogin: 'Log in with Google to use this (the "Log in" button at the top right).', exportNoRecords: 'There are no records to export yet.',
    exportDone: 'Saved: ', exportOpen: 'Open in Google Drive',
    exportFailed: 'Export failed. Check your connection and login status, then try again.',
    devicesTitle: 'Registered devices (max {max})',
    devicesHelp: 'Devices using this shared account. Remove devices that are no longer used so new ones can register (records they saved are kept).',
    devicesLoad: 'Show list', devicesLoading: 'Loading…', devicesCount: '{n} / {max} devices',
    devicesThis: 'This device', devicesOver: 'Over limit', devicesRegistered: 'Registered {time}', devicesRemove: 'Remove',
    devicesConfirmRemove: 'Remove "{name}"? (If a slot is free, that device registers again the next time it logs in.)',
    devicesNeedLogin: 'Log in to see the list.', devicesFailed: 'Could not load. Check your connection.',
    deviceLimitAlert: 'This shared account has reached its limit of {max} devices, so this device cannot show or save records. Remove an unused device in Settings → Registered devices.',
    deviceLimitNote: 'The limit of {max} devices has been reached, so this device cannot show or save records. Remove an unused device from the list below.',
    accountShared: 'Records from every device logged in to this account (up to {max}) are combined in this folder.',
    helpTitle: 'How to use (Help)', helpSubtitle: 'Recording, the map, export and device management',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
};

function t(key) {
  return translations[currentLanguage][key];
}

function getCategoryLabel(category) {
  return currentLanguage === 'en' ? (category.labelEn || category.label) : category.label;
}

function buildPlaceholderImage(color, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">`
    + `<rect width="240" height="240" fill="${color}"/>`
    + `<text x="120" y="146" font-family="sans-serif" font-size="104" fill="#fff8f1" text-anchor="middle">${label}</text>`
    + `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function getRecordImageSrc(record) {
  if (record.image) return record.image;
  const category = categoryMap[record.category] || categoryMap.unclassified;
  return buildPlaceholderImage(category.color, getCategoryLabel(category).slice(0, 1));
}

function getRecordPlaceText(record) {
  // Show the actual coordinates whenever they're available, rather than a
  // generic label like "撮影地点" - the numbers are more informative, and
  // this also heals older records whose saved place text was a stale
  // "no location" placeholder despite having real coordinates (e.g. from
  // the old fallback to the map's pan position).
  if (hasValidCoordinates(record)) {
    return `${record.lat.toFixed(5)}, ${record.lng.toFixed(5)}`;
  }
  return record.place;
}

function updateInstallGuide() {
  const accessUrl = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://192.168.1.150:8000/'
    : window.location.href.split('#')[0];
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(accessUrl)}`;
  document.querySelector('#installQrCode').src = qrCodeUrl;
  document.querySelector('#installUrl').textContent = accessUrl;
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.querySelector('.topbar .eyebrow').textContent = t('appTagline');
  document.querySelector('.settings-card .eyebrow').textContent = 'CleanLog';
  document.querySelector('.summary-button .label').textContent = t('recordPeriod');
  document.querySelector('.summary-item.accent .label').textContent = t('periodCount');
  document.querySelectorAll('.summary-item .label')[2].textContent = t('density');
  document.querySelector('.map-panel #map').setAttribute('aria-label', t('map'));
  addRecordButton.setAttribute('aria-label', t('addRecord'));
  addRecordLabel.textContent = t('capture');
  locateButton.setAttribute('aria-label', currentLanguage === 'ja' ? '現在地を表示' : 'Show current location');
  locateButton.title = currentLanguage === 'ja' ? '現在地を表示' : 'Show current location';
  albumButton.setAttribute('aria-label', currentLanguage === 'ja' ? 'アルバムから写真を選択' : 'Choose a photo from album');
  albumButton.title = currentLanguage === 'ja' ? 'アルバムから写真を選択' : 'Choose a photo from album';
  settingsButton.setAttribute('aria-label', t('settings') + 'を開く');
  settingsButton.title = t('settings');
  dateRangeButton.setAttribute('aria-label', t('selectPeriod'));
  googleLoginText.textContent = isGoogleLoggedIn ? t('connected') : t('login');
  googleLoginText.classList.toggle('connected', isGoogleLoggedIn);
  document.querySelector('#accountModalTitle').textContent = t('account');
  closeAccountModal.setAttribute('aria-label', t('close'));
  switchAccountButton.textContent = t('switchAccount');
  signOutButton.textContent = t('signOut');
  document.querySelector('.list-panel h2').textContent = t('recent');
  document.querySelector('.list-panel .text-button').textContent = t('periodFilter');
  document.querySelector('#detailSheet').setAttribute('aria-label', t('details'));
  closeDetailButton.setAttribute('aria-label', t('close'));
  editDetailButton.textContent = t('edit');
  deleteDetailButton.textContent = t('delete');
  document.querySelector('#detailCategoryLabel').textContent = t('type');
  document.querySelector('#detailDateTimeLabel').textContent = t('capturedAt');
  updateDetailButton.textContent = t('update');
  cancelDetailEditButton.textContent = t('cancel');
  useCurrentLocationForDetailButton.textContent = t('useCurrentLocation');
  updateDetailCategoryOptions();
  document.querySelector('#recordModalTitle').textContent = t('newRecord');
  closeRecordModal.setAttribute('aria-label', t('close'));
  const recordFields = recordForm.querySelectorAll('.field > span');
  [t('photo'), t('type'), t('capturedAt'), t('saveTo')].forEach((label, index) => {
    if (recordFields[index]) recordFields[index].textContent = label;
  });
  document.querySelector('.drive-pill').textContent = t('driveFolder');
  document.querySelector('#saveRecordButton').textContent = t('saveDrive');
  photoPreview.alt = currentLanguage === 'ja' ? '撮影した写真のサムネイル' : 'Captured photo thumbnail';
  useCurrentLocationForRecordButton.textContent = t('useCurrentLocation');
  locationHintText.textContent = t('locationHint');
  document.querySelector('#dateRangeTitle').textContent = t('selectPeriod');
  closeDateRangeModal.setAttribute('aria-label', t('close'));
  const dateFields = dateRangeForm.querySelectorAll('.field > span');
  dateFields[0].textContent = t('startDate');
  dateFields[1].textContent = t('endDate');
  startDateInput.setAttribute('aria-label', t('startDate'));
  endDateInput.setAttribute('aria-label', t('endDate'));
  document.querySelector('#dateRangeForm .primary-button').textContent = t('showPeriod');
  document.querySelector('#settingsTitle').textContent = t('settings');
  closeSettingsModal.setAttribute('aria-label', t('close'));
  document.querySelector('#categorySettingsTitle').textContent = t('categories');
  document.querySelector('#languageSettingsTitle').textContent = t('language');
  document.querySelector('#languageSelect').setAttribute('aria-label', t('language'));
  document.querySelector('#themeSettingsTitle').textContent = t('themeTitle');
  themeSelect.setAttribute('aria-label', t('themeTitle'));
  themeSelect.options[0].textContent = t('themeAuto');
  themeSelect.options[1].textContent = t('themeLight');
  themeSelect.options[2].textContent = t('themeDark');
  document.querySelector('#exportSettingsTitle').textContent = t('exportTitle');
  document.querySelector('#exportHelp').textContent = t('exportHelp');
  exportDeviceButton.textContent = t('exportDevice');
  updateExportControls();
  document.querySelector('#devicesSettingsTitle').textContent = fillIn(t('devicesTitle'), { max: window.LogDevices.MAX_DEVICES });
  document.querySelector('#devicesHelp').textContent = t('devicesHelp');
  document.querySelector('#accountSharedNote').textContent = fillIn(t('accountShared'), { max: window.LogDevices.MAX_DEVICES });
  document.querySelector('#helpCard').href = `help.html?lang=${currentLanguage}`;
  document.querySelector('#helpCardTitle').textContent = t('helpTitle');
  document.querySelector('#helpCardSub').textContent = t('helpSubtitle');
  updateDeviceControls();
  document.querySelector('#installSettingsTitle').textContent = t('installTitle');
  document.querySelector('#installDescription').textContent = t('installDescription');
  document.querySelector('#installQrCode').alt = t('qrAlt');
  document.querySelector('#androidInstallTitle').textContent = t('android');
  document.querySelector('#androidInstallText').textContent = t('androidGuide');
  document.querySelector('#iosInstallTitle').textContent = t('ios');
  document.querySelector('#iosInstallText').textContent = t('iosGuide');
  document.querySelector('#privacyPolicyLink').textContent = t('privacyPolicy');
  updateInstallGuide();
  const categoryFields = categoryForm.querySelectorAll('.field > span, .color-field > span');
  categoryFields[0].textContent = t('newType');
  categoryFields[1].textContent = t('color');
  categoryNameInput.placeholder = t('exampleType');
  categoryForm.querySelector('.primary-button').textContent = t('addType');
  updateRecordCategoryOptions();
  renderSettingsCategories();
  renderRecords();
  renderDateRangeSummary();
}

function parseDate(dateValue) {
  return new Date(dateValue.replace(/\//g, '-'));
}

function formatShortDate(dateString) {
  if (!dateString) return '';
  const value = dateString.includes('/') ? dateString : dateString.replace(/-/g, '/');
  const [, month, day] = value.split('/').map(Number);
  if (!month || !day) return value;
  return `${month}/${day}`;
}

function padDatePart(value) {
  return String(value).padStart(2, '0');
}

function normalizeDateInputValue(value) {
  return value ? value.replace(/-/g, '/') : '';
}

function getDateParts(value) {
  const [year, month, day] = normalizeDateInputValue(value).split('/').map(Number);
  return { year, month: month || 1, day: day || 1 };
}

const calendarState = {
  start: { year: 2026, month: 9 },
  end: { year: 2026, month: 9 },
};

function renderCalendar(type) {
  const calendar = type === 'start' ? startCalendar : endCalendar;
  const input = type === 'start' ? startDateInput : endDateInput;
  const state = calendarState[type];
  const firstDay = new Date(state.year, state.month - 1, 1);
  const daysInMonth = new Date(state.year, state.month, 0).getDate();
  const selectedValue = normalizeDateInputValue(input.value);
  const weekdays = t('weekdays');
  const cells = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    cells.push('<span></span>');
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const value = `${state.year}/${padDatePart(state.month)}/${padDatePart(day)}`;
    const selectedClass = value === selectedValue ? ' selected' : '';
    cells.push(`<button type="button" class="calendar-day${selectedClass}" data-calendar-date="${value}">${day}</button>`);
  }

  calendar.innerHTML = `
    <div class="calendar-header">
      <button type="button" class="calendar-nav" data-calendar-direction="-1" aria-label="${t('previousMonth')}">‹</button>
      <span class="calendar-title">${currentLanguage === 'ja' ? `${state.year}年${state.month}月` : `${state.year}/${state.month}`}</span>
      <button type="button" class="calendar-nav" data-calendar-direction="1" aria-label="${t('nextMonth')}">›</button>
    </div>
    <div class="calendar-weekdays">${weekdays.map((day) => `<span>${day}</span>`).join('')}</div>
    <div class="calendar-grid">${cells.join('')}</div>
  `;

  calendar.querySelector('[data-calendar-direction="-1"]').addEventListener('click', () => {
    state.month -= 1;
    if (state.month === 0) {
      state.month = 12;
      state.year -= 1;
    }
    renderCalendar(type);
  });

  calendar.querySelector('[data-calendar-direction="1"]').addEventListener('click', () => {
    state.month += 1;
    if (state.month === 13) {
      state.month = 1;
      state.year += 1;
    }
    renderCalendar(type);
  });

  calendar.querySelectorAll('[data-calendar-date]').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.dataset.calendarDate;
      calendar.classList.add('hidden');
      renderCalendar(type);
    });
  });
}

function openCalendar(type) {
  const input = type === 'start' ? startDateInput : endDateInput;
  const calendar = type === 'start' ? startCalendar : endCalendar;
  const parts = getDateParts(input.value || dateRange.start || getLatestDate());
  calendarState[type] = { year: parts.year, month: parts.month };
  startCalendar.classList.add('hidden');
  endCalendar.classList.add('hidden');
  calendar.classList.remove('hidden');
  renderCalendar(type);
}

startDateInput.addEventListener('click', () => openCalendar('start'));
endDateInput.addEventListener('click', () => openCalendar('end'));

function formatRangeLabel(startDate, endDate) {
  if (!startDate && !endDate) return '9/12';
  if (!startDate) return formatShortDate(endDate);
  if (!endDate) return formatShortDate(startDate);
  if (startDate === endDate) return formatShortDate(startDate);
  return `${formatShortDate(startDate)}-${formatShortDate(endDate)}`;
}

function getLatestDate() {
  const dates = records.map((record) => record.date).filter(Boolean).sort((a, b) => parseDate(b) - parseDate(a));
  return dates[0] || getTodayDateString();
}

function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}/${padDatePart(now.getMonth() + 1)}/${padDatePart(now.getDate())}`;
}

function setDefaultDateRange() {
  const today = getTodayDateString();
  dateRange.start = today;
  dateRange.end = today;
  dateRangeValue.textContent = formatRangeLabel(dateRange.start, dateRange.end);
}

function openDateRangeModal() {
  startDateInput.value = normalizeDateInputValue(dateRange.start);
  endDateInput.value = normalizeDateInputValue(dateRange.end);
  dateRangeModal.classList.remove('hidden');
}

function closeDateRangeModalView() {
  dateRangeModal.classList.add('hidden');
}

function getRecordsInRange() {
  if (!dateRange.start && !dateRange.end) {
    return records;
  }

  const startMs = dateRange.start ? parseDate(dateRange.start).getTime() : Number.NEGATIVE_INFINITY;
  const endMs = dateRange.end ? parseDate(dateRange.end).getTime() : Number.POSITIVE_INFINITY;

  return records.filter((record) => {
    if (!record.date) return false;
    const recordMs = parseDate(record.date).getTime();
    return recordMs >= startMs && recordMs <= endMs;
  });
}

function hasValidCoordinates(record) {
  return Number.isFinite(record.lat) && Number.isFinite(record.lng);
}

function getMapVisibleRecords() {
  const recordsWithLocation = getRecordsInRange()
    .filter((record) => activeCategoryKeys.includes(record.category))
    .filter(hasValidCoordinates);

  if (!window.map || typeof window.map.getBounds !== 'function') {
    return recordsWithLocation;
  }

  const bounds = window.map.getBounds();
  return recordsWithLocation.filter((record) => bounds.contains([record.lat, record.lng]));
}

function getMapAreaKm2() {
  if (!window.map || typeof window.map.getBounds !== 'function') {
    return 1;
  }

  const bounds = window.map.getBounds();
  const latDiff = Math.abs(bounds.getNorthEast().lat - bounds.getSouthWest().lat);
  const lngDiff = Math.abs(bounds.getNorthEast().lng - bounds.getSouthWest().lng);
  const centerLat = (bounds.getNorthEast().lat + bounds.getSouthWest().lat) / 2;
  const latKm = latDiff * 111.32;
  const lngKm = lngDiff * 111.32 * Math.cos((centerLat * Math.PI) / 180);
  const areaKm2 = Math.max(latKm * lngKm, 0.0001);
  return areaKm2;
}

function renderDateRangeSummary() {
  dateRangeValue.textContent = formatRangeLabel(dateRange.start, dateRange.end);
  const visibleRecords = getMapVisibleRecords();
  rangeCountValue.textContent = String(visibleRecords.length);

  const density = visibleRecords.length === 0 ? 0 : visibleRecords.length / getMapAreaKm2();
  densityValue.textContent = density.toFixed(1);
}

function handleDateRangeSubmit(event) {
  event.preventDefault();
  let start = normalizeDateInputValue(startDateInput.value || dateRange.start);
  let end = normalizeDateInputValue(endDateInput.value || dateRange.end);

  if (start && end && parseDate(start) > parseDate(end)) {
    [start, end] = [end, start];
    startDateInput.value = start;
    endDateInput.value = end;
  }

  dateRange.start = start;
  dateRange.end = end;
  renderDateRangeSummary();
  renderRecords();
  renderMarkers(activeCategoryKeys);
  closeDateRangeModalView();
}

function toDateTimeLocalValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return toDateTimeLocalValue(new Date());
  }
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function parseExifDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value !== 'string') return null;

  const normalized = value.trim().replace(/^([0-9]{4}):([0-9]{2}):([0-9]{2})/, '$1-$2-$3');
  const parsed = new Date(normalized.replace(' ', 'T'));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function gpsCoordinateToDecimal(value, reference) {
  if (typeof value === 'number') return value;
  if (!Array.isArray(value) || value.length < 3) return null;

  const parts = value.map((part) => {
    if (typeof part === 'number') return part;
    if (part && typeof part === 'object' && typeof part.numerator === 'number') {
      return part.denominator ? part.numerator / part.denominator : part.numerator;
    }
    return Number(part);
  });
  if (parts.some((part) => !Number.isFinite(part))) return null;

  const decimal = parts[0] + parts[1] / 60 + parts[2] / 3600;
  return ['S', 'W'].includes(String(reference).toUpperCase()) ? -decimal : decimal;
}

function classifyPhoto(file) {
  const fileName = file.name.toLowerCase();
  const matches = [
    { keys: ['cigarette', 'tobacco', 'タバコ', '吸い殻'], category: 'tobacco' },
    { keys: ['can', 'bottle', '缶', '瓶'], category: 'can' },
    { keys: ['food', 'waste', '生ごみ'], category: 'foodWaste' },
    { keys: ['toy', 'おもちゃ'], category: 'toy' },
    { keys: ['firework', '花火'], category: 'fireworks' },
    { keys: ['crumb', 'food-scrap', '食べかす'], category: 'crumbs' },
    { keys: ['candy', 'gum', '飴', 'ガム'], category: 'candy' },
  ];
  const match = matches.find(({ keys }) => keys.some((key) => fileName.includes(key)));
  return match ? match.category : '';
}

async function readPhotoMetadata(file) {
  if (!window.exifr || typeof window.exifr.parse !== 'function') return {};

  try {
    return await window.exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      translateValues: true,
    }) || {};
  } catch {
    return {};
  }
}

function getPhotoExifLocation(metadata) {
  const latitude = metadata.latitude ?? gpsCoordinateToDecimal(metadata.GPSLatitude, metadata.GPSLatitudeRef);
  const longitude = metadata.longitude ?? gpsCoordinateToDecimal(metadata.GPSLongitude, metadata.GPSLongitudeRef);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return {
    lat: latitude,
    lng: longitude,
    place: currentLanguage === 'ja' ? '撮影地点(写真情報)' : 'Photo location (from photo)',
  };
}

async function handlePhotoFile(file) {
  if (!file) return;

  selectedPhotoFile = file;
  selectedPhotoLocation = null;
  photoPreview.src = URL.createObjectURL(file);
  photoPreview.classList.remove('hidden');
  recordCategoryInput.value = classifyPhoto(file);

  const metadata = await readPhotoMetadata(file);
  const capturedDate = parseExifDate(metadata.DateTimeOriginal || metadata.CreateDate || metadata.ModifyDate);
  recordDateTimeInput.value = toDateTimeLocalValue(capturedDate || new Date(file.lastModified || Date.now()));

  // Location, in order of how well each source matches where the photo was
  // actually taken:
  //
  // 1. The photo's own GPS EXIF. Read for every photo now, including camera
  //    captures - some devices do geotag them, and when they do it is the
  //    only source tied to the photo itself rather than to "wherever the
  //    phone is at this moment".
  // 2. For a camera capture with no EXIF GPS (the common case: the in-browser
  //    camera hands back a bare image), the device's current position, taken
  //    right now while the phone is still at the spot. Uses the fix the map
  //    already got on launch if it is fresh, otherwise a live request with
  //    relaxed settings - a network-based or recently cached position is
  //    accepted, because the strict GPS-only request was what kept failing in
  //    the moment right after the camera handed control back.
  //    An album photo deliberately skips this: it may have been taken
  //    somewhere else entirely, so guessing "here, now" would be wrong.
  // 3. Failing both, the manual button, which stays visible so the location
  //    can be added (or corrected) by hand. Save time retries once more.
  selectedPhotoLocation = getPhotoExifLocation(metadata);

  if (!selectedPhotoLocation && selectedPhotoSource === 'camera') {
    locationStatusText.classList.remove('hidden', 'error', 'approximate');
    locationStatusText.textContent = currentLanguage === 'ja' ? '現在地を取得中…' : 'Getting current location…';

    if (initialLocationPromise) {
      await initialLocationPromise;
    }
    selectedPhotoLocation = getApproximateFallbackLocation(2 * 60 * 1000) || await requestPhotoLocation();
  }

  useCurrentLocationForRecordButton.classList.remove('hidden');
  updateLocationStatus();
}

async function handleUseCurrentLocationForRecord() {
  useCurrentLocationForRecordButton.disabled = true;
  locationStatusText.classList.remove('hidden', 'error', 'approximate');
  locationStatusText.textContent = currentLanguage === 'ja' ? '現在地を取得中…' : 'Getting current location…';

  const location = await requestPhotoLocation();

  useCurrentLocationForRecordButton.disabled = false;

  if (location) {
    selectedPhotoLocation = location;
  }
  updateLocationStatus();
}

function updateLocationStatus() {
  locationStatusText.classList.remove('hidden', 'error', 'approximate');

  if (selectedPhotoLocation) {
    const coords = `${selectedPhotoLocation.lat.toFixed(5)}, ${selectedPhotoLocation.lng.toFixed(5)}`;
    if (selectedPhotoLocation.approximate) {
      locationStatusText.classList.add('approximate');
      locationStatusText.textContent = currentLanguage === 'ja'
        ? `位置情報(推定・直近の位置を使用): ${coords}`
        : `Location (approx., from your last known position): ${coords}`;
    } else {
      locationStatusText.textContent = currentLanguage === 'ja' ? `位置情報: ${coords}` : `Location: ${coords}`;
    }
    return;
  }

  locationStatusText.classList.add('error');
  locationStatusText.textContent = lastGeolocationErrorMessage
    || (currentLanguage === 'ja'
      ? '位置情報がありません。「現在位置を記録」ボタンで追加できます。'
      : 'No location yet. Use the “Record current location” button to add one.');
}

function handlePhotoSelected() {
  const file = photoInput.files && photoInput.files[0];
  handlePhotoFile(file);
}

function handleAlbumSelected() {
  const file = albumInput.files && albumInput.files[0];
  if (file) {
    recordModal.classList.remove('hidden');
    handlePhotoFile(file);
  }
}

async function openRecordModal(source = 'camera') {
  await driveSessionReadyPromise;

  if (!isGoogleLoggedIn) {
    if (!isDriveConfigured()) {
      window.alert(t('clientIdMissingAlert'));
      return;
    }
    window.alert(t('signInBeforeCaptureAlert'));
    handleGoogleLogin();
    return;
  }

  if (isDeviceLimited) {
    window.alert(fillIn(t('deviceLimitAlert'), { max: window.LogDevices.MAX_DEVICES }));
    return;
  }

  recordModal.classList.remove('hidden');
  recordForm.reset();
  photoPreview.removeAttribute('src');
  photoPreview.classList.add('hidden');
  locationStatusText.classList.add('hidden');
  locationStatusText.textContent = '';
  // Show this immediately for a camera capture rather than waiting for
  // handlePhotoFile() to finish processing the photo - it doesn't depend on
  // the photo at all, and this way it's available even if that processing
  // is slow or something about it doesn't go as expected on a given phone.
  useCurrentLocationForRecordButton.classList.toggle('hidden', source !== 'camera');
  selectedPhotoFile = null;
  selectedPhotoLocation = null;
  selectedPhotoSource = source;
  recordCategoryInput.value = '';
  if (source === 'album') {
    albumInput.value = '';
    albumInput.click();
  } else {
    photoInput.value = '';
    photoInput.click();
  }
}

function closeRecordModalView() {
  recordModal.classList.add('hidden');
}

/** ログイン中で、オンラインの間だけ、ログインボタンの縁を緑にして点滅させる */
function updateLiveIndicator() {
  googleLoginButton.classList.toggle('google-button-live', isGoogleLoggedIn && navigator.onLine !== false);
}

window.addEventListener('online', updateLiveIndicator);
window.addEventListener('offline', updateLiveIndicator);

function updateLoginState() {
  googleLoginText.textContent = isGoogleLoggedIn ? t('connected') : t('login');
  googleLoginText.classList.toggle('connected', isGoogleLoggedIn);
  googleLoginButton.style.opacity = isGoogleLoggedIn ? '1' : '0.96';
  updateLiveIndicator();

  if (isGoogleLoggedIn && driveUserAvatarUrl) {
    googleMark.style.backgroundImage = `url(${driveUserAvatarUrl})`;
    googleMark.style.backgroundSize = 'cover';
    googleMark.style.backgroundPosition = 'center';
    googleMarkInner.style.display = 'none';
  } else {
    googleMark.style.backgroundImage = '';
    googleMarkInner.style.display = '';
  }
}

async function fetchDriveUserAvatar() {
  try {
    const response = await driveFetch('https://www.googleapis.com/oauth2/v2/userinfo');
    const data = await response.json();
    driveUserAvatarUrl = data.picture || null;
    driveUserEmail = data.email || null;
  } catch {
    driveUserAvatarUrl = null;
    driveUserEmail = null;
  }
}

function isDriveConfigured() {
  return Boolean(driveConfig.clientId) && driveConfig.clientId.trim() !== 'YOUR_GOOGLE_CLIENT_ID';
}

const DRIVE_TOKEN_KEY = 'cleanlog-drive-token';

function storeDriveAccessToken(accessToken, expiresInSeconds) {
  const expiresInMs = Number(expiresInSeconds) > 0 ? Number(expiresInSeconds) * 1000 : 55 * 60 * 1000;
  try {
    localStorage.setItem(DRIVE_TOKEN_KEY, JSON.stringify({
      accessToken,
      expiresAt: Date.now() + expiresInMs,
    }));
  } catch {
    // Ignore storage failures (e.g. private browsing quota); the token still works in memory.
  }
}

function getStoredDriveAccessToken() {
  try {
    const raw = localStorage.getItem(DRIVE_TOKEN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.accessToken || !Number.isFinite(parsed.expiresAt)) return null;
    if (parsed.expiresAt <= Date.now() + 30000) return null;
    return parsed.accessToken;
  } catch {
    return null;
  }
}

function clearStoredDriveAccessToken() {
  localStorage.removeItem(DRIVE_TOKEN_KEY);
}

function getDriveAccessToken(interactive = true, promptOverride = null) {
  return new Promise((resolve, reject) => {
    if (!window.google || !google.accounts || !google.accounts.oauth2) {
      reject(new Error('google-identity-not-loaded'));
      return;
    }

    if (!driveTokenClient) {
      driveTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: driveConfig.clientId,
        scope: driveConfig.scope,
        callback: () => {},
      });
    }

    driveTokenClient.callback = (response) => {
      if (response.error) {
        reject(response);
        return;
      }
      driveAccessToken = response.access_token;
      storeDriveAccessToken(driveAccessToken, response.expires_in);
      resolve(driveAccessToken);
    };

    driveTokenClient.requestAccessToken({
      prompt: promptOverride ?? (interactive && !driveAccessToken ? 'consent' : ''),
    });
  });
}

async function driveFetch(path, options = {}, allowRetry = true) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${driveAccessToken}`,
    },
  });

  if (response.status === 401 && allowRetry) {
    await getDriveAccessToken(false);
    return driveFetch(path, options, false);
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Drive API error ${response.status}: ${errorBody}`);
  }

  return response;
}

async function ensureDriveFolder() {
  const query = encodeURIComponent(
    `name='${driveConfig.folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
  );
  const listResponse = await driveFetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&spaces=drive`,
  );
  const listData = await listResponse.json();
  if (listData.files && listData.files.length > 0) {
    return listData.files[0].id;
  }

  const createResponse = await driveFetch('https://www.googleapis.com/drive/v3/files?fields=id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: driveConfig.folderName, mimeType: 'application/vnd.google-apps.folder' }),
  });
  const createData = await createResponse.json();
  return createData.id;
}

async function uploadFileToDrive(blob, name, mimeType, parentId) {
  const metadata = { name, parents: [parentId] };
  const boundary = `cleanlog-${Date.now()}`;
  const metadataPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;
  const contentBuffer = await blob.arrayBuffer();

  const body = new Blob([
    metadataPart,
    `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`,
    contentBuffer,
    closeDelimiter,
  ]);

  const response = await driveFetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method: 'POST',
      headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
      body,
    },
  );
  const data = await response.json();
  return data.id;
}

async function updateDriveFileContent(fileId, blob, mimeType) {
  await driveFetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
    method: 'PATCH',
    headers: { 'Content-Type': mimeType },
    body: blob,
  });
}

async function trashDriveFile(fileId) {
  if (!fileId) return;
  await driveFetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trashed: true }),
  });
}

async function hydrateRecordImage(record) {
  if (!record.photoFileId) return;

  if (driveImageUrlCache.has(record.photoFileId)) {
    record.image = driveImageUrlCache.get(record.photoFileId);
    return;
  }

  try {
    const response = await driveFetch(`https://www.googleapis.com/drive/v3/files/${record.photoFileId}?alt=media`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    driveImageUrlCache.set(record.photoFileId, url);
    record.image = url;
  } catch {
    // Keep whatever placeholder image the record already had.
  }
}

async function loadRecordsFromDrive() {
  const query = encodeURIComponent(`'${driveFolderId}' in parents and mimeType='application/json' and trashed=false`);
  const listResponse = await driveFetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&orderBy=name desc&spaces=drive`,
  );
  const listData = await listResponse.json();
  // 端末の登録ファイル（device-*.json）は記録ではないので、読み込まない
  const files = (listData.files || []).filter((file) => !window.LogDevices.DEVICE_FILE_RE.test(file.name));

  const loadedRecords = await Promise.all(
    files.map(async (file) => {
      const contentResponse = await driveFetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`);
      const data = await contentResponse.json();
      return { ...data, dataFileId: file.id };
    }),
  );

  loadedRecords.sort((a, b) => parseDate(b.date) - parseDate(a.date));
  records.length = 0;
  records.push(...loadedRecords);

  await Promise.all(records.map(hydrateRecordImage));

  setDefaultDateRange();
  renderRecords();
  renderMarkers(activeCategoryKeys);
  renderDateRangeSummary();
}

const DRIVE_SESSION_KEY = 'cleanlog-drive-connected';

async function connectToDrive(promptOverride = null) {
  if (!isDriveConfigured()) {
    window.alert(t('clientIdMissingAlert'));
    return false;
  }

  googleLoginText.textContent = t('connecting');
  googleLoginText.classList.remove('connected');
  googleLoginButton.classList.remove('google-button-live');

  try {
    await getDriveAccessToken(true, promptOverride);
    driveFolderId = await ensureDriveFolder();
    isGoogleLoggedIn = true;
    localStorage.setItem(DRIVE_SESSION_KEY, '1');
    await fetchDriveUserAvatar();
    updateLoginState();
    await registerDeviceAndLoad();
    return true;
  } catch {
    isGoogleLoggedIn = false;
    localStorage.removeItem(DRIVE_SESSION_KEY);
    clearStoredDriveAccessToken();
    updateLoginState();
    window.alert(t('loginFailedAlert'));
    return false;
  }
}

async function handleGoogleLogin() {
  if (isGoogleLoggedIn) {
    openAccountModal();
    return;
  }

  if (await connectToDrive()) {
    window.alert(t('loginAlert'));
  }
}

async function signOutOfDrive() {
  const tokenToRevoke = driveAccessToken;

  isGoogleLoggedIn = false;
  driveAccessToken = null;
  driveFolderId = null;
  driveUserAvatarUrl = null;
  driveUserEmail = null;
  isDeviceLimited = false;
  devicesLoaded = false;
  driveImageUrlCache.clear();
  localStorage.removeItem(DRIVE_SESSION_KEY);
  clearStoredDriveAccessToken();
  updateLoginState();

  records.length = 0;
  setDefaultDateRange();
  renderRecords();
  renderMarkers(activeCategoryKeys);
  renderDateRangeSummary();

  if (tokenToRevoke && window.google?.accounts?.oauth2?.revoke) {
    google.accounts.oauth2.revoke(tokenToRevoke, () => {});
  }
}

async function handleSignOut() {
  closeAccountModalView();
  await signOutOfDrive();
}

async function handleSwitchAccount() {
  closeAccountModalView();
  await signOutOfDrive();
  if (await connectToDrive('select_account')) {
    window.alert(t('loginAlert'));
  }
}

function openAccountModal() {
  accountModalEmail.textContent = driveUserEmail || '';
  accountModal.classList.remove('hidden');
}

function closeAccountModalView() {
  accountModal.classList.add('hidden');
}

async function restoreDriveSession() {
  if (!isDriveConfigured() || localStorage.getItem(DRIVE_SESSION_KEY) !== '1') return;

  try {
    // Reuse a still-valid token from a previous page load first; it works even
    // when the browser blocks the third-party cookies that silent GIS reauth
    // (prompt: '') needs, which made reloads log the user back out.
    driveAccessToken = getStoredDriveAccessToken();
    if (!driveAccessToken) {
      await getDriveAccessToken(false);
    }
    driveFolderId = await ensureDriveFolder();
    isGoogleLoggedIn = true;
    await fetchDriveUserAvatar();
    updateLoginState();
    await registerDeviceAndLoad();
  } catch {
    isGoogleLoggedIn = false;
    driveAccessToken = null;
    localStorage.removeItem(DRIVE_SESSION_KEY);
    clearStoredDriveAccessToken();
    updateLoginState();
  }
}

async function saveRecordToDrive(event) {
  event.preventDefault();

  if (!isGoogleLoggedIn) {
    window.alert(t('signInFirstAlert'));
    return;
  }

  if (isDeviceLimited) {
    window.alert(fillIn(t('deviceLimitAlert'), { max: window.LogDevices.MAX_DEVICES }));
    return;
  }

  const file = selectedPhotoFile;
  const category = recordCategoryInput.value || 'unclassified';
  const categoryInfo = categoryMap[category] || categoryMap.unclassified;
  const title = getCategoryLabel(categoryInfo);
  const dateTimeValue = recordDateTimeInput.value || toDateTimeLocalValue(new Date());
  const [datePart, timePart] = dateTimeValue.split('T');
  const id = Date.now();

  saveRecordButton.disabled = true;
  saveRecordButton.textContent = t('savingToDrive');

  if (selectedPhotoSource === 'camera' && !selectedPhotoLocation) {
    // The page has been stable (showing the category/date fields) for a
    // while by now, rather than having just regained focus from the camera
    // app, so a live request here is far more likely to actually succeed.
    if (initialLocationPromise) {
      await initialLocationPromise;
    }
    selectedPhotoLocation = await requestPhotoLocation() || getApproximateFallbackLocation();
    updateLocationStatus();
  }

  try {
    const photoFileName = `CleanLog-${id}.jpg`;
    const photoFileId = file
      ? await uploadFileToDrive(file, photoFileName, file.type || 'image/jpeg', driveFolderId)
      : null;

    const payload = {
      id,
      title,
      category,
      date: datePart,
      time: timePart || '12:00',
      place: selectedPhotoLocation?.place || (currentLanguage === 'ja' ? '写真から位置情報なし' : 'No location in photo'),
      lat: Number.isFinite(selectedPhotoLocation?.lat) ? selectedPhotoLocation.lat : null,
      lng: Number.isFinite(selectedPhotoLocation?.lng) ? selectedPhotoLocation.lng : null,
      photoFileId,
      photoFileName,
    };

    const dataFileName = `CleanLog-${id}.json`;
    const dataFileId = await uploadFileToDrive(
      new Blob([JSON.stringify(payload)], { type: 'application/json' }),
      dataFileName,
      'application/json',
      driveFolderId,
    );

    const record = {
      ...payload,
      dataFileId,
      dataFileName,
      image: file ? URL.createObjectURL(file) : '',
    };
    if (photoFileId && record.image) {
      driveImageUrlCache.set(photoFileId, record.image);
    }

    records.unshift(record);
    renderRecords();
    renderMarkers();
    closeRecordModalView();
    openDetail(record);
    window.alert(`${t('savedAlert')}\n${dataFileName}`);
  } catch {
    window.alert(t('saveFailedAlert'));
  } finally {
    saveRecordButton.disabled = false;
    saveRecordButton.textContent = t('saveDrive');
  }
}

addRecordButton.addEventListener('click', openRecordModal);
albumButton.addEventListener('click', () => openRecordModal('album'));
locateButton.addEventListener('click', centerOnCurrentLocation);
closeRecordModal.addEventListener('click', closeRecordModalView);
recordModal.addEventListener('click', (event) => {
  if (event.target === recordModal) {
    closeRecordModalView();
  }
});
recordForm.addEventListener('submit', saveRecordToDrive);
photoInput.addEventListener('change', handlePhotoSelected);
albumInput.addEventListener('change', handleAlbumSelected);
useCurrentLocationForRecordButton.addEventListener('click', handleUseCurrentLocationForRecord);
settingsButton.addEventListener('click', openSettings);
closeSettingsModal.addEventListener('click', closeSettings);
settingsModal.addEventListener('click', (event) => {
  if (event.target === settingsModal) {
    closeSettings();
  }
});
categoryForm.addEventListener('submit', addCategory);
closeAccountModal.addEventListener('click', closeAccountModalView);
accountModal.addEventListener('click', (event) => {
  if (event.target === accountModal) {
    closeAccountModalView();
  }
});
switchAccountButton.addEventListener('click', handleSwitchAccount);
signOutButton.addEventListener('click', handleSignOut);
dateRangeButton.addEventListener('click', openDateRangeModal);
closeDateRangeModal.addEventListener('click', closeDateRangeModalView);
dateRangeModal.addEventListener('click', (event) => {
  if (event.target === dateRangeModal) {
    closeDateRangeModalView();
  }
});
dateRangeForm.addEventListener('submit', handleDateRangeSubmit);
googleLoginButton.addEventListener('click', handleGoogleLogin);
languageSelect.value = currentLanguage;
languageSelect.addEventListener('change', () => {
  currentLanguage = languageSelect.value;
  localStorage.setItem('cleanlog-language', currentLanguage);
  applyTranslations();
});
function loadThemePreference() {
  try {
    const saved = localStorage.getItem('cleanlog-theme');
    return saved === 'light' || saved === 'dark' ? saved : 'auto';
  } catch {
    return 'auto';
  }
}

themeSelect.value = loadThemePreference();
themeSelect.addEventListener('change', () => {
  const preference = themeSelect.value;
  try {
    if (preference === 'auto') localStorage.removeItem('cleanlog-theme');
    else localStorage.setItem('cleanlog-theme', preference);
  } catch {
    // 保存できなくても、その回の表示は切り替わる
  }
  window.cleanlogApplyTheme(preference);
});
updateLoginState();
updateRecordCategoryOptions();
applyTranslations();

function refreshDetailPlaceText() {
  if (!activeDetailRecord) return;
  const category = categoryMap[activeDetailRecord.category];
  // Preview the not-yet-saved location fetched via 現在位置を記録 as soon as
  // it's available, rather than only reflecting it after 更新 is pressed.
  const placeText = pendingDetailLocation
    ? `${pendingDetailLocation.lat.toFixed(5)}, ${pendingDetailLocation.lng.toFixed(5)}`
    : getRecordPlaceText(activeDetailRecord);
  detailPlace.textContent = `${placeText} / ${activeDetailRecord.categoryLabel || getCategoryLabel(category)}`;
  detailNotes.textContent = currentLanguage === 'ja'
    ? `${activeDetailRecord.title}を記録しました。現場は ${placeText} で、${category.label}として分類されています。`
    : `${activeDetailRecord.title} was recorded at ${placeText} and classified as ${getCategoryLabel(category)}.`;
}

function openDetail(record) {
  activeDetailRecord = record;
  const category = categoryMap[record.category];
  detailImage.src = getRecordImageSrc(record);
  detailImage.alt = record.title;
  detailCategoryBadge.textContent = getCategoryLabel(category);
  detailCategoryBadge.style.background = category.color;
  detailTitle.textContent = record.title;
  detailDate.textContent = record.date || '2026/09/12';
  detailTime.textContent = record.time;
  refreshDetailPlaceText();
  detailEditForm.classList.add('hidden');
  updateDetailCategoryOptions();
  detailCategoryInput.value = record.category;
  detailDateTimeInput.value = getDetailDateTimeValue(record);
  detailSheet.classList.remove('hidden');
}

function getDetailDateTimeValue(record) {
  const [hours = '12', minutes = '00'] = (record.time || '12:00').split(':');
  return `${record.date.replace(/\//g, '-')}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

function startDetailEdit() {
  if (!activeDetailRecord) return;
  updateDetailCategoryOptions();
  detailCategoryInput.value = activeDetailRecord.category;
  detailDateTimeInput.value = getDetailDateTimeValue(activeDetailRecord);
  pendingDetailLocation = null;
  detailLocationStatusText.classList.add('hidden');
  detailLocationStatusText.textContent = '';
  detailEditForm.classList.remove('hidden');
}

function cancelDetailEdit() {
  detailEditForm.classList.add('hidden');
}

async function handleUseCurrentLocationForDetail() {
  useCurrentLocationForDetailButton.disabled = true;
  detailLocationStatusText.classList.remove('hidden', 'error', 'approximate');
  detailLocationStatusText.textContent = currentLanguage === 'ja' ? '現在地を取得中…' : 'Getting current location…';

  const location = await requestPhotoLocation();

  useCurrentLocationForDetailButton.disabled = false;

  if (location) {
    pendingDetailLocation = location;
    refreshDetailPlaceText();
    const coords = `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
    detailLocationStatusText.textContent = currentLanguage === 'ja' ? `位置情報: ${coords}` : `Location: ${coords}`;
  } else {
    detailLocationStatusText.classList.add('error');
    detailLocationStatusText.textContent = lastGeolocationErrorMessage
      || (currentLanguage === 'ja' ? '現在地を取得できませんでした。' : 'Could not get your current location.');
  }
}

async function updateDetailRecord() {
  if (!activeDetailRecord) return;
  const nextCategory = detailCategoryInput.value || 'unclassified';
  const nextDateTime = detailDateTimeInput.value || getDetailDateTimeValue(activeDetailRecord);
  const [date, time] = nextDateTime.split('T');
  activeDetailRecord.category = nextCategory;
  activeDetailRecord.title = getCategoryLabel(categoryMap[nextCategory]);
  activeDetailRecord.date = date.replace(/-/g, '/');
  activeDetailRecord.time = time || '12:00';

  if (pendingDetailLocation) {
    activeDetailRecord.lat = pendingDetailLocation.lat;
    activeDetailRecord.lng = pendingDetailLocation.lng;
    activeDetailRecord.place = pendingDetailLocation.place;
    pendingDetailLocation = null;
  }

  if (isGoogleLoggedIn && activeDetailRecord.dataFileId) {
    try {
      // image と dataFileName は、ファイルに保存する内容から除くために取り出している
      const { image, dataFileId, dataFileName, ...persisted } = activeDetailRecord;
      await updateDriveFileContent(
        dataFileId,
        new Blob([JSON.stringify(persisted)], { type: 'application/json' }),
        'application/json',
      );
    } catch {
      window.alert(t('updateFailedAlert'));
    }
  }

  renderRecords();
  renderMarkers(activeCategoryKeys);
  renderDateRangeSummary();
  openDetail(activeDetailRecord);
}

async function deleteDetailRecord() {
  if (!activeDetailRecord) return;
  const recordToDelete = activeDetailRecord;
  const recordIndex = records.findIndex((record) => record.id === recordToDelete.id);
  if (recordIndex >= 0) records.splice(recordIndex, 1);
  renderRecords();
  renderMarkers(activeCategoryKeys);
  renderDateRangeSummary();
  activeDetailRecord = null;
  closeDetail();

  if (isGoogleLoggedIn && recordToDelete.dataFileId) {
    try {
      await trashDriveFile(recordToDelete.dataFileId);
      await trashDriveFile(recordToDelete.photoFileId);
    } catch {
      window.alert(t('deleteFailedAlert'));
    }
  }
}

function closeDetail() {
  detailSheet.classList.add('hidden');
}

closeDetailButton.addEventListener('click', closeDetail);
editDetailButton.addEventListener('click', startDetailEdit);
deleteDetailButton.addEventListener('click', deleteDetailRecord);
updateDetailButton.addEventListener('click', updateDetailRecord);
cancelDetailEditButton.addEventListener('click', cancelDetailEdit);
useCurrentLocationForDetailButton.addEventListener('click', handleUseCurrentLocationForDetail);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDetail();
  }
});

function updateRecordCategoryOptions() {
  recordCategoryInput.innerHTML = categories
    .map((category) => `<option value="${category.key}">${getCategoryLabel(category)}</option>`)
    .join('');
  recordCategoryInput.insertAdjacentHTML('afterbegin', `<option value="">${t('selectType')}</option>`);
}

function updateDetailCategoryOptions() {
  detailCategoryInput.innerHTML = categories
    .map((category) => `<option value="${category.key}">${getCategoryLabel(category)}</option>`)
    .join('');
  detailCategoryInput.insertAdjacentHTML('afterbegin', `<option value="unclassified">${getCategoryLabel(categoryMap.unclassified)}</option>`);
}

function renderSettingsCategories() {
  settingsCategoryList.innerHTML = '';
  categoryCount.textContent = currentLanguage === 'ja' ? `${categories.length}種類` : `${categories.length} types`;

  categories.forEach((category) => {
    const item = document.createElement('div');
    item.className = 'settings-category-item';
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `${category.label}を編集`);
    item.innerHTML = `
      <span class="color-dot" style="background:${category.color}"></span>
      <span class="settings-category-name">${getCategoryLabel(category)}</span>
    `;

    const editCategory = () => {
      item.classList.add('editing');
      item.innerHTML = `
        <input class="category-edit-input" type="text" maxlength="20" value="${category.label}" aria-label="ごみの種類名" />
        <input class="category-edit-color" type="color" value="${category.color}" aria-label="ごみの種類の色" />
        <div class="category-edit-actions">
          <button type="button" class="category-edit-save">保存</button>
          <button type="button" class="category-edit-delete">削除</button>
          <button type="button" class="category-edit-cancel">キャンセル</button>
        </div>
      `;

      const nameInput = item.querySelector('.category-edit-input');
      const colorInput = item.querySelector('.category-edit-color');
      nameInput.focus();

      item.querySelector('.category-edit-save').addEventListener('click', (event) => {
        event.stopPropagation();
        const nextLabel = nameInput.value.trim();
        if (!nextLabel) return;
        category.label = nextLabel;
        if (!category.labelEn || currentLanguage === 'en') category.labelEn = nextLabel;
        category.color = colorInput.value;
        updateRecordCategoryOptions();
        renderSettingsCategories();
        renderRecords();
        renderMarkers(activeCategoryKeys);
        renderDateRangeSummary();
      });

      item.querySelector('.category-edit-delete').addEventListener('click', (event) => {
        event.stopPropagation();
        const categoryIndex = categories.findIndex((item) => item.key === category.key);
        categories.splice(categoryIndex, 1);
        updateRecordCategoryOptions();
        renderSettingsCategories();
        renderMarkers(activeCategoryKeys);
        renderDateRangeSummary();
      });

      item.querySelector('.category-edit-cancel').addEventListener('click', (event) => {
        event.stopPropagation();
        renderSettingsCategories();
      });
    };

    item.addEventListener('click', () => {
      if (!item.classList.contains('editing')) {
        editCategory();
      }
    });
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        editCategory();
      }
    });
    settingsCategoryList.appendChild(item);
  });
}

// ---- Device management: up to 20 devices per shared account (same as LeadLog). See devices.js ----

const DEVICE_ID_KEY = 'cleanlog-device-id';

/** Replaces {name} placeholders in a translated string. */
function fillIn(text, vars) {
  return text.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? vars[key] : ''));
}

function currentDevice() {
  return {
    deviceId: window.LogDevices.getDeviceId(DEVICE_ID_KEY),
    device: window.LogDevices.describeDevice(navigator.userAgent),
  };
}

async function listDriveFolderFiles(folderId) {
  const query = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
  const files = [];
  let pageToken = '';
  do {
    const url =
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=nextPageToken,files(id,name,modifiedTime,createdTime)` +
      `&pageSize=1000&spaces=drive${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
    const data = await (await driveFetch(url)).json();
    files.push(...(data.files || []));
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  return files;
}

const deviceApi = {
  listFolderFiles: listDriveFolderFiles,
  uploadFile: (blob, name, mimeType, parentId) => uploadFileToDrive(blob, name, mimeType, parentId),
  downloadText: async (fileId) => (await driveFetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`)).text(),
  deleteFile: (fileId) => driveFetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, { method: 'DELETE' }),
};

/**
 * Registers this device, then loads the records. When the account already has the maximum number of devices,
 * the records are not shown or saved on this device (the settings screen can still remove unused devices).
 */
async function registerDeviceAndLoad() {
  try {
    await window.LogDevices.ensureRegistered(deviceApi, await listDriveFolderFiles(driveFolderId), driveFolderId, currentDevice());
    isDeviceLimited = false;
  } catch (error) {
    if (error instanceof window.LogDevices.DeviceLimitError) {
      isDeviceLimited = true;
      records.length = 0;
      renderRecords();
      renderMarkers(activeCategoryKeys);
      renderDateRangeSummary();
      updateDeviceControls();
      window.alert(fillIn(t('deviceLimitAlert'), { max: window.LogDevices.MAX_DEVICES }));
      return;
    }
    // A failure other than the limit (for example a network hiccup) must not lock the user out.
    console.error('[device-register]', error);
  }
  updateDeviceControls();
  await loadRecordsFromDrive();
}

function updateDeviceControls() {
  devicesNote.textContent = isDeviceLimited ? fillIn(t('deviceLimitNote'), { max: window.LogDevices.MAX_DEVICES }) : '';
  devicesLoadButton.disabled = !isGoogleLoggedIn;
  devicesLoadButton.textContent = t('devicesLoad');
  devicesStatus.textContent = isGoogleLoggedIn ? '' : t('devicesNeedLogin');
  devicesStatus.classList.remove('error');
  if (isGoogleLoggedIn && devicesLoaded) {
    // Re-draw the loaded list (for example after switching the language).
    renderDeviceList(lastDevices);
  } else {
    devicesList.replaceChildren();
    devicesCount.textContent = '';
    devicesLoadButton.hidden = false;
  }
}

async function loadDeviceList() {
  devicesLoadButton.disabled = true;
  devicesLoadButton.textContent = t('devicesLoading');
  devicesStatus.textContent = '';
  try {
    const devices = await window.LogDevices.listDevices(deviceApi, driveFolderId);
    devicesLoaded = true;
    renderDeviceList(devices);
  } catch (error) {
    console.error('[devices]', error);
    devicesLoaded = false;
    devicesLoadButton.disabled = false;
    devicesLoadButton.textContent = t('devicesLoad');
    devicesStatus.textContent = t('devicesFailed');
    devicesStatus.classList.add('error');
  }
}

function renderDeviceList(devices) {
  lastDevices = devices;
  const me = window.LogDevices.getDeviceId(DEVICE_ID_KEY);
  const max = window.LogDevices.MAX_DEVICES;
  devicesLoadButton.hidden = true;
  devicesCount.textContent = fillIn(t('devicesCount'), { n: devices.filter((d) => d.active).length, max });
  devicesList.replaceChildren();
  for (const device of devices) {
    const name = device.device || `#${device.deviceId}`;
    const item = document.createElement('li');
    item.className = 'devices-item';

    const info = document.createElement('div');
    info.className = 'devices-info';
    const title = document.createElement('div');
    title.className = 'devices-name';
    title.textContent = name;
    if (device.deviceId === me) {
      const badge = document.createElement('span');
      badge.className = 'devices-badge';
      badge.textContent = t('devicesThis');
      title.append(' ', badge);
    }
    if (!device.active) {
      const badge = document.createElement('span');
      badge.className = 'devices-badge warn';
      badge.textContent = t('devicesOver');
      title.append(' ', badge);
    }
    const sub = document.createElement('div');
    sub.className = 'devices-sub';
    const when = new Date(device.registeredAt).toLocaleString(currentLanguage === 'ja' ? 'ja-JP' : 'en-US', {
      month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
    sub.textContent = `#${device.deviceId} · ${fillIn(t('devicesRegistered'), { time: when })}`;
    info.append(title, sub);
    item.append(info);

    if (device.deviceId !== me) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'devices-remove';
      remove.textContent = t('devicesRemove');
      remove.addEventListener('click', () => removeDevice(device, name));
      item.append(remove);
    }
    devicesList.append(item);
  }
}

async function removeDevice(device, name) {
  if (!window.confirm(fillIn(t('devicesConfirmRemove'), { name }))) return;
  try {
    await deviceApi.deleteFile(device.fileId);
  } catch (error) {
    console.error('[devices]', error);
  }
  // This device was over the limit: now that a slot may be free, try to register again (before redrawing the list).
  if (isDeviceLimited && isGoogleLoggedIn) await registerDeviceAndLoad();
  await loadDeviceList();
}

devicesLoadButton.addEventListener('click', loadDeviceList);

// ---- Data export: Excel + photos + JSON (same package as LeadLog). See export.js ----

function updateExportControls() {
  const canExport = isGoogleLoggedIn && records.length > 0 && !isExporting;
  exportDriveButton.disabled = !canExport;
  exportDeviceButton.disabled = !canExport;
  exportDriveButton.textContent = isExporting ? t('exportBusy') : t('exportDrive');
  exportNote.textContent = !isGoogleLoggedIn ? t('exportNeedLogin') : records.length === 0 ? t('exportNoRecords') : '';
}

async function loadRecordPhotoBlob(record) {
  if (!record.photoFileId) return null;
  if (record.image && record.image.startsWith('blob:')) {
    try {
      return await (await fetch(record.image)).blob();
    } catch {
      // Fall back to downloading it from Drive.
    }
  }
  return (await driveFetch(`https://www.googleapis.com/drive/v3/files/${record.photoFileId}?alt=media`)).blob();
}

/** Finds a sub-folder by name inside parentId, creating it when missing. */
async function ensureDriveSubfolder(parentId, name) {
  const query = encodeURIComponent(
    `name='${name}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`,
  );
  const listResponse = await driveFetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id)&orderBy=createdTime&spaces=drive`,
  );
  const listData = await listResponse.json();
  if (listData.files && listData.files.length > 0) return listData.files[0].id;

  const createResponse = await driveFetch('https://www.googleapis.com/drive/v3/files?fields=id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder', parents: [parentId] }),
  });
  return (await createResponse.json()).id;
}

function showExportStatus(message, { error = false, folderId = null } = {}) {
  exportStatus.textContent = message;
  exportStatus.classList.toggle('error', error);
  if (folderId) {
    const link = document.createElement('a');
    link.href = `https://drive.google.com/drive/folders/${folderId}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = t('exportOpen');
    exportStatus.append(' ', link);
  }
}

async function exportData(to) {
  if (isExporting || !isGoogleLoggedIn || records.length === 0) return;
  isExporting = true;
  showExportStatus('');
  updateExportControls();
  try {
    const pkg = await window.LogExport.buildPackage({
      appName: driveConfig.folderName,
      lang: currentLanguage,
      records,
      categories,
      categoryLabel: (key) => getCategoryLabel(categoryMap[key] || categoryMap.unclassified),
      loadPhoto: loadRecordPhotoBlob,
    });

    if (to === 'drive') {
      const folderId = await ensureDriveSubfolder(driveFolderId, pkg.baseName);
      for (const file of pkg.entries) {
        const mimeType = file.name.endsWith('.json')
          ? 'application/json'
          : file.name.endsWith('.xlsx')
            ? window.LogExport.XLSX_MIME
            : 'image/jpeg';
        await uploadFileToDrive(new Blob([file.data]), file.name, mimeType, folderId);
      }
      showExportStatus(`${t('exportDone')}${pkg.baseName}`, { folderId });
    } else {
      const zip = await window.LogExport.createZip(pkg.entries);
      const url = URL.createObjectURL(zip);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${pkg.baseName}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      showExportStatus(`${t('exportDone')}${pkg.baseName}.zip`);
    }
  } catch (error) {
    console.error('[export]', error);
    showExportStatus(t('exportFailed'), { error: true });
  } finally {
    isExporting = false;
    updateExportControls();
  }
}

exportDriveButton.addEventListener('click', () => exportData('drive'));
exportDeviceButton.addEventListener('click', () => exportData('device'));

function openSettings() {
  renderSettingsCategories();
  updateExportControls();
  updateDeviceControls();
  settingsModal.classList.remove('hidden');
}

function closeSettings() {
  settingsModal.classList.add('hidden');
}

function createCategoryKey(label) {
  const baseKey = label.toLowerCase().replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9fff]+/g, '-') || 'custom';
  let key = baseKey;
  let suffix = 2;
  while (categoryMap[key]) {
    key = `${baseKey}-${suffix}`;
    suffix += 1;
  }
  return key;
}

function addCategory(event) {
  event.preventDefault();
  const label = categoryNameInput.value.trim();
  if (!label) return;

  const category = {
    key: createCategoryKey(label),
    label,
    labelEn: label,
    color: categoryColorInput.value,
  };
  categories.push(category);
  categoryMap[category.key] = category;
  activeCategoryKeys.push(category.key);
  updateRecordCategoryOptions();
  renderSettingsCategories();
  categoryNameInput.value = '';
  categoryColorInput.value = '#a86b43';
}

function renderRecords() {
  recordList.innerHTML = '';

  const visibleRecords = getRecordsInRange();

  visibleRecords.forEach((item) => {
    const category = categoryMap[item.category];
    const article = document.createElement('article');
    article.className = 'record-item';
    article.innerHTML = `
      <img class="record-photo" src="${getRecordImageSrc(item)}" alt="${item.title}" />
      <div class="record-main">
        <p class="record-title">${item.title}</p>
        <div class="record-meta">${getRecordPlaceText(item)}</div>
        <span class="record-badge" style="background:${category.color}">${getCategoryLabel(category)}</span>
      </div>
      <div class="record-time">${item.time}</div>
    `;
    article.addEventListener('click', () => {
      if (hasValidCoordinates(item)) {
        map.flyTo([item.lat, item.lng], 17, { duration: 1.2 });
      }
      openDetail(item);
    });
    recordList.appendChild(article);
  });
}

function buildPopupContent(record) {
  return `
    <div class="record-popup">
      <img src="${getRecordImageSrc(record)}" alt="${record.title}" />
      <h4>${record.title}</h4>
      <p>${getRecordPlaceText(record)}</p>
      <p>${record.date || '2026/09/12'} ${record.time}</p>
      <button type="button" class="popup-detail-button" data-record-id="${record.id}">${t('detailButton')}</button>
    </div>
  `;
}

function buildMarkerIcon(color, label = 'G') {
  return L.divIcon({
    className: 'custom-marker-wrap',
    html: `<div class="custom-marker" style="background:${color}">${label}</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
}

function renderMarkers(activeCategories = activeCategoryKeys) {
  if (!window.mapMarkers) {
    window.mapMarkers = [];
  }

  // Fit to every matching record, not just the ones already inside the current
  // view - otherwise a marker that falls outside the map's last position can
  // never pull the view back out to include it again.
  const matchingRecords = getRecordsInRange()
    .filter((record) => activeCategories.includes(record.category))
    .filter(hasValidCoordinates);

  if (matchingRecords.length > 1) {
    const bounds = L.latLngBounds(matchingRecords.map((record) => [record.lat, record.lng]));
    map.fitBounds(bounds, { padding: [24, 24] });
  } else if (matchingRecords.length === 1) {
    map.setView([matchingRecords[0].lat, matchingRecords[0].lng], Math.max(map.getZoom(), 16));
  }

  window.mapMarkers.forEach((marker) => map.removeLayer(marker));
  window.mapMarkers = [];

  getMapVisibleRecords()
    .filter((record) => activeCategories.includes(record.category))
    .forEach((record) => {
      const category = categoryMap[record.category] || categoryMap.unclassified;
      const marker = L.marker([record.lat, record.lng], {
        icon: buildMarkerIcon(category.color, getCategoryLabel(category).slice(0, 1)),
      }).addTo(map);
      marker.recordId = record.id;

      marker.bindPopup(buildPopupContent(record), {
        className: 'record-popup-wrapper',
        closeButton: true,
        maxWidth: 220,
      });

      marker.on('popupopen', () => {
        const detailButton = document.querySelector('[data-record-id="' + record.id + '"]');
        if (detailButton) {
          detailButton.addEventListener('click', () => openDetail(record), { once: true });
        }
      });

      window.mapMarkers.push(marker);
    });
}

function placeCurrentLocationMarker(currentLocation) {
  if (window.currentLocationMarker) {
    window.currentLocationMarker.setLatLng(currentLocation);
  } else {
    window.currentLocationMarker = L.circleMarker(currentLocation, {
      radius: 8,
      color: '#fff8f1',
      weight: 3,
      fillColor: '#a86b43',
      fillOpacity: 1,
    }).addTo(map);
  }
}

let lastKnownLocation = null;

function rememberLocation(lat, lng) {
  lastKnownLocation = { lat, lng, timestamp: Date.now() };
}

function getApproximateFallbackLocation(maxAgeMs = 60 * 60 * 1000) {
  if (!lastKnownLocation || Date.now() - lastKnownLocation.timestamp > maxAgeMs) {
    return null;
  }
  return {
    lat: lastKnownLocation.lat,
    lng: lastKnownLocation.lng,
    place: currentLanguage === 'ja' ? '撮影地点(推定)' : 'Photo location (approximate)',
    approximate: true,
  };
}

function centerOnCurrentLocation() {
  if (!navigator.geolocation) {
    window.alert(currentLanguage === 'ja' ? 'この端末では位置情報を利用できません。' : 'Location is not available on this device.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const currentLocation = [position.coords.latitude, position.coords.longitude];
      rememberLocation(position.coords.latitude, position.coords.longitude);
      map.setView(currentLocation, 17, { animate: true });
      placeCurrentLocationMarker(currentLocation);
    },
    () => {
      window.alert(currentLanguage === 'ja'
        ? '現在地を取得できませんでした。ブラウザーの位置情報を許可してください。'
        : 'Could not get your location. Please allow location access in your browser.');
    },
    { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 },
  );
}

// Tracks the initial, launch-time location fetch so a photo taken in the
// first few seconds after opening the app (before this resolves) can wait
// for it instead of finding lastKnownLocation still empty.
let initialLocationPromise = null;

function centerMapOnCurrentLocationOnLoad() {
  if (!navigator.geolocation || !window.isSecureContext) {
    initialLocationPromise = Promise.resolve();
    return initialLocationPromise;
  }

  initialLocationPromise = new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = [position.coords.latitude, position.coords.longitude];
        rememberLocation(position.coords.latitude, position.coords.longitude);
        map.setView(currentLocation, 15, { animate: true });
        placeCurrentLocationMarker(currentLocation);
        resolve();
      },
      () => {
        // Keep whatever view the map already has (default center, or fit to
        // existing records); the locate button remains available to retry.
        resolve();
      },
      // Same relaxed settings as requestPhotoLocation(): this fix also seeds
      // the cache that camera photos fall back on, so it needs to succeed
      // far more than it needs to be GPS-precise.
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    );
  });

  return initialLocationPromise;
}

function describeGeolocationError(error) {
  if (error && error.code === 1) {
    return currentLanguage === 'ja'
      ? '位置情報の利用が許可されていません。ブラウザまたは端末の設定で位置情報へのアクセスを許可してください。'
      : 'Location access was denied. Please allow location access in your browser or device settings.';
  }
  if (error && error.code === 3) {
    return currentLanguage === 'ja'
      ? '位置情報の取得がタイムアウトしました。電波・GPSの入りが良い場所でもう一度お試しください。'
      : 'Getting your location timed out. Please try again somewhere with a clearer GPS signal.';
  }
  return currentLanguage === 'ja'
    ? '現在位置を取得できませんでした。'
    : 'Could not get your current location.';
}

let lastGeolocationErrorMessage = null;

function requestPhotoLocation() {
  if (!navigator.geolocation) {
    lastGeolocationErrorMessage = currentLanguage === 'ja'
      ? 'この端末・ブラウザーは位置情報に対応していません。'
      : 'This device or browser does not support geolocation.';
    return Promise.resolve(getApproximateFallbackLocation());
  }

  if (!window.isSecureContext) {
    lastGeolocationErrorMessage = currentLanguage === 'ja'
      ? '安全な接続(HTTPS)で開かれていないため、位置情報を利用できません。'
      : 'Location isn’t available because this page wasn’t opened over a secure (HTTPS) connection.';
    return Promise.resolve(getApproximateFallbackLocation());
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lastGeolocationErrorMessage = null;
        rememberLocation(position.coords.latitude, position.coords.longitude);
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          place: currentLanguage === 'ja' ? '撮影地点' : 'Photo location',
        });
      },
      (error) => {
        lastGeolocationErrorMessage = describeGeolocationError(error);
        // A fresh fix failed (denied, timed out, or unavailable) - fall back to
        // the last fix this session actually got (from the map centering on
        // load, the locate button, or an earlier photo) if it's still recent,
        // rather than leaving the record with no location at all.
        resolve(getApproximateFallbackLocation());
      },
      // Favor actually succeeding over precision: enableHighAccuracy forces a
      // GPS-only fix, which can be slow or fail outright indoors/with a weak
      // signal, and maximumAge: 0 refuses any position the browser already
      // has cached. Allow a faster network-based fix and one up to 5 minutes
      // old - close enough for "roughly where this was taken" - since a less
      // precise location beats none at all.
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 5 * 60 * 1000 },
    );
  });
}

const map = L.map('map', {
  zoomControl: false,
  attributionControl: true,
}).setView([35.6812, 139.7671], 15);

L.control.zoom({ position: 'bottomright' }).addTo(map);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

map.on('moveend zoomend', renderDateRangeSummary);

setDefaultDateRange();
renderDateRangeSummary();
renderRecords();
renderMarkers();

window.map = map;

// Center on the device's current location right away, in parallel with
// loading Drive records, so the map opens on "where you are" as fast as
// possible instead of waiting on the network round trip for Drive first.
centerMapOnCurrentLocationOnLoad();
const driveSessionReadyPromise = restoreDriveSession();
