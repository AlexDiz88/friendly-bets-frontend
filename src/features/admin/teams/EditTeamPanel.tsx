import {
	Autocomplete,
	Box,
	CircularProgress,
	FilterOptionsState,
	TextField,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { notifyExternalSyncIssuesChanged } from '../external-sync-issues/api';
import {
	buildExternalAliasPrefill,
	findTeamByExternalAlias,
} from './teamMappingLinkUtils';
import { selectTeams } from './selectors';
import {
	emptyTeamFormValues,
	formValuesToUpdatePayload,
	teamToFormValues,
} from './teamFormUtils';
import Team from './types/Team';
import { getAllTeams, updateTeam } from './teamsSlice';

export default function EditTeamPanel(): JSX.Element {
	const dispatch = useAppDispatch();
	const { i18n } = useTranslation();
	const [searchParams] = useSearchParams();
	const teams = useAppSelector(selectTeams);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<Team | null>(null);
	const [values, setValues] = useState(emptyTeamFormValues);
	const [saving, setSaving] = useState(false);
	const [unmappedHintsRefreshKey, setUnmappedHintsRefreshKey] = useState(0);
	const [deepLinkHandled, setDeepLinkHandled] = useState(false);

	const prefillProvider = searchParams.get('provider') ?? undefined;
	const prefillExternalId = searchParams.get('externalId') ?? undefined;
	const prefillExternalName = searchParams.get('externalName') ?? undefined;
	const prefillTeamId = searchParams.get('teamId') ?? undefined;
	const hasMappingPrefill = Boolean(
		prefillProvider && (prefillExternalId || prefillExternalName)
	);

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
				resolveTeamRussianSortName(a, t).localeCompare(resolveTeamRussianSortName(b, t), 'ru')
			),
		[teams]
	);

	const filterTeamOptions = useCallback(
		(options: Team[], state: FilterOptionsState<Team>) =>
			options.filter((team) => teamMatchesSearchQuery(team, state.inputValue, t)),
		[]
	);

	useEffect(() => {
		if (selected) {
			setValues(teamToFormValues(selected));
		} else {
			setValues(emptyTeamFormValues());
		}
	}, [selected]);

	useEffect(() => {
		if (loading || deepLinkHandled) {
			return;
		}
		if (prefillTeamId) {
			const team = teams.find((item) => item.id === prefillTeamId);
			if (team) {
				setSelected(team);
				setDeepLinkHandled(true);
			}
			return;
		}
		if (hasMappingPrefill && prefillProvider) {
			const matched = findTeamByExternalAlias(
				teams,
				prefillProvider,
				prefillExternalId,
				prefillExternalName
			);
			if (matched) {
				setSelected(matched);
				setDeepLinkHandled(true);
			}
		}
	}, [
		deepLinkHandled,
		hasMappingPrefill,
		loading,
		prefillExternalId,
		prefillExternalName,
		prefillProvider,
		prefillTeamId,
		teams,
	]);

	useEffect(() => {
		if (!selected || !hasMappingPrefill || !prefillProvider) {
			return;
		}
		const prefill = buildExternalAliasPrefill(
			prefillProvider,
			prefillExternalId,
			prefillExternalName
		);
		if (Object.keys(prefill).length === 0) {
			return;
		}
		setValues((prev) => ({ ...prev, ...prefill }));
	}, [hasMappingPrefill, prefillExternalId, prefillExternalName, prefillProvider, selected]);

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
			dispatch(showSuccessSnackbar({ message: t('teamWasSuccessfullyUpdated') }));
			notifyExternalSyncIssuesChanged();
			setSelected(null);
			setValues(emptyTeamFormValues());
			setUnmappedHintsRefreshKey((k) => k + 1);
		}
		if (updateTeam.rejected.match(result)) {
			dispatch(showErrorSnackbar({ message: result.error.message }));
		}
	}, [dispatch, selected, saving, values]);

	return (
		<Box>
			{loading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
					<CircularProgress size={28} />
				</Box>
			) : (
				<Autocomplete
					options={sortedTeams}
					value={selected}
					onChange={(_e, team) => setSelected(team)}
					getOptionLabel={(team) => resolveTeamDisplayName(team, t, i18n.language)}
					filterOptions={filterTeamOptions}
					isOptionEqualToValue={(a, b) => a.id === b.id}
					renderOption={(props, team) => (
						<li {...props} key={team.id}>
							<TeamAvatar team={team} height={22} />
						</li>
					)}
					renderInput={(params) => (
						<TextField
							{...params}
							label={t('teamSelectToEdit')}
							variant="outlined"
							size="small"
						/>
					)}
					sx={{ mb: 1.5 }}
				/>
			)}

			{hasMappingPrefill && !selected ? (
				<Typography variant="body2" sx={{ mb: 1.5, opacity: 0.85, textAlign: 'left' }}>
					{t('externalSyncIssuesTeamMappingPrefillHint', {
						name: prefillExternalName ?? '—',
						id: prefillExternalId ?? '—',
					})}
				</Typography>
			) : null}

			{selected ? (
				<Box>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
						<TeamAvatar team={selected} height={28} />
						<TeamFormStatusIcon values={values} />
					</Box>
					<TeamFormFields
						values={values}
						onChange={handleChange}
						titleReadOnly
						unmappedHintsRefreshKey={unmappedHintsRefreshKey}
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
