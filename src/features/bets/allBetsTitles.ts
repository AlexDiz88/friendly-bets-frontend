const allBetsTitles = {
	popular: [
		'П1',
		'Х',
		'П2',
		'ТМ 2,5',
		'ТБ 2,5',
		'П1 + ТБ 1,5',
		'П2 + ТБ 1,5',
		'П1 + ТБ 2,5',
		'П2 + ТБ 2,5',
		'П1 + ТМ 3,5',
		'П2 + ТМ 3,5',
		'П1 + ТМ 4,5',
		'П2 + ТМ 4,5',
		'Ф1(0)',
		'Ф2(0)',
	],
	gameResult_GoalsAmount: {
		gameResult: ['П1', 'Х', 'П2', '1Х', '12', 'Х2'],
		homeTeamWin_GoalsTotalLess: [
			'П1 + ТМ 1,5',
			'П1 + ТМ 2',
			'П1 + ТМ 2,5',
			'П1 + ТМ 3',
			'П1 + ТМ 3,5',
			'П1 + ТМ 4',
			'П1 + ТМ 4,5',
			'П1 + ТМ 5',
			'П1 + ТМ 5,5',
		],
		homeTeamWin_GoalsTotalMore: [
			'П1 + ТБ 1,5',
			'П1 + ТБ 2',
			'П1 + ТБ 2,5',
			'П1 + ТБ 3',
			'П1 + ТБ 3,5',
			'П1 + ТБ 4',
			'П1 + ТБ 4,5',
			'П1 + ТБ 5',
			'П1 + ТБ 5,5',
		],
		homeTeamNotLose_GoalsTotalLess: [
			'1Х + ТМ 1,5',
			'1Х + ТМ 2',
			'1Х + ТМ 2,5',
			'1Х + ТМ 3',
			'1Х + ТМ 3,5',
			'1Х + ТМ 4',
			'1Х + ТМ 4,5',
			'1Х + ТМ 5',
			'1Х + ТМ 5,5',
		],
		homeTeamNotLose_GoalsTotalMore: [
			'1Х + ТБ 1,5',
			'1Х + ТБ 2',
			'1Х + ТБ 2,5',
			'1Х + ТБ 3',
			'1Х + ТБ 3,5',
			'1Х + ТБ 4',
			'1Х + ТБ 4,5',
			'1Х + ТБ 5',
			'1Х + ТБ 5,5',
		],
		draw_GoalsAmount: [
			'Х +  ТМ 2,5',
			'Х +  ТМ 3,5',
			'Х +  ТМ 4,5',
			'Х +  ТМ 5,5',
			'Х +  ТБ 1,5',
			'Х +  ТБ 2,5',
			'Х +  ТБ 3,5',
		],
		awayTeamWin_GoalsTotalLess: [
			'П2 + ТМ 1,5',
			'П2 + ТМ 2',
			'П2 + ТМ 2,5',
			'П2 + ТМ 3',
			'П2 + ТМ 3,5',
			'П2 + ТМ 4',
			'П2 + ТМ 4,5',
			'П2 + ТМ 5',
			'П2 + ТМ 5,5',
		],
		awayTeamWin_GoalsTotalMore: [
			'П2 + ТБ 1,5',
			'П2 + ТБ 2',
			'П2 + ТБ 2,5',
			'П2 + ТБ 3',
			'П2 + ТБ 3,5',
			'П2 + ТБ 4',
			'П2 + ТБ 4,5',
			'П2 + ТБ 5',
			'П2 + ТБ 5,5',
		],
		awayTeamNotLose_GoalsTotalLess: [
			'Х2 + ТМ 1,5',
			'Х2 + ТМ 2',
			'Х2 + ТМ 2,5',
			'Х2 + ТМ 3',
			'Х2 + ТМ 3,5',
			'Х2 + ТМ 4',
			'Х2 + ТМ 4,5',
			'Х2 + ТМ 5',
			'Х2 + ТМ 5,5',
		],
		awayTeamNotLose_GoalsTotalMore: [
			'Х2 + ТБ 1,5',
			'Х2 + ТБ 2',
			'Х2 + ТБ 2,5',
			'Х2 + ТБ 3',
			'Х2 + ТБ 3,5',
			'Х2 + ТБ 4',
			'Х2 + ТБ 4,5',
			'Х2 + ТБ 5',
			'Х2 + ТБ 5,5',
		],
		no_draw_GoalsAmount: [
			'12 +  ТМ 2,5',
			'12 +  ТМ 3,5',
			'12 +  ТМ 4,5',
			'12 +  ТМ 5,5',
			'12 +  ТБ 1,5',
			'12 +  ТБ 2,5',
			'12 +  ТБ 3,5',
			'12 +  ТБ 4,5',
		],
	},
	goalsAmount: {
		goalsTotalAmount: [
			'ТМ 1,5',
			'ТМ 2',
			'ТМ 2,5',
			'ТМ 3',
			'ТМ 3,5',
			'ТМ 4',
			'ТМ 4,5',
			'ТМ 5',
			'ТМ 5,5',
			'ТМ 6',

			'ТБ 1,5',
			'ТБ 2',
			'ТБ 2,5',
			'ТБ 3',
			'ТБ 3,5',
			'ТБ 4',
			'ТБ 4,5',
			'ТБ 5',
			'ТБ 5,5',
			'ТБ 6',
		],
		homeTeamGoalsAmount: [
			'Хозяева ИТМ 1,5',
			'Хозяева ИТМ 2',
			'Хозяева ИТМ 2,5',
			'Хозяева ИТМ 3',
			'Хозяева ИТМ 3,5',
			'Хозяева ИТМ 4',
			'Хозяева ИТМ 4,5',

			'Хозяева ИТБ 1,5',
			'Хозяева ИТБ 2',
			'Хозяева ИТБ 2,5',
			'Хозяева ИТБ 3',
			'Хозяева ИТБ 3,5',
			'Хозяева ИТБ 4',
			'Хозяева ИТБ 4,5',
		],
		awayTeamGoalsAmount: [
			'Гости ИТМ 1,5',
			'Гости ИТМ 2',
			'Гости ИТМ 2,5',
			'Гости ИТМ 3',
			'Гости ИТМ 3,5',
			'Гости ИТМ 4',
			'Гости ИТМ 4,5',

			'Гости ИТБ 1,5',
			'Гости ИТБ 2',
			'Гости ИТБ 2,5',
			'Гости ИТБ 3',
			'Гости ИТБ 3,5',
			'Гости ИТБ 4',
			'Гости ИТБ 4,5',
		],
	},
	handicap: [
		'Ф1(0)',
		'Ф1(-1)',
		'Ф1(+1)',
		'Ф1(-1.5)',
		'Ф1(+1.5)',
		'Ф1(-2)',
		'Ф1(+2)',
		'Ф1(-2.5)',
		'Ф1(+2.5)',
		'Ф1(-3)',
		'Ф1(+3)',
		'Ф1(-3.5)',
		'Ф1(+3.5)',
		'Ф1(-4)',
		'Ф1(+4)',
		'Ф1(-4.5)',
		'Ф1(+4.5)',
		'Ф1(-5)',
		'Ф1(+5)',

		'Ф2(0)',
		'Ф2(-1)',
		'Ф2(+1)',
		'Ф2(-1.5)',
		'Ф2(+1.5)',
		'Ф2(-2)',
		'Ф2(+2)',
		'Ф2(-2.5)',
		'Ф2(+2.5)',
		'Ф2(-3)',
		'Ф2(+3)',
		'Ф2(-3.5)',
		'Ф2(+3.5)',
		'Ф2(-4)',
		'Ф2(+4)',
		'Ф2(-4.5)',
		'Ф2(+4.5)',
		'Ф2(-5)',
		'Ф2(+5)',
	],
	gameScore: {
		normalGameScore: [
			'Счёт 0:0',
			'Счёт 1:0',
			'Счёт 2:0',
			'Счёт 3:0',
			'Счёт 0:1',
			'Счёт 1:1',
			'Счёт 2:1',
			'Счёт 3:1',
			'Счёт 0:2',
			'Счёт 1:2',
			'Счёт 2:2',
			'Счёт 3:2',
			'Счёт 0:3',
			'Счёт 1:3',
			'Счёт 2:3',
			'Счёт 3:3',
		],
		unusualGameScore: [
			'Счёт 0:4',
			'Счёт 4:0',
			'Счёт 0:5',
			'Счёт 5:0',
			'Счёт 1:4',
			'Счёт 4:1',
			'Счёт 1:5',
			'Счёт 5:1',
			'Счёт 2:4',
			'Счёт 4:2',
			'Счёт 2:5',
			'Счёт 5:2',
			'Счёт 3:4',
			'Счёт 4:3',
			'Счёт 3:5',
			'Счёт 5:3',
			'Счёт 4:4',
			'Счёт 4:5',
			'Счёт 5:4',
			'Счёт 5:5',
		],
	},
	goals: {
		bothTeamScore: ['Обе забьют', 'Хозяева забьют', 'Гости забьют'],
		bothTeamScore_Half: [
			'Хозяева забьют в 1 тайме',
			'Хозяева забьют во 2 тайме',
			'Гости забьют в 1 тайме',
			'Гости забьют во 2 тайме',
			'Хозяева забьют в обоих таймах',
			'Гости забьют в обоих таймах',
			'Обе забьют в 1 тайме',
			'Обе забьют во 2 тайме',
			'Обе забьют в обоих таймах',
			'Голы в обоих таймах',
		],
		bothTeamScore_GameResult: [
			'П1 + Обе забьют',
			'П2 + Обе забьют',
			'1Х + Обе забьют',
			'Х2 + Обе забьют',
			'Х + Обе забьют',
			'12 + Обе забьют',
		],
		bothTeamScore_GoalsAmount: [
			'ОЗ +  ТМ 1,5',
			'ОЗ +  ТМ 2',
			'ОЗ +  ТМ 2,5',
			'ОЗ +  ТМ 3',
			'ОЗ +  ТМ 3,5',
			'ОЗ +  ТМ 4',
			'ОЗ +  ТМ 4,5',
			'ОЗ +  ТМ 5',
			'ОЗ +  ТМ 5,5',

			'ОЗ +  ТБ 1,5',
			'ОЗ +  ТБ 2',
			'ОЗ +  ТБ 2,5',
			'ОЗ +  ТБ 3',
			'ОЗ +  ТБ 3,5',
			'ОЗ +  ТБ 4',
			'ОЗ +  ТБ 4,5',
			'ОЗ +  ТБ 5',
			'ОЗ +  ТБ 5,5',
		],
		anyTeamScoresMoreThan: [
			'Любая команда забьет 2 и больше голов',
			'Любая команда забьет 3 и больше голов',
			'Любая команда забьет 4 и больше голов',
			'Любая команда забьет 5 и больше голов',
		],
	},
	half: {
		half_gameResult: [
			'1й тайм: П1',
			'1й тайм: Х',
			'1й тайм: П2',
			'1й тайм: Х1',
			'1й тайм: 12',
			'1й тайм: Х2',
			'2й тайм: П1',
			'2й тайм: Х',
			'2й тайм: П2',
			'2й тайм: Х1',
			'2й тайм: 12',
			'2й тайм: Х2',
			'Любой тайм: П1',
			'Любой тайм: Х',
			'Любой тайм: П2',
		],
		firstHalf_gameResult: [
			'Тайм/Матч: П1 / П1',
			'Тайм/Матч: П1 / Х',
			'Тайм/Матч: П1 / П2',
			'Тайм/Матч: Х / П1',
			'Тайм/Матч: Х / Х',
			'Тайм/Матч: Х / П2',
			'Тайм/Матч: П2 / П1',
			'Тайм/Матч: П2 / Х',
			'Тайм/Матч: П2 / П2',
		],
		firstHalf_secondHalf: [
			'1й/2й тайм: П1 / П1',
			'1й/2й тайм: П1 / Х',
			'1й/2й тайм: П1 / П2',
			'1й/2й тайм: Х / П1',
			'1й/2й тайм: Х / Х',
			'1й/2й тайм: Х / П2',
			'1й/2й тайм: П2 / П1',
			'1й/2й тайм: П2 / Х',
			'1й/2й тайм: П2 / П2',
		],
		firstHalf_gameScore: [
			'1й тайм: 0:0',
			'1й тайм: 1:0',
			'1й тайм: 2:0',
			'1й тайм: 3:0',
			'1й тайм: 0:1',
			'1й тайм: 1:1',
			'1й тайм: 2:1',
			'1й тайм: 3:1',
			'1й тайм: 0:2',
			'1й тайм: 1:2',
			'1й тайм: 2:2',
			'1й тайм: 3:2',
			'1й тайм: 0:3',
			'1й тайм: 1:3',
			'1й тайм: 2:3',
			'1й тайм: 3:3',
		],
		secondHalf_gameScore: [
			'2й тайм: 0:0',
			'2й тайм: 1:0',
			'2й тайм: 2:0',
			'2й тайм: 3:0',
			'2й тайм: 0:1',
			'2й тайм: 1:1',
			'2й тайм: 2:1',
			'2й тайм: 3:1',
			'2й тайм: 0:2',
			'2й тайм: 1:2',
			'2й тайм: 2:2',
			'2й тайм: 3:2',
			'2й тайм: 0:3',
			'2й тайм: 1:3',
			'2й тайм: 2:3',
			'2й тайм: 3:3',
		],
		bothTeamScore_halfGameResult: [
			'1й тайм: ОЗ + П1',
			'1й тайм: ОЗ + Х',
			'1й тайм: ОЗ + П2',
			'1й тайм: ОЗ + 1Х',
			'1й тайм: ОЗ + 12',
			'1й тайм: ОЗ + Х2',
			'2й тайм: ОЗ + П1',
			'2й тайм: ОЗ + Х',
			'2й тайм: ОЗ + П2',
			'2й тайм: ОЗ + 1Х',
			'2й тайм: ОЗ + 12',
			'2й тайм: ОЗ + Х2',
		],
		firstHalf_Handicap: [
			'1й тайм: Ф1(0)',
			'1й тайм: Ф1(-1)',
			'1й тайм: Ф1(+1)',
			'1й тайм: Ф1(-1,5)',
			'1й тайм: Ф1(+1,5)',
			'1й тайм: Ф1(-2)',
			'1й тайм: Ф1(+2)',
			'1й тайм: Ф1(-2,5)',
			'1й тайм: Ф1(+2,5)',
			'1й тайм: Ф2(0)',
			'1й тайм: Ф2(-1)',
			'1й тайм: Ф2(+1)',
			'1й тайм: Ф2(-1,5)',
			'1й тайм: Ф2(+1,5)',
			'1й тайм: Ф2(-2)',
			'1й тайм: Ф2(+2)',
			'1й тайм: Ф2(-2,5)',
			'1й тайм: Ф2(+2,5)',
		],
		secondHalf_Handicap: [
			'2й тайм: Ф1(0)',
			'2й тайм: Ф1(-1)',
			'2й тайм: Ф1(+1)',
			'2й тайм: Ф1(-1,5)',
			'2й тайм: Ф1(+1,5)',
			'2й тайм: Ф1(-2)',
			'2й тайм: Ф1(+2)',
			'2й тайм: Ф1(-2,5)',
			'2й тайм: Ф1(+2,5)',
			'2й тайм: Ф2(0)',
			'2й тайм: Ф2(-1)',
			'2й тайм: Ф2(+1)',
			'2й тайм: Ф2(-1,5)',
			'2й тайм: Ф2(+1,5)',
			'2й тайм: Ф2(-2)',
			'2й тайм: Ф2(+2)',
			'2й тайм: Ф2(-2,5)',
			'2й тайм: Ф2(+2,5)',
		],
		firstHalf_GoalsAmount: [
			'1й тайм: ТМ 0,5',
			'1й тайм: ТМ 1',
			'1й тайм: ТМ 1,5',
			'1й тайм: ТМ 2',
			'1й тайм: ТМ 2,5',
			'1й тайм: ТМ 3',
			'1й тайм: ТМ 3,5',
			'1й тайм: ТБ 0,5',
			'1й тайм: ТБ 1',
			'1й тайм: ТБ 1,5',
			'1й тайм: ТБ 2',
			'1й тайм: ТБ 2,5',
			'1й тайм: ТБ 3',
			'1й тайм: ТБ 3,5',
		],
		secondHalf_GoalsAmount: [
			'2й тайм: ТМ 0,5',
			'2й тайм: ТМ 1',
			'2й тайм: ТМ 1,5',
			'2й тайм: ТМ 2',
			'2й тайм: ТМ 2,5',
			'2й тайм: ТМ 3',
			'2й тайм: ТМ 3,5',
			'2й тайм: ТБ 0,5',
			'2й тайм: ТБ 1',
			'2й тайм: ТБ 1,5',
			'2й тайм: ТБ 2',
			'2й тайм: ТБ 2,5',
			'2й тайм: ТБ 3',
			'2й тайм: ТБ 3,5',
		],
		firstHalf_homeTeamGoalsAmount: [
			'1й тайм: Хозяева ИТМ 0,5',
			'1й тайм: Хозяева ИТМ 1',
			'1й тайм: Хозяева ИТМ 1,5',
			'1й тайм: Хозяева ИТМ 2',
			'1й тайм: Хозяева ИТМ 2,5',
			'1й тайм: Хозяева ИТМ 3',
			'1й тайм: Хозяева ИТБ 0,5',
			'1й тайм: Хозяева ИТБ 1',
			'1й тайм: Хозяева ИТБ 1,5',
			'1й тайм: Хозяева ИТБ 2',
			'1й тайм: Хозяева ИТБ 2,5',
			'1й тайм: Хозяева ИТБ 3',
		],
		secondHalf_homeTeamGoalsAmount: [
			'2й тайм: Хозяева ИТМ 0,5',
			'2й тайм: Хозяева ИТМ 1',
			'2й тайм: Хозяева ИТМ 1,5',
			'2й тайм: Хозяева ИТМ 2',
			'2й тайм: Хозяева ИТМ 2,5',
			'2й тайм: Хозяева ИТМ 3',
			'2й тайм: Хозяева ИТБ 0,5',
			'2й тайм: Хозяева ИТБ 1',
			'2й тайм: Хозяева ИТБ 1,5',
			'2й тайм: Хозяева ИТБ 2',
			'2й тайм: Хозяева ИТБ 2,5',
			'2й тайм: Хозяева ИТБ 3',
		],
		firstHalf_awayTeamGoalsAmount: [
			'1й тайм: Гости ИТМ 0,5',
			'1й тайм: Гости ИТМ 1',
			'1й тайм: Гости ИТМ 1,5',
			'1й тайм: Гости ИТМ 2',
			'1й тайм: Гости ИТМ 2,5',
			'1й тайм: Гости ИТМ 3',
			'1й тайм: Гости ИТБ 0,5',
			'1й тайм: Гости ИТБ 1',
			'1й тайм: Гости ИТБ 1,5',
			'1й тайм: Гости ИТБ 2',
			'1й тайм: Гости ИТБ 2,5',
			'1й тайм: Гости ИТБ 3',
		],
		secondHalf_awayTeamGoalsAmount: [
			'2й тайм: Гости ИТМ 0,5',
			'2й тайм: Гости ИТМ 1',
			'2й тайм: Гости ИТМ 1,5',
			'2й тайм: Гости ИТМ 2',
			'2й тайм: Гости ИТМ 2,5',
			'2й тайм: Гости ИТМ 3',
			'2й тайм: Гости ИТБ 0,5',
			'2й тайм: Гости ИТБ 1',
			'2й тайм: Гости ИТБ 1,5',
			'2й тайм: Гости ИТБ 2',
			'2й тайм: Гости ИТБ 2,5',
			'2й тайм: Гости ИТБ 3',
		],
		firstHalf_gameResult_GoalsTotalLess: [
			'1й тайм: П1 + ТМ 1,5',
			'1й тайм: Х + ТМ 1,5',
			'1й тайм: П2 + ТМ 1,5',
			'1й тайм: 1Х + ТМ 1,5',
			'1й тайм: 12 + ТМ 1,5',
			'1й тайм: Х2 + ТМ 1,5',
			'1й тайм: П1 + ТМ 2',
			'1й тайм: Х + ТМ 2',
			'1й тайм: П2 + ТМ 2',
			'1й тайм: 1Х + ТМ 2',
			'1й тайм: 12 + ТМ 2',
			'1й тайм: Х2 + ТМ 2',
			'1й тайм: П1 + ТМ 2,5',
			'1й тайм: Х + ТМ 2,5',
			'1й тайм: П2 + ТМ 2,5',
			'1й тайм: 1Х + ТМ 2,5',
			'1й тайм: 12 + ТМ 2,5',
			'1й тайм: Х2 + ТМ 2,5',
			'1й тайм: П1 + ТМ 3',
			'1й тайм: Х + ТМ 3',
			'1й тайм: П2 + ТМ 3',
			'1й тайм: 1Х + ТМ 3',
			'1й тайм: 12 + ТМ 3',
			'1й тайм: Х2 + ТМ 3',
			'1й тайм: П1 + ТМ 3,5',
			'1й тайм: Х + ТМ 3,5',
			'1й тайм: П2 + ТМ 3,5',
			'1й тайм: 1Х + ТМ 3,5',
			'1й тайм: 12 + ТМ 3,5',
			'1й тайм: Х2 + ТМ 3,5',
		],
		firstHalf_gameResult_GoalsTotalMore: [
			'1й тайм: П1 + ТБ 1,5',
			'1й тайм: Х + ТБ 1,5',
			'1й тайм: П2 + ТБ 1,5',
			'1й тайм: 1Х + ТБ 1,5',
			'1й тайм: 12 + ТБ 1,5',
			'1й тайм: Х2 + ТБ 1,5',
			'1й тайм: П1 + ТБ 2',
			'1й тайм: Х + ТБ 2',
			'1й тайм: П2 + ТБ 2',
			'1й тайм: 1Х + ТБ 2',
			'1й тайм: 12 + ТБ 2',
			'1й тайм: Х2 + ТБ 2',
			'1й тайм: П1 + ТБ 2,5',
			'1й тайм: Х + ТБ 2,5',
			'1й тайм: П2 + ТБ 2,5',
			'1й тайм: 1Х + ТБ 2,5',
			'1й тайм: 12 + ТБ 2,5',
			'1й тайм: Х2 + ТБ 2,5',
			'1й тайм: П1 + ТБ 3',
			'1й тайм: Х + ТБ 3',
			'1й тайм: П2 + ТБ 3',
			'1й тайм: 1Х + ТБ 3',
			'1й тайм: 12 + ТБ 3',
			'1й тайм: Х2 + ТБ 3',
			'1й тайм: П1 + ТБ 3,5',
			'1й тайм: Х + ТБ 3,5',
			'1й тайм: П2 + ТБ 3,5',
			'1й тайм: 1Х + ТБ 3,5',
			'1й тайм: 12 + ТБ 3,5',
			'1й тайм: Х2 + ТБ 3,5',
		],
		secondHalf_gameResult_GoalsTotalLess: [
			'2й тайм: П1 + ТМ 1,5',
			'2й тайм: Х + ТМ 1,5',
			'2й тайм: П2 + ТМ 1,5',
			'2й тайм: 1Х + ТМ 1,5',
			'2й тайм: 12 + ТМ 1,5',
			'2й тайм: Х2 + ТМ 1,5',
			'2й тайм: П1 + ТМ 2',
			'2й тайм: Х + ТМ 2',
			'2й тайм: П2 + ТМ 2',
			'2й тайм: 1Х + ТМ 2',
			'2й тайм: 12 + ТМ 2',
			'2й тайм: Х2 + ТМ 2',
			'2й тайм: П1 + ТМ 2,5',
			'2й тайм: Х + ТМ 2,5',
			'2й тайм: П2 + ТМ 2,5',
			'2й тайм: 1Х + ТМ 2,5',
			'2й тайм: 12 + ТМ 2,5',
			'2й тайм: Х2 + ТМ 2,5',
			'2й тайм: П1 + ТМ 3',
			'2й тайм: Х + ТМ 3',
			'2й тайм: П2 + ТМ 3',
			'2й тайм: 1Х + ТМ 3',
			'2й тайм: 12 + ТМ 3',
			'2й тайм: Х2 + ТМ 3',
			'2й тайм: П1 + ТМ 3,5',
			'2й тайм: Х + ТМ 3,5',
			'2й тайм: П2 + ТМ 3,5',
			'2й тайм: 1Х + ТМ 3,5',
			'2й тайм: 12 + ТМ 3,5',
			'2й тайм: Х2 + ТМ 3,5',
		],
		secondHalf_gameResult_GoalsTotalMore: [
			'2й тайм: П1 + ТБ 1,5',
			'2й тайм: Х + ТБ 1,5',
			'2й тайм: П2 + ТБ 1,5',
			'2й тайм: 1Х + ТБ 1,5',
			'2й тайм: 12 + ТБ 1,5',
			'2й тайм: Х2 + ТБ 1,5',
			'2й тайм: П1 + ТБ 2',
			'2й тайм: Х + ТБ 2',
			'2й тайм: П2 + ТБ 2',
			'2й тайм: 1Х + ТБ 2',
			'2й тайм: 12 + ТБ 2',
			'2й тайм: Х2 + ТБ 2',
			'2й тайм: П1 + ТБ 2,5',
			'2й тайм: Х + ТБ 2,5',
			'2й тайм: П2 + ТБ 2,5',
			'2й тайм: 1Х + ТБ 2,5',
			'2й тайм: 12 + ТБ 2,5',
			'2й тайм: Х2 + ТБ 2,5',
			'2й тайм: П1 + ТБ 3',
			'2й тайм: Х + ТБ 3',
			'2й тайм: П2 + ТБ 3',
			'2й тайм: 1Х + ТБ 3',
			'2й тайм: 12 + ТБ 3',
			'2й тайм: Х2 + ТБ 3',
			'2й тайм: П1 + ТБ 3,5',
			'2й тайм: Х + ТБ 3,5',
			'2й тайм: П2 + ТБ 3,5',
			'2й тайм: 1Х + ТБ 3,5',
			'2й тайм: 12 + ТБ 3,5',
			'2й тайм: Х2 + ТБ 3,5',
		],
		halfWithMoreGoals: [
			'Тотал голов: 1й > 2й тайм',
			'Тотал голов: Поровну',
			'Тотал голов: 1й < 2й тайм',
			'Тотал голов: (Хозяева) 1й > 2й тайм',
			'Тотал голов: (Хозяева) Поровну',
			'Тотал голов: (Хозяева) 1й < 2й тайм',
			'Тотал голов: (Гости) 1й > 2й тайм',
			'Тотал голов: (Гости) Поровну',
			'Тотал голов: (Гости) 1й < 2й тайм',
		],
	},
	special: {
		cleanWin: ['Хозяева - победа всухую', 'Гости - победа всухую', 'Любая - победа всухую'],
		goalsDifference: [
			'П1 в 1 гол',
			'П2 в 1 гол',
			'П1 в 2 гола',
			'П2 в 2 гола',
			'П1 в 3 гола',
			'П2 в 3 гола',
			'П1 или П2 в 1 гол',
			'П1 или П2 в 2 гола',
			'П1 или П2 в 3 гола',
		],
		playoff: [
			'Дополнительное время',
			'Послематчевые пенальти',
			'П1 в осн.время',
			'П2 в осн.время',
			'12 в осн.время',
			'П1 в доп.время',
			'П2 в доп.время',
			'12 в доп.время',
			'П1 по пенальти',
			'П2 по пенальти',
			'12 по пенальти',
			'Хозяева - выход в след.стадию',
			'Гости - выход в след.стадию',
			'Хозяева - выход в финал',
			'Гости - выход в финал',
			'Хозяева - победитель турнира',
			'Гости - победитель турнира',
		],
	},
};

export default allBetsTitles;
