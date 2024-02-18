export const transformGameResult = (str: string): string => {
	str = str
		.trim()
		.replace(/[$!"№%?(){}\]§&+=]/g, '')
		.replace(/[.*;_/-]/g, ':')
		.replace(/:+/g, ':')
		.replace(/[,]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	return str;
};

export const removeExtraLabels = (str: string): string => {
	str = str
		.trim()
		.replace(/[$!"№%?{}§&+=\][(]/g, '')
		.replace(/доп\.|пен\./g, '');
	return str;
};

function isValidScore(matchScore: string, isOvertime: boolean, isPenalty: boolean): boolean {
	let scoreRegex = /^(\d+):(\d+) \((\d+):(\d+)\)$/;
	if (isOvertime && !isPenalty) {
		scoreRegex = /^\d+:\d+ \(\d+:\d+\) \[доп\.\d+:\d+\]$/;
	}
	if (isOvertime && isPenalty) {
		scoreRegex = /^\d+:\d+ \(\d+:\d+\) \[доп\.\d+:\d+, пен\.\d+:\d+\]$/;
	}

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
export default function GameScoreValidation(inputString: string): string {
	if (!inputString) {
		return '';
	}
	let isOvertime = false;
	let isPenalty = false;
	let transformedString = transformGameResult(inputString);
	console.log(transformedString);

	const numberOfSpaces = transformedString.split(' ').length - 1;
	if (numberOfSpaces === 2) {
		isOvertime = true;
	}
	if (numberOfSpaces === 3) {
		isOvertime = true;
		isPenalty = true;
	}

	if (!isOvertime && !isPenalty) {
		transformedString = transformedString.replace(/([^\s]+)\s(.+)/, '$1 ($2)');
	} else if (isOvertime && !isPenalty) {
		transformedString = transformedString.replace(/([^\s]+)\s([^\s]+)\s(.+)/, '$1 ($2) [доп.$3]');
	} else if (isOvertime && isPenalty) {
		transformedString = transformedString.replace(
			/([^\s]+)\s([^\s]+)\s([^\s]+)\s(.+)/,
			'$1 ($2) [доп.$3, пен.$4]'
		);
	}

	if (!isValidScore(transformedString, isOvertime, isPenalty)) {
		return 'Некорректный счёт матча!';
	}

	return transformedString;
}
