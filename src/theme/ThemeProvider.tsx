import React, { useState } from "react";
import { ThemeProvider } from "@mui/material";
import { themeCreator } from "./base";
import { useTranslation } from "react-i18next";
import { StylesProvider } from "@mui/styles";

import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
// Configure JSS

const cacheRtl = createCache({
  key: "muirtl",
  // prefixer is the only stylis plugin by default, so when
  // overriding the plugins you need to include it explicitly
  // if you want to retain the auto-prefixing behavior.
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: "muiltr",
});

export const ThemeContext = React.createContext(
  (themeName: string): void => {}
);

const ThemeProviderWrapper: React.FC = (props) => {
  const { i18n } = useTranslation();
  const direction = i18n.dir();
  const curThemeName = localStorage.getItem("appTheme") || "PureLightTheme";
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    localStorage.setItem("appTheme", themeName);
    _setThemeName(themeName);
  };

  return (
    <StylesProvider injectFirst>
      <CacheProvider value={direction === "rtl" ? cacheRtl : cacheLtr}>
        <ThemeContext.Provider value={setThemeName}>
          <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
        </ThemeContext.Provider>
      </CacheProvider>
    </StylesProvider>
  );
};

export default ThemeProviderWrapper;
