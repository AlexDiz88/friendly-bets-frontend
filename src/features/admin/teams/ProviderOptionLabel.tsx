import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Avatar, Box, MenuItem, Tooltip, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { leagueLogoAvatarSx } from '../../../components/custom/avatar/LeagueAvatar';
import { isInactiveExternalProvider } from './teamProviderConstants';
import { teamApiLogoSrc } from './teamFormUtils';

/** Sentinel value for the disabled group row — must not match a real providerId. */
const INACTIVE_GROUP_VALUE = '__inactive_providers_group__';

const PROVIDER_LOGO_SIZE = 18;

const providerLogoSx: SxProps<Theme> = [
	{ width: PROVIDER_LOGO_SIZE, height: PROVIDER_LOGO_SIZE, flexShrink: 0, pointerEvents: 'none' },
	leagueLogoAvatarSx,
];

/** Aligns logo + label in the closed Select field. */
export const providerSelectSx: SxProps<Theme> = {
	'& .MuiSelect-select': {
		display: 'flex',
		alignItems: 'center',
	},
};

type InactiveProviderMarkProps = {
	fontSize?: number;
};

function InactiveProviderGlyph({ fontSize = 16 }: { fontSize?: number }): JSX.Element {
	return (
		<ReportProblemIcon
			sx={{ fontSize, color: 'error.main', flexShrink: 0, pointerEvents: 'none' }}
		/>
	);
}

export function InactiveProviderMark({ fontSize = 16 }: InactiveProviderMarkProps): JSX.Element {
	const title = t('inactiveExternalProviderTooltip');
	return (
		<Tooltip title={title} arrow>
			<Box
				component="span"
				sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, lineHeight: 0 }}
				aria-label={title}
			>
				<InactiveProviderGlyph fontSize={fontSize} />
			</Box>
		</Tooltip>
	);
}

function ProviderLogo({ provider }: { provider: string }): JSX.Element {
	return (
		<Avatar variant="square" alt="" src={teamApiLogoSrc(provider)} sx={providerLogoSx} />
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
				gap: 0.75,
				minWidth: 0,
				maxWidth: '100%',
			}}
		>
			<ProviderLogo provider={provider} />
			<Box
				component="span"
				sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
			>
				{label}
			</Box>
			{isInactiveExternalProvider(provider) ? <InactiveProviderGlyph /> : null}
		</Box>
	);
}

type ProviderSelectItemsProps = {
	providers: readonly string[];
	labelFor?: (provider: string) => string;
};

/** Call as `{ProviderSelectItems({ ... })}` so MenuItems are direct Select children. */
export function ProviderSelectItems({ providers, labelFor }: ProviderSelectItemsProps): JSX.Element[] {
	const live = providers.filter((id) => !isInactiveExternalProvider(id));
	const inactive = providers.filter((id) => isInactiveExternalProvider(id));
	const items: JSX.Element[] = live.map((id) => (
		<MenuItem key={id} value={id}>
			<ProviderOptionLabel provider={id} label={labelFor ? labelFor(id) : id} />
		</MenuItem>
	));
	if (inactive.length > 0) {
		items.push(
			<MenuItem
				key={INACTIVE_GROUP_VALUE}
				value={INACTIVE_GROUP_VALUE}
				disabled
				dense
				sx={{
					opacity: '1 !important',
					fontSize: '0.75rem',
					fontWeight: 600,
					color: 'text.secondary',
					py: 0.5,
				}}
			>
				{t('inactiveExternalProvidersGroup')}
			</MenuItem>
		);
	}
	for (const id of inactive) {
		items.push(
			<MenuItem key={id} value={id} title={t('inactiveExternalProviderTooltip')}>
				<ProviderOptionLabel provider={id} label={labelFor ? labelFor(id) : id} />
			</MenuItem>
		);
	}
	return items;
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
