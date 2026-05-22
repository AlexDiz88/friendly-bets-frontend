import DeleteIcon from '@mui/icons-material/Delete';
import {
	Box,
	FormControlLabel,
	IconButton,
	MenuItem,
	Select,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
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
import { ADMIN_PANEL_SX } from '../adminPanelStyles';
import { createTournamentFormat, getTournamentFormats } from './api';
import TournamentFormatListItem from './TournamentFormatListItem';
import TournamentFormat, { NewTournamentFormat, PlayoffStage, RoundRobinStage } from './types/TournamentFormat';

const PLAYOFF_STAGE_OPTIONS = ['1/16', '1/8', '1/4', '1/2', 'third_place', 'final'] as const;

const emptyPlayoffStage = (): PlayoffStage => ({ stage: '1/8', matchdayCount: 2 });

export default function TournamentFormatsManagement(): JSX.Element {
	const dispatch = useAppDispatch();
	const [formats, setFormats] = useState<TournamentFormat[]>([]);
	const [showCreate, setShowCreate] = useState(false);
	const [showFormatsList, setShowFormatsList] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formatCode, setFormatCode] = useState('');
	const [name, setName] = useState('');
	const [useRegular, setUseRegular] = useState(false);
	const [regularCount, setRegularCount] = useState('38');
	const [useGroup, setUseGroup] = useState(false);
	const [groupCount, setGroupCount] = useState('8');
	const [usePlayoff, setUsePlayoff] = useState(false);
	const [rounds, setRounds] = useState<PlayoffStage[]>([emptyPlayoffStage()]);

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
		setUseRegular(false);
		setRegularCount('38');
		setUseGroup(false);
		setGroupCount('8');
		setUsePlayoff(false);
		setRounds([emptyPlayoffStage()]);
	};

	const buildPayload = (): NewTournamentFormat => {
		const regularStage: RoundRobinStage | null =
			useRegular && !useGroup ? { matchdayCount: Number(regularCount) } : null;
		const groupStage: RoundRobinStage | null =
			useGroup && !useRegular ? { matchdayCount: Number(groupCount) } : null;
		const playoff: PlayoffStage[] | null = usePlayoff
			? rounds.filter((r) => r.stage.trim())
			: null;
		return {
			formatCode: formatCode.trim(),
			name: name.trim(),
			regularStage,
			groupStage,
			playoff,
		};
	};

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

	const updateStage = (index: number, field: keyof PlayoffStage, value: string | number): void => {
		setRounds((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
	};

	return (
		<Box sx={ADMIN_PANEL_SX}>
			<Typography sx={{ fontSize: 22, fontWeight: 600, mb: 1.5 }}>{t('tournamentFormatsManagement')}</Typography>

			<CustomButton
				sx={{ px: 2, mb: 2 }}
				onClick={() => setShowCreate(!showCreate)}
				buttonColor="secondary"
				buttonText={t('newTournamentFormat')}
			/>

			{showCreate && (
				<Box sx={{ textAlign: 'left', px: 1, mb: 2 }}>
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

					<FormControlLabel
						control={
							<Switch
								checked={useRegular}
								onChange={(e) => {
									setUseRegular(e.target.checked);
									if (e.target.checked) setUseGroup(false);
								}}
							/>
						}
						label={t('tournamentFormatRegularStage')}
					/>
					{useRegular && (
						<TextField
							fullWidth
							size="small"
							type="number"
							label={t('tournamentFormatMatchdayCount')}
							value={regularCount}
							onChange={(e) => setRegularCount(e.target.value)}
							inputProps={{ min: 1 }}
							sx={{ mb: 1 }}
						/>
					)}

					<FormControlLabel
						control={
							<Switch
								checked={useGroup}
								onChange={(e) => {
									setUseGroup(e.target.checked);
									if (e.target.checked) setUseRegular(false);
								}}
							/>
						}
						label={t('tournamentFormatGroupStage')}
					/>
					{useGroup && (
						<TextField
							fullWidth
							size="small"
							type="number"
							label={t('tournamentFormatMatchdayCount')}
							value={groupCount}
							onChange={(e) => setGroupCount(e.target.value)}
							inputProps={{ min: 1 }}
							sx={{ mb: 1 }}
						/>
					)}

					<FormControlLabel
						control={
							<Switch checked={usePlayoff} onChange={(e) => setUsePlayoff(e.target.checked)} />
						}
						label={t('tournamentFormatPlayoff')}
					/>

					{usePlayoff && (
						<Box sx={{ mb: 1 }}>
							<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
								{t('tournamentFormatPlayoffStages')}
							</Typography>
							{rounds.map((round, index) => (
								<Box
									key={`round-${index}`}
									sx={{ display: 'flex', gap: 0.5, mb: 0.5, alignItems: 'center' }}
								>
									<Select
										size="small"
										value={round.stage}
										onChange={(e) => updateStage(index, 'stage', e.target.value)}
										sx={{ flex: 1 }}
									>
										{PLAYOFF_STAGE_OPTIONS.map((key) => (
											<MenuItem key={key} value={key}>
												{t(`playoffStage.${key}`)}
											</MenuItem>
										))}
									</Select>
									<Select
										size="small"
										value={round.matchdayCount}
										onChange={(e) =>
											updateStage(index, 'matchdayCount', Number(e.target.value))
										}
										sx={{ width: '5rem' }}
									>
										<MenuItem value={1}>1</MenuItem>
										<MenuItem value={2}>2</MenuItem>
									</Select>
									<IconButton
										size="small"
										onClick={() => setRounds((prev) => prev.filter((_, i) => i !== index))}
										disabled={rounds.length <= 1}
									>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</Box>
							))}
							<CustomButton
								buttonSize="small"
								buttonVariant="outlined"
								onClick={() => setRounds((prev) => [...prev, emptyPlayoffStage()])}
								buttonText={t('tournamentFormatAddStage')}
							/>
						</Box>
					)}

					<Box sx={{ textAlign: 'center', mt: 1 }}>
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
				sx={{ px: 2, mb: showFormatsList ? 1 : 0 }}
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
				<Box sx={{ textAlign: 'left' }}>
					<Typography sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>
						{t('tournamentFormatsList')}
					</Typography>
					{loading && (
						<Typography variant="body2" sx={{ textAlign: 'center' }}>
							{t('loading')}
						</Typography>
					)}
					{!loading && formats.length === 0 && (
						<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
							{t('tournamentFormatsEmpty')}
						</Typography>
					)}
					{formats.map((f) => (
						<TournamentFormatListItem key={f.id} format={f} onChanged={loadFormats} />
					))}
				</Box>
			)}
		</Box>
	);
}
