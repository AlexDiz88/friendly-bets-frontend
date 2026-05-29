export type Wc26TeamId =
	| 'MEX'
	| 'RSA'
	| 'KOR'
	| 'CZE'
	| 'CAN'
	| 'SUI'
	| 'QAT'
	| 'BIH'
	| 'BRA'
	| 'MAR'
	| 'HAI'
	| 'SCO'
	| 'USA'
	| 'PAR'
	| 'AUS'
	| 'TUR'
	| 'GER'
	| 'CUW'
	| 'CIV'
	| 'ECU'
	| 'NED'
	| 'JPN'
	| 'TUN'
	| 'SWE'
	| 'KSA'
	| 'URU'
	| 'ESP'
	| 'CPV'
	| 'IRN'
	| 'NZL'
	| 'BEL'
	| 'EGY'
	| 'FRA'
	| 'SEN'
	| 'IRQ'
	| 'NOR'
	| 'ARG'
	| 'ALG'
	| 'AUT'
	| 'JOR'
	| 'ENG'
	| 'CRO'
	| 'GHA'
	| 'PAN'
	| 'POR'
	| 'UZB'
	| 'COL'
	| 'COD';

export interface Wc26Team {
	id: Wc26TeamId;
	fifaCode: string;
	/** Код для flagcdn.com (gb-eng, gb-sct, …). */
	isoFlag: string;
	fifaSlug: string;
	nameKey: string;
}

