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
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2e6?auto=format&fit=crop&w=600&q=80',
  },
];

const categoryMap = Object.fromEntries(categories.map((category) => [category.key, category]));
categoryMap.unclassified = {
  key: 'unclassified',
  label: '分類未設定',
  labelEn: 'Unclassified',
  color: '#a86b43',
};

const categoryList = document.getElementById('categoryList');
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
const addRecordButton = document.getElementById('addRecordButton');
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
const recordModal = document.getElementById('recordModal');
const closeRecordModal = document.getElementById('closeRecordModal');
const recordForm = document.getElementById('recordForm');
const googleLoginButton = document.getElementById('googleLoginButton');
const googleLoginText = document.getElementById('googleLoginText');
const languageSelect = document.getElementById('languageSelect');
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
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
};

let isGoogleLoggedIn = false;
let activeCategoryKeys = [...categories.map((category) => category.key), 'unclassified'];
let currentLanguage = localStorage.getItem('cleanlog-language') || (navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en');
let selectedPhotoFile = null;
let selectedPhotoLocation = null;
let selectedPhotoSource = 'camera';
let pendingPhotoLocation = null;
let activeDetailRecord = null;

const dateRange = {
  start: '',
  end: '',
};

const translations = {
  ja: {
    appTagline: 'ゴミ拾い記録帳', settings: '設定', login: 'ログイン', connected: 'Google接続中',
    recordPeriod: '記録期間', periodCount: '期間中の件数', density: 'ごみ密度 (個/km²)',
    map: 'ごみ分布マップ', addRecord: '新しい記録を追加', categories: 'ごみの種類', all: '全て表示',
    recent: '最近の記録', periodFilter: '期間指定', details: '記録詳細', close: '閉じる',
    recordTitle: '記録タイトル', place: '場所', notes: '写真と位置情報を元に、ゴミの状態と種類を記録しています。',
    newRecord: '新しいごみ記録', selectType: '種類を選択', type: '種類', capturedAt: '撮影日時', photo: '写真',
    saveTo: '保存先', driveFolder: 'Google Drive の CleanLog フォルダー', saveDrive: 'Drive に保存',
    selectPeriod: '期間を選択', startDate: '開始日', endDate: '終了日', showPeriod: 'この期間で表示',
    language: '言語/Language', newType: '新しい種類', color: '色', addType: '種類を追加', exampleType: '例：段ボール',
    installTitle: 'デバイスへのインストール方法', installDescription: '下のQRコードをスマートフォンで読み取ってアクセスしてください。',
    android: 'Android', androidGuide: 'Chromeでアクセスし、メニューから「ホーム画面に追加」または「アプリをインストール」を選択してください。',
    ios: 'iPhone / iPad', iosGuide: 'Safariでアクセスし、共有ボタンから「ホーム画面に追加」を選択してください。', qrAlt: 'アクセス先のQRコード',
    previousMonth: '前の月', nextMonth: '次の月', save: '保存', update: '更新', delete: '削除', edit: '編集', cancel: 'キャンセル',
    detailButton: '記録詳細を見る', loginConnectedAlert: 'Google Drive に接続済みです。写真とデータは CleanLog フォルダーへ保存されます。',
    loginAlert: 'Googleアカウントでログインしました。写真とデータは Google Drive の CleanLog フォルダーに保存されます。',
    savedAlert: '写真とデータを Google Drive の CleanLog フォルダーに保存しました。',
    deleteSavedAlert: '保存済みの記録とアイコンは残したまま、種類を一覧から削除しました。',
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
  },
  en: {
    appTagline: 'Clean-up Logbook', settings: 'Settings', login: 'Log in', connected: 'Google connected',
    recordPeriod: 'Record period', periodCount: 'Records in period', density: 'Waste density (items/km²)',
    map: 'Waste distribution map', addRecord: 'Add new record', categories: 'Waste types', all: 'Show all',
    recent: 'Recent records', periodFilter: 'Filter by period', details: 'Record details', close: 'Close',
    recordTitle: 'Record title', place: 'Place', notes: 'The waste condition and type are recorded from the photo and location.',
    newRecord: 'New waste record', selectType: 'Select type', type: 'Type', capturedAt: 'Captured at', photo: 'Photo',
    saveTo: 'Save to', driveFolder: 'Google Drive CleanLog folder', saveDrive: 'Save to Drive',
    selectPeriod: 'Select period', startDate: 'Start date', endDate: 'End date', showPeriod: 'Show this period',
    language: '言語/Language', newType: 'New type', color: 'Color', addType: 'Add type', exampleType: 'e.g. Cardboard',
    installTitle: 'How to install on your device', installDescription: 'Scan the QR code below with your smartphone to open CleanLog.',
    android: 'Android', androidGuide: 'Open this page in Chrome, then choose “Add to Home screen” or “Install app” from the menu.',
    ios: 'iPhone / iPad', iosGuide: 'Open this page in Safari, tap the Share button, then choose “Add to Home Screen”.', qrAlt: 'QR code for this app',
    previousMonth: 'Previous month', nextMonth: 'Next month', save: 'Save', update: 'Update', delete: 'Delete', edit: 'Edit', cancel: 'Cancel',
    detailButton: 'View record details', loginConnectedAlert: 'Google Drive is connected. Photos and data will be saved to the CleanLog folder.',
    loginAlert: 'You are now signed in with Google. Photos and data will be saved to the CleanLog folder.',
    savedAlert: 'The photo and data were saved to the CleanLog folder in Google Drive.',
    deleteSavedAlert: 'The saved record and its map icon remain, while this type was removed from the list.',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
};

function t(key) {
  return translations[currentLanguage][key];
}

function getCategoryLabel(category) {
  return currentLanguage === 'en' ? (category.labelEn || category.label) : category.label;
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
  locateButton.setAttribute('aria-label', currentLanguage === 'ja' ? '現在地を表示' : 'Show current location');
  locateButton.title = currentLanguage === 'ja' ? '現在地を表示' : 'Show current location';
  albumButton.setAttribute('aria-label', currentLanguage === 'ja' ? 'アルバムから写真を選択' : 'Choose a photo from album');
  albumButton.title = currentLanguage === 'ja' ? 'アルバムから写真を選択' : 'Choose a photo from album';
  settingsButton.setAttribute('aria-label', t('settings') + 'を開く');
  settingsButton.title = t('settings');
  dateRangeButton.setAttribute('aria-label', t('selectPeriod'));
  googleLoginText.textContent = isGoogleLoggedIn ? t('connected') : t('login');
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
  document.querySelector('#installSettingsTitle').textContent = t('installTitle');
  document.querySelector('#installDescription').textContent = t('installDescription');
  document.querySelector('#installQrCode').alt = t('qrAlt');
  document.querySelector('#androidInstallTitle').textContent = t('android');
  document.querySelector('#androidInstallText').textContent = t('androidGuide');
  document.querySelector('#iosInstallTitle').textContent = t('ios');
  document.querySelector('#iosInstallText').textContent = t('iosGuide');
  updateInstallGuide();
  const categoryFields = categoryForm.querySelectorAll('.field > span, .color-field > span');
  categoryFields[0].textContent = t('newType');
  categoryFields[1].textContent = t('color');
  categoryNameInput.placeholder = t('exampleType');
  categoryForm.querySelector('.primary-button').textContent = t('addType');
  renderCategoryFilters();
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
  const [year, month, day] = value.split('/').map(Number);
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
  return dates[0] || '2026/09/12';
}

function getEarliestDate() {
  const dates = records.map((record) => record.date).filter(Boolean).sort((a, b) => parseDate(a) - parseDate(b));
  return dates[0] || '2026/09/09';
}

function setDefaultDateRange() {
  const earliestDate = getEarliestDate();
  const latestDate = getLatestDate();
  dateRange.start = earliestDate;
  dateRange.end = latestDate;
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

function getMapVisibleRecords() {
  if (!window.map || typeof window.map.getBounds !== 'function') {
    return getRecordsInRange().filter((record) => activeCategoryKeys.includes(record.category));
  }

  const bounds = window.map.getBounds();
  return getRecordsInRange()
    .filter((record) => activeCategoryKeys.includes(record.category))
    .filter((record) => bounds.contains([record.lat, record.lng]));
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
  } catch (error) {
    return {};
  }
}

async function handlePhotoFile(file) {
  if (!file) return;

  selectedPhotoFile = file;
  selectedPhotoLocation = null;
  photoPreview.src = URL.createObjectURL(file);
  photoPreview.classList.remove('hidden');
  const metadata = await readPhotoMetadata(file);
  const capturedDate = parseExifDate(metadata.DateTimeOriginal || metadata.CreateDate || metadata.ModifyDate);
  recordDateTimeInput.value = toDateTimeLocalValue(capturedDate || new Date(file.lastModified || Date.now()));

  const browserLocation = selectedPhotoSource === 'camera' && pendingPhotoLocation
    ? await pendingPhotoLocation
    : null;
  const latitude = metadata.latitude ?? gpsCoordinateToDecimal(metadata.GPSLatitude, metadata.GPSLatitudeRef);
  const longitude = metadata.longitude ?? gpsCoordinateToDecimal(metadata.GPSLongitude, metadata.GPSLongitudeRef);
  if (browserLocation) {
    selectedPhotoLocation = browserLocation;
  } else if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    selectedPhotoLocation = {
      lat: latitude,
      lng: longitude,
      place: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
    };
  }

  recordCategoryInput.value = classifyPhoto(file);
}

function handlePhotoSelected() {
  const file = selectedPhotoFile || (photoInput.files && photoInput.files[0]);
  handlePhotoFile(file);
}

function handleAlbumSelected() {
  const file = albumInput.files && albumInput.files[0];
  if (file) {
    recordModal.classList.remove('hidden');
    handlePhotoFile(file);
  }
}

function openRecordModal(source = 'camera') {
  recordModal.classList.remove('hidden');
  recordForm.reset();
  photoPreview.removeAttribute('src');
  photoPreview.classList.add('hidden');
  selectedPhotoFile = null;
  selectedPhotoLocation = null;
  selectedPhotoSource = source;
  pendingPhotoLocation = source === 'camera' ? requestPhotoLocation() : null;
  recordCategoryInput.value = '';
  if (source === 'album') {
    albumInput.value = '';
    albumInput.click();
  } else {
    photoInput.click();
  }
}

function closeRecordModalView() {
  recordModal.classList.add('hidden');
}

function updateLoginState() {
  googleLoginText.textContent = isGoogleLoggedIn ? t('connected') : t('login');
  googleLoginButton.style.opacity = isGoogleLoggedIn ? '1' : '0.96';
}

function handleGoogleLogin() {
  if (isGoogleLoggedIn) {
    window.alert(t('loginConnectedAlert'));
    return;
  }

  isGoogleLoggedIn = true;
  updateLoginState();
  window.alert(t('loginAlert'));
}

async function saveRecordToDrive(event) {
  event.preventDefault();

  if (selectedPhotoSource === 'camera' && pendingPhotoLocation && !selectedPhotoLocation) {
    selectedPhotoLocation = await pendingPhotoLocation;
  }

  const file = selectedPhotoFile || (photoInput.files && photoInput.files[0]);
  const category = recordCategoryInput.value || 'unclassified';
  const categoryInfo = categoryMap[category] || categoryMap.unclassified;
  const title = getCategoryLabel(categoryInfo);
  const dateTimeValue = recordDateTimeInput.value || toDateTimeLocalValue(new Date());
  const [datePart, timePart] = dateTimeValue.split('T');

  const payload = {
    id: Date.now(),
    title,
    category,
    date: datePart,
    time: timePart || '12:00',
    place: selectedPhotoLocation?.place || (currentLanguage === 'ja' ? '写真から位置情報なし' : 'No location in photo'),
    lat: selectedPhotoLocation?.lat ?? map.getCenter().lat,
    lng: selectedPhotoLocation?.lng ?? map.getCenter().lng,
    image: file ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80',
    savedToDrive: true,
    driveFolder: driveConfig.folderName,
  };
  payload.dataFileName = `CleanLog-${payload.id}.json`;
  payload.photoFileName = `CleanLog-${payload.id}.jpg`;

  records.unshift(payload);
  renderRecords();
  renderMarkers();
  closeRecordModalView();
  openDetail(payload);
  window.alert(`${t('savedAlert')}\n${payload.dataFileName}`);
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
settingsButton.addEventListener('click', openSettings);
closeSettingsModal.addEventListener('click', closeSettings);
settingsModal.addEventListener('click', (event) => {
  if (event.target === settingsModal) {
    closeSettings();
  }
});
categoryForm.addEventListener('submit', addCategory);
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
updateLoginState();
updateRecordCategoryOptions();
applyTranslations();

function openDetail(record) {
  activeDetailRecord = record;
  const category = categoryMap[record.category];
  detailImage.src = record.image;
  detailImage.alt = record.title;
  detailCategoryBadge.textContent = getCategoryLabel(category);
  detailCategoryBadge.style.background = category.color;
  detailTitle.textContent = record.title;
  detailPlace.textContent = `${record.place} / ${record.categoryLabel || getCategoryLabel(category)}`;
  detailDate.textContent = record.date || '2026/09/12';
  detailTime.textContent = record.time;
  detailNotes.textContent = currentLanguage === 'ja'
    ? `${record.title}を記録しました。現場は ${record.place} で、${category.label}として分類されています。`
    : `${record.title} was recorded at ${record.place} and classified as ${getCategoryLabel(category)}.`;
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
  detailEditForm.classList.remove('hidden');
}

function cancelDetailEdit() {
  detailEditForm.classList.add('hidden');
}

function updateDetailRecord() {
  if (!activeDetailRecord) return;
  const nextCategory = detailCategoryInput.value || 'unclassified';
  const nextDateTime = detailDateTimeInput.value || getDetailDateTimeValue(activeDetailRecord);
  const [date, time] = nextDateTime.split('T');
  activeDetailRecord.category = nextCategory;
  activeDetailRecord.title = getCategoryLabel(categoryMap[nextCategory]);
  activeDetailRecord.date = date.replace(/-/g, '/');
  activeDetailRecord.time = time || '12:00';
  renderRecords();
  renderMarkers(activeCategoryKeys);
  renderDateRangeSummary();
  openDetail(activeDetailRecord);
}

function deleteDetailRecord() {
  if (!activeDetailRecord) return;
  const recordIndex = records.findIndex((record) => record.id === activeDetailRecord.id);
  if (recordIndex >= 0) records.splice(recordIndex, 1);
  renderRecords();
  renderMarkers(activeCategoryKeys);
  renderDateRangeSummary();
  activeDetailRecord = null;
  closeDetail();
}

function closeDetail() {
  detailSheet.classList.add('hidden');
}

closeDetailButton.addEventListener('click', closeDetail);
editDetailButton.addEventListener('click', startDetailEdit);
deleteDetailButton.addEventListener('click', deleteDetailRecord);
updateDetailButton.addEventListener('click', updateDetailRecord);
cancelDetailEditButton.addEventListener('click', cancelDetailEdit);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDetail();
  }
});

