/*
 * 端末の管理（共有アカウントで使える端末の数を制限する。最大 20 台）。LeadLog と同じ仕組み。CapLog と CleanLog で共通。
 *
 * ドライブのアプリ用フォルダーに、端末ごとの登録ファイル device-<端末ID>.json を置く（端末ごとに別のファイルなので、
 * 同時に登録しても書き込みが消し合わない）。上限に達していたら、新しい端末は登録せず、記録の読み込み・保存もしない。
 * 2台がほぼ同時に最後の1枠に登録した場合に備え、登録した後にもう一度数え、登録の遅い方が取り消す。
 * 使わなくなった端末は、設定から解除して枠を空けられる（その端末が保存した記録は残る）。
 *
 * ドライブとのやり取りは api（app.js が渡す）で行う:
 *   api.listFolderFiles(folderId) -> [{ id, name, createdTime, modifiedTime }]
 *   api.uploadFile(blob, name, mimeType, parentId) -> ファイルID
 *   api.downloadText(fileId) -> 文字列
 *   api.deleteFile(fileId)
 */
(function (root) {
  'use strict';

  const MAX_DEVICES = 20;
  const DEVICE_FILE_RE = /^device-([a-z0-9]{8})\.json$/;
  const deviceFileName = (deviceId) => `device-${deviceId}.json`;

  class DeviceLimitError extends Error {
    constructor() {
      super('device-limit');
      this.name = 'DeviceLimitError';
    }
  }

  /** 端末 ID（8文字）。初回に作って、この端末のブラウザに保存する */
  function getDeviceId(storageKey) {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && /^[a-z0-9]{8}$/.test(saved)) return saved;
    } catch {
      // 保存できない環境では、その回だけの ID になる
    }
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 8);
    try {
      localStorage.setItem(storageKey, id);
    } catch {
      // 無視
    }
    return id;
  }

  /** ユーザーエージェントから「Android · Chrome」のような端末の種類を作る */
  function describeDevice(ua) {
    const os = /iPad/.test(ua)
      ? 'iPad'
      : /iPhone/.test(ua)
        ? 'iPhone'
        : /Android/.test(ua)
          ? 'Android'
          : /Windows/.test(ua)
            ? 'Windows'
            : /Macintosh|Mac OS X/.test(ua)
              ? 'Mac'
              : /Linux/.test(ua)
                ? 'Linux'
                : '';
    const browser = /Edg\//.test(ua)
      ? 'Edge'
      : /SamsungBrowser/.test(ua)
        ? 'Samsung Internet'
        : /CriOS|Chrome\//.test(ua)
          ? 'Chrome'
          : /FxiOS|Firefox\//.test(ua)
            ? 'Firefox'
            : /Safari\//.test(ua)
              ? 'Safari'
              : '';
    return [os, browser].filter(Boolean).join(' · ') || 'Browser';
  }

  /** 登録ファイルを、登録の早い順（同時刻なら端末ID順）に並べる。全端末で同じ順になる */
  function sortRegistrations(files) {
    return [...files].sort((a, b) =>
      a.createdTime === b.createdTime ? a.deviceId.localeCompare(b.deviceId) : a.createdTime.localeCompare(b.createdTime),
    );
  }

  /** この端末が、上限の内側（登録の早い max 台）に入っているか */
  function isWithinLimit(files, deviceId, max = MAX_DEVICES) {
    const unique = new Map();
    for (const f of sortRegistrations(files)) if (!unique.has(f.deviceId)) unique.set(f.deviceId, f);
    return [...unique.keys()].slice(0, max).includes(deviceId);
  }

  /** フォルダーのファイル一覧から、端末の登録ファイルだけを取り出す */
  function registrations(files) {
    return files.flatMap((f) => {
      const m = f.name.match(DEVICE_FILE_RE);
      return m ? [{ deviceId: m[1], fileId: f.id, createdTime: f.createdTime || f.modifiedTime }] : [];
    });
  }

  /**
   * この端末を登録する（登録済みなら何もしない）。上限を超える場合は DeviceLimitError。
   * me: { deviceId, device }。files: フォルダーのファイル一覧
   */
  async function ensureRegistered(api, files, folderId, me) {
    const regs = registrations(files);
    if (regs.some((r) => r.deviceId === me.deviceId)) {
      if (!isWithinLimit(regs, me.deviceId)) throw new DeviceLimitError();
      return;
    }
    if (new Set(regs.map((r) => r.deviceId)).size >= MAX_DEVICES) throw new DeviceLimitError();

    const entry = { deviceId: me.deviceId, device: me.device, registeredAt: Date.now() };
    const fileId = await api.uploadFile(
      new Blob([JSON.stringify(entry)], { type: 'application/json' }),
      deviceFileName(me.deviceId),
      'application/json',
      folderId,
    );
    // ほぼ同時に他の端末も登録した場合に備えて、もう一度数える。上限の外なら、自分の登録を取り消す
    const after = registrations(await api.listFolderFiles(folderId));
    if (!after.some((r) => r.deviceId === me.deviceId)) {
      after.push({ deviceId: me.deviceId, fileId, createdTime: new Date().toISOString() });
    }
    if (!isWithinLimit(after, me.deviceId)) {
      await api.deleteFile(fileId).catch(() => {});
      throw new DeviceLimitError();
    }
  }

  /** 登録済みの端末の一覧（登録の早い順）。設定の画面で使う。active は、上限の内側に入っているか */
  async function listDevices(api, folderId) {
    const regs = sortRegistrations(registrations(await api.listFolderFiles(folderId)));
    const result = [];
    for (const r of regs) {
      let entry = {};
      try {
        entry = JSON.parse(await api.downloadText(r.fileId));
      } catch {
        // 読めない登録ファイルも、解除できるように一覧には出す
      }
      result.push({
        deviceId: r.deviceId,
        device: entry.device || '',
        registeredAt: entry.registeredAt || Date.parse(r.createdTime),
        fileId: r.fileId,
        active: isWithinLimit(regs, r.deviceId),
      });
    }
    return result;
  }

  const api = {
    MAX_DEVICES, DEVICE_FILE_RE, DeviceLimitError, deviceFileName, getDeviceId, describeDevice,
    sortRegistrations, isWithinLimit, registrations, ensureRegistered, listDevices,
  };
  root.LogDevices = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
