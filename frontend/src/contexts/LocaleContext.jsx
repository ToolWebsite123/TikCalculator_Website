import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { normalizeLang } from '../utils/localeRouting';

const LocaleContext = createContext(null);

export const LocaleProvider = ({ lang, children }) => (
  <LocaleContext.Provider value={normalizeLang(lang)}>
    {children}
  </LocaleContext.Provider>
);

export const useActiveLang = () => {
  const ctxLang = useContext(LocaleContext);
  const { i18n } = useTranslation();

  if (ctxLang) {
    return ctxLang;
  }

  return normalizeLang(i18n.resolvedLanguage || i18n.language);
};

export default LocaleContext;
