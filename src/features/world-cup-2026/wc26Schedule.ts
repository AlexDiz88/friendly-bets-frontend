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
	date: string;
	timeLocal: string;
	stage: Wc26Stage;
	group?: string;
	home?: Wc26TeamId;
	away?: Wc26TeamId;
	/** i18n для плей-офф без конкретных сборных */
	labelKey?: string;
	venueKey: string;
}

function gm(
	id: number,
	date: string,
	timeLocal: string,
	group: string,
	home: Wc26TeamId,
	away: Wc26TeamId,
	venueKey: string
): Wc26Match {
	return { id, date, timeLocal, stage: 'group', group, home, away, venueKey };
}

function ko(
	id: number,
	date: string,
	timeLocal: string,
	stage: Exclude<Wc26Stage, 'group'>,
	labelKey: string,
	venueKey: string
): Wc26Match {
	return { id, date, timeLocal, stage, labelKey, venueKey };
}

/**
 * Статическое расписание FIFA World Cup 26™ (слоты ставок, сопоставление с external).
 * Страница ЧМ-2026 загружает расписание + счёт из {@code GET /api/wc26/schedule}.
 */
export const WC26_SCHEDULE: Wc26Match[] = [
	gm(1, '2026-06-11', '13:00', 'A', 'MEX', 'RSA', 'mexicoCity'),
	gm(2, '2026-06-11', '20:00', 'A', 'KOR', 'CZE', 'guadalajara'),
	gm(3, '2026-06-12', '15:00', 'B', 'CAN', 'BIH', 'toronto'),
	gm(4, '2026-06-12', '18:00', 'D', 'USA', 'PAR', 'losAngeles'),
	gm(5, '2026-06-13', '21:00', 'C', 'HAI', 'SCO', 'boston'),
	gm(6, '2026-06-13', '21:00', 'D', 'AUS', 'TUR', 'vancouver'),
	gm(7, '2026-06-13', '18:00', 'C', 'BRA', 'MAR', 'newYork'),
	gm(8, '2026-06-13', '12:00', 'B', 'QAT', 'SUI', 'sanFrancisco'),
	gm(9, '2026-06-14', '19:00', 'E', 'CIV', 'ECU', 'philadelphia'),
	gm(10, '2026-06-14', '12:00', 'E', 'GER', 'CUW', 'houston'),
	gm(11, '2026-06-14', '15:00', 'F', 'NED', 'JPN', 'dallas'),
	gm(12, '2026-06-14', '20:00', 'F', 'SWE', 'TUN', 'monterrey'),
	gm(13, '2026-06-15', '18:00', 'H', 'KSA', 'URU', 'miami'),
	gm(14, '2026-06-15', '12:00', 'H', 'ESP', 'CPV', 'atlanta'),
	gm(15, '2026-06-15', '18:00', 'G', 'IRN', 'NZL', 'losAngeles'),
	gm(16, '2026-06-15', '12:00', 'G', 'BEL', 'EGY', 'seattle'),
	gm(17, '2026-06-16', '15:00', 'I', 'FRA', 'SEN', 'newYork'),
	gm(18, '2026-06-16', '18:00', 'I', 'IRQ', 'NOR', 'boston'),
	gm(19, '2026-06-16', '20:00', 'J', 'ARG', 'ALG', 'kansasCity'),
	gm(20, '2026-06-16', '21:00', 'J', 'AUT', 'JOR', 'sanFrancisco'),
	gm(21, '2026-06-17', '19:00', 'L', 'GHA', 'PAN', 'toronto'),
	gm(22, '2026-06-17', '15:00', 'L', 'ENG', 'CRO', 'dallas'),
	gm(23, '2026-06-17', '12:00', 'K', 'POR', 'COD', 'houston'),
	gm(24, '2026-06-17', '20:00', 'K', 'UZB', 'COL', 'mexicoCity'),
	gm(25, '2026-06-18', '12:00', 'A', 'CZE', 'RSA', 'atlanta'),
	gm(26, '2026-06-18', '12:00', 'B', 'SUI', 'BIH', 'losAngeles'),
	gm(27, '2026-06-18', '15:00', 'B', 'CAN', 'QAT', 'vancouver'),
	gm(28, '2026-06-18', '19:00', 'A', 'MEX', 'KOR', 'guadalajara'),
	gm(29, '2026-06-19', '21:00', 'C', 'BRA', 'HAI', 'philadelphia'),
	gm(30, '2026-06-19', '18:00', 'C', 'SCO', 'MAR', 'boston'),
	gm(31, '2026-06-19', '20:00', 'D', 'TUR', 'PAR', 'sanFrancisco'),
	gm(32, '2026-06-19', '12:00', 'D', 'USA', 'AUS', 'seattle'),
	gm(33, '2026-06-20', '16:00', 'E', 'GER', 'CIV', 'toronto'),
	gm(34, '2026-06-20', '19:00', 'E', 'ECU', 'CUW', 'kansasCity'),
	gm(35, '2026-06-20', '12:00', 'F', 'NED', 'SWE', 'houston'),
	gm(36, '2026-06-20', '22:00', 'F', 'TUN', 'JPN', 'monterrey'),
	gm(37, '2026-06-21', '18:00', 'H', 'URU', 'CPV', 'miami'),
	gm(38, '2026-06-21', '12:00', 'H', 'ESP', 'KSA', 'atlanta'),
	gm(39, '2026-06-21', '12:00', 'G', 'BEL', 'IRN', 'losAngeles'),
	gm(40, '2026-06-21', '18:00', 'G', 'NZL', 'EGY', 'vancouver'),
	gm(41, '2026-06-22', '20:00', 'I', 'NOR', 'SEN', 'newYork'),
	gm(42, '2026-06-22', '17:00', 'I', 'FRA', 'IRQ', 'philadelphia'),
	gm(43, '2026-06-22', '12:00', 'J', 'ARG', 'AUT', 'dallas'),
	gm(44, '2026-06-22', '20:00', 'J', 'JOR', 'ALG', 'sanFrancisco'),
	gm(45, '2026-06-23', '16:00', 'L', 'ENG', 'GHA', 'boston'),
	gm(46, '2026-06-23', '19:00', 'L', 'PAN', 'CRO', 'toronto'),
	gm(47, '2026-06-23', '12:00', 'K', 'POR', 'UZB', 'houston'),
	gm(48, '2026-06-23', '20:00', 'K', 'COL', 'COD', 'guadalajara'),
	gm(49, '2026-06-24', '18:00', 'C', 'SCO', 'BRA', 'miami'),
	gm(50, '2026-06-24', '18:00', 'C', 'MAR', 'HAI', 'atlanta'),
	gm(51, '2026-06-24', '12:00', 'B', 'SUI', 'CAN', 'vancouver'),
	gm(52, '2026-06-24', '12:00', 'B', 'BIH', 'QAT', 'seattle'),
	gm(53, '2026-06-24', '19:00', 'A', 'CZE', 'MEX', 'mexicoCity'),
	gm(54, '2026-06-24', '19:00', 'A', 'RSA', 'KOR', 'monterrey'),
	gm(55, '2026-06-25', '16:00', 'E', 'CUW', 'CIV', 'philadelphia'),
	gm(56, '2026-06-25', '16:00', 'E', 'ECU', 'GER', 'newYork'),
	gm(57, '2026-06-25', '18:00', 'F', 'JPN', 'SWE', 'dallas'),
	gm(58, '2026-06-25', '18:00', 'F', 'TUN', 'NED', 'kansasCity'),
	gm(59, '2026-06-25', '19:00', 'D', 'TUR', 'USA', 'losAngeles'),
	gm(60, '2026-06-25', '19:00', 'D', 'PAR', 'AUS', 'sanFrancisco'),
	gm(61, '2026-06-26', '15:00', 'I', 'NOR', 'FRA', 'boston'),
	gm(62, '2026-06-26', '15:00', 'I', 'SEN', 'IRQ', 'toronto'),
	gm(63, '2026-06-26', '20:00', 'G', 'EGY', 'IRN', 'seattle'),
	gm(64, '2026-06-26', '20:00', 'G', 'NZL', 'BEL', 'vancouver'),
	gm(65, '2026-06-26', '19:00', 'H', 'CPV', 'KSA', 'houston'),
	gm(66, '2026-06-26', '18:00', 'H', 'URU', 'ESP', 'guadalajara'),
	gm(67, '2026-06-27', '17:00', 'L', 'PAN', 'ENG', 'newYork'),
	gm(68, '2026-06-27', '17:00', 'L', 'CRO', 'GHA', 'philadelphia'),
	gm(69, '2026-06-27', '21:00', 'J', 'ALG', 'AUT', 'kansasCity'),
	gm(70, '2026-06-27', '21:00', 'J', 'JOR', 'ARG', 'dallas'),
	gm(71, '2026-06-27', '19:30', 'K', 'COL', 'POR', 'miami'),
	gm(72, '2026-06-27', '19:30', 'K', 'COD', 'UZB', 'atlanta'),
	ko(73, '2026-06-28', '12:00', 'round_of_32', 'wc26.matches.m73', 'losAngeles'),
	ko(74, '2026-06-29', '16:30', 'round_of_32', 'wc26.matches.m74', 'boston'),
	ko(75, '2026-06-29', '19:00', 'round_of_32', 'wc26.matches.m75', 'monterrey'),
	ko(76, '2026-06-29', '12:00', 'round_of_32', 'wc26.matches.m76', 'houston'),
	ko(77, '2026-06-30', '17:00', 'round_of_32', 'wc26.matches.m77', 'newYork'),
	ko(78, '2026-06-30', '12:00', 'round_of_32', 'wc26.matches.m78', 'dallas'),
	ko(79, '2026-06-30', '19:00', 'round_of_32', 'wc26.matches.m79', 'mexicoCity'),
	ko(80, '2026-07-01', '12:00', 'round_of_32', 'wc26.matches.m80', 'atlanta'),
	ko(81, '2026-07-01', '17:00', 'round_of_32', 'wc26.matches.m81', 'sanFrancisco'),
	ko(82, '2026-07-01', '13:00', 'round_of_32', 'wc26.matches.m82', 'seattle'),
	ko(83, '2026-07-02', '19:00', 'round_of_32', 'wc26.matches.m83', 'toronto'),
	ko(84, '2026-07-02', '12:00', 'round_of_32', 'wc26.matches.m84', 'losAngeles'),
	ko(85, '2026-07-02', '20:00', 'round_of_32', 'wc26.matches.m85', 'vancouver'),
	ko(86, '2026-07-03', '18:00', 'round_of_32', 'wc26.matches.m86', 'miami'),
	ko(87, '2026-07-03', '20:30', 'round_of_32', 'wc26.matches.m87', 'kansasCity'),
	ko(88, '2026-07-03', '13:00', 'round_of_32', 'wc26.matches.m88', 'dallas'),
	ko(89, '2026-07-04', '17:00', 'round_of_16', 'wc26.matches.m89', 'philadelphia'),
	ko(90, '2026-07-04', '12:00', 'round_of_16', 'wc26.matches.m90', 'houston'),
	ko(91, '2026-07-05', '16:00', 'round_of_16', 'wc26.matches.m91', 'newYork'),
	ko(92, '2026-07-05', '18:00', 'round_of_16', 'wc26.matches.m92', 'mexicoCity'),
	ko(93, '2026-07-06', '14:00', 'round_of_16', 'wc26.matches.m93', 'dallas'),
	ko(94, '2026-07-06', '17:00', 'round_of_16', 'wc26.matches.m94', 'seattle'),
	ko(95, '2026-07-07', '12:00', 'round_of_16', 'wc26.matches.m95', 'atlanta'),
	ko(96, '2026-07-07', '13:00', 'round_of_16', 'wc26.matches.m96', 'vancouver'),
	ko(97, '2026-07-09', '16:00', 'quarter_final', 'wc26.matches.m97', 'boston'),
	ko(98, '2026-07-10', '12:00', 'quarter_final', 'wc26.matches.m98', 'losAngeles'),
	ko(99, '2026-07-11', '17:00', 'quarter_final', 'wc26.matches.m99', 'miami'),
	ko(100, '2026-07-11', '20:00', 'quarter_final', 'wc26.matches.m100', 'kansasCity'),
	ko(101, '2026-07-14', '14:00', 'semi_final', 'wc26.matches.m101', 'dallas'),
	ko(102, '2026-07-15', '15:00', 'semi_final', 'wc26.matches.m102', 'atlanta'),
	ko(103, '2026-07-18', '17:00', 'third_place', 'wc26.matches.m103', 'miami'),
	ko(104, '2026-07-19', '15:00', 'final', 'wc26.matches.m104', 'newYork'),
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
