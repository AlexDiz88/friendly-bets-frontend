import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
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
	Typography,
} from '@mui/material';
import { green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { t } from 'i18next';
import { useState } from 'react';

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

export default function ScheduleEuro2024(): JSX.Element {
	const [expanded, setExpanded] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

	const handleLikeToggle = (): void => {
		setIsLiked((prevState) => !prevState);
	};

	const handleExpandClick = (): void => {
		setExpanded(!expanded);
	};

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
							3
						</Avatar>
					}
					title={t('siteNews:Season2425.title')}
					subheader={t('siteNews:Season2425.date')}
				/>
				<CardMedia
					component="img"
					height="320"
					image="/upload/img/2425-season-start.gif"
					alt="2425-season-start"
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						{t('siteNews:Season2425.header')}
					</Typography>
				</CardContent>
				<CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<IconButton aria-label="add to favorites" onClick={handleLikeToggle}>
						<FavoriteIcon color={isLiked ? 'error' : 'inherit'} />
					</IconButton>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography sx={{ fontSize: '0.85rem' }}>
							{t('siteNews:Season2425.showSchedule')}
						</Typography>
						<ExpandMore
							expand={expanded}
							onClick={handleExpandClick}
							aria-expanded={expanded}
							aria-label="show more"
						>
							<ExpandMoreIcon />
						</ExpandMore>
					</Box>
				</CardActions>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<CardContent>
						<Typography paragraph>
							<i>{t('siteNews:Season2425.topic')}:</i>
						</Typography>
						<Typography paragraph sx={{ color: 'brown' }}>
							<b>{t('siteNews:Season2425.text.1')}</b>
						</Typography>
						<Typography paragraph sx={{ px: 1, pt: 1 }}>
							{t('siteNews:Season2425.text.2')}
							<b>{t('siteNews:Season2425.text.3')}</b>
							{t('siteNews:Season2425.text.4')}
							<b>{t('siteNews:Season2425.text.5')}</b>
							{t('siteNews:Season2425.text.6')}
						</Typography>
						<Typography sx={{ px: 1, pt: 0 }}>{t('siteNews:Season2425.text.7')}</Typography>

						<Typography paragraph sx={{ color: 'brown', pt: 3 }}>
							<b>{t('siteNews:Season2425.text.8')}</b>
						</Typography>
						<Typography paragraph sx={{ px: 1, pt: 1 }}>
							{t('siteNews:Season2425.text.9')}
						</Typography>
						<CardMedia
							sx={{ border: 1 }}
							component="img"
							image="/upload/img/byGameweek.png"
							alt="byGameweek_table_img"
							content="contain"
						/>
						<Typography paragraph sx={{ px: 1, pt: 1 }}>
							{t('siteNews:Season2425.text.9a')}
						</Typography>
						<Typography paragraph sx={{ px: 1, pt: 1 }}>
							{t('siteNews:Season2425.text.10')}
						</Typography>

						<Typography paragraph sx={{ color: 'brown', pt: 2 }}>
							<b>{t('siteNews:Season2425.text.11')}</b>
						</Typography>
						<Typography paragraph sx={{ px: 1, pt: 1 }}>
							{t('siteNews:Season2425.text.12')}
						</Typography>
						<Typography paragraph sx={{ px: 1, pt: 0 }}>
							{t('siteNews:Season2425.text.13')}
						</Typography>
						<CardMedia
							sx={{ border: 1 }}
							component="img"
							image="/upload/img/languages_feature.png"
							alt="languages_feature"
							content="contain"
						/>
						<Typography paragraph sx={{ px: 1, pt: 1 }}>
							{t('siteNews:Season2425.text.14')}
						</Typography>

						<Typography paragraph sx={{ color: 'brown', pt: 2 }}>
							<b>{t('siteNews:Season2425.text.15')}</b>
						</Typography>
						<Typography paragraph sx={{ px: 1, pt: 1 }}>
							{t('siteNews:Season2425.text.16a')}
							<b>{t('siteNews:Season2425.text.16b')}</b>
							{t('siteNews:Season2425.text.16c')}
							<b>{t('siteNews:Season2425.text.16d')}</b>
							{t('siteNews:Season2425.text.16e')}
						</Typography>
						<Typography paragraph sx={{ px: 1, pt: 0 }}>
							{t('siteNews:Season2425.text.17')}
						</Typography>

						<Typography paragraph sx={{ color: 'green', px: 2, pt: 2 }}>
							<b>{t('siteNews:Season2425.text.18')}</b>
						</Typography>

						<CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'end' }}>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Typography sx={{ fontSize: '0.85rem' }}>{t('close')}</Typography>
								<ExpandMore
									expand={expanded}
									onClick={handleExpandClick}
									aria-expanded={expanded}
									aria-label="show more"
								>
									<ExpandMoreIcon />
								</ExpandMore>
							</Box>
						</CardActions>
					</CardContent>
				</Collapse>
			</Card>
		</Box>
	);
}
