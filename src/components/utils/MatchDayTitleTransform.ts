import { t } from 'i18next';
import MatchDayInfo from '../../features/bets/types/MatchDayInfo';

const playoffMatchDayList: string[] = [
	t(`playoffRound.1/16`),
	t(`playoffRound.1/8`),
	t(`playoffRound.1/4`),
	t(`playoffRound.1/2`),
];

export default function MatchDayTitleTransform(matchDayInfo: MatchDayInfo): string {
	let result = matchDayInfo.matchDay;
	if (!matchDayInfo.isPlayoff) {
		// return result + 'й';
		return result;
	}
	if (matchDayInfo.isPlayoff && matchDayInfo.matchDay === t(`playoffRound.final`)) {
		return result;
	}
	if (matchDayInfo.isPlayoff && playoffMatchDayList.includes(result)) {
		const idx = result.indexOf(' ');
		result = result.substring(0, idx);
		return result + ' [' + matchDayInfo.playoffRound + ']';
	}

	return '';
}
