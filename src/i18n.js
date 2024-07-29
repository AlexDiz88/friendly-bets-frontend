import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import siteNewsDE from '../i18n/de/siteNews.json';
import teamsDE from '../i18n/de/teams.json';
import rulesDE from '../i18n/de/tournamentRules.json';
import translationDE from '../i18n/de/translation.json';
import siteNewsEN from '../i18n/en/siteNews.json';
import teamsEN from '../i18n/en/teams.json';
import rulesEN from '../i18n/en/tournamentRules.json';
import translationEN from '../i18n/en/translation.json';
import siteNewsRU from '../i18n/ru/siteNews.json';
import teamsRU from '../i18n/ru/teams.json';
import rulesRU from '../i18n/ru/tournamentRules.json';
import translationRU from '../i18n/ru/translation.json';

i18n.use(initReactI18next).init({
	resources: {
		de: {
			translation: translationDE,
			siteNews: siteNewsDE,
			tournamentRules: rulesDE,
			teams: teamsDE,
		},
		en: {
			translation: translationEN,
			siteNews: siteNewsEN,
			tournamentRules: rulesEN,
			teams: teamsEN,
		},
		ru: {
			translation: translationRU,
			siteNews: siteNewsRU,
			tournamentRules: rulesRU,
			teams: teamsRU,
		},
	},
	debug: false,
	fallbackLng: 'ru',
	interpolation: {
		escapeValue: false,
	},
	ns: ['translation', 'siteNews', 'tournamentRules', 'teams'], // Указываем пространства имен
	defaultNS: 'translation', // Указываем пространство имен по умолчанию
	// if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
	// set returnNull to false (and also in the i18next.d.ts options)
	// returnNull: false,
});

export default i18n;
