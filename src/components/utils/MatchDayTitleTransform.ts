import { t } from 'i18next';
import MatchDayInfo from '../../features/bets/types/MatchDayInfo';

const playoffMatchDayList: string[] = [
	t(`playoffRound.1/16`),
	t(`playoffRound.1/8`),
	t(`playoffRound.1/4`),
	t(`playoffRound.1/2`),
];

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

export default function MatchDayTitleTransform(
	matchDayInfo: MatchDayInfo,
	currentLanguage: string
): string {
	const result = matchDayInfo.matchDay;

	if (!matchDayInfo.isPlayoff) {
		if (currentLanguage === 'ru') {
			return result + 'й';
		}
		if (currentLanguage === 'de') {
			return result + '.';
		}
		if (currentLanguage === 'en') {
			return getEnglishOrdinalSuffix(Number(result)).toString();
		}
		return result;
	}

	if (
		(matchDayInfo.isPlayoff && matchDayInfo.matchDay === 'final') ||
		matchDayInfo.matchDay === t(`playoffRound.final`)
	) {
		return t(`playoffRound.final`);
	}

	if (matchDayInfo.isPlayoff && playoffMatchDayList.includes(result)) {
		// в меню добавления новой ставки можно добавить к 1/8 слово "финала" на разных языках
		// но затем его нужно отсечь и правильно обработать а также сохранить в бд просто как 1/8
		// const idx = result.indexOf(' ');
		// result = result.substring(0, idx);
		return result + ' [' + matchDayInfo.playoffRound + ']';
	}

	return '';
}
