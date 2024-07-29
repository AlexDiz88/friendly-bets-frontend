import { Box, Container } from '@mui/material';
import { t } from 'i18next';
import Rules from './Rules';

export default function RulesPage(): JSX.Element {
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
				{t('generalRules')}
			</Box>
			<Rules />
		</Container>
	);
}
