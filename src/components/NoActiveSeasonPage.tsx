import Box from '@mui/material/Box';

export default function NoActiveSeasonPage(): JSX.Element {
	return (
		<Box sx={{ textAlign: 'center', fontWeight: 600, color: 'brown', pt: 10, fontSize: 20 }}>
			В данный момент нет активных турниров
		</Box>
	);
}
