import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import LeagueAvatar from '../../../components/custom/avatar/LeagueAvatar';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import MatchdayGridSelect from '../../../components/matchday/MatchdayGridSelect';
import {
	expandedSlotsToMatchdaySlots,
	matchDayStringToSlotValue,
	slotValueToMatchDayString,
} from '../../../components/matchday/slotMappers';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import League from './types/League';
import { setLeagueCurrentMatchday } from './api';
import LeagueRemoveFromSeasonButton from './LeagueRemoveFromSeasonButton';

export default function LeagueCurrentMatchdayAssignInline({
	league,
	formatCode,
	seasonId,
	onSaved,
}: {
	league: League;
	formatCode?: string;
	seasonId: string;
	onSaved: () => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const slots = useMemo(
		() => (league.matchdaySlots?.length ? expandedSlotsToMatchdaySlots(league.matchdaySlots) : []),
		[league.matchdaySlots]
	);
	const [slotValue, setSlotValue] = useState(() =>
		matchDayStringToSlotValue(league.currentMatchDay, slots)
	);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setSlotValue(matchDayStringToSlotValue(league.currentMatchDay, slots));
	}, [league.id, league.currentMatchDay, slots]);

	const handleSave = async (): Promise<void> => {
		if (saving || slots.length === 0) {
			return;
		}
		setSaving(true);
		try {
			await setLeagueCurrentMatchday(league.id, slotValueToMatchDayString(slotValue, slots));
			dispatch(showSuccessSnackbar({ message: t('leagueCurrentMatchdaySaved') }));
			onSaved();
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('leagueCurrentMatchdayError'),
				})
			);
		} finally {
			setSaving(false);
		}
	};

	if (slots.length === 0) {
		return <></>;
	}

	return (
		<Box
			sx={{
				border: 1,
				borderColor: 'divider',
				borderRadius: 1,
				px: 0.25,
				py: 0.75,
				bgcolor: 'background.paper',
				textAlign: 'left',
				width: '100%',
				minWidth: 0,
				overflow: 'hidden',
				boxSizing: 'border-box',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: formatCode ? 0.25 : 0.5 }}>
				<LeagueAvatar leagueCode={league.leagueCode} height={24} />
				<Typography variant="body2" fontWeight={600} sx={{ flex: 1, minWidth: 0 }}>
					{league.name}
				</Typography>
				{league.removable ? (
					<LeagueRemoveFromSeasonButton
						seasonId={seasonId}
						league={league}
						onRemoved={onSaved}
					/>
				) : null}
			</Box>
			{formatCode ? (
				<Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5, pl: 3.5 }}>
					{formatCode}
				</Typography>
			) : null}
			<Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
				{t('leagueCurrentMatchday')}
			</Typography>
			<Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', minWidth: 0 }}>
				<MatchdayGridSelect
					value={slotValue}
					matchdayCount={slots.length}
					slots={slots}
					onChange={setSlotValue}
					disabled={saving}
					aria-label={t('leagueCurrentMatchday')}
				/>
				<CustomSuccessButton
					buttonText={t('btnText.save')}
					disabled={saving}
					onClick={() => {
						void handleSave();
					}}
					sx={{ height: '2rem', px: 1, mr: 0, minWidth: 0, flexShrink: 0 }}
					textSize="0.75rem"
				/>
			</Box>
		</Box>
	);
}
