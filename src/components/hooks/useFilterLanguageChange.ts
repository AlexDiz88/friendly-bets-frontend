import i18n from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useFilterLanguageChange = (
	setSelectedLeagueCode: (value: string) => void,
	setSelectedPlayerName?: (value: string) => void,
	filterOpenedBets?: (leagueCode: string, playerName: string) => void
): void => {
	const { t } = useTranslation();

	useEffect(() => {
		const handleLanguageChange = (): void => {
			const allValue = t('all');
			setSelectedLeagueCode(allValue);
			if (setSelectedPlayerName) {
				setSelectedPlayerName(allValue);
			}
			if (filterOpenedBets) {
				filterOpenedBets(allValue, allValue);
			}
		};

		i18n.on('languageChanged', handleLanguageChange);

		return () => {
			i18n.off('languageChanged', handleLanguageChange);
		};
	}, [i18n, t, setSelectedLeagueCode, setSelectedPlayerName, filterOpenedBets]);
};

export default useFilterLanguageChange;