export const WC26_TEAMS: Record<Wc26TeamId, Wc26Team> = {
	MEX: { id: 'MEX', fifaCode: 'MEX', isoFlag: 'mx', fifaSlug: 'mexico', nameKey: 'wc26.teams.MEX' },
	RSA: { id: 'RSA', fifaCode: 'RSA', isoFlag: 'za', fifaSlug: 'south-africa', nameKey: 'wc26.teams.RSA' },
	KOR: { id: 'KOR', fifaCode: 'KOR', isoFlag: 'kr', fifaSlug: 'korea-republic', nameKey: 'wc26.teams.KOR' },
	CZE: { id: 'CZE', fifaCode: 'CZE', isoFlag: 'cz', fifaSlug: 'czechia', nameKey: 'wc26.teams.CZE' },
	CAN: { id: 'CAN', fifaCode: 'CAN', isoFlag: 'ca', fifaSlug: 'canada', nameKey: 'wc26.teams.CAN' },
	SUI: { id: 'SUI', fifaCode: 'SUI', isoFlag: 'ch', fifaSlug: 'switzerland', nameKey: 'wc26.teams.SUI' },
	QAT: { id: 'QAT', fifaCode: 'QAT', isoFlag: 'qa', fifaSlug: 'qatar', nameKey: 'wc26.teams.QAT' },
	BIH: {
		id: 'BIH',
		fifaCode: 'BIH',
		isoFlag: 'ba',
		fifaSlug: 'bosnia-and-herzegovina',
		nameKey: 'wc26.teams.BIH',
	},
	BRA: { id: 'BRA', fifaCode: 'BRA', isoFlag: 'br', fifaSlug: 'brazil', nameKey: 'wc26.teams.BRA' },
	MAR: { id: 'MAR', fifaCode: 'MAR', isoFlag: 'ma', fifaSlug: 'morocco', nameKey: 'wc26.teams.MAR' },
	HAI: { id: 'HAI', fifaCode: 'HAI', isoFlag: 'ht', fifaSlug: 'haiti', nameKey: 'wc26.teams.HAI' },
	SCO: { id: 'SCO', fifaCode: 'SCO', isoFlag: 'gb-sct', fifaSlug: 'scotland', nameKey: 'wc26.teams.SCO' },
	USA: { id: 'USA', fifaCode: 'USA', isoFlag: 'us', fifaSlug: 'usa', nameKey: 'wc26.teams.USA' },
	PAR: { id: 'PAR', fifaCode: 'PAR', isoFlag: 'py', fifaSlug: 'paraguay', nameKey: 'wc26.teams.PAR' },
	AUS: { id: 'AUS', fifaCode: 'AUS', isoFlag: 'au', fifaSlug: 'australia', nameKey: 'wc26.teams.AUS' },
	TUR: { id: 'TUR', fifaCode: 'TUR', isoFlag: 'tr', fifaSlug: 'turkiye', nameKey: 'wc26.teams.TUR' },
	GER: { id: 'GER', fifaCode: 'GER', isoFlag: 'de', fifaSlug: 'germany', nameKey: 'wc26.teams.GER' },
	CUW: { id: 'CUW', fifaCode: 'CUW', isoFlag: 'cw', fifaSlug: 'curacao', nameKey: 'wc26.teams.CUW' },
	CIV: { id: 'CIV', fifaCode: 'CIV', isoFlag: 'ci', fifaSlug: 'cote-divoire', nameKey: 'wc26.teams.CIV' },
	ECU: { id: 'ECU', fifaCode: 'ECU', isoFlag: 'ec', fifaSlug: 'ecuador', nameKey: 'wc26.teams.ECU' },
	NED: { id: 'NED', fifaCode: 'NED', isoFlag: 'nl', fifaSlug: 'netherlands', nameKey: 'wc26.teams.NED' },
	JPN: { id: 'JPN', fifaCode: 'JPN', isoFlag: 'jp', fifaSlug: 'japan', nameKey: 'wc26.teams.JPN' },
	TUN: { id: 'TUN', fifaCode: 'TUN', isoFlag: 'tn', fifaSlug: 'tunisia', nameKey: 'wc26.teams.TUN' },
	SWE: { id: 'SWE', fifaCode: 'SWE', isoFlag: 'se', fifaSlug: 'sweden', nameKey: 'wc26.teams.SWE' },
	KSA: { id: 'KSA', fifaCode: 'KSA', isoFlag: 'sa', fifaSlug: 'saudi-arabia', nameKey: 'wc26.teams.KSA' },
	URU: { id: 'URU', fifaCode: 'URU', isoFlag: 'uy', fifaSlug: 'uruguay', nameKey: 'wc26.teams.URU' },
	ESP: { id: 'ESP', fifaCode: 'ESP', isoFlag: 'es', fifaSlug: 'spain', nameKey: 'wc26.teams.ESP' },
	CPV: { id: 'CPV', fifaCode: 'CPV', isoFlag: 'cv', fifaSlug: 'cabo-verde', nameKey: 'wc26.teams.CPV' },
	IRN: { id: 'IRN', fifaCode: 'IRN', isoFlag: 'ir', fifaSlug: 'iran', nameKey: 'wc26.teams.IRN' },
	NZL: { id: 'NZL', fifaCode: 'NZL', isoFlag: 'nz', fifaSlug: 'new-zealand', nameKey: 'wc26.teams.NZL' },
	BEL: { id: 'BEL', fifaCode: 'BEL', isoFlag: 'be', fifaSlug: 'belgium', nameKey: 'wc26.teams.BEL' },
	EGY: { id: 'EGY', fifaCode: 'EGY', isoFlag: 'eg', fifaSlug: 'egypt', nameKey: 'wc26.teams.EGY' },
	FRA: { id: 'FRA', fifaCode: 'FRA', isoFlag: 'fr', fifaSlug: 'france', nameKey: 'wc26.teams.FRA' },
	SEN: { id: 'SEN', fifaCode: 'SEN', isoFlag: 'sn', fifaSlug: 'senegal', nameKey: 'wc26.teams.SEN' },
	IRQ: { id: 'IRQ', fifaCode: 'IRQ', isoFlag: 'iq', fifaSlug: 'iraq', nameKey: 'wc26.teams.IRQ' },
	NOR: { id: 'NOR', fifaCode: 'NOR', isoFlag: 'no', fifaSlug: 'norway', nameKey: 'wc26.teams.NOR' },
	ARG: { id: 'ARG', fifaCode: 'ARG', isoFlag: 'ar', fifaSlug: 'argentina', nameKey: 'wc26.teams.ARG' },
	ALG: { id: 'ALG', fifaCode: 'ALG', isoFlag: 'dz', fifaSlug: 'algeria', nameKey: 'wc26.teams.ALG' },
	AUT: { id: 'AUT', fifaCode: 'AUT', isoFlag: 'at', fifaSlug: 'austria', nameKey: 'wc26.teams.AUT' },
	JOR: { id: 'JOR', fifaCode: 'JOR', isoFlag: 'jo', fifaSlug: 'jordan', nameKey: 'wc26.teams.JOR' },
	ENG: { id: 'ENG', fifaCode: 'ENG', isoFlag: 'gb-eng', fifaSlug: 'england', nameKey: 'wc26.teams.ENG' },
	CRO: { id: 'CRO', fifaCode: 'CRO', isoFlag: 'hr', fifaSlug: 'croatia', nameKey: 'wc26.teams.CRO' },
	GHA: { id: 'GHA', fifaCode: 'GHA', isoFlag: 'gh', fifaSlug: 'ghana', nameKey: 'wc26.teams.GHA' },
	PAN: { id: 'PAN', fifaCode: 'PAN', isoFlag: 'pa', fifaSlug: 'panama', nameKey: 'wc26.teams.PAN' },
	POR: { id: 'POR', fifaCode: 'POR', isoFlag: 'pt', fifaSlug: 'portugal', nameKey: 'wc26.teams.POR' },
	UZB: { id: 'UZB', fifaCode: 'UZB', isoFlag: 'uz', fifaSlug: 'uzbekistan', nameKey: 'wc26.teams.UZB' },
	COL: { id: 'COL', fifaCode: 'COL', isoFlag: 'co', fifaSlug: 'colombia', nameKey: 'wc26.teams.COL' },
	COD: { id: 'COD', fifaCode: 'COD', isoFlag: 'cd', fifaSlug: 'congo-dr', nameKey: 'wc26.teams.COD' },
};
