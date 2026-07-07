import type { Wc26TeamId } from './wc26Teams';

export type Wc26Stage =
	| 'group'
	| 'round_of_32'
	| 'round_of_16'
	| 'quarter_final'
	| 'semi_final'
	| 'third_place'
	| 'final';

export interface Wc26Match {
	id: number;
	/** Календарный день на FIFA (country=DE). */
	date: string;
	/** Время на FIFA (country=DE, Europe/Berlin) — как на сайте, без конвертаций. */
	timeLocal: string;
	stage: Wc26Stage;
	group?: string;
	home?: Wc26TeamId;
	away?: Wc26TeamId;
	/** i18n для плей-офф без конкретных сборных */
	labelKey?: string;
}

function gm(
	id: number,
	date: string,
	timeLocal: string,
	group: string,
	home: Wc26TeamId,
	away: Wc26TeamId
): Wc26Match {
	return { id, date, timeLocal, stage: 'group', group, home, away };
}

function playoffKo(
	id: number,
	date: string,
	timeLocal: string,
	stage: Exclude<Wc26Stage, 'group' | 'round_of_32' | 'round_of_16'>,
	labelKey: string
): Wc26Match {
	return { id, date, timeLocal, stage, labelKey };
}

function roundOf32(
	id: number,
	date: string,
	timeLocal: string,
	home: Wc26TeamId,
	away: Wc26TeamId,
	labelKey: string
): Wc26Match {
	return { id, date, timeLocal, stage: 'round_of_32', home, away, labelKey };
}

function roundOf16(
	id: number,
	date: string,
	timeLocal: string,
	home: Wc26TeamId,
	away: Wc26TeamId,
	labelKey: string
): Wc26Match {
	return { id, date, timeLocal, stage: 'round_of_16', home, away, labelKey };
}

function quarterFinal(
	id: number,
	date: string,
	timeLocal: string,
	home: Wc26TeamId,
	away: Wc26TeamId,
	labelKey: string
): Wc26Match {
	return { id, date, timeLocal, stage: 'quarter_final', home, away, labelKey };
}

/**
 * Расписание FIFA World Cup 26™ — дата/время Europe/Berlin (как fifa.com?country=DE).
 * Генерация: {@code node scripts/gen-wc26-schedule.mjs} (источник: api.fifa.com UTC → Berlin).
 */
