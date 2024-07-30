import { Box, Button, Typography } from '@mui/material';

interface PaginationControlsProps {
	page: number;
	totalPages: number;
	handlePageChange: (newPage: number) => void;
}

const CustomButtonGroupPagination = ({
	page,
	totalPages,
	handlePageChange,
}: PaginationControlsProps): JSX.Element => {
	return (
		<Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}>
			<Button
				sx={{
					width: 60,
					padding: '10px 50px',
					backgroundColor: '#e2e7fd',
					color: 'black',
				}}
				variant="contained"
				disabled={page === 1}
				onClick={() => handlePageChange(page - 1)}
			>
				<Typography sx={{ fontSize: 20 }}>&lt;</Typography>
			</Button>
			<Button
				sx={{
					width: 60,
					padding: '10px 50px',
					margin: '0 15px',
					backgroundColor: '#afafaf',
				}}
				variant="contained"
				onClick={() => handlePageChange(page)}
			>
				<Typography sx={{ fontSize: 20, fontWeight: 600, fontFamily: 'Exo 2' }}>{page}</Typography>
			</Button>
			<Button
				sx={{
					width: 60,
					padding: '10px 50px',
					backgroundColor: '#e2e7fd',
					color: 'black',
				}}
				variant="contained"
				disabled={page === totalPages}
				onClick={() => handlePageChange(page + 1)}
			>
				<Typography sx={{ fontSize: 20 }}>&gt;</Typography>
			</Button>
		</Box>
	);
};

export default CustomButtonGroupPagination;
