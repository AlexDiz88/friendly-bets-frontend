import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomSwitchButton from '../../components/custom/btn/CustomSwitchButton';
import {
	betsSwitchButtonSx,
	betsSwitchLabelSx,
	betsTabBarSx,
} from '../bets/betsPageStyles';

export type MatchResultsPageView = 'matches' | 'standings';

const VIEW_ORDER: MatchResultsPageView[] = ['matches', 'standings'];

interface MatchResultsViewTabsProps {
	value: MatchResultsPageView;
	onChange: (view: MatchResultsPageView) => void;
}

export default function MatchResultsViewTabs({
	value,
	onChange,
}: MatchResultsViewTabsProps): JSX.Element {
	const { t } = useTranslation();

	return (
		<Box sx={betsTabBarSx}>
			{VIEW_ORDER.map((view) => {
				const active = value === view;
				return (
					<CustomSwitchButton
						key={view}
						onClick={() => onChange(view)}
						buttonText={t(`matchResultsTab.${view}`)}
						isActive={active}
						sx={betsSwitchButtonSx(active)}
						labelSx={betsSwitchLabelSx(active)}
					/>
				);
			})}
		</Box>
	);
}
