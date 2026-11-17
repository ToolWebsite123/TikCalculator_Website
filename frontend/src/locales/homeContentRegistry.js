import { useEffect, useState } from 'react';

const PACK_LOADERS = {
  id: () => import('./id/infoContent'),
  de: () => import('./de/infoContent'),
  es: () => import('./es/infoContent'),
  fr: () => import('./fr/infoContent'),
  it: () => import('./it/infoContent'),
  ms: () => import('./ms/infoContent'),
  pt: () => import('./pt/infoContent'),
};

const EXPORT_KEYS = {
  id: 'ID_HOME_PACK',
  de: 'DE_HOME_PACK',
  es: 'ES_HOME_PACK',
  fr: 'FR_HOME_PACK',
  it: 'IT_HOME_PACK',
  ms: 'MS_HOME_PACK',
  pt: 'PT_HOME_PACK',
};

const packCache = {};
const pendingLoads = {};
const subscribers = new Set();

const notifySubscribers = () => {
  subscribers.forEach((cb) => cb());
};

export const DATE_LOCALE_BY_LANG = {
  en: 'en-US',
  id: 'id-ID',
  de: 'de-DE',
  es: 'es-ES',
  fr: 'fr-FR',
  it: 'it-IT',
  ms: 'ms-MY',
  pt: 'pt-BR',
};

export const SUPPORTED_NON_EN_LANGS = Object.keys(PACK_LOADERS);

export const resolveLangCode = (lang) =>
  (lang || 'en').toLowerCase().split(/[-_]/)[0] || 'en';

export const getHomeLocalePack = (lang) =>
  packCache[resolveLangCode(lang)] || null;

export const loadHomeLocalePack = async (lang) => {
  const code = resolveLangCode(lang);
  if (!PACK_LOADERS[code]) return null;
  if (packCache[code]) return packCache[code];

  if (!pendingLoads[code]) {
    pendingLoads[code] = PACK_LOADERS[code]()
      .then((mod) => {
        const pack = mod[EXPORT_KEYS[code]] || mod.default || null;
        if (pack) {
          packCache[code] = pack;
          notifySubscribers();
        }
        return pack;
      })
      .finally(() => {
        delete pendingLoads[code];
      });
  }

  return pendingLoads[code];
};

export const loadAllHomeLocalePacks = async () => {
  await Promise.all(SUPPORTED_NON_EN_LANGS.map((lang) => loadHomeLocalePack(lang)));
  return { ...packCache };
};

export const useHomeLocalePack = (lang) => {
  const code = resolveLangCode(lang);
  const [, setVersion] = useState(0);

  useEffect(() => {
    const onUpdate = () => setVersion((v) => v + 1);
    subscribers.add(onUpdate);
    if (PACK_LOADERS[code] && !packCache[code]) {
      loadHomeLocalePack(code);
    }
    return () => {
      subscribers.delete(onUpdate);
    };
  }, [code]);

  return packCache[code] || null;
};
