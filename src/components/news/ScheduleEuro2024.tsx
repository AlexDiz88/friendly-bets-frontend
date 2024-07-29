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
							2
						</Avatar>
					}
					title={t('siteNews:ScheduleEuro2024.title')}
					subheader={t('siteNews:ScheduleEuro2024.date')}
				/>
				<CardMedia
					component="img"
					height="194"
					image="/upload/img/euro-2024-stadium.jpeg"
					alt="euro-2024"
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						{t('siteNews:ScheduleEuro2024.header')}
					</Typography>
				</CardContent>
				<CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<IconButton aria-label="add to favorites" onClick={handleLikeToggle}>
						<FavoriteIcon color={isLiked ? 'error' : 'inherit'} />
					</IconButton>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography sx={{ fontSize: '0.85rem' }}>
							{t('siteNews:ScheduleEuro2024.showSchedule')}
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
					<CardContent sx={{ p: 0 }}>
						<CardMedia
							component="img"
							image="/upload/img/euro2024-schedule-groupstage.png"
							alt="Group stage schedule"
							content="contain"
						/>
						<Typography paragraph sx={{ px: 2, pt: 2 }}>
							{t('siteNews:ScheduleEuro2024.text.1')}
						</Typography>
						<CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'end' }}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
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