export const WC26_SCHEDULE: Wc26Match[] = [
	gm(1, '2026-06-11', '21:00', 'A', 'MEX', 'RSA'),
	gm(2, '2026-06-12', '04:00', 'A', 'KOR', 'CZE'),
	gm(3, '2026-06-12', '21:00', 'B', 'CAN', 'BIH'),
	gm(4, '2026-06-13', '03:00', 'D', 'USA', 'PAR'),
	gm(5, '2026-06-14', '03:00', 'C', 'HAI', 'SCO'),
	gm(6, '2026-06-14', '06:00', 'D', 'AUS', 'TUR'),
	gm(7, '2026-06-14', '00:00', 'C', 'BRA', 'MAR'),
	gm(8, '2026-06-13', '21:00', 'B', 'QAT', 'SUI'),
	gm(9, '2026-06-15', '01:00', 'E', 'CIV', 'ECU'),
	gm(10, '2026-06-14', '19:00', 'E', 'GER', 'CUW'),
	gm(11, '2026-06-14', '22:00', 'F', 'NED', 'JPN'),
	gm(12, '2026-06-15', '04:00', 'F', 'SWE', 'TUN'),
	gm(13, '2026-06-16', '00:00', 'H', 'KSA', 'URU'),
	gm(14, '2026-06-15', '18:00', 'H', 'ESP', 'CPV'),
	gm(15, '2026-06-16', '03:00', 'G', 'IRN', 'NZL'),
	gm(16, '2026-06-15', '21:00', 'G', 'BEL', 'EGY'),
	gm(17, '2026-06-16', '21:00', 'I', 'FRA', 'SEN'),
	gm(18, '2026-06-17', '00:00', 'I', 'IRQ', 'NOR'),
	gm(19, '2026-06-17', '03:00', 'J', 'ARG', 'ALG'),
	gm(20, '2026-06-17', '06:00', 'J', 'AUT', 'JOR'),
	gm(21, '2026-06-18', '01:00', 'L', 'GHA', 'PAN'),
	gm(22, '2026-06-17', '22:00', 'L', 'ENG', 'CRO'),
	gm(23, '2026-06-17', '19:00', 'K', 'POR', 'COD'),
	gm(24, '2026-06-18', '04:00', 'K', 'UZB', 'COL'),
	gm(25, '2026-06-18', '18:00', 'A', 'CZE', 'RSA'),
	gm(26, '2026-06-18', '21:00', 'B', 'SUI', 'BIH'),
	gm(27, '2026-06-19', '00:00', 'B', 'CAN', 'QAT'),
	gm(28, '2026-06-19', '03:00', 'A', 'MEX', 'KOR'),
	gm(29, '2026-06-20', '02:30', 'C', 'BRA', 'HAI'),
	gm(30, '2026-06-20', '00:00', 'C', 'SCO', 'MAR'),
	gm(31, '2026-06-20', '05:00', 'D', 'TUR', 'PAR'),
	gm(32, '2026-06-19', '21:00', 'D', 'USA', 'AUS'),
	gm(33, '2026-06-20', '22:00', 'E', 'GER', 'CIV'),
	gm(34, '2026-06-21', '02:00', 'E', 'ECU', 'CUW'),
	gm(35, '2026-06-20', '19:00', 'F', 'NED', 'SWE'),
	gm(36, '2026-06-21', '06:00', 'F', 'TUN', 'JPN'),
	gm(37, '2026-06-22', '00:00', 'H', 'URU', 'CPV'),
	gm(38, '2026-06-21', '18:00', 'H', 'ESP', 'KSA'),
	gm(39, '2026-06-21', '21:00', 'G', 'BEL', 'IRN'),
	gm(40, '2026-06-22', '03:00', 'G', 'NZL', 'EGY'),
	gm(41, '2026-06-23', '02:00', 'I', 'NOR', 'SEN'),
	gm(42, '2026-06-22', '23:00', 'I', 'FRA', 'IRQ'),
	gm(43, '2026-06-22', '19:00', 'J', 'ARG', 'AUT'),
	gm(44, '2026-06-23', '05:00', 'J', 'JOR', 'ALG'),
	gm(45, '2026-06-23', '22:00', 'L', 'ENG', 'GHA'),
	gm(46, '2026-06-24', '01:00', 'L', 'PAN', 'CRO'),
	gm(47, '2026-06-23', '19:00', 'K', 'POR', 'UZB'),
	gm(48, '2026-06-24', '04:00', 'K', 'COL', 'COD'),
	gm(49, '2026-06-25', '00:00', 'C', 'SCO', 'BRA'),
	gm(50, '2026-06-25', '00:00', 'C', 'MAR', 'HAI'),
	gm(51, '2026-06-24', '21:00', 'B', 'SUI', 'CAN'),
	gm(52, '2026-06-24', '21:00', 'B', 'BIH', 'QAT'),
	gm(53, '2026-06-25', '03:00', 'A', 'CZE', 'MEX'),
	gm(54, '2026-06-25', '03:00', 'A', 'RSA', 'KOR'),
	gm(55, '2026-06-25', '22:00', 'E', 'CUW', 'CIV'),
	gm(56, '2026-06-25', '22:00', 'E', 'ECU', 'GER'),
	gm(57, '2026-06-26', '01:00', 'F', 'JPN', 'SWE'),
	gm(58, '2026-06-26', '01:00', 'F', 'TUN', 'NED'),
	gm(59, '2026-06-26', '04:00', 'D', 'TUR', 'USA'),
	gm(60, '2026-06-26', '04:00', 'D', 'PAR', 'AUS'),
	gm(61, '2026-06-26', '21:00', 'I', 'NOR', 'FRA'),
	gm(62, '2026-06-26', '21:00', 'I', 'SEN', 'IRQ'),
	gm(63, '2026-06-27', '05:00', 'G', 'EGY', 'IRN'),
	gm(64, '2026-06-27', '05:00', 'G', 'NZL', 'BEL'),
	gm(65, '2026-06-27', '02:00', 'H', 'CPV', 'KSA'),
	gm(66, '2026-06-27', '02:00', 'H', 'URU', 'ESP'),
	gm(67, '2026-06-27', '23:00', 'L', 'PAN', 'ENG'),
	gm(68, '2026-06-27', '23:00', 'L', 'CRO', 'GHA'),
	gm(69, '2026-06-28', '04:00', 'J', 'ALG', 'AUT'),
	gm(70, '2026-06-28', '04:00', 'J', 'JOR', 'ARG'),
	gm(71, '2026-06-28', '01:30', 'K', 'COL', 'POR'),
	gm(72, '2026-06-28', '01:30', 'K', 'COD', 'UZB'),
	roundOf32(73, '2026-06-28', '21:00', 'RSA', 'CAN', 'wc26.matches.m73'),
	roundOf32(74, '2026-06-29', '22:30', 'GER', 'PAR', 'wc26.matches.m74'),
	roundOf32(75, '2026-06-30', '03:00', 'NED', 'MAR', 'wc26.matches.m75'),
	roundOf32(76, '2026-06-29', '19:00', 'BRA', 'JPN', 'wc26.matches.m76'),
	roundOf32(77, '2026-06-30', '23:00', 'FRA', 'SWE', 'wc26.matches.m77'),
	roundOf32(78, '2026-06-30', '19:00', 'CIV', 'NOR', 'wc26.matches.m78'),
	roundOf32(79, '2026-07-01', '03:00', 'MEX', 'ECU', 'wc26.matches.m79'),
	roundOf32(80, '2026-07-01', '18:00', 'ENG', 'COD', 'wc26.matches.m80'),
	roundOf32(81, '2026-07-02', '02:00', 'USA', 'BIH', 'wc26.matches.m81'),
	roundOf32(82, '2026-07-01', '22:00', 'BEL', 'SEN', 'wc26.matches.m82'),
	roundOf32(83, '2026-07-03', '01:00', 'POR', 'CRO', 'wc26.matches.m83'),
	roundOf32(84, '2026-07-02', '21:00', 'ESP', 'AUT', 'wc26.matches.m84'),
	roundOf32(85, '2026-07-03', '05:00', 'SUI', 'ALG', 'wc26.matches.m85'),
	roundOf32(86, '2026-07-04', '00:00', 'ARG', 'CPV', 'wc26.matches.m86'),
	roundOf32(87, '2026-07-04', '03:30', 'COL', 'GHA', 'wc26.matches.m87'),
	roundOf32(88, '2026-07-03', '20:00', 'AUS', 'EGY', 'wc26.matches.m88'),
	roundOf16(89, '2026-07-04', '23:00', 'PAR', 'FRA', 'wc26.matches.m89'),
	roundOf16(90, '2026-07-04', '19:00', 'CAN', 'MAR', 'wc26.matches.m90'),
	roundOf16(91, '2026-07-05', '22:00', 'BRA', 'NOR', 'wc26.matches.m91'),
	roundOf16(92, '2026-07-06', '02:00', 'MEX', 'ENG', 'wc26.matches.m92'),
	roundOf16(93, '2026-07-06', '21:00', 'POR', 'ESP', 'wc26.matches.m93'),
	roundOf16(94, '2026-07-07', '02:00', 'USA', 'BEL', 'wc26.matches.m94'),
	roundOf16(95, '2026-07-07', '18:00', 'ARG', 'EGY', 'wc26.matches.m95'),
	roundOf16(96, '2026-07-07', '22:00', 'SUI', 'COL', 'wc26.matches.m96'),
	quarterFinal(97, '2026-07-09', '22:00', 'FRA', 'MAR', 'wc26.matches.m97'),
	quarterFinal(98, '2026-07-10', '21:00', 'ESP', 'BEL', 'wc26.matches.m98'),
	quarterFinal(99, '2026-07-11', '23:00', 'NOR', 'ENG', 'wc26.matches.m99'),
	quarterFinal(100, '2026-07-12', '03:00', 'ARG', 'SUI', 'wc26.matches.m100'),
	playoffKo(101, '2026-07-14', '21:00', 'semi_final', 'wc26.matches.m101'),
	playoffKo(102, '2026-07-15', '21:00', 'semi_final', 'wc26.matches.m102'),
	playoffKo(103, '2026-07-18', '23:00', 'third_place', 'wc26.matches.m103'),
	playoffKo(104, '2026-07-19', '21:00', 'final', 'wc26.matches.m104'),
];

export const WC26_STAGE_ORDER: Wc26Stage[] = [
	'group',
	'round_of_32',
	'round_of_16',
	'quarter_final',
	'semi_final',
	'third_place',
	'final',
];
