import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import siteNewsDE from '../i18n/de/siteNews.json';
import rulesDE from '../i18n/de/tournamentRules.json';
import translationDE from '../i18n/de/translation.json';
import siteNewsEN from '../i18n/en/siteNews.json';
import rulesEN from '../i18n/en/tournamentRules.json';
import translationEN from '../i18n/en/translation.json';
import siteNewsRU from '../i18n/ru/siteNews.json';
import rulesRU from '../i18n/ru/tournamentRules.json';
import translationRU from '../i18n/ru/translation.json';

i18n.use(initReactI18next).init({
	resources: {
		de: {
			translation: translationDE,
			siteNews: siteNewsDE,
			tournamentRules: rulesDE,
		},
		en: {
			translation: translationEN,
			siteNews: siteNewsEN,
			tournamentRules: rulesEN,
		},
		ru: {
			translation: translationRU,
			siteNews: siteNewsRU,
			tournamentRules: rulesRU,
		},
	},
	debug: false,
	fallbackLng: 'ru',
	interpolation: {
		escapeValue: false,
	},
	ns: ['translation', 'siteNews', 'tournamentRules'],
	defaultNS: 'translation',
});

export default i18n;
