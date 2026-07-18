import { useLanguage } from "../i18n/LanguageContext";
import { LANGUAGES } from "../i18n/translations";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="language-switcher" role="group" aria-label={t.languageLabel}>
      {LANGUAGES.map((option) => (
        <button
          key={option.code}
          type="button"
          className={option.code === lang ? "language-switcher__active" : ""}
          onClick={() => setLang(option.code)}
          aria-pressed={option.code === lang}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
