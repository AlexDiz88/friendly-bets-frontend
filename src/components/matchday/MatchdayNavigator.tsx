import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Tooltip } from '@mui/material';
import { t } from 'i18next';
import { useMemo } from 'react';
import MatchdayGridSelect from './MatchdayGridSelect';
import type { MatchdaySlot } from './types';

export interface MatchdayNavigatorProps {
	value: number;
	slots: MatchdaySlot[];
	onChange: (value: number) => void;
	disabled?: boolean;
	/** Подпись для aria (по умолчанию — «Тур»). */
	ariaLabel?: string;
}

export default function MatchdayNavigator({
	value,
	slots,
	onChange,
	disabled = false,
	ariaLabel,
}: MatchdayNavigatorProps): JSX.Element {
	const matchdayLabel = ariaLabel ?? t('matchday');
	const matchdayCount = slots.length;

	const currentSlotIndex = useMemo(
		() => slots.findIndex((s) => s.value === value),
		[slots, value]
	);

	const canGoPrev = currentSlotIndex > 0;
	const canGoNext = currentSlotIndex >= 0 && currentSlotIndex < slots.length - 1;

	const goPrev = (): void => {
		if (!canGoPrev) return;
		onChange(slots[currentSlotIndex - 1].value);
	};

	const goNext = (): void => {
		if (!canGoNext) return;
		onChange(slots[currentSlotIndex + 1].value);
	};

	if (matchdayCount === 0) {
		return <></>;
	}

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 0.25,
				justifyContent: 'center',
			}}
		>
			<Tooltip title={t('previousMatchday')}>
				<span>
					<IconButton
						disabled={disabled || !canGoPrev}
						onClick={goPrev}
						aria-label={t('previousMatchday')}
						size="small"
						sx={{
							width: 36,
							height: 36,
							flexShrink: 0,
						}}
					>
						<ChevronLeftIcon sx={{ fontSize: 28 }} />
					</IconButton>
				</span>
			</Tooltip>
			<MatchdayGridSelect
				value={value}
				matchdayCount={matchdayCount}
				slots={slots}
				onChange={onChange}
				disabled={disabled}
				aria-label={matchdayLabel}
			/>
			<Tooltip title={t('nextMatchday')}>
				<span>
					<IconButton
						disabled={disabled || !canGoNext}
						onClick={goNext}
						aria-label={t('nextMatchday')}
						size="small"
						sx={{
							width: 36,
							height: 36,
							flexShrink: 0,
						}}
					>
						<ChevronRightIcon sx={{ fontSize: 28 }} />
					</IconButton>
				</span>
			</Tooltip>
		</Box>
	);
}
