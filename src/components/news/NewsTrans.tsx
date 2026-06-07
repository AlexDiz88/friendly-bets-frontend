import { Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import { useMemo } from 'react';
import { Trans } from 'react-i18next';
import type { AppThemeMode } from '../../theme/createAppTheme';
import { getNewsTransComponents } from './newsTransComponents';

type Props = {
	i18nKey: string;
	sx?: SxProps<Theme>;
	paragraph?: boolean;
};

export default function NewsTrans({ i18nKey, sx, paragraph = true }: Props): JSX.Element {
	const theme = useTheme();
	const mode: AppThemeMode = theme.palette.mode === 'dark' ? 'dark' : 'light';
	const components = useMemo(() => getNewsTransComponents(mode), [mode]);

	return (
		<Typography paragraph={paragraph} sx={sx}>
			<Trans ns="siteNews" i18nKey={i18nKey} components={components} />
		</Typography>
	);
}
