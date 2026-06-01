import { t } from 'i18next';
import { MATCHDAY_TITLE_FINAL } from '../../constants';

/** Туры/слоты вида «1 [2]», «ЧМ-1 [1]» — без порядкового окончания (й / st / …). */
const MATCHDAY_SLOT_INDEX_SUFFIX = /\[\d+\]\s*$/;

const getEnglishOrdinalSuffix = (num: number): string => {
	if (num >= 11 && num <= 13) {
		return `${num}th`;
	}
	switch (num % 10) {
		case 1:
			return `${num}st`;
		case 2:
			return `${num}nd`;
		case 3:
			return `${num}rd`;
		default:
			return `${num}th`;
	}
};

const matchDayTitleViewTransform = (title: string, currentLanguage: string): string => {
	if (title === MATCHDAY_TITLE_FINAL) {
		return t(`playoffStage.final`);
	}

	if (title.startsWith('1/')) {
		return title;
	}

	if (MATCHDAY_SLOT_INDEX_SUFFIX.test(title)) {
		return title;
	}

	if (currentLanguage === 'ru') {
		return title + 'й';
	}
	if (currentLanguage === 'de') {
		return title + '.';
	}
	if (currentLanguage === 'en') {
		return getEnglishOrdinalSuffix(Number(title)).toString();
	}

	return title;
};

export default matchDayTitleViewTransform;
