import { AddCircle, DoDisturbOn, RemoveCircle } from '@mui/icons-material';
import { Avatar, Box, IconButton, Switch, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomLeagueButton from '../../../components/custom/btn/CustomLeagueButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import CustomErrorMessage from '../../../components/custom/CustomErrorMessage';
import { pathToLogoImage } from '../../../components/utils/imgBase64Converter';
import { MATCHDAY_TITLE_FINAL } from '../../../constants';
import {
	suggestedBetSizeForCalendarMatchday,
} from '../../bets/betSizeDefaults';
import MatchDayForm from '../../bets/MatchDayForm';
import League from '../leagues/types/League';
import LeagueMatchdayNode from './types/LeagueMatchdayNode';

interface MatchdayLeaguePickerProps {
	leagues: League[];
	setLeagueMatchdayNodes: (leagueMatchdayNodes: LeagueMatchdayNode[]) => void;
	leagueMatchdayNodes: LeagueMatchdayNode[];
	defaultSeasonBetLimit: number;
	defaultSeasonBetSize: number;
}

const MatchdayLeaguePicker = ({
	leagues,
	setLeagueMatchdayNodes,
	leagueMatchdayNodes,
	defaultSeasonBetLimit,
	defaultSeasonBetSize,
}: MatchdayLeaguePickerProps): JSX.Element => {
	const [selectedLeague, setSelectedLeague] = useState<League | undefined>(undefined);
	const [showLeagues, setShowLeagues] = useState<boolean>(true);
	const [showMatchDayForm, setShowMatchDayForm] = useState<boolean>(false);
	const [showAddLeagueError, setShowAddLeagueError] = useState<boolean>(false);
	const [matchDay, setMatchDay] = useState<string>('1');
	const [betLimit, setBetLimit] = useState<number>(defaultSeasonBetLimit);
	const [isLimitEnabled, setIsLimitEnabled] = useState(false);
	const [betSizeLimit, setBetSizeLimit] = useState<number>(
		suggestedBetSizeForCalendarMatchday(defaultSeasonBetSize, '1')
	);
	const [isBetSizeLimitEnabled, setIsBetSizeLimitEnabled] = useState(false);

	const resolveBetCountLimit = (): number => {
		if (!isLimitEnabled) {
			return defaultSeasonBetLimit;
		}
		return betLimit > 0 ? betLimit : defaultSeasonBetLimit;
	};

	const resolveDefaultBetSize = (): number => {
		if (!isBetSizeLimitEnabled) {
			return suggestedBetSizeForCalendarMatchday(defaultSeasonBetSize, matchDay);
		}
		return betSizeLimit > 0
			? betSizeLimit
			: suggestedBetSizeForCalendarMatchday(defaultSeasonBetSize, matchDay);
	};

	const resetBetLimitForm = (): void => {
		setBetLimit(defaultSeasonBetLimit);
		setIsLimitEnabled(false);
		setBetSizeLimit(suggestedBetSizeForCalendarMatchday(defaultSeasonBetSize, matchDay));
		setIsBetSizeLimitEnabled(false);
	};

	const handleAddLeague = (): void => {
		if (selectedLeague) {
			const leagueExists = leagueMatchdayNodes.some((lmn) => {
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
				betCountLimit: resolveBetCountLimit(),
				defaultBetSize: resolveDefaultBetSize(),
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
		setShowAddLeagueError(false);
		setMatchDay(league.currentMatchDay);
		resetBetLimitForm();
	};

	const handleCancelLeaguePick = (): void => {
		setSelectedLeague(undefined);
		setShowLeagues(true);
		setShowMatchDayForm(false);
		setShowAddLeagueError(false);
		setMatchDay('1');
		resetBetLimitForm();
	};

	const handleMatchDay = (title: string): void => {
		setMatchDay(title);
		if (!isBetSizeLimitEnabled) {
			setBetSizeLimit(suggestedBetSizeForCalendarMatchday(defaultSeasonBetSize, title));
		}
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
		if (!isLimitEnabled) {
			setBetLimit(defaultSeasonBetLimit);
		}
	}, [defaultSeasonBetLimit, isLimitEnabled]);

	useEffect(() => {
		if (!isBetSizeLimitEnabled) {
			setBetSizeLimit(suggestedBetSizeForCalendarMatchday(defaultSeasonBetSize, matchDay));
		}
	}, [defaultSeasonBetSize, isBetSizeLimitEnabled, matchDay]);

	const displayedBetSize = isBetSizeLimitEnabled
		? betSizeLimit
		: suggestedBetSizeForCalendarMatchday(defaultSeasonBetSize, matchDay);

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
					<Box
						sx={{
							display: 'flex',
							alignItems: 'flex-end',
							flexDirection: 'column',
						}}
					>
						<Switch
							checked={isLimitEnabled}
							onChange={(e) => {
								const checked = e.target.checked;
								setIsLimitEnabled(checked);
								if (checked && betLimit < 1) {
									setBetLimit(defaultSeasonBetLimit);
								}
							}}
							color="secondary"
						/>
						<Box
							sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right', height: 20 }}
						>
							<Typography sx={{ mr: 0.5, fontWeight: 600 }}>{t('maxBetsPerMatchday')}:</Typography>
							{isLimitEnabled && (
								<IconButton
									sx={{ p: 0, m: 0 }}
									onClick={() => setBetLimit((prev) => Math.max(1, prev - 1))}
								>
									<RemoveCircle color="secondary" sx={{ fontSize: '1.75rem', m: 0, p: 0 }} />
								</IconButton>
							)}
							<Typography sx={{ fontWeight: 600, mx: 0.15 }}>
								{isLimitEnabled ? betLimit : defaultSeasonBetLimit}
							</Typography>
							{isLimitEnabled && (
								<IconButton sx={{ p: 0, m: 0 }} onClick={() => setBetLimit((prev) => prev + 1)}>
									<AddCircle color="secondary" sx={{ fontSize: '1.75rem', m: 0, p: 0 }} />
								</IconButton>
							)}
						</Box>
						<Switch
							checked={isBetSizeLimitEnabled}
							onChange={(e) => {
								const checked = e.target.checked;
								setIsBetSizeLimitEnabled(checked);
								if (checked && betSizeLimit < 1) {
									setBetSizeLimit(
										suggestedBetSizeForCalendarMatchday(defaultSeasonBetSize, matchDay)
									);
								}
							}}
							color="secondary"
						/>
						<Box
							sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right', height: 20 }}
						>
							<Typography sx={{ mr: 0.5, fontWeight: 600 }}>
								{t('maxBetSizePerMatchday')}:
							</Typography>
							{isBetSizeLimitEnabled && (
								<IconButton
									sx={{ p: 0, m: 0 }}
									onClick={() => setBetSizeLimit((prev) => Math.max(1, prev - 1))}
								>
									<RemoveCircle color="secondary" sx={{ fontSize: '1.75rem', m: 0, p: 0 }} />
								</IconButton>
							)}
							<Typography sx={{ fontWeight: 600, mx: 0.15 }}>{displayedBetSize}</Typography>
							{isBetSizeLimitEnabled && (
								<IconButton
									sx={{ p: 0, m: 0 }}
									onClick={() => setBetSizeLimit((prev) => prev + 1)}
								>
									<AddCircle color="secondary" sx={{ fontSize: '1.75rem', m: 0, p: 0 }} />
								</IconButton>
							)}
						</Box>
					</Box>

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
							<Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
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
											? t(`playoffStage.${lmn.matchDay}`)
											: lmn.matchDay}
									</Typography>
								</Box>
								<Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
									{t('maxBetsPerMatchday')}: {lmn.betCountLimit}, {t('amount')}:{' '}
									{lmn.defaultBetSize}
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
		</Box>
	);
};

export default MatchdayLeaguePicker;
