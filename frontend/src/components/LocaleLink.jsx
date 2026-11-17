import React from 'react';
import { Link } from 'react-router-dom';
import { useActiveLang } from '../contexts/LocaleContext';
import { buildLocalizedPath } from '../utils/localeRouting';

/**
 * Router Link wrapper that automatically scopes internal targets to the active URL locale prefix.
 */
const LocaleLink = ({ to, ...props }) => {
  const activeLang = useActiveLang();
  const localizedTo = typeof to === 'string' ? buildLocalizedPath(to, activeLang) : to;
  return <Link to={localizedTo} {...props} />;
};

export default LocaleLink;
