import React, { createContext, useContext } from 'react';

const SEOContext = createContext(null);

export const SEOProvider = ({ onCollect, children }) => (
  <SEOContext.Provider value={onCollect}>
    {children}
  </SEOContext.Provider>
);

export const useSEOCollector = () => useContext(SEOContext);

export default SEOContext;

