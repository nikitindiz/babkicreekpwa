import { FC, useState, useRef, useEffect } from 'react';
import { useLanguage } from 'utils/ui/useLanguage';
import classes from './LanguageSelector.module.scss';

interface LanguageSelectorProps {}

export const LanguageSelector: FC<LanguageSelectorProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setWebsiteLanguage, availableLanguages } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageChange = (lang: string) => {
    setWebsiteLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className={classes.languageSelector} ref={dropdownRef}>
      <button className={classes.currentLanguage} onClick={toggleDropdown}>
        {language.toUpperCase()}
      </button>

      {isOpen && (
        <div className={classes.dropdown}>
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              className={`${classes.option} ${lang.code === language ? classes.active : ''}`}
              onClick={() => handleLanguageChange(lang.code)}>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
