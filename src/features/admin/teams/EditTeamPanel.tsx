import {
	Autocomplete,
	Box,
	CircularProgress,
	FilterOptionsState,
	TextField,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import TeamAvatar from '../../../components/custom/avatar/TeamAvatar';
import {
	resolveTeamDisplayName,
	resolveTeamRussianSortName,
	teamMatchesSearchQuery,
} from '../../../components/utils/teamDisplay';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import TeamFormFields from './TeamFormFields';
import TeamFormStatusIcon from './TeamFormStatusIcon';
import {
	buildExternalAliasPrefill,
	clearTeamMappingSearchParams,
	findTeamByExternalAlias,
	readTeamMappingFromSearchParams,
	type TeamMappingRef,
} from './teamMappingLinkUtils';
import { selectTeams } from './selectors';
import {
	emptyTeamFormValues,
	formValuesToUpdatePayload,
	teamToFormValues,
} from './teamFormUtils';
import Team from './types/Team';
import { getAllTeams, updateTeam } from './teamsSlice';
import { ADMIN_EXTERNAL_TEAM_ALIASES_ID, softScrollToId } from '../adminScroll';

export default function EditTeamPanel(): JSX.Element {
	const dispatch = useAppDispatch();
	const { i18n } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();
	const teams = useAppSelector(selectTeams);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<Team | null>(null);
	const [values, setValues] = useState(emptyTeamFormValues);
	const [saving, setSaving] = useState(false);
	const [mappingSession, setMappingSession] = useState<TeamMappingRef | null>(null);
	const prefillTeamIdRef = useRef<string | null>(null);
	const teamSelectInputRef = useRef<HTMLInputElement | null>(null);
	const focusTeamSelectPendingRef = useRef(false);
	const [teamSelectOpen, setTeamSelectOpen] = useState(false);

	const prefillTeamId = searchParams.get('teamId') ?? undefined;

	const exitMappingMode = useCallback((): void => {
		setMappingSession(null);
		prefillTeamIdRef.current = null;
		focusTeamSelectPendingRef.current = false;
		setTeamSelectOpen(false);
		clearTeamMappingSearchParams(setSearchParams);
	}, [setSearchParams]);

	useEffect(() => {
		const fromUrl = readTeamMappingFromSearchParams(searchParams);
		const teamIdFromUrl = searchParams.get('teamId');
		const openEdit = searchParams.get('openTeamEdit') === '1';
		if (!fromUrl && !teamIdFromUrl && !openEdit) {
			return;
		}

		if (fromUrl) {
			setMappingSession(fromUrl);
			prefillTeamIdRef.current = null;
			focusTeamSelectPendingRef.current = true;
			setSelected(null);
			setValues(emptyTeamFormValues());
		}
		clearTeamMappingSearchParams(setSearchParams);
	}, [searchParams, setSearchParams]);

	useEffect(() => {
		if (!mappingSession || loading || selected || !focusTeamSelectPendingRef.current) {
			return;
		}
		focusTeamSelectPendingRef.current = false;
		const timer = window.setTimeout(() => {
			teamSelectInputRef.current?.focus();
			setTeamSelectOpen(true);
		}, 50);
		return () => window.clearTimeout(timer);
	}, [mappingSession, loading, selected]);

	useEffect(() => {
		let cancelled = false;
		const load = async (): Promise<void> => {
			setLoading(true);
			await dispatch(getAllTeams());
			if (!cancelled) {
				setLoading(false);
			}
		};
		load();
		return () => {
			cancelled = true;
		};
	}, [dispatch]);

	const sortedTeams = useMemo(
		() =>
			[...teams].sort((a, b) =>
				resolveTeamRussianSortName(a).localeCompare(resolveTeamRussianSortName(b), 'ru')
			),
		[teams]
	);

	const filterTeamOptions = useCallback(
		(options: Team[], state: FilterOptionsState<Team>) =>
			options.filter((team) => teamMatchesSearchQuery(team, state.inputValue)),
		[]
	);

	useEffect(() => {
		if (loading || !mappingSession) {
			return;
		}
		if (prefillTeamIdRef.current != null) {
			return;
		}
		const matched = findTeamByExternalAlias(
			teams,
			mappingSession.provider,
			mappingSession.externalId,
			mappingSession.externalName
		);
		if (matched) {
			setSelected(matched);
		}
	}, [loading, mappingSession, teams]);

	useEffect(() => {
		if (loading || prefillTeamIdRef.current != null) {
			return;
		}
		if (prefillTeamId) {
			const team = teams.find((item) => item.id === prefillTeamId);
			if (team) {
				setSelected(team);
			}
		}
	}, [loading, prefillTeamId, teams]);

	useEffect(() => {
		if (!selected) {
			setValues(emptyTeamFormValues());
			return;
		}
		const base = teamToFormValues(selected);
		if (
			mappingSession &&
			(prefillTeamIdRef.current === null || prefillTeamIdRef.current === selected.id)
		) {
			if (prefillTeamIdRef.current === null) {
				prefillTeamIdRef.current = selected.id;
			}
			setValues({
				...base,
				...buildExternalAliasPrefill(
					mappingSession.provider,
					mappingSession.externalId,
					mappingSession.externalName
				),
			});
			return;
		}
		setValues(base);
	}, [mappingSession, selected]);

	const handleChange = (patch: Partial<typeof values>): void => {
		setValues((prev) => ({ ...prev, ...patch }));
	};

	const handleCancel = useCallback((): void => {
		setSelected(null);
		setValues(emptyTeamFormValues());
	}, []);

	const handleSave = useCallback(async () => {
		if (!selected || saving) {
			return;
		}
		setSaving(true);
		const result = await dispatch(
			updateTeam({
				teamId: selected.id,
				payload: formValuesToUpdatePayload(values, selected.externalAliases),
			})
		);
		setSaving(false);
		if (updateTeam.fulfilled.match(result)) {
			const returnToAliases = mappingSession != null;
			dispatch(showSuccessSnackbar({ message: t('teamWasSuccessfullyUpdated') }));
			exitMappingMode();
			setSelected(null);
			setValues(emptyTeamFormValues());
			if (returnToAliases) {
				window.setTimeout(() => {
					softScrollToId(ADMIN_EXTERNAL_TEAM_ALIASES_ID, 0);
				}, 10);
			}
		}
		if (updateTeam.rejected.match(result)) {
			dispatch(showErrorSnackbar({ message: result.error.message }));
		}
	}, [dispatch, exitMappingMode, mappingSession, selected, saving, values]);

	return (
		<Box>
			{mappingSession && !selected ? (
				<Typography variant="body2" sx={{ mb: 1, opacity: 0.85, textAlign: 'left' }}>
					{t('errorLogsTeamMappingPrefillHint', {
						name: mappingSession.externalName ?? '—',
					})}
				</Typography>
			) : null}

			{loading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
					<CircularProgress size={28} />
				</Box>
			) : (
				<Autocomplete
					options={sortedTeams}
					value={selected}
					open={teamSelectOpen}
					onOpen={() => setTeamSelectOpen(true)}
					onClose={() => setTeamSelectOpen(false)}
					onChange={(_e, team) => {
						setTeamSelectOpen(false);
						setSelected(team);
					}}
					getOptionLabel={(team) => resolveTeamDisplayName(team, i18n.language)}
					filterOptions={filterTeamOptions}
					isOptionEqualToValue={(a, b) => a.id === b.id}
					renderOption={(props, team) => (
						<li {...props} key={team.id}>
							<Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
								<TeamAvatar team={team} height={22} />
								<TeamFormStatusIcon values={teamToFormValues(team)} />
							</Box>
						</li>
					)}
					renderInput={(params) => (
						<TextField
							{...params}
							inputRef={teamSelectInputRef}
							label={t('teamSelectToEdit')}
							variant="outlined"
							size="small"
						/>
					)}
					sx={{ mb: 1.5 }}
				/>
			)}

			{selected ? (
				<Box>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
						<TeamAvatar team={selected} height={28} />
						<TeamFormStatusIcon values={values} />
					</Box>
					<TeamFormFields
						values={values}
						onChange={handleChange}
						titleReadOnly
						forceExpandAliases={mappingSession != null}
					/>
					<Box sx={{ textAlign: 'center', mt: 1 }}>
						<CustomCancelButton onClick={handleCancel} sx={{ mb: 0.75 }} />
						<CustomSuccessButton
							onClick={handleSave}
							buttonText={t('btnText.save')}
							disabled={saving}
						/>
					</Box>
				</Box>
			) : null}
		</Box>
	);
}
