import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { getActiveSeasonId } from '../../features/admin/seasons/seasonsSlice';
import SeasonResponseError from '../../features/admin/seasons/types/SeasonResponseError';

interface LoadingResult {
	loading: boolean;
	loadingError: boolean;
}

const useFetchActiveSeason = (activeSeasonId: string | undefined): LoadingResult => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	useEffect(() => {
		if (!activeSeasonId) {
			dispatch(getActiveSeasonId())
				.unwrap()
				.then(() => {
					setLoading(false);
				})
				.catch((error: SeasonResponseError) => {
					if (error.message === t('noActiveSeasonWasFounded')) {
						navigate('/no-active-season');
					} else {
						setLoadingError(true);
					}
					setLoading(false);
				});
		}
	}, [activeSeasonId, dispatch, navigate]);

	return { loading, loadingError };
};

export default useFetchActiveSeason;
