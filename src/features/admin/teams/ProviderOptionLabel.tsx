import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Box, ListSubheader, MenuItem, Tooltip } from '@mui/material';
import { t } from 'i18next';
import { isInactiveExternalProvider } from './teamProviderConstants';

type InactiveProviderMarkProps = {
	fontSize?: number;
};

export function InactiveProviderMark({ fontSize = 16 }: InactiveProviderMarkProps): JSX.Element {
	const title = t('inactiveExternalProviderTooltip');
	return (
		<Tooltip title={title} arrow>
			<Box
				component="span"
				sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, lineHeight: 0 }}
				aria-label={title}
			>
				<ReportProblemIcon sx={{ fontSize, color: 'error.main' }} />
			</Box>
		</Tooltip>
	);
}

type ProviderOptionLabelProps = {
	provider: string;
	label: string;
};

export function ProviderOptionLabel({ provider, label }: ProviderOptionLabelProps): JSX.Element {
	return (
		<Box
			sx={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 0.5,
				minWidth: 0,
				maxWidth: '100%',
			}}
		>
			<Box
				component="span"
				sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
			>
				{label}
			</Box>
			{isInactiveExternalProvider(provider) ? <InactiveProviderMark /> : null}
		</Box>
	);
}

type ProviderSelectItemsProps = {
	providers: readonly string[];
	labelFor?: (provider: string) => string;
};

export function ProviderSelectItems({ providers, labelFor }: ProviderSelectItemsProps): JSX.Element {
	const live = providers.filter((id) => !isInactiveExternalProvider(id));
	const inactive = providers.filter((id) => isInactiveExternalProvider(id));
	return (
		<>
			{live.map((id) => (
				<MenuItem key={id} value={id}>
					<ProviderOptionLabel provider={id} label={labelFor ? labelFor(id) : id} />
				</MenuItem>
			))}
			{inactive.length > 0 ? (
				<ListSubheader disableSticky sx={{ lineHeight: 2, fontSize: '0.75rem' }}>
					{t('inactiveExternalProvidersGroup')}
				</ListSubheader>
			) : null}
			{inactive.map((id) => (
				<MenuItem key={id} value={id}>
					<ProviderOptionLabel provider={id} label={labelFor ? labelFor(id) : id} />
				</MenuItem>
			))}
		</>
	);
}

export function renderProviderSelectValue(labelFor?: (provider: string) => string) {
	return (value: unknown): JSX.Element | string => {
		const id = String(value ?? '');
		if (!id) {
			return '';
		}
		return <ProviderOptionLabel provider={id} label={labelFor ? labelFor(id) : id} />;
	};
}
