import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Dialog, DialogActions, DialogContent, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import { deleteTournamentFormat, updateTournamentFormat } from './api';
import TournamentFormatStructureFields from './TournamentFormatStructureFields';
import {
	buildStructurePayload,
	resizeStructureDraftGroupCount,
	structureDraftFromFormat,
	type TournamentFormatStructureDraft,
} from './tournamentFormatStructureUtils';
import TournamentFormat from './types/TournamentFormat';

function TooltipIconButton({
	title,
	disabled,
	onClick,
	color,
	children,
}: {
	title: string;
	disabled?: boolean;
	onClick: () => void;
	color?: 'default' | 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
	children: React.ReactNode;
}): JSX.Element {
	return (
		<Tooltip title={title} arrow>
			<span>
				<IconButton size="small" color={color} disabled={disabled} onClick={onClick}>
					{children}
				</IconButton>
			</span>
		</Tooltip>
	);
}

export default function TournamentFormatListItem({
	format,
	onChanged,
}: {
	format: TournamentFormat;
	onChanged: () => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const [editing, setEditing] = useState(false);
	const [nameDraft, setNameDraft] = useState(format.name);
	const [structureDraft, setStructureDraft] = useState<TournamentFormatStructureDraft>(() =>
		structureDraftFromFormat(format)
	);
	const [busy, setBusy] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const linkedCount = format.linkedLeagueCount ?? 0;
	const canDelete = linkedCount === 0;
	const canEditStructure = linkedCount === 0;
	const formatId = format.id;

	const resetDraft = (): void => {
		setNameDraft(format.name);
		setStructureDraft(structureDraftFromFormat(format));
	};

	const startEdit = (): void => {
		resetDraft();
		setEditing(true);
	};

	const cancelEdit = (): void => {
		resetDraft();
		setEditing(false);
	};

	const handleSave = async (): Promise<void> => {
		const trimmed = nameDraft.trim();
		if (!trimmed || busy || !formatId) {
			return;
		}
		setBusy(true);
		try {
			if (canEditStructure) {
				const structure = buildStructurePayload(structureDraft, format.formatCode);
				await updateTournamentFormat(formatId, {
					name: trimmed,
					...structure,
				});
				dispatch(showSuccessSnackbar({ message: t('tournamentFormatUpdated') }));
			} else {
				await updateTournamentFormat(formatId, {
					name: trimmed,
					regularStage: null,
					groupStage: null,
					playoff: null,
				});
				dispatch(showSuccessSnackbar({ message: t('tournamentFormatNameUpdated') }));
			}
			setEditing(false);
			onChanged();
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('tournamentFormatUpdateError'),
				})
			);
		} finally {
			setBusy(false);
		}
	};

	const handleDeleteConfirm = async (): Promise<void> => {
		if (!canDelete || busy || !formatId) {
			return;
		}
		setBusy(true);
		try {
			await deleteTournamentFormat(formatId);
			dispatch(showSuccessSnackbar({ message: t('tournamentFormatDeleted') }));
			setDeleteDialogOpen(false);
			onChanged();
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('tournamentFormatDeleteError'),
				})
			);
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<Box
				sx={{
					border: 1,
					borderRadius: 1,
					p: 1,
					mb: 1,
					fontSize: '0.85rem',
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						{editing ? (
							<>
								<TextField
									fullWidth
									size="small"
									label={t('tournamentFormatName')}
									value={nameDraft}
									onChange={(e) => setNameDraft(e.target.value)}
									disabled={busy}
									autoFocus
									sx={{ mb: canEditStructure ? 1 : 0 }}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											void handleSave();
										}
										if (e.key === 'Escape') {
											cancelEdit();
										}
									}}
								/>
								{canEditStructure ? (
									<TournamentFormatStructureFields
										formatCode={format.formatCode}
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
										onRoundsChange={(rounds) =>
											setStructureDraft((prev) => ({ ...prev, rounds }))
										}
										disabled={busy}
									/>
								) : (
									<Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
										{t('tournamentFormatStructureEditBlocked', { count: linkedCount })}
									</Typography>
								)}
							</>
						) : (
							<>
								<Typography fontWeight={700}>{format.name}</Typography>
								<Typography variant="caption" color="text.secondary">
									{format.formatCode}
								</Typography>
								{format.expandedSlots && (
									<Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
										{t('tournamentFormatSlotsCount', { count: format.expandedSlots.length })}
									</Typography>
								)}
								{linkedCount > 0 && (
									<Typography variant="caption" color="text.secondary" display="block">
										{t('tournamentFormatLinkedLeagues', { count: linkedCount })}
									</Typography>
								)}
							</>
						)}
					</Box>
					<Box sx={{ display: 'flex', flexShrink: 0 }}>
						{editing ? (
							<>
								<TooltipIconButton
									title={t('btnText.save')}
									disabled={busy || !nameDraft.trim()}
									onClick={() => {
										void handleSave();
									}}
									color="success"
								>
									<CheckIcon fontSize="small" />
								</TooltipIconButton>
								<TooltipIconButton
									title={t('btnText.cancel')}
									disabled={busy}
									onClick={cancelEdit}
								>
									<CloseIcon fontSize="small" />
								</TooltipIconButton>
							</>
						) : (
							<>
								<TooltipIconButton title={t('btnText.edit')} disabled={busy} onClick={startEdit}>
									<EditIcon fontSize="small" />
								</TooltipIconButton>
								<TooltipIconButton
									title={
										canDelete
											? t('btnText.delete')
											: t('tournamentFormatDeleteBlocked', { count: linkedCount })
									}
									disabled={!canDelete || busy}
									onClick={() => setDeleteDialogOpen(true)}
									color="error"
								>
									<DeleteIcon fontSize="small" />
								</TooltipIconButton>
							</>
						)}
					</Box>
				</Box>
			</Box>

			<Dialog
				open={deleteDialogOpen}
				onClose={() => {
					if (!busy) {
						setDeleteDialogOpen(false);
					}
				}}
			>
				<DialogContent>
					<Box sx={{ fontWeight: 600, fontSize: '1rem', maxWidth: '16rem' }}>
						{t('tournamentFormatDeleteConfirm', { name: format.name })}
					</Box>
				</DialogContent>
				<DialogActions sx={{ justifyContent: 'center', pb: 1.5 }}>
					<CustomCancelButton onClick={() => setDeleteDialogOpen(false)} />
					<CustomSuccessButton
						onClick={() => {
							void handleDeleteConfirm();
						}}
						buttonText={t('btnText.delete')}
						disabled={busy}
					/>
				</DialogActions>
			</Dialog>
		</>
	);
}
