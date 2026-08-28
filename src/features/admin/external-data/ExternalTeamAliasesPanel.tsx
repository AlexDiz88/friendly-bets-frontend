import {
	Box,
	Chip,
	CircularProgress,
	FormControl,
	InputLabel,
	Select,
	Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import CustomCheckbox from '../../../components/custom/controls/CustomCheckbox';
import { toggleInlineRowSx } from '../../../components/custom/controls/customToggleStyles';
import LeagueSelect from '../../../components/selectors/LeagueSelect';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import { ADMIN_EXTERNAL_TEAM_ALIASES_ID } from '../adminScroll';
import { getActiveSeason } from '../seasons/seasonsSlice';
import { selectActiveSeason } from '../seasons/selectors';
import {
	MARATHONBET_PROVIDER,
	MELBET_PROVIDER,
	SOCCER365_PROVIDER,
	SPORTS_RU_PROVIDER,
	FOOTBALL24_PROVIDER,
	TWENTYFOUR_SCORE_PROVIDER,
	CHAMPIONAT_PROVIDER,
	EURO_FOOTBALL_PROVIDER,
	RUSCORE_PROVIDER,
	FLASHSCORE_PROVIDER,
	FLASHSCORE_UA_PROVIDER,
	LIVERESULT_PROVIDER,
	firstLiveProvider,
} from '../teams/teamProviderConstants';
import { ProviderSelectItems, renderProviderSelectValue } from '../teams/ProviderOptionLabel';
import {
	ExternalTeamNameChip,
	fetchExternalTeamNames,
} from '../external-data/externalDataAdminApi';
import { getAllTeams } from '../teams/teamsSlice';

const PROVIDERS = [
	SOCCER365_PROVIDER,
	SPORTS_RU_PROVIDER,
	FOOTBALL24_PROVIDER,
	MARATHONBET_PROVIDER,
	MELBET_PROVIDER,
	TWENTYFOUR_SCORE_PROVIDER,
	CHAMPIONAT_PROVIDER,
	EURO_FOOTBALL_PROVIDER,
	RUSCORE_PROVIDER,
	FLASHSCORE_PROVIDER,
	FLASHSCORE_UA_PROVIDER,
	LIVERESULT_PROVIDER,
] as const;

const PROVIDER_LEAGUE_CODES: Record<string, Set<string>> = {
	[SOCCER365_PROVIDER]: new Set(['EPL', 'BL', 'CL', 'LE', 'EC', 'WC']),
	[SPORTS_RU_PROVIDER]: new Set(['EPL', 'BL']),
	[FOOTBALL24_PROVIDER]: new Set(['EPL', 'BL', 'CL', 'LE']),
	[MARATHONBET_PROVIDER]: new Set(['EPL', 'BL', 'CL', 'LE', 'WC']),
	[MELBET_PROVIDER]: new Set(['EPL', 'BL']),
	[TWENTYFOUR_SCORE_PROVIDER]: new Set(['EPL', 'BL']),
	[CHAMPIONAT_PROVIDER]: new Set(['EPL', 'BL']),
	[EURO_FOOTBALL_PROVIDER]: new Set(['EPL', 'BL', 'CL', 'LE']),
	[RUSCORE_PROVIDER]: new Set(['EPL', 'BL', 'CL', 'LE']),
	[FLASHSCORE_PROVIDER]: new Set(['EPL', 'BL']),
	[FLASHSCORE_UA_PROVIDER]: new Set(['EPL', 'BL']),
	[LIVERESULT_PROVIDER]: new Set(['EPL', 'BL']),
};

const PROVIDER_LABEL_KEY: Record<string, string> = {
	[SOCCER365_PROVIDER]: 'externalTeamAliasProviderSoccer365',
	[SPORTS_RU_PROVIDER]: 'externalTeamAliasProviderSportsRu',
	[FOOTBALL24_PROVIDER]: 'externalTeamAliasProviderFootball24',
	[MARATHONBET_PROVIDER]: 'externalTeamAliasProviderMarathonbet',
	[MELBET_PROVIDER]: 'externalTeamAliasProviderMelbet',
	[TWENTYFOUR_SCORE_PROVIDER]: 'externalTeamAliasProvider24score',
	[CHAMPIONAT_PROVIDER]: 'externalTeamAliasProviderChampionat',
	[EURO_FOOTBALL_PROVIDER]: 'externalTeamAliasProviderEuroFootball',
	[RUSCORE_PROVIDER]: 'externalTeamAliasProviderRuscore',
	[FLASHSCORE_PROVIDER]: 'externalTeamAliasProviderFlashscore',
	[FLASHSCORE_UA_PROVIDER]: 'externalTeamAliasProviderFlashscoreUa',
	[LIVERESULT_PROVIDER]: 'externalTeamAliasProviderLiveresult',
};

export default function ExternalTeamAliasesPanel(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const [, setSearchParams] = useSearchParams();
	const [provider, setProvider] = useState<string>(() => firstLiveProvider(PROVIDERS));
	const [leagueCode, setLeagueCode] = useState('EPL');
	const [loadingNames, setLoadingNames] = useState(false);
	const [forceOverwrite, setForceOverwrite] = useState(false);
	const [chips, setChips] = useState<ExternalTeamNameChip[]>([]);
	const [namesLoaded, setNamesLoaded] = useState(false);

	useEffect(() => {
		if (!activeSeason) {
			void dispatch(getActiveSeason());
		}
	}, [activeSeason, dispatch]);

	const leagues = useMemo(() => {
		const allowed = PROVIDER_LEAGUE_CODES[provider] ?? new Set<string>();
		return activeSeason?.leagues?.filter((l) => allowed.has(l.leagueCode)) ?? [];
	}, [activeSeason?.leagues, provider]);

	const effectiveLeagueCode = useMemo(() => {
		if (leagues.some((l) => l.leagueCode === leagueCode)) {
			return leagueCode;
		}
		return leagues[0]?.leagueCode ?? '';
	}, [leagues, leagueCode]);

	const handleProviderChange = (next: string): void => {
		setProvider(next);
		setChips([]);
		setNamesLoaded(false);
	};

	const handleLeagueChange = (next: string): void => {
		setLeagueCode(next);
		setChips([]);
		setNamesLoaded(false);
	};

	const handleLoadNames = async (): Promise<void> => {
		if (!effectiveLeagueCode || !provider) {
			return;
		}
		setLoadingNames(true);
		try {
			const result = await fetchExternalTeamNames(provider, effectiveLeagueCode, forceOverwrite);
			setChips(result.unmapped ?? []);
			setNamesLoaded(true);
			void dispatch(getAllTeams());
			dispatch(
				showSuccessSnackbar({
					message: t('externalTeamAliasesLoadResult', {
						autoBound: result.autoBoundCount ?? 0,
						remaining: (result.unmapped ?? []).length,
						mismatches: result.mismatchCount ?? 0,
						overwritten: result.overwrittenCount ?? 0,
					}),
					duration: 4500,
				})
			);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalTeamNamesFetchFailed',
				})
			);
		} finally {
			setLoadingNames(false);
		}
	};

	const openTeamPrefill = (externalName: string): void => {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				next.set('openTeamEdit', '1');
				next.set('provider', provider);
				next.set('externalName', externalName);
				next.delete('externalId');
				next.delete('teamId');
				return next;
			},
			{ replace: false }
		);
		setChips((prev) => prev.filter((c) => c.externalName !== externalName));
	};

	return (
		<AdminSection title={t('externalTeamAliasesTitle')} hint={t('externalTeamAliasesHint')}>
			<Box id={ADMIN_EXTERNAL_TEAM_ALIASES_ID} sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				<FormControl fullWidth size="small">
					<InputLabel id="external-alias-provider">{t('externalTeamAliasProvider')}</InputLabel>
					<Select
						labelId="external-alias-provider"
						label={t('externalTeamAliasProvider')}
						value={provider}
						onChange={(e: SelectChangeEvent) => handleProviderChange(e.target.value)}
						renderValue={renderProviderSelectValue((id) => t(PROVIDER_LABEL_KEY[id] ?? id))}
					>
						<ProviderSelectItems
							providers={PROVIDERS}
							labelFor={(id) => t(PROVIDER_LABEL_KEY[id] ?? id)}
						/>
					</Select>
				</FormControl>
				{leagues.length > 0 ? (
					<LeagueSelect
						value={effectiveLeagueCode}
						onChange={(e: SelectChangeEvent<string>) => handleLeagueChange(e.target.value)}
						leagues={leagues}
						withoutAll
						compact
					/>
				) : null}
				<Box sx={toggleInlineRowSx as SxProps<Theme>}>
					<CustomCheckbox
						checked={forceOverwrite}
						onChange={(e) => setForceOverwrite(e.target.checked)}
						disabled={loadingNames}
						inputProps={{ 'aria-label': t('externalTeamAliasesForceOverwrite') }}
					/>
					<Typography component="span" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
						{t('externalTeamAliasesForceOverwrite')}
					</Typography>
				</Box>
				<span>
					<CustomSuccessButton
						buttonText={
							loadingNames ? t('btnText.processing') : t('externalTeamAliasesLoad')
						}
						onClick={() => void handleLoadNames()}
						disabled={loadingNames || !effectiveLeagueCode}
					/>
				</span>
				{loadingNames ? (
					<CircularProgress size={24} />
				) : namesLoaded && chips.length === 0 ? (
					<Typography variant="body2" color="text.secondary">
						{t('externalTeamAliasesEmpty')}
					</Typography>
				) : chips.length > 0 ? (
					<>
						<Typography variant="body2" color="text.secondary">
							{t('externalTeamAliasesUnmappedHint')}
						</Typography>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
							{chips.map((chip) => (
								<Chip
									key={chip.externalName}
									label={chip.externalName}
									onClick={() => openTeamPrefill(chip.externalName)}
									clickable
									size="small"
								/>
							))}
						</Box>
					</>
				) : null}
			</Box>
		</AdminSection>
	);
}
