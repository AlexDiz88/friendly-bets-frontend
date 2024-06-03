import MatchDayInfo from '../../features/bets/types/MatchDayInfo';

export default function MatchDayTitleTransform(matchDayInfo: MatchDayInfo): string {
	let result = matchDayInfo.matchDay;
	if (!matchDayInfo.isPlayoff) {
		// оптимизировать под разные языки?
		// return result + 'й';
		return result;
	}
	if (matchDayInfo.isPlayoff && matchDayInfo.matchDay === 'Финал') {
		return result;
	}
	if (matchDayInfo.isPlayoff && matchDayInfo.matchDay.includes('1/')) {
		const idx = result.indexOf(' ');
		result = result.substring(0, idx);
		return result + ' [' + matchDayInfo.playoffRound + ']';
	}

	return '';
}
