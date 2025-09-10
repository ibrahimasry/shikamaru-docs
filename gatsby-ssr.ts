import * as React from "react";

export const onRenderBody = ({ setPreBodyComponents }: any) => {
  const noFlashScript = `
    (function () {
      try {
        var storageKey = 'theme';
        var classList = document.documentElement.classList;
        var persisted = null;
        try { persisted = localStorage.getItem(storageKey); } catch (e) {}
        var mql = window.matchMedia('(prefers-color-scheme: dark)');
        var systemPrefersDark = mql.matches;
        // Default: dark if nothing persisted
        var theme = persisted || (systemPrefersDark ? 'dark' : 'dark');
        if (theme === 'dark') {
          classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      } catch (e) {
        // ignore
      }
    })();
  `;
  setPreBodyComponents([
    React.createElement("script", {
      key: "noflash-theme-script",
      dangerouslySetInnerHTML: { __html: noFlashScript },
    }),
  ]);
};
