import { Box, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import CustomButton from '../../../components/custom/btn/CustomButton';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import { useAppDispatch } from '../../../app/hooks';
import AdminSection from '../AdminSection';
import { ADMIN_FORM_PANEL_SX } from '../adminPanelStyles';
import { createTournamentFormat, getTournamentFormats } from './api';
import TournamentFormatListItem from './TournamentFormatListItem';
import TournamentFormatStructureFields from './TournamentFormatStructureFields';
import {
	buildStructurePayload,
	emptyStructureDraft,
	resizeStructureDraftGroupCount,
	type TournamentFormatStructureDraft,
} from './tournamentFormatStructureUtils';
import TournamentFormat, { NewTournamentFormat } from './types/TournamentFormat';

export default function TournamentFormatsManagement(): JSX.Element {
	const dispatch = useAppDispatch();
	const [formats, setFormats] = useState<TournamentFormat[]>([]);
	const [showCreate, setShowCreate] = useState(false);
	const [showFormatsList, setShowFormatsList] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formatCode, setFormatCode] = useState('');
	const [name, setName] = useState('');
	const [structureDraft, setStructureDraft] = useState<TournamentFormatStructureDraft>(emptyStructureDraft);

	const loadFormats = useCallback(async () => {
		setLoading(true);
		try {
			const page = await getTournamentFormats();
			setFormats(page.formats);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('tournamentFormatLoadError'),
				})
			);
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		loadFormats();
	}, [loadFormats]);

	const resetForm = (): void => {
		setFormatCode('');
		setName('');
		setStructureDraft(emptyStructureDraft());
	};

	const buildPayload = (): NewTournamentFormat => ({
		formatCode: formatCode.trim(),
		name: name.trim(),
		...buildStructurePayload(structureDraft),
	});

	const handleSubmit = async (): Promise<void> => {
		try {
			await createTournamentFormat(buildPayload());
			dispatch(showSuccessSnackbar({ message: t('tournamentFormatCreated') }));
			resetForm();
			setShowCreate(false);
			await loadFormats();
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('tournamentFormatCreateError'),
				})
			);
		}
	};

	return (
		<AdminSection title={t('tournamentFormatsManagement')}>
			<CustomButton
				sx={{ width: '100%', mb: showCreate ? 1.5 : 1 }}
				onClick={() => setShowCreate(!showCreate)}
				buttonColor="secondary"
				buttonText={t('newTournamentFormat')}
			/>

			{showCreate && (
				<Box sx={ADMIN_FORM_PANEL_SX}>
					<TextField
						fullWidth
						size="small"
						label={t('tournamentFormatCode')}
						value={formatCode}
						onChange={(e) => setFormatCode(e.target.value)}
						sx={{ mb: 1 }}
					/>
					<TextField
						fullWidth
						size="small"
						label={t('tournamentFormatName')}
						value={name}
						onChange={(e) => setName(e.target.value)}
						sx={{ mb: 1 }}
					/>

					<TournamentFormatStructureFields
						useRegular={structureDraft.useRegular}
						onUseRegularChange={(value) =>
							setStructureDraft((prev) => ({ ...prev, useRegular: value }))
						}
						regularCount={structureDraft.regularCount}
						onRegularCountChange={(value) =>
							setStructureDraft((prev) => ({ ...prev, regularCount: value }))
						}
						useGroup={structureDraft.useGroup}
						onUseGroupChange={(value) =>
							setStructureDraft((prev) => ({ ...prev, useGroup: value }))
						}
						groupCount={structureDraft.groupCount}
						onGroupCountChange={(value) =>
							setStructureDraft((prev) => resizeStructureDraftGroupCount(prev, value))
						}
						groupSplitSlots={structureDraft.groupSplitSlots}
						onGroupSplitSlotsChange={(value) =>
							setStructureDraft((prev) => ({ ...prev, groupSplitSlots: value }))
						}
						groupSlotsPerRound={structureDraft.groupSlotsPerRound}
						onGroupSlotsPerRoundChange={(groupSlotsPerRound) =>
							setStructureDraft((prev) => ({ ...prev, groupSlotsPerRound }))
						}
						usePlayoff={structureDraft.usePlayoff}
						onUsePlayoffChange={(value) =>
							setStructureDraft((prev) => ({ ...prev, usePlayoff: value }))
						}
						rounds={structureDraft.rounds}
						onRoundsChange={(rounds) => setStructureDraft((prev) => ({ ...prev, rounds }))}
					/>

					<Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1.5 }}>
						<CustomCancelButton
							onClick={() => {
								setShowCreate(false);
								resetForm();
							}}
						/>
						<CustomSuccessButton onClick={handleSubmit} buttonText={t('btnText.create')} />
					</Box>
				</Box>
			)}

			<CustomButton
				sx={{ width: '100%', mb: showFormatsList ? 1.5 : 0 }}
				onClick={() => setShowFormatsList(!showFormatsList)}
				buttonColor="info"
				buttonVariant="outlined"
				buttonText={
					showFormatsList
						? t('hideTournamentFormatsList')
						: t('showTournamentFormatsList', { count: formats.length })
				}
			/>

			{showFormatsList && (
				<Box>
					{loading && (
						<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
							{t('loading')}
						</Typography>
					)}
					{!loading && formats.length === 0 && (
						<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
							{t('tournamentFormatsEmpty')}
						</Typography>
					)}
					{formats.map((f) => (
						<TournamentFormatListItem key={f.id} format={f} onChanged={loadFormats} />
					))}
				</Box>
			)}
		</AdminSection>
	);
}
