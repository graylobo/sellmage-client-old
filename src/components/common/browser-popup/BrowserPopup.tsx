import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface BrowserPopupProps {
  name: string;
  children: React.ReactNode;
}

export const BrowserPopup = ({ name, children }: BrowserPopupProps) => {
  const _window = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // If open, create window and store in ref
    if (open) {
      _window.current = window.open(
        "",
        "",
        "width=600,height=400,left=200,top=200"
      );

      // Save reference to window for cleanup
      const curWindow = _window.current;
      curWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
           
          </head>
          <body>
            <div id="root"></div>
          </body>
        </html>
      `);
      curWindow.document.close();
      curWindow.onbeforeunload = () => {
        setReady(false);
        setOpen(false);
      };

      setReady(true);

      // Return cleanup function
    } else {
      _window.current?.close();
      setReady(false);
    }
  }, [open]);

  useEffect(() => {
    if (_window.current) {
      copyStyles(window.document, _window.current.document);
    }
  }, [ready]);

  return (
    <>
      <button onClick={() => setOpen(true)}>{name}</button>
      {open && ready && createPortal(children, _window.current?.document.body)}
    </>
  );
};
function copyStyles(src, dest) {
  Array.from(src.styleSheets).forEach((styleSheet: any) => {
    dest.head.appendChild(styleSheet.ownerNode.cloneNode(true));
  });
  Array.from(src.fonts).forEach((font) => dest.fonts.add(font));
}