function createCategoryChip(category, active = true) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `category-chip${active ? ' active' : ''}`;
  button.dataset.category = category.key;
  button.innerHTML = `
    <span class="color-dot" style="background:${category.color}"></span>
    <span>${getCategoryLabel(category)}</span>
  `;
  button.addEventListener('click', () => {
    if (!categoryList) return;
    button.classList.toggle('active');
    activeCategoryKeys = Array.from(document.querySelectorAll('.category-chip.active')).map((chip) => chip.dataset.category);
    renderMarkers(activeCategoryKeys);
    renderDateRangeSummary();
  });
  return button;
}

function renderCategoryFilters() {
  if (!categoryList) return;
  categoryList.innerHTML = '';
  categories.forEach((category) => {
    categoryList.appendChild(createCategoryChip(category, true));
  });
}

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
        renderCategoryFilters();
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
        renderCategoryFilters();
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

function openSettings() {
  renderSettingsCategories();
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
  renderCategoryFilters();
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
      <img class="record-photo" src="${item.image}" alt="${item.title}" />
      <div class="record-main">
        <p class="record-title">${item.title}</p>
        <div class="record-meta">${item.place}</div>
        <span class="record-badge" style="background:${category.color}">${getCategoryLabel(category)}</span>
      </div>
      <div class="record-time">${item.time}</div>
    `;
    article.addEventListener('click', () => {
      map.flyTo([item.lat, item.lng], 17, { duration: 1.2 });
      openDetail(item);
    });
    recordList.appendChild(article);
  });
}

function buildPopupContent(record) {
  const category = categoryMap[record.category];
  return `
    <div class="record-popup">
      <img src="${record.image}" alt="${record.title}" />
      <h4>${record.title}</h4>
      <p>${record.place}</p>
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

  const visibleMarkers = getMapVisibleRecords().filter((record) => activeCategories.includes(record.category));

  if (visibleMarkers.length > 1) {
    const bounds = L.latLngBounds(visibleMarkers.map((record) => [record.lat, record.lng]));
    map.fitBounds(bounds, { padding: [24, 24] });
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

function centerOnCurrentLocation() {
  if (!navigator.geolocation) {
    window.alert(currentLanguage === 'ja' ? 'この端末では位置情報を利用できません。' : 'Location is not available on this device.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const currentLocation = [position.coords.latitude, position.coords.longitude];
      map.setView(currentLocation, 17, { animate: true });
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
    },
    () => {
      window.alert(currentLanguage === 'ja'
        ? '現在地を取得できませんでした。ブラウザーの位置情報を許可してください。'
        : 'Could not get your location. Please allow location access in your browser.');
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
  );
}

function requestPhotoLocation() {
  if (!navigator.geolocation || !window.isSecureContext) return Promise.resolve(null);

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        place: currentLanguage === 'ja' ? '撮影地点' : 'Photo location',
      }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
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
renderCategoryFilters();
renderRecords();
renderMarkers();

window.map = map;
