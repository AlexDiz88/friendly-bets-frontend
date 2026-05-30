import { Box, Chip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { getUnmappedExternalTeamNames, API_SYNC_ISSUES_CHANGED_EVENT } from '../external-sync-issues/api';
import { UnmappedExternalTeamName } from '../external-sync-issues/types/UnmappedExternalTeamName';
import { FOOTBALL_DATA_PROVIDER, ODDS_API_PROVIDER } from './teamProviderConstants';

export type UnmappedHintsProvider = typeof FOOTBALL_DATA_PROVIDER | typeof ODDS_API_PROVIDER;

type UnmappedTeamNameHintsProps = {
	provider: UnmappedHintsProvider;
	onApply: (externalName: string, externalId?: number) => void;
	refreshKey?: number;
};

export default function UnmappedTeamNameHints({
	provider,
	onApply,
	refreshKey = 0,
}: UnmappedTeamNameHintsProps): JSX.Element | null {
	const [hints, setHints] = useState<UnmappedExternalTeamName[]>([]);

	useEffect(() => {
		let cancelled = false;
		const load = async (): Promise<void> => {
			try {
				const data = await getUnmappedExternalTeamNames();
				if (!cancelled) {
					setHints(data);
				}
			} catch {
				if (!cancelled) {
					setHints([]);
				}
			}
		};
		load();
		const onChanged = (): void => {
			void load();
		};
		window.addEventListener(API_SYNC_ISSUES_CHANGED_EVENT, onChanged);
		return () => {
			cancelled = true;
			window.removeEventListener(API_SYNC_ISSUES_CHANGED_EVENT, onChanged);
		};
	}, [refreshKey]);

	const filtered = useMemo(
		() =>
			[...hints]
				.filter((hint) => (hint.provider ?? FOOTBALL_DATA_PROVIDER) === provider)
				.sort((a, b) =>
					a.externalName.localeCompare(b.externalName, 'en', { sensitivity: 'base' })
				),
		[hints, provider]
	);

	if (filtered.length === 0) {
		return null;
	}

	const hintLabelKey =
		provider === ODDS_API_PROVIDER
			? 'teamUnmappedOddsApiNamesHint'
			: 'teamUnmappedFootballDataNamesHint';

	return (
		<Box sx={{ mb: 1 }}>
			<Typography variant="body2" sx={{ opacity: 0.85, mb: 0.75, textAlign: 'left' }}>
				{t(hintLabelKey)}
			</Typography>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
				{filtered.map((hint) => {
					const label =
						hint.externalId != null
							? `${hint.externalName} (${hint.externalId})`
							: hint.externalName;
					return (
						<Chip
							key={`${provider}:${hint.externalName}:${hint.externalId ?? ''}`}
							label={label}
							size="small"
							clickable
							onClick={() => onApply(hint.externalName, hint.externalId)}
							sx={{ maxWidth: '100%' }}
						/>
					);
				})}
			</Box>
		</Box>
	);
}
