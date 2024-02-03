function isValidScore(matchScore: string): boolean {
	const scoreRegex = /^(\d+):(\d+) \((\d+):(\d+)\)$/;
	// const scoreRegex = /^(\d+):(\d+) \((\d+):(\d+)\) \[(\d+):(\d+)\] (\d+):(\d+)\)$/;
	// const scoreRegex = /^(\d+):(\d+)\s+(\d+):(\d+)\s+(\d+):(\d+)\s+(\d+):(\d+)$/;

	if (!scoreRegex.test(matchScore)) {
		return false;
	}
	const matchArray = scoreRegex.exec(matchScore);
	if (!matchArray) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [p, fullTimeHome, fullTimeAway, halfTimeHome, halfTimeAway] = matchArray;
	const fullTimeHomeGoals = parseInt(fullTimeHome, 10);
	const fullTimeAwayGoals = parseInt(fullTimeAway, 10);
	const halfTimeHomeGoals = parseInt(halfTimeHome, 10);
	const halfTimeAwayGoals = parseInt(halfTimeAway, 10);
	if (fullTimeHomeGoals < halfTimeHomeGoals || fullTimeAwayGoals < halfTimeAwayGoals) {
		return false;
	}
	return true;
}

// проверка корректности введенного счёта
export default function GameScoreValidation(
	inputString: string,
	isOvertime = false,
	isPenalty = false
): string {
	if (!inputString) {
		return '';
	}
	let transformedString = inputString;
	transformedString = transformedString
		.trim()
		.replace(/[$!"№%?(){}\]§&=]/g, '')
		.replace(/[.*;_/-]/g, ':')
		.replace(/:+/g, ':')
		.replace(/[,]/g, ' ')
		.replace(/\s+/g, ' ');

	if (!isOvertime && !isPenalty) {
		transformedString = transformedString.replace(/([^\s]+)\s(.+)/, '$1 ($2)');
	} else if (isOvertime && !isPenalty) {
		transformedString = transformedString.replace(/([^\s]+)\s{2}([^\s]+)\s(.+)/, '$1 ($2) [$3]');
	} else if (isOvertime && isPenalty) {
		transformedString = transformedString.replace(
			/([^\s]+)\s{3}([^\s]+)\s(.+)/,
			'$1 ($2) [от $3, пен.$3]'
		);
	}
	console.log(transformedString);

	if (!isValidScore(transformedString)) {
		return 'Некорректный счёт матча!';
	}

	return transformedString;
}
