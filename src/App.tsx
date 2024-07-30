import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import Archive from './components/Archive';
import EmptyPage from './components/EmptyPage';
import Homepage from './components/Homepage';
import Layout from './components/Layout';
import LeaguesStatsPage from './components/LeaguesStatsPage';
import News from './components/News';
import NoActiveSeasonPage from './components/NoActiveSeasonPage';
import RulesPage from './components/RulesPage';
import TeamsStatsPage from './components/TeamsStatsPage';
import MyStats from './components/profile/MyStats';
import Profile from './components/profile/Profile';
import SeasonRegister from './components/profile/SeasonRegister';
import AdminCabinet from './features/admin/AdminCabinet';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import { getProfile } from './features/auth/authSlice';
import BetEditList from './features/bets/BetEditList';
import BetInputContainer from './features/bets/BetInputContainer';
import BetsCheck from './features/bets/BetsCheck';
import BetsList from './features/bets/BetsList';
import CompletedBetsList from './features/bets/CompletedBetsList';
import OpenedBetsList from './features/bets/OpenedBetsList';

function App(): JSX.Element {
	useAppSelector((state) => state.language);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getProfile());
	}, [dispatch]);

	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="/" element={<Homepage />} />
				<Route path="/auth/login" element={<Login />} />
				<Route path="/auth/register" element={<Register />} />
				<Route path="/admin/cabinet" element={<AdminCabinet />} />
				<Route path="/my/profile" element={<Profile />} />
				<Route path="/bets" element={<BetsList />}>
					<Route path="/bets/opened" element={<OpenedBetsList />} />
					<Route path="/bets/completed" element={<CompletedBetsList />} />
				</Route>
				<Route path="/bet-input" element={<BetInputContainer />} />
				<Route path="/my/stats" element={<MyStats />} />
				<Route path="/season/register" element={<SeasonRegister />} />
				<Route path="/bets/check" element={<BetsCheck />} />
				<Route path="/in-progress" element={<EmptyPage />} />
				<Route path="/news" element={<News />} />
				<Route path="/bets/edit" element={<BetEditList />} />
				<Route path="/stats/leagues" element={<LeaguesStatsPage />} />
				<Route path="/stats/teams" element={<TeamsStatsPage />} />
				<Route path="/rules" element={<RulesPage />} />
				<Route path="/archive" element={<Archive />} />
				<Route path="/no-active-season" element={<NoActiveSeasonPage />} />
			</Route>
		</Routes>
	);
}

export default App;
