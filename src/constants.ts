export const TOTAL_ID = 'total';
export const TOTAL_STATS_BY_TEAMS_USER_ID = 'total';
export const MATCHDAY_TITLE_FINAL = 'final';

export const BET_STATUS_OPENED = 'OPENED';
export const BET_STATUS_EMPTY = 'EMPTY';
export const BET_STATUS_WON = 'WON';
export const BET_STATUS_RETURNED = 'RETURNED';
export const BET_STATUS_LOST = 'LOST';

export const COMPLETED_BET_STATUSES = [BET_STATUS_WON, BET_STATUS_RETURNED, BET_STATUS_LOST];
export type BetStatus = typeof BET_STATUS_WON | typeof BET_STATUS_RETURNED | typeof BET_STATUS_LOST;

export const GAMEWEEK_CARD_MIN_WIDTH = '9rem';
export const GAMEWEEK_CARD_MAX_WIDTH = '12rem';
export const GAMEWEEK_CARD_HEIGHT = '4.2rem';
