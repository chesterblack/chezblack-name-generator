import { createTranslator, resolveHostLocale, useHostLocale } from "@vvd/sdk";
import { useMemo } from "react";
import { CATALOGS } from "./tool";


export function useT() {
  const { locale } = useHostLocale();
  return useMemo(
    () => createTranslator(
      resolveHostLocale({ locale, catalogs: CATALOGS, defaultLocale: "en" })
    ),
    [locale]
  );
}
