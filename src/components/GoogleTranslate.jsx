import { useEffect, useRef } from "react";

const SCRIPT_ID = "google-translate-script";

function initWidget() {
  if (!window.google?.translate?.TranslateElement) return;
  if (document.querySelector("#google_translate_element .goog-te-combo")) return;

  new window.google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "hi,en,ta,te,mr,gu,bn,kn,ml,pa,ur",
      layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
      autoDisplay: false,
    },
    "google_translate_element"
  );
}

export default function GoogleTranslate({ className = "" }) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (window.google?.translate?.TranslateElement) {
      initWidget();
      return;
    }

    window.googleTranslateElementInit = initWidget;

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      className={`notranslate overflow-hidden max-w-[78px] sm:max-w-none ${className}`}
    />
  );
}
