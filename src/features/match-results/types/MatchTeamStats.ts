/** Per-match team stats from FULL_MATCH providers (same shape as backend MatchTeamStats). */
export default interface MatchTeamStats {
	possessionHome?: number | null;
	possessionAway?: number | null;
	shotsHome?: number | null;
	shotsAway?: number | null;
	shotsOnTargetHome?: number | null;
	shotsOnTargetAway?: number | null;
	yellowCardsHome?: number | null;
	yellowCardsAway?: number | null;
	redCardsHome?: number | null;
	redCardsAway?: number | null;
	cornersHome?: number | null;
	cornersAway?: number | null;
	offsidesHome?: number | null;
	offsidesAway?: number | null;
	savesHome?: number | null;
	savesAway?: number | null;
	xgHome?: number | null;
	xgAway?: number | null;
}
