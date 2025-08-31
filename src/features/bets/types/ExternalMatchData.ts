export interface ExternalTeam {
	id: number;
	name: string; // Liverpool FC
	shortName: string; // Liverpool
	tla: string; // LIV
}

export interface ExternalScore {
	home: number;
	away: number;
}

export interface ExternalMatchData {
	competition: {
		id: number;
		name: string; // Premier League
		code: string; // PL, BL1
	};
	season: {
		currentMatchday: number; // текущий тур лиги
	};
	id: number;
	utcDate: string; // 2025-08-15T19:00:00Z
	status: string; // FINISHED
	matchday: number; // тур, к которому относится матч
	homeTeam: ExternalTeam;
	awayTeam: ExternalTeam;
	score: {
		winner: string; // HOME_TEAM, DRAW, AWAY_TEAM
		duration: string; // REGULAR - в основное время
		fullTime: ExternalScore;
		halfTime: ExternalScore;
		overTime: ExternalScore;
		penalty: ExternalScore;
	};
}

export interface ExternalMatchdayData {
	resultSet: {
		first: string; // дата начала тура "2025-08-15"
		last: string; // дата конца тура "2025-08-18"
	};
	matches: ExternalMatchData[];
}
