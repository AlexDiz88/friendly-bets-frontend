import { Typography, type SxProps, type Theme } from '@mui/material';
import { Trans } from 'react-i18next';
import { newsTransComponents } from './newsTransComponents';

type Props = {
	i18nKey: string;
	sx?: SxProps<Theme>;
	paragraph?: boolean;
};

export default function NewsTrans({ i18nKey, sx, paragraph = true }: Props): JSX.Element {
	return (
		<Typography paragraph={paragraph} sx={sx}>
			<Trans ns="siteNews" i18nKey={i18nKey} components={newsTransComponents} />
		</Typography>
	);
}
