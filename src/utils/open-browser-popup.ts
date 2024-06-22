import React from "react";
import { createRoot } from "react-dom/client";

export function openBrowserPopup(
  component: React.ReactNode,
  title: string,
  width: number,
  height: number
) {
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    "",
    title,
    `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
  );

  if (popup) {
    popup.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${title}</title>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `);
    popup.document.close();

    const rootElement = popup.document.getElementById("root");
    if (rootElement) {
      const root = createRoot(rootElement);
      root.render(component);
    }

    popup.focus();
  }

  return popup;
}
