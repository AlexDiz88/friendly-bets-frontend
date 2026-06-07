import type { SxProps, Theme } from '@mui/material';

export type NewsImageBlock = {
	type: 'image';
	src: string;
	alt: string;
	sx?: SxProps<Theme>;
};

export type NewsTransBlock = {
	type: 'trans';
	blockKey: string;
	sx?: SxProps<Theme>;
	paragraph?: boolean;
};

export type NewsBlock = NewsImageBlock | NewsTransBlock;

export type NewsItemConfig = {
	id: string;
	i18nKey: string;
	order: number;
	coverImage: {
		src: string;
		alt: string;
		height?: number;
	};
	blocks: NewsBlock[];
};

export const NEWS_ITEMS: NewsItemConfig[] = [
	{
		id: 'wc2026',
		i18nKey: 'Wc2026',
		order: 5,
		coverImage: {
			src: '/upload/img/WC2026-intro.mp4',
			alt: 'FIFA World Cup 2026',
			height: 320,
		},
		blocks: [
			{ type: 'trans', blockKey: 'intro' },
			{ type: 'trans', blockKey: 's1Title', sx: { color: 'brown' } },
			{ type: 'trans', blockKey: 's1p1' },
			{ type: 'trans', blockKey: 's2Title', sx: { color: 'brown', mt: 2 } },
			{ type: 'trans', blockKey: 's2p1' },
			{ type: 'trans', blockKey: 's3Title', sx: { color: 'brown', mt: 2 } },
			{ type: 'trans', blockKey: 's3p1' },
			{ type: 'trans', blockKey: 's4Title', sx: { color: 'brown', mt: 2 } },
			{ type: 'trans', blockKey: 's4p1' },
			{ type: 'trans', blockKey: 's5Title', sx: { color: 'brown', mt: 2 } },
			{ type: 'trans', blockKey: 's5p1' },
			{ type: 'trans', blockKey: 'closing', sx: { color: 'green', px: 2, pt: 2 } },
		],
	},
	{
		id: 'season2526',
		i18nKey: 'Season2526',
		order: 4,
		coverImage: {
			src: '/upload/img/season25-26.png',
			alt: 'season25-26',
			height: 320,
		},
		blocks: [
			{ type: 'trans', blockKey: 'intro' },
			{ type: 'trans', blockKey: 's1Title', sx: { color: 'brown' } },
			{ type: 'trans', blockKey: 's1p1' },
			{ type: 'trans', blockKey: 's1p2' },
			{ type: 'trans', blockKey: 's1p3' },
			{ type: 'trans', blockKey: 's1p4' },
			{ type: 'trans', blockKey: 's2Title', sx: { color: 'brown', mt: 2 } },
			{ type: 'trans', blockKey: 's2p1' },
			{ type: 'trans', blockKey: 's2p2' },
			{
				type: 'image',
				src: '/upload/img/findBetTitlesPage.png',
				alt: 'bet titles stats',
				sx: { border: 1, width: 175, height: 175, objectFit: 'contain' },
			},
			{ type: 'trans', blockKey: 's2p3', sx: { px: 1, pt: 1 } },
			{
				type: 'image',
				src: '/upload/img/byBetTitles.png',
				alt: 'by bet titles',
				sx: { border: 1 },
			},
			{ type: 'trans', blockKey: 'closing', sx: { color: 'green', px: 2, pt: 2 } },
		],
	},
	{
		id: 'season2425',
		i18nKey: 'Season2425',
		order: 3,
		coverImage: {
			src: '/upload/img/2425-season-start.gif',
			alt: '2425-season-start',
			height: 320,
		},
		blocks: [
			{ type: 'trans', blockKey: 'intro' },
			{ type: 'trans', blockKey: 's1Title', sx: { color: 'brown' } },
			{ type: 'trans', blockKey: 's1p1', sx: { px: 1, pt: 1 } },
			{ type: 'trans', blockKey: 's1p2', sx: { px: 1 } },
			{ type: 'trans', blockKey: 's2Title', sx: { color: 'brown', pt: 3 } },
			{ type: 'trans', blockKey: 's2p1', sx: { px: 1, pt: 1 } },
			{
				type: 'image',
				src: '/upload/img/byGameweek.png',
				alt: 'by gameweek',
				sx: { border: 1 },
			},
			{ type: 'trans', blockKey: 's2p2', sx: { px: 1, pt: 1 } },
			{ type: 'trans', blockKey: 's2p3', sx: { px: 1, pt: 1 } },
			{ type: 'trans', blockKey: 's3Title', sx: { color: 'brown', pt: 2 } },
			{ type: 'trans', blockKey: 's3p1', sx: { px: 1, pt: 1 } },
			{ type: 'trans', blockKey: 's3p2', sx: { px: 1 } },
			{
				type: 'image',
				src: '/upload/img/languages_feature.png',
				alt: 'languages feature',
				sx: { border: 1 },
			},
			{ type: 'trans', blockKey: 's3p3', sx: { px: 1, pt: 1 } },
			{ type: 'trans', blockKey: 's4Title', sx: { color: 'brown', pt: 2 } },
			{ type: 'trans', blockKey: 's4p1', sx: { px: 1, pt: 1 } },
			{ type: 'trans', blockKey: 's4p2', sx: { px: 1 } },
			{ type: 'trans', blockKey: 'closing', sx: { color: 'green', px: 2, pt: 2 } },
		],
	},
	{
		id: 'scheduleEuro2024',
		i18nKey: 'ScheduleEuro2024',
		order: 2,
		coverImage: {
			src: '/upload/img/euro-2024-stadium.jpeg',
			alt: 'euro-2024',
			height: 194,
		},
		blocks: [
			{
				type: 'image',
				src: '/upload/img/euro2024-schedule-groupstage.png',
				alt: 'Group stage schedule',
				sx: {},
			},
			{ type: 'trans', blockKey: 'footer', sx: { px: 2, pt: 2 } },
		],
	},
	{
		id: 'season2324',
		i18nKey: 'Season2324',
		order: 1,
		coverImage: {
			src: '/upload/img/borussiya-dortmund-pered-nachalom-sezona-2023-2024.jpg',
			alt: 'news photo',
			height: 194,
		},
		blocks: [
			{ type: 'trans', blockKey: 'featuresIntro' },
			{ type: 'trans', blockKey: 'features' },
			{ type: 'trans', blockKey: 'reqTitle' },
			{ type: 'trans', blockKey: 'reqSteps' },
			{ type: 'trans', blockKey: 'secTitle' },
			{ type: 'trans', blockKey: 'secBody' },
			{ type: 'trans', blockKey: 'closing' },
		],
	},
];
