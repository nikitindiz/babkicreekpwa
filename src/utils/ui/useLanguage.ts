import { useState } from 'react';
import { useSelector } from 'react-redux';
import { settings } from 'store';

export const useLanguage = () => {
  const profileLanguage = useSelector(settings.selectors.language);
  const websiteLanguage = localStorage.getItem('lang') || 'en';

  const [language, setLanguage] = useState<string>(
    profileLanguage || websiteLanguage || navigator.language.split('-')[0].toLowerCase(),
  );

  const setWebsiteLanguage = (lang: string) => {
    localStorage.setItem('lang', lang);
    setLanguage(lang);
  };

  return { language, setWebsiteLanguage };
};
