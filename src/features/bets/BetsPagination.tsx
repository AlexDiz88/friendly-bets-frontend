import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
	betsPaginationIndicatorSx,
	betsPaginationNavBtnSx,
	betsPaginationPageTextSx,
	betsPaginationRootSx,
} from './betsPageStyles';

export default function BetsPagination({
	page,
	totalPages,
	onPageChange,
}: {
	page: number;
	totalPages: number;
	onPageChange: (newPage: number) => void;
}): JSX.Element | null {
	const { t } = useTranslation();

	if (totalPages <= 1) {
		return null;
	}

	const isFirst = page <= 1;
	const isLast = page >= totalPages;

	return (
		<Box sx={betsPaginationRootSx} role="navigation" aria-label={t('completedBets')}>
			<span>
				<IconButton
					aria-label={t('betsPaginationPrev')}
					disabled={isFirst}
					onClick={() => onPageChange(page - 1)}
					sx={betsPaginationNavBtnSx(isFirst)}
				>
					<ChevronLeftIcon sx={{ fontSize: 28 }} />
				</IconButton>
			</span>

			<Box sx={betsPaginationIndicatorSx}>
				<Typography component="span" sx={betsPaginationPageTextSx}>
					{t('betsPaginationPage', { page, total: totalPages })}
				</Typography>
			</Box>

			<span>
				<IconButton
					aria-label={t('betsPaginationNext')}
					disabled={isLast}
					onClick={() => onPageChange(page + 1)}
					sx={betsPaginationNavBtnSx(isLast)}
				>
					<ChevronRightIcon sx={{ fontSize: 28 }} />
				</IconButton>
			</span>
		</Box>
	);
}
