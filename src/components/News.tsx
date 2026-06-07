import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NewsCard from './news/NewsCard';
import { NEWS_ITEMS } from './news/newsItems';

export default function News(): JSX.Element {
	const { t } = useTranslation();

	return (
		<Container>
			<Box
				sx={{
					textAlign: 'center',
					borderBottom: 2,
					mx: 2,
					pb: 1,
					mb: 2,
					fontWeight: 600,
				}}
			>
				{t('websiteNews')}
			</Box>
			{NEWS_ITEMS.map((item) => (
				<NewsCard key={item.id} item={item} />
			))}
		</Container>
	);
}
