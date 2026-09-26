/*
 * データのエクスポート（Excel・写真・データ JSON をまとめた書き出し）。LeadLog と同じ形。
 * CapLog と CleanLog で共通。ビルド不要のアプリなので、ZIP と Excel（.xlsx）も、このファイルの中で作る。
 *
 * 書き出す中身（Google ドライブでは1つのフォルダー、この端末では1つの ZIP にまとめる）:
 *   <アプリ名>_YYYYMMDD-HHMM.xlsx  … 記録の一覧と、種類別の件数
 *   <アプリ名小文字>-data.json      … 記録・種類のデータ（ドライブに保存している記録と同じ項目）
 *   <アプリ名>-<記録ID>.jpg         … 記録の写真
 */
(function (root) {
  'use strict';

  // ---- ZIP（圧縮は、ブラウザ標準の CompressionStream の deflate-raw。使えない環境では圧縮せずに保存する） ----

  const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(data) {
    let c = 0xffffffff;
    for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  async function deflate(data) {
    if (typeof CompressionStream === 'undefined') return null;
    const stream = new Blob([data.slice()]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  function dosDateTime(d = new Date()) {
    const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    return { date, time };
  }

  /** 複数のファイル（{ name, data: Uint8Array }）を1つの ZIP（Blob）にまとめる */
  async function createZip(entries) {
    const encoder = new TextEncoder();
    const { date, time } = dosDateTime();
    const parts = [];
    const central = [];
    let offset = 0;
    let centralSize = 0;

    for (const entry of entries) {
      const nameBytes = encoder.encode(entry.name);
      const crc = crc32(entry.data);
      const compressed = await deflate(entry.data);
      const method = compressed ? 8 : 0;
      const body = compressed || entry.data;

      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true);
      local.setUint16(4, 20, true);
      local.setUint16(6, 0x0800, true); // ファイル名は UTF-8
      local.setUint16(8, method, true);
      local.setUint16(10, time, true);
      local.setUint16(12, date, true);
      local.setUint32(14, crc, true);
      local.setUint32(18, body.length, true);
      local.setUint32(22, entry.data.length, true);
      local.setUint16(26, nameBytes.length, true);
      local.setUint16(28, 0, true);
      parts.push(local.buffer, nameBytes.slice(), body.slice());

      const header = new DataView(new ArrayBuffer(46));
      header.setUint32(0, 0x02014b50, true);
      header.setUint16(4, 20, true);
      header.setUint16(6, 20, true);
      header.setUint16(8, 0x0800, true);
      header.setUint16(10, method, true);
      header.setUint16(12, time, true);
      header.setUint16(14, date, true);
      header.setUint32(16, crc, true);
      header.setUint32(20, body.length, true);
      header.setUint32(24, entry.data.length, true);
      header.setUint16(28, nameBytes.length, true);
      header.setUint32(42, offset, true);
      central.push(header.buffer, nameBytes);

      offset += 30 + nameBytes.length + body.length;
      centralSize += 46 + nameBytes.length;
    }

    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, entries.length, true);
    end.setUint16(10, entries.length, true);
    end.setUint32(12, centralSize, true);
    end.setUint32(16, offset, true);

    return new Blob([...parts, ...central, end.buffer], { type: 'application/zip' });
  }

  // ---- Excel（.xlsx。文字は inlineStr で持つので、共有文字列の表は要らない） ----

  const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  function xmlEscape(value) {
    return String(value)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** 0 → A, 25 → Z, 26 → AA */
  function columnName(index) {
    let name = '';
    for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + ((n - 1) % 26)) + name;
    return name;
  }

  const STYLE_HEADER = 1;
  const STYLE_COORD = 2;

  function cellXml(ref, cell, style) {
    if (cell === null || cell === undefined || cell === '') return '';
    const s = style ? ` s="${style}"` : '';
    if (typeof cell === 'number' && Number.isFinite(cell)) return `<c r="${ref}"${s}><v>${cell}</v></c>`;
    return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${xmlEscape(cell)}</t></is></c>`;
  }

  /** sheet: { name, header: string[], rows: (string|number|null)[][], widths: number[], coordColumns?: number[] } */
  function sheetXml(sheet) {
    const rows = [];
    rows.push(
      `<row r="1">${sheet.header.map((h, c) => cellXml(`${columnName(c)}1`, h, STYLE_HEADER)).join('')}</row>`,
    );
    sheet.rows.forEach((row, i) => {
      const r = i + 2;
      const cells = row
        .map((cell, c) => cellXml(`${columnName(c)}${r}`, cell, (sheet.coordColumns || []).includes(c) ? STYLE_COORD : 0))
        .join('');
      rows.push(`<row r="${r}">${cells}</row>`);
    });
    const cols = sheet.widths
      .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
      .join('');
    return (
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      // 見出し行を固定する
      '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' +
      `<cols>${cols}</cols><sheetData>${rows.join('')}</sheetData></worksheet>`
    );
  }

  const STYLES_XML =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<numFmts count="1"><numFmt numFmtId="164" formatCode="0.000000"/></numFmts>' +
    '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
    '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>' +
    '<fill><patternFill patternType="solid"><fgColor rgb="FFDDEBF7"/><bgColor indexed="64"/></patternFill></fill></fills>' +
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="3">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>' +
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '</cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    '</styleSheet>';

  /** シート名に使えない文字（\ / ? * [ ] :）を除き、31文字までにする */
  function sheetName(name) {
    return name.replace(/[\\/?*[\]:]/g, ' ').trim().slice(0, 31) || 'Sheet';
  }

  /** シートの一覧から .xlsx（Uint8Array）を作る */
  async function buildXlsx(sheets) {
    const enc = new TextEncoder();
    const rels =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      sheets
        .map(
          (_, i) =>
            `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`,
        )
        .join('') +
      `<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
      '</Relationships>';
    const files = [
      {
        name: '[Content_Types].xml',
        text:
          '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
          '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
          '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
          '<Default Extension="xml" ContentType="application/xml"/>' +
          '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
          sheets
            .map(
              (_, i) =>
                `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
            )
            .join('') +
          '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
          '</Types>',
      },
      {
        name: '_rels/.rels',
        text:
          '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
          '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
          '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
          '</Relationships>',
      },
      {
        name: 'xl/workbook.xml',
        text:
          '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
          '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' +
          sheets.map((s, i) => `<sheet name="${xmlEscape(sheetName(s.name))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('') +
          '</sheets></workbook>',
      },
      { name: 'xl/_rels/workbook.xml.rels', text: rels },
      { name: 'xl/styles.xml', text: STYLES_XML },
      ...sheets.map((s, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, text: sheetXml(s) })),
    ];
    const zip = await createZip(files.map((f) => ({ name: f.name, data: enc.encode(f.text) })));
    return new Uint8Array(await zip.arrayBuffer());
  }

  // ---- 書き出しのまとめ ----

  const LABELS = {
    ja: {
      sheetRecords: '記録', sheetByType: '種類別', date: '日付', time: '時刻', type: '種類', title: 'タイトル',
      place: '場所', lat: '緯度', lng: '経度', photo: '写真ファイル', count: '件数',
    },
    en: {
      sheetRecords: 'Records', sheetByType: 'By type', date: 'Date', time: 'Time', type: 'Type', title: 'Title',
      place: 'Place', lat: 'Latitude', lng: 'Longitude', photo: 'Photo file', count: 'Count',
    },
  };

  const pad2 = (n) => String(n).padStart(2, '0');

  /** ファイル名・フォルダー名に使う日時。例: 20260921-0015（端末のローカル時刻。Windows で使えない : は入れない） */
  function timestamp(now) {
    return `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}-${pad2(now.getHours())}${pad2(now.getMinutes())}`;
  }

  /** 記録の写真のファイル名。ドライブに保存している名前があればそれを使う */
  function photoName(appName, record) {
    return record.photoFileName || `${appName}-${record.id}.jpg`;
  }

  /**
   * 書き出すファイルを集める。
   *   appName       アプリ名（CapLog / CleanLog）
   *   lang          'ja' | 'en'
   *   records       書き出す記録
   *   categories    種類の一覧（key, label, labelEn, color）
   *   categoryLabel 種類の表示名を返す関数（key → 文字列）
   *   loadPhoto     記録の写真（Blob）を返す関数。無ければ null
   * 戻り値: { baseName, workbookName, dataName, entries }
   */
  async function buildPackage({ appName, lang, records, categories, categoryLabel, loadPhoto, now = new Date() }) {
    const L = LABELS[lang] || LABELS.ja;
    const sorted = [...records].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

    const recordsSheet = {
      name: L.sheetRecords,
      header: [L.date, L.time, L.type, L.title, L.place, L.lat, L.lng, L.photo],
      rows: sorted.map((r) => [
        r.date, r.time, categoryLabel(r.category), r.title, r.place,
        Number.isFinite(r.lat) ? r.lat : null, Number.isFinite(r.lng) ? r.lng : null,
        r.photoFileId ? photoName(appName, r) : null,
      ]),
      widths: [12, 8, 16, 18, 28, 12, 12, 26],
      coordColumns: [5, 6],
    };

    const counts = new Map();
    for (const r of sorted) counts.set(r.category, (counts.get(r.category) || 0) + 1);
    const known = categories.map((c) => c.key);
    const byTypeSheet = {
      name: L.sheetByType,
      header: [L.type, L.count],
      rows: [...known, ...[...counts.keys()].filter((k) => !known.includes(k))]
        .filter((k) => counts.has(k) || known.includes(k))
        .map((k) => [categoryLabel(k), counts.get(k) || 0]),
      widths: [20, 8],
    };

    const stamp = timestamp(now);
    const baseName = `${appName}_${stamp}`;
    const workbookName = `${baseName}.xlsx`;
    const dataName = `${appName.toLowerCase()}-data.json`;

    const data = {
      version: 1,
      app: appName,
      exportedAt: now.toISOString(),
      categories: categories.map((c) => ({ key: c.key, label: c.label, labelEn: c.labelEn, color: c.color })),
      records: sorted.map((r) => ({
        id: r.id, title: r.title, category: r.category, date: r.date, time: r.time, place: r.place,
        lat: Number.isFinite(r.lat) ? r.lat : null, lng: Number.isFinite(r.lng) ? r.lng : null,
        photoFileId: r.photoFileId || null, photoFileName: r.photoFileId ? photoName(appName, r) : null,
      })),
    };

    const entries = [
      { name: workbookName, data: await buildXlsx([recordsSheet, byTypeSheet]) },
      { name: dataName, data: new TextEncoder().encode(JSON.stringify(data)) },
    ];
    const used = new Set();
    for (const r of sorted) {
      if (!r.photoFileId) continue;
      const name = photoName(appName, r);
      if (used.has(name)) continue;
      used.add(name);
      let blob = null;
      try {
        blob = await loadPhoto(r);
      } catch (e) {
        console.error('[export-photo]', e);
      }
      if (blob) entries.push({ name, data: new Uint8Array(await blob.arrayBuffer()) });
    }
    return { baseName, workbookName, dataName, entries };
  }

  const api = { createZip, buildXlsx, buildPackage, timestamp, XLSX_MIME };
  root.LogExport = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
