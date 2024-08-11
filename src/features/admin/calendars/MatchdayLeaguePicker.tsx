import { DoDisturbOn } from '@mui/icons-material';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomLeagueButton from '../../../components/custom/btn/CustomLeagueButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import CustomErrorMessage from '../../../components/custom/CustomErrorMessage';
import pathToLogoImage from '../../../components/utils/pathToLogoImage';
import { MATCHDAY_TITLE_FINAL } from '../../../constants';
import MatchDayForm from '../../bets/MatchDayForm';
import League from '../leagues/types/League';
import LeagueMatchdayNode from './types/LeagueMatchdayNode';

interface MatchdayLeaguePickerProps {
	leagues: League[];
	setLeagueMatchdayNodes: (leagueMatchdayNodes: LeagueMatchdayNode[]) => void;
	leagueMatchdayNodes: LeagueMatchdayNode[];
}

const MatchdayLeaguePicker = ({
	leagues,
	setLeagueMatchdayNodes,
	leagueMatchdayNodes,
}: MatchdayLeaguePickerProps): JSX.Element => {
	const hiddenButtonRef = useRef<HTMLButtonElement>(null);
	const [selectedLeague, setSelectedLeague] = useState<League | undefined>(undefined);
	const [showLeagues, setShowLeagues] = useState<boolean>(true);
	const [showMatchDayForm, setShowMatchDayForm] = useState<boolean>(false);
	const [showAddLeagueError, setShowAddLeagueError] = useState<boolean>(false);
	const [matchDay, setMatchDay] = useState<string>('1');

	const handleAddLeague = (): void => {
		if (selectedLeague) {
			const leagueExists = leagueMatchdayNodes.some((lmn) => {
				console.log('lmn.matchDay');
				console.log(lmn.matchDay);
				console.log('matchDay');
				console.log(matchDay);

				return lmn.leagueId === selectedLeague.id && lmn.matchDay === matchDay;
			});

			if (leagueExists) {
				setShowAddLeagueError(true);
				return;
			}

			const newLeagueMatchdayNode: LeagueMatchdayNode = {
				leagueId: selectedLeague.id,
				leagueCode: selectedLeague.leagueCode,
				matchDay,
				bets: [],
			};

			const currentLeagueMatchdayNodes = [...leagueMatchdayNodes];
			currentLeagueMatchdayNodes.push(newLeagueMatchdayNode);
			setLeagueMatchdayNodes(currentLeagueMatchdayNodes);
		}

		setShowAddLeagueError(false);
		setShowMatchDayForm(false);
		setShowLeagues(true);
	};

	const handleLeaguePick = (league: League): void => {
		setSelectedLeague(league);
		setShowLeagues(false);
		setShowMatchDayForm(true);
		setMatchDay(league.currentMatchDay);
	};

	const handleCancelLeaguePick = (): void => {
		setSelectedLeague(undefined);
		setShowLeagues(true);
		setShowMatchDayForm(false);
		setShowAddLeagueError(false);
		setMatchDay('1');
	};

	const handleMatchDay = (title: string): void => {
		setMatchDay(title);
	};

	const handleRemoveLeagueMatchdayNode = (leagueMatchdayNode: LeagueMatchdayNode): void => {
		const newLeagueMatchdayNodes = leagueMatchdayNodes.filter(
			(lmn) =>
				!(
					lmn.leagueId === leagueMatchdayNode.leagueId &&
					lmn.matchDay === leagueMatchdayNode.matchDay
				)
		);

		setLeagueMatchdayNodes(newLeagueMatchdayNodes);
		setShowAddLeagueError(false);
	};

	useEffect(() => {
		setTimeout(() => {
			if (hiddenButtonRef.current) {
				hiddenButtonRef.current.focus();
			}
		}, 0);
	}, [selectedLeague]);

	return (
		<Box>
			<Box sx={{ my: 1 }}> {t('chooseLeagues')}:</Box>
			{showLeagues ? (
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					{leagues.map((league) => (
						<Box key={league.id}>
							<CustomLeagueButton league={league} onClick={() => handleLeaguePick(league)} />
						</Box>
					))}
				</Box>
			) : (
				<CustomLeagueButton league={selectedLeague} onClick={handleCancelLeaguePick} />
			)}

			{showMatchDayForm && (
				<>
					<MatchDayForm matchDay={matchDay} onMatchDay={handleMatchDay} />
					<Box sx={{ mt: 3 }}>
						<CustomCancelButton onClick={handleCancelLeaguePick} sx={{ height: '2.3rem' }} />
						<CustomSuccessButton onClick={handleAddLeague} sx={{ height: '2.3rem' }} />
					</Box>
				</>
			)}

			<Box
				sx={{
					mt: 2,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
				}}
			>
				{showAddLeagueError && (
					<CustomErrorMessage sx={{ py: 1 }} message="leagueMatchdayAlreadyAdded" />
				)}
				<Box sx={{ my: 1 }}> {t('listOfPickedLeaguesMatchdays')}:</Box>
				{leagueMatchdayNodes &&
					leagueMatchdayNodes.map((lmn, index) => (
						<Box
							key={index}
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: '19rem',
								m: 0.5,
								p: 1.5,
								border: '1px solid #123456DB',
								borderRadius: 2,
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Avatar
									variant="square"
									sx={{ width: 27, height: 27 }}
									alt="league_logo"
									src={pathToLogoImage(lmn.leagueCode)}
								/>
								<Typography
									sx={{ mx: 0.5, fontWeight: 600, fontFamily: "'Exo 2'", color: '#123456' }}
								>
									{t(`leagueFullName.${lmn.leagueCode}`)} -{' '}
									{lmn.matchDay === MATCHDAY_TITLE_FINAL
										? t(`playoffRound.${lmn.matchDay}`)
										: lmn.matchDay}
								</Typography>
							</Box>
							{leagueMatchdayNodes.length === index + 1 && (
								<IconButton
									sx={{ ml: 1, p: 0, color: 'red', scale: '150%' }}
									onClick={() => handleRemoveLeagueMatchdayNode(lmn)}
								>
									<DoDisturbOn />
								</IconButton>
							)}
						</Box>
					))}
			</Box>
			<Box aria-hidden="true">
				<Button
					ref={hiddenButtonRef}
					style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
				/>
			</Box>
		</Box>
	);
};

export default MatchdayLeaguePicker;
