import DeleteIcon from '@mui/icons-material/Delete';
import {
	Box,
	FormControlLabel,
	IconButton,
	MenuItem,
	Select,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import CustomButton from '../../../components/custom/btn/CustomButton';
import { PLAYOFF_STAGE_OPTIONS, WC_FORMAT_CODE } from './tournamentFormatStructureUtils';
import type { PlayoffStage } from './types/TournamentFormat';

const STANDARD_PLAYOFF_COUNTS = [1, 2] as const;
const EXTENDED_PLAYOFF_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const GROUP_SLOT_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export interface TournamentFormatStructureFieldsProps {
	formatCode?: string;
	useRegular: boolean;
	onUseRegularChange: (value: boolean) => void;
	regularCount: string;
	onRegularCountChange: (value: string) => void;
	useGroup: boolean;
	onUseGroupChange: (value: boolean) => void;
	groupCount: string;
	onGroupCountChange: (value: string) => void;
	groupSplitSlots: boolean;
	onGroupSplitSlotsChange: (value: boolean) => void;
	groupSlotsPerRound: string[];
	onGroupSlotsPerRoundChange: (slots: string[]) => void;
	usePlayoff: boolean;
	onUsePlayoffChange: (value: boolean) => void;
	rounds: PlayoffStage[];
	onRoundsChange: (rounds: PlayoffStage[]) => void;
	disabled?: boolean;
}

export default function TournamentFormatStructureFields({
	formatCode,
	useRegular,
	onUseRegularChange,
	regularCount,
	onRegularCountChange,
	useGroup,
	onUseGroupChange,
	groupCount,
	onGroupCountChange,
	groupSplitSlots,
	onGroupSplitSlotsChange,
	groupSlotsPerRound,
	onGroupSlotsPerRoundChange,
	usePlayoff,
	onUsePlayoffChange,
	rounds,
	onRoundsChange,
	disabled = false,
}: TournamentFormatStructureFieldsProps): JSX.Element {
	const isWc = formatCode === WC_FORMAT_CODE;
	const playoffCounts = isWc ? EXTENDED_PLAYOFF_COUNTS : STANDARD_PLAYOFF_COUNTS;
	const groupRoundCount = Math.max(1, Math.min(8, Number(groupCount) || 1));

	const updateStage = (index: number, field: keyof PlayoffStage, value: string | number): void => {
		onRoundsChange(rounds.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
	};

	const updateGroupSlotCount = (roundIndex: number, value: string): void => {
		onGroupSlotsPerRoundChange(
			groupSlotsPerRound.map((s, i) => (i === roundIndex ? value : s))
		);
	};

	return (
		<Box sx={{ mt: 1 }}>
			{!isWc && (
				<>
					<FormControlLabel
						control={
							<Switch
								checked={useRegular}
								disabled={disabled}
								onChange={(e) => {
									onUseRegularChange(e.target.checked);
									if (e.target.checked) {
										onUseGroupChange(false);
									}
								}}
							/>
						}
						label={t('tournamentFormatRegularStage')}
					/>
					{useRegular && (
						<TextField
							fullWidth
							size="small"
							type="number"
							label={t('tournamentFormatMatchdayCount')}
							value={regularCount}
							onChange={(e) => onRegularCountChange(e.target.value)}
							inputProps={{ min: 1 }}
							disabled={disabled}
							sx={{ mb: 1 }}
						/>
					)}
				</>
			)}

			<FormControlLabel
				control={
					<Switch
						checked={useGroup}
						disabled={disabled || isWc}
						onChange={(e) => {
							onUseGroupChange(e.target.checked);
							if (e.target.checked) {
								onUseRegularChange(false);
							}
						}}
					/>
				}
				label={t('tournamentFormatGroupStage')}
			/>
			{useGroup && (
				<Box sx={{ mb: 1 }}>
					<TextField
						fullWidth
						size="small"
						type="number"
						label={t('tournamentFormatMatchdayCount')}
						value={groupCount}
						onChange={(e) => onGroupCountChange(e.target.value)}
						inputProps={{ min: 1, max: 8 }}
						disabled={disabled}
						sx={{ mb: 0.5 }}
					/>
					<FormControlLabel
						control={
							<Switch
								checked={groupSplitSlots}
								disabled={disabled}
								onChange={(e) => onGroupSplitSlotsChange(e.target.checked)}
							/>
						}
						label={t('tournamentFormatGroupSplitSlots')}
					/>
					{groupSplitSlots && (
						<Box sx={{ pl: 0.5 }}>
							{Array.from({ length: groupRoundCount }, (_, i) => i).map((roundIndex) => (
								<Box
									key={`group-round-${roundIndex}`}
									sx={{ display: 'flex', gap: 0.5, mb: 0.5, alignItems: 'center' }}
								>
									<Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
										{t('tournamentFormatGroupRoundLabel', { round: roundIndex + 1 })}
									</Typography>
									<Select
										size="small"
										value={Number(groupSlotsPerRound[roundIndex] ?? 1)}
										disabled={disabled}
										onChange={(e) =>
											updateGroupSlotCount(roundIndex, String(e.target.value))
										}
										sx={{ width: '4.5rem' }}
									>
										{GROUP_SLOT_COUNTS.map((count) => (
											<MenuItem key={count} value={count}>
												{count}
											</MenuItem>
										))}
									</Select>
								</Box>
							))}
						</Box>
					)}
				</Box>
			)}

			<FormControlLabel
				control={
					<Switch
						checked={usePlayoff}
						disabled={disabled}
						onChange={(e) => onUsePlayoffChange(e.target.checked)}
					/>
				}
				label={t('tournamentFormatPlayoff')}
			/>

			{usePlayoff && (
				<Box sx={{ mb: 1 }}>
					<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
						{t('tournamentFormatPlayoffStages')}
					</Typography>
					{rounds.map((round, index) => (
						<Box
							key={`round-${index}`}
							sx={{ display: 'flex', gap: 0.5, mb: 0.5, alignItems: 'center' }}
						>
							<Select
								size="small"
								value={round.stage}
								disabled={disabled}
								onChange={(e) => updateStage(index, 'stage', e.target.value)}
								sx={{ flex: 1 }}
							>
								{PLAYOFF_STAGE_OPTIONS.map((key) => (
									<MenuItem key={key} value={key}>
										{t(`playoffStage.${key}`)}
									</MenuItem>
								))}
							</Select>
							<Select
								size="small"
								value={round.matchdayCount}
								disabled={disabled}
								onChange={(e) => updateStage(index, 'matchdayCount', Number(e.target.value))}
								sx={{ width: isWc ? '4.5rem' : '5rem' }}
							>
								{playoffCounts.map((count) => (
									<MenuItem key={count} value={count}>
										{count}
									</MenuItem>
								))}
							</Select>
							<IconButton
								size="small"
								disabled={disabled || rounds.length <= 1}
								onClick={() => onRoundsChange(rounds.filter((_, i) => i !== index))}
							>
								<DeleteIcon fontSize="small" />
							</IconButton>
						</Box>
					))}
					<CustomButton
						buttonSize="small"
						buttonVariant="outlined"
						disabled={disabled}
						onClick={() => onRoundsChange([...rounds, { stage: '1/8', matchdayCount: 2 }])}
						buttonText={t('tournamentFormatAddStage')}
					/>
				</Box>
			)}
		</Box>
	);
}
