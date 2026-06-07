import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	Avatar,
	Box,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Collapse,
	IconButton,
	IconButtonProps,
	type SxProps,
	type Theme,
} from '@mui/material';
import { green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NewsTrans from './NewsTrans';
import { applyNewsVideoVolume, isNewsVideoSrc } from './newsMedia';
import type { NewsItemConfig } from './newsItems';

interface ExpandMoreProps extends IconButtonProps {
	expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expand }) => ({
	transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	}),
}));

type Props = {
	item: NewsItemConfig;
};

function NewsVideo({
	src,
	alt,
	height,
	sx,
}: {
	src: string;
	alt: string;
	height?: number;
	sx?: SxProps<Theme>;
}): JSX.Element {
	return (
		<CardMedia
			component="video"
			src={src}
			title={alt}
			controls
			autoPlay
			loop
			playsInline
			preload="metadata"
			onLoadedMetadata={(event) => applyNewsVideoVolume(event.currentTarget)}
			sx={{
				width: '100%',
				height: height ?? 'auto',
				display: 'block',
				objectFit: 'cover',
				backgroundColor: 'black',
				...sx,
			}}
		/>
	);
}

function NewsMedia({
	src,
	alt,
	height,
	sx,
}: {
	src: string;
	alt: string;
	height?: number;
	sx?: SxProps<Theme>;
}): JSX.Element {
	if (isNewsVideoSrc(src)) {
		return <NewsVideo src={src} alt={alt} height={height} sx={sx} />;
	}

	return (
		<CardMedia
			component="img"
			height={height ?? 194}
			image={src}
			alt={alt}
			sx={sx}
		/>
	);
}

export default function NewsCard({ item }: Props): JSX.Element {
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(false);
	const prefix = `${item.i18nKey}.blocks`;

	const expandControl = (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box component="span" sx={{ fontSize: '0.85rem' }}>
				{expanded ? t('close') : t(`siteNews:${item.i18nKey}.expandLabel`)}
			</Box>
			<ExpandMore
				expand={expanded}
				onClick={() => setExpanded((prev) => !prev)}
				aria-expanded={expanded}
				aria-label={expanded ? 'collapse' : 'expand'}
			>
				<ExpandMoreIcon />
			</ExpandMore>
		</Box>
	);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Card
				sx={{
					mt: 1,
					maxWidth: 345,
					boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.7)',
				}}
			>
				<CardHeader
					avatar={
						<Avatar sx={{ bgcolor: green[500] }} aria-label="news-title">
							{item.order}
						</Avatar>
					}
					title={t(`siteNews:${item.i18nKey}.title`)}
					subheader={t(`siteNews:${item.i18nKey}.date`)}
				/>
				<NewsMedia
					src={item.coverImage.src}
					alt={item.coverImage.alt}
					height={item.coverImage.height}
				/>
				<CardContent>
					<NewsTrans
						i18nKey={`${item.i18nKey}.header`}
						sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.43 }}
						paragraph={false}
					/>
				</CardContent>
				<CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
					{expandControl}
				</CardActions>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<CardContent sx={item.id === 'scheduleEuro2024' ? { p: 0 } : undefined}>
						{item.blocks.map((block, index) => {
							if (block.type === 'image') {
								return (
									<NewsMedia
										key={`${item.id}-img-${index}`}
										src={block.src}
										alt={block.alt}
										sx={block.sx}
									/>
								);
							}
							return (
								<NewsTrans
									key={`${item.id}-trans-${block.blockKey}`}
									i18nKey={`${prefix}.${block.blockKey}`}
									sx={block.sx}
									paragraph={block.paragraph ?? true}
								/>
							);
						})}
						<CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							{expandControl}
						</CardActions>
					</CardContent>
				</Collapse>
			</Card>
		</Box>
	);
}
