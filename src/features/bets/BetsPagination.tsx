import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
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
	navigationAriaLabel,
}: {
	page: number;
	totalPages: number;
	onPageChange: (newPage: number) => void;
	/** i18n-ключ для aria-label навигации; по умолчанию — завершённые ставки */
	navigationAriaLabel?: string;
}): JSX.Element | null {
	const { t } = useTranslation();
	const navLabel = navigationAriaLabel ? t(navigationAriaLabel) : t('completedBets');

	if (totalPages <= 1) {
		return null;
	}

	const isFirst = page <= 1;
	const isLast = page >= totalPages;

	return (
		<Box sx={betsPaginationRootSx} role="navigation" aria-label={navLabel}>
			<span>
				<IconButton
					aria-label={t('betsPaginationFirst')}
					disabled={isFirst}
					onClick={() => onPageChange(1)}
					sx={betsPaginationNavBtnSx(isFirst)}
				>
					<FirstPageIcon sx={{ fontSize: 28 }} />
				</IconButton>
			</span>
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
			<span>
				<IconButton
					aria-label={t('betsPaginationLast')}
					disabled={isLast}
					onClick={() => onPageChange(totalPages)}
					sx={betsPaginationNavBtnSx(isLast)}
				>
					<LastPageIcon sx={{ fontSize: 28 }} />
				</IconButton>
			</span>
		</Box>
	);
}
