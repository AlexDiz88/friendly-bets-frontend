import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../i18n/en/translation.json';
import translationDE from '../i18n/de/translation.json';
import translationRU from '../i18n/ru/translation.json';

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: translationEN,
		},
		de: {
			translation: translationDE,
		},
		ru: {
			translation: translationRU,
		},
	},
	debug: true,
	fallbackLng: 'ru',
	interpolation: {
		escapeValue: false,
	},
	// if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
	// set returnNull to false (and also in the i18next.d.ts options)
	// returnNull: false,
});

// i18next.on('languageChanged', (lng) => {
// 	i18next.changeLanguage(lng);
// });

export default i18n;
