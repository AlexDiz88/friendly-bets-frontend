import { Box, Chip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { getUnmappedExternalTeamNames } from '../external-sync-issues/api';
import { UnmappedExternalTeamName } from '../external-sync-issues/types/UnmappedExternalTeamName';

type UnmappedTeamNameHintsProps = {
	onApply: (externalName: string, externalId?: number) => void;
	refreshKey?: number;
};

export default function UnmappedTeamNameHints({
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
					const sorted = [...data].sort((a, b) =>
						a.externalName.localeCompare(b.externalName, 'en', { sensitivity: 'base' })
					);
					setHints(sorted);
				}
			} catch {
				if (!cancelled) {
					setHints([]);
				}
			}
		};
		load();
		return () => {
			cancelled = true;
		};
	}, [refreshKey]);

	if (hints.length === 0) {
		return null;
	}

	return (
		<Box sx={{ mb: 1 }}>
			<Typography variant="body2" sx={{ opacity: 0.85, mb: 0.75, textAlign: 'left' }}>
				{t('teamUnmappedApiNamesHint')}
			</Typography>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
				{hints.map((hint) => {
					const label =
						hint.externalId != null
							? `${hint.externalName} (${hint.externalId})`
							: hint.externalName;
					return (
						<Chip
							key={hint.externalName}
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
