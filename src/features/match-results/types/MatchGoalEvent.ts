export default interface MatchGoalEvent {
	minute?: string | null;
	minuteNumber?: number | null;
	/** HOME or AWAY */
	teamSide?: string | null;
	playerName?: string | null;
	penalty?: boolean | null;
	penaltyShootout?: boolean | null;
	ownGoal?: boolean | null;
	missed?: boolean | null;
	varDisallowed?: boolean | null;
	redCard?: boolean | null;
	secondYellow?: boolean | null;
}
