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
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import TeamAvatar from '../../../components/custom/avatar/TeamAvatar';
import {
	resolveTeamDisplayName,
	resolveTeamRussianSortName,
	teamMatchesSearchQuery,
} from '../../../components/utils/teamDisplay';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import TeamFormFields from './TeamFormFields';
import TeamFormStatusIcon from './TeamFormStatusIcon';
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
	const teams = useAppSelector(selectTeams);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<Team | null>(null);
	const [values, setValues] = useState(emptyTeamFormValues);
	const [saving, setSaving] = useState(false);
	const [unmappedHintsRefreshKey, setUnmappedHintsRefreshKey] = useState(0);

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

	const handleChange = (patch: Partial<typeof values>): void => {
		setValues((prev) => ({ ...prev, ...patch }));
	};

	const handleSave = useCallback(async () => {
		if (!selected || saving) {
			return;
		}
		setSaving(true);
		const result = await dispatch(
			updateTeam({
				teamId: selected.id,
				payload: formValuesToUpdatePayload(values),
			})
		);
		setSaving(false);
		if (updateTeam.fulfilled.match(result)) {
			dispatch(showSuccessSnackbar({ message: t('teamWasSuccessfullyUpdated') }));
			const updated = result.payload;
			setSelected(updated);
			setValues(teamToFormValues(updated));
			setUnmappedHintsRefreshKey((k) => k + 1);
		}
		if (updateTeam.rejected.match(result)) {
			dispatch(showErrorSnackbar({ message: result.error.message }));
		}
	}, [dispatch, selected, saving, values]);

	return (
		<Box sx={{ textAlign: 'left', mt: 2 }}>
			<Typography sx={{ fontWeight: 600, mb: 1 }}>{t('teamEditSection')}</Typography>

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
