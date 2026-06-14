import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material';
import { Box, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Wc26PageView } from './wc26PageViews';
import { wc26PageViewBarSx, wc26PageViewChipExtraSx, wc26StageChipSx } from './wc26PageStyles';

const VIEW_ORDER: Wc26PageView[] = ['schedule', 'standings', 'bracket'];

interface Wc26PageViewTabsProps {
	value: Wc26PageView;
	onChange: (view: Wc26PageView) => void;
}

export default function Wc26PageViewTabs({ value, onChange }: Wc26PageViewTabsProps): JSX.Element {
	const { t } = useTranslation();

	return (
		<Box sx={wc26PageViewBarSx}>
			{VIEW_ORDER.map((view) => (
				<Chip
					key={view}
					label={t(`wc26.views.${view}`)}
					onClick={() => onChange(view)}
					sx={(theme: Theme) => {
						const base = wc26StageChipSx(value === view);
						const resolved = typeof base === 'function' ? base(theme) : base;
						const merged = {
							...(Array.isArray(resolved) ? {} : resolved),
							...wc26PageViewChipExtraSx,
						};
						return merged as SystemStyleObject<Theme>;
					}}
				/>
			))}
		</Box>
	);
}
