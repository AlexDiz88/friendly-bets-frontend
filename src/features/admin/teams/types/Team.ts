export interface TeamDisplayNames {
	en?: string;
	ru?: string;
	de?: string;
}

export interface TeamExternalAlias {
	provider: string;
	externalId?: number;
	externalName?: string;
}

export default interface Team {
	id: string;
	title: string;
	country?: string;
	logoKey?: string;
	displayNames?: TeamDisplayNames;
	externalAliases?: TeamExternalAlias[];
	footballDataTeamId?: number;
}
