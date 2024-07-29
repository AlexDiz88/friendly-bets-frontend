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

export default function StartSeason2324(): JSX.Element {
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
							1
						</Avatar>
					}
					title={t('siteNews:Season2324.title')}
					subheader={t('siteNews:Season2324.date')}
				/>
				<CardMedia
					component="img"
					height="194"
					image="/upload/img/borussiya-dortmund-pered-nachalom-sezona-2023-2024.jpg"
					alt="news photo"
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						{t('siteNews:Season2324.header')} &quot;{t('moreDetails')}&quot;
					</Typography>
				</CardContent>
				<CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<IconButton aria-label="add to favorites" onClick={handleLikeToggle}>
						<FavoriteIcon color={isLiked ? 'error' : 'inherit'} />
					</IconButton>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography sx={{ fontSize: '0.85rem' }}>{t('moreDetails')}</Typography>
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
							<b>{t('siteNews:Season2324.topic')}:</b>
						</Typography>
						<Typography paragraph>
							{t('siteNews:Season2324.paragraph.1')}
							<br />
							<br />
							{t('siteNews:Season2324.paragraph.2a')}{' '}
							<a href="https://cloud.mongodb.com">https://cloud.mongodb.com</a>.{' '}
							{t('siteNews:Season2324.paragraph.2b')}
							<br />
							<br />
							{t('siteNews:Season2324.paragraph.3')}
							<br />
							<br />
							{t('siteNews:Season2324.paragraph.4')}
							<br />
							<br />
							{t('siteNews:Season2324.paragraph.5')}
							<br />
							<br />
							{t('siteNews:Season2324.paragraph.6')}
						</Typography>
						<Typography paragraph>
							<b>{t('siteNews:Season2324.text.1')}:</b>
						</Typography>
						<Typography paragraph>
							{t('siteNews:Season2324.text.2')}:
							<br />
							<br /> - {t('siteNews:Season2324.text.3')}{' '}
							<i>&quot;{t('siteNews:Season2324.text.4')}&quot;</i>.{' '}
							{t('siteNews:Season2324.text.5')}
							<br />
							<br /> - {t('siteNews:Season2324.text.6')}
							<i>&quot;{t('siteNews:Season2324.text.7')}&quot;</i>.{' '}
							{t('siteNews:Season2324.text.8')}
							<i>&quot;{t('siteNews:Season2324.text.9')}&quot;</i>{' '}
							{t('siteNews:Season2324.text.10')} &quot;-&quot;, &quot;_&quot;{' '}
							{t('siteNews:Season2324.text.11')}
							<br />
							<br />- {t('siteNews:Season2324.text.12')}{' '}
							<i>&quot;{t('siteNews:Season2324.text.13')}&quot;</i>.{' '}
							{t('siteNews:Season2324.text.14')}
							<br />
							{t('siteNews:Season2324.text.15')}
						</Typography>
						<Typography paragraph>
							<b>{t('siteNews:Season2324.text.16')}:</b>
						</Typography>
						<Typography paragraph>
							{t('siteNews:Season2324.text.17')}
							<br /> {t('siteNews:Season2324.text.18')}
						</Typography>
						<Typography paragraph>
							<b>{t('siteNews:Season2324.text.19')}</b>
						</Typography>
						<CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'end' }}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Typography sx={{ fontSize: '0.85rem' }}>{t('collapse')} </Typography>
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
