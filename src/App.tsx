import i18n from 'i18next';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import Archive from './components/Archive';
import EmptyPage from './components/EmptyPage';
import Homepage from './components/Homepage';
import Layout from './components/Layout';
import News from './components/News';
import NoActiveSeasonPage from './components/NoActiveSeasonPage';
import RulesPage from './components/RulesPage';
import MyStats from './components/profile/MyStats';
import Profile from './components/profile/Profile';
import SeasonRegister from './components/profile/SeasonRegister';
import AdminCabinet from './features/admin/AdminCabinet';
import MatchdayCalendar from './features/admin/calendars/MatchdayCalendar';
import { getActiveSeason, getActiveSeasonId } from './features/admin/seasons/seasonsSlice';
import { selectActiveSeason, selectActiveSeasonId } from './features/admin/seasons/selectors';
import Login from './features/auth/Login';
import PrivateRoute from './features/auth/PrivateRoute';
import Register from './features/auth/Register';
import { getProfile } from './features/auth/authSlice';
import { selectUser } from './features/auth/selectors';
import BetEditList from './features/bets/BetEditList';
import BetInputContainer from './features/bets/BetInputContainer';
import BetsCheck from './features/bets/BetsCheck';
import BetsList from './features/bets/BetsList';
import CompletedBetsList from './features/bets/CompletedBetsList';
import OpenedBetsList from './features/bets/OpenedBetsList';
import Gameweek from './features/gameweeks/Gameweek';
import LeaguesStatsPage from './features/stats/LeaguesStatsPage';
import TeamsStatsPage from './features/stats/TeamsStatsPage';

function App(): JSX.Element {
	useAppSelector((state) => state.language);
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const user = useAppSelector(selectUser);

	useEffect(() => {
		dispatch(getProfile());
	}, []);

	useEffect(() => {
		if (user && user.language) {
			i18n.changeLanguage(user.language);
		}
	}, [user]);

	useEffect(() => {
		if (!activeSeasonId) {
			dispatch(getActiveSeasonId());
		}
	}, []);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, []);

	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="/" element={<Homepage />} />
				<Route path="/auth/login" element={<Login />} />
				<Route path="/auth/register" element={<Register />} />

				<Route element={<PrivateRoute roles={['ADMIN']} />}>
					<Route path="/admin/cabinet" element={<AdminCabinet />} />
				</Route>

				<Route element={<PrivateRoute roles={['ADMIN', 'MODERATOR']} />}>
					<Route path="/bet-input" element={<BetInputContainer />} />
				</Route>

				<Route element={<PrivateRoute roles={['ADMIN', 'MODERATOR']} />}>
					<Route path="/bets/check" element={<BetsCheck />} />
				</Route>

				<Route element={<PrivateRoute roles={['ADMIN', 'MODERATOR']} />}>
					<Route path="/bets/edit" element={<BetEditList />} />
				</Route>

				<Route element={<PrivateRoute roles={['ADMIN', 'MODERATOR']} />}>
					<Route path="/calendar" element={<MatchdayCalendar />} />
				</Route>

				<Route element={<PrivateRoute roles={['ADMIN', 'MODERATOR', 'USER']} />}>
					<Route path="/my/profile" element={<Profile />} />
				</Route>

				<Route element={<PrivateRoute roles={['ADMIN', 'MODERATOR', 'USER']} />}>
					<Route path="/season/register" element={<SeasonRegister />} />
				</Route>

				<Route path="/bets" element={<BetsList />}>
					<Route path="/bets/opened" element={<OpenedBetsList />} />
					<Route path="/bets/completed" element={<CompletedBetsList />} />
				</Route>

				<Route path="/stats/leagues" element={<LeaguesStatsPage />} />
				<Route path="/stats/teams" element={<TeamsStatsPage />} />
				<Route path="/gameweeks" element={<Gameweek />} />
				<Route path="/news" element={<News />} />
				<Route path="/rules" element={<RulesPage />} />
				<Route path="/archive" element={<Archive />} />
				<Route path="/my/stats" element={<MyStats />} />
				<Route path="/no-active-season" element={<NoActiveSeasonPage />} />
				<Route path="/in-progress" element={<EmptyPage />} />
			</Route>
		</Routes>
	);
}

export default App;
