import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Typography } from '@mui/material';
import { t } from 'i18next';
import {
	errorLogsPaginationIndicatorSx,
	errorLogsPaginationNavBtnSx,
	errorLogsPaginationPageTextSx,
	errorLogsPaginationRootSx,
} from './errorLogsPageStyles';

export default function ErrorLogsPagination({
	page,
	totalPages,
	onPageChange,
}: {
	page: number;
	totalPages: number;
	onPageChange: (newPage: number) => void;
}): JSX.Element | null {
	if (totalPages <= 1) {
		return null;
	}

	const isFirst = page <= 1;
	const isLast = page >= totalPages;

	return (
		<Box sx={errorLogsPaginationRootSx} role="navigation" aria-label={t('errorLogsPaginationNav')}>
			<span>
				<IconButton
					aria-label={t('betsPaginationPrev')}
					disabled={isFirst}
					onClick={() => onPageChange(page - 1)}
					sx={errorLogsPaginationNavBtnSx(isFirst)}
				>
					<ChevronLeftIcon sx={{ fontSize: 28 }} />
				</IconButton>
			</span>

			<Box sx={errorLogsPaginationIndicatorSx}>
				<Typography component="span" sx={errorLogsPaginationPageTextSx}>
					{t('betsPaginationPage', { page, total: totalPages })}
				</Typography>
			</Box>

			<span>
				<IconButton
					aria-label={t('betsPaginationNext')}
					disabled={isLast}
					onClick={() => onPageChange(page + 1)}
					sx={errorLogsPaginationNavBtnSx(isLast)}
				>
					<ChevronRightIcon sx={{ fontSize: 28 }} />
				</IconButton>
			</span>
		</Box>
	);
}
