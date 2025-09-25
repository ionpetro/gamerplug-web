"use client"

import { createContext, useContext } from "react";

export type Messages = Record<string, any>;

export const I18nContext = createContext<{ locale: string; t: Messages }>({ locale: 'en', t: {} });

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({ locale, messages, children }: { locale: string; messages: Messages; children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ locale, t: messages }}>
      {children}
    </I18nContext.Provider>
  );
}


