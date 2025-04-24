import { useSelector } from 'react-redux';
import { settings, useAppDispatch } from 'store';

export const useLanguage = () => {
  const language = useSelector(settings.selectors.language);
  const dispatch = useAppDispatch();

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Russian' },
  ];

  const setWebsiteLanguage = (lang: string) => {
    dispatch(settings.actions.setLanguage(lang));
  };

  return { language: language || 'en', setWebsiteLanguage, availableLanguages };
};
