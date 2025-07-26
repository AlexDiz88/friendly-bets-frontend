import { t } from 'i18next';
import BetTitle from '../../features/bets/types/BetTitle';

export const getFullBetTitle = (betTitle: BetTitle | undefined): string => {
	return betTitle?.isNot ? betTitle.label + t('not') : betTitle?.label ?? '';
};
