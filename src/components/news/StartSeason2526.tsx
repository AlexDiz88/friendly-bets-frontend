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

export default function StartSeason2526(): JSX.Element {
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
							4
						</Avatar>
					}
					title={t('siteNews:Season2526.title')}
					subheader={t('siteNews:Season2526.date')}
				/>
				<CardMedia
					component="img"
					height="320"
					image="/upload/img/season25-26.png"
					alt="season25-26"
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						{t('siteNews:Season2526.header')}
					</Typography>
				</CardContent>
				<CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<IconButton aria-label="add to favorites" onClick={handleLikeToggle}>
						<FavoriteIcon color={isLiked ? 'error' : 'inherit'} />
					</IconButton>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography sx={{ fontSize: '0.85rem' }}>
							{t('siteNews:Season2526.showSchedule')}
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
						<Typography paragraph>{t('siteNews:Season2526.topic')}</Typography>
						<Typography paragraph sx={{ color: 'brown' }}>
							<b>{t('siteNews:Season2526.text.1')}</b>
						</Typography>
						<Typography paragraph>{t('siteNews:Season2526.text.2')}</Typography>
						<Typography>{t('siteNews:Season2526.text.3')}</Typography>
						<Typography sx={{ pt: 1 }}>
							<b>{t('siteNews:Season2526.text.4')}</b>
						</Typography>
						<Typography sx={{ pt: 1 }}>{t('siteNews:Season2526.text.5')}</Typography>

						<Typography paragraph sx={{ mt: 2, color: 'brown' }}>
							<b>{t('siteNews:Season2526.text.6')}</b>
						</Typography>
						<CardMedia
							component="img"
							image="/upload/img/findBetTitlesPage.png"
							alt="byGameweek_table_img"
							sx={{
								border: 1,
								width: 175,
								height: 175,
								objectFit: 'contain',
							}}
						/>
						<Typography>{t('siteNews:Season2526.text.7')}</Typography>
						<Typography paragraph>{t('siteNews:Season2526.text.8')}</Typography>
						<CardMedia
							sx={{ border: 1 }}
							component="img"
							image="/upload/img/byBetTitles.png"
							alt="byGameweek_table_img"
							content="contain"
						/>
						<Typography paragraph sx={{ px: 1, pt: 1 }}>
							{t('siteNews:Season2526.text.9')}
						</Typography>
						<Typography paragraph sx={{ color: 'green', px: 2, pt: 2 }}>
							<b>{t('siteNews:Season2526.text.10')}</b>
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
