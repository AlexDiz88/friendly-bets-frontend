import { Box, Container } from '@mui/material';
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
				Общие правила для всех турниров
			</Box>
			<Rules />
		</Container>
	);
}
