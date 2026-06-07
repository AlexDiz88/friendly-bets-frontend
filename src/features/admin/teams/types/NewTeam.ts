import { TeamDisplayNames, TeamExternalAlias } from './Team';

export default interface NewTeam {
	title: string;
	country: string;
	displayNames?: TeamDisplayNames;
	externalAliases?: TeamExternalAlias[];
	footballDataTeamId?: number;
}
