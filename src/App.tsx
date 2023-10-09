import { Routes, Route, HashRouter } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import { getProfile } from './features/auth/authSlice';
import { useAppDispatch } from './app/hooks';
import Tasks from './features/tasks/Tasks';
import AdminCabinet from './features/admin/AdminCabinet';
import Profile from './components/profile/Profile';
import BetsList from './features/bets/BetsList';
import Homepage from './components/Homepage';
import BetInputContainer from './features/bets/BetInputContainer';
import MyStats from './components/profile/MyStats';
import SeasonRegister from './components/profile/SeasonRegister';
import BetsCheck from './features/bets/BetsCheck';
import EmptyPage from './components/EmptyPage';
import News from './components/News';
import BetEditList from './features/bets/BetEditList';
import LeaguesStatsPage from './components/LeaguesStatsPage';
import TeamsStatsPage from './components/TeamsStatsPage';

function App(): JSX.Element {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getProfile());
	}, [dispatch]);

	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/" element={<Homepage />} />
					<Route path="/tasks" element={<Tasks />} />
					<Route path="/auth/login" element={<Login />} />
					<Route path="/auth/register" element={<Register />} />
					<Route path="/admin/cabinet" element={<AdminCabinet />} />
					<Route path="/my/profile" element={<Profile />} />
					<Route path="/bets" element={<BetsList />} />
					<Route path="/bet-input" element={<BetInputContainer />} />
					<Route path="/my/stats" element={<MyStats />} />
					<Route path="/season/register" element={<SeasonRegister />} />
					<Route path="/bets/check" element={<BetsCheck />} />
					<Route path="/in-progress" element={<EmptyPage />} />
					<Route path="/news" element={<News />} />
					<Route path="/bets/edit" element={<BetEditList />} />
					<Route path="/stats/leagues" element={<LeaguesStatsPage />} />
					<Route path="/stats/teams" element={<TeamsStatsPage />} />
				</Route>
			</Routes>
		</HashRouter>
	);
}

export default App;
