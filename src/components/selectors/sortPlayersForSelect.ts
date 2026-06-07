import User from '../../features/auth/types/User';

/** Кириллица в нике — группа Ru, иначе En (если language не задан). */
const CYRILLIC_IN_NAME = /[\u0400-\u04FF]/;

type PlayerSelectGroup = 'ru' | 'en';

function normalizeLanguageCode(language: string | undefined): string | undefined {
	if (!language) return undefined;
	return language.toLowerCase().split('-')[0];
}

function playerSelectGroup(player: User): PlayerSelectGroup {
	const lang = normalizeLanguageCode(player.language);
	if (lang === 'ru') return 'ru';
	if (lang === 'en') return 'en';

	const name = player.username ?? '';
	return CYRILLIC_IN_NAME.test(name) ? 'ru' : 'en';
}

function groupOrder(group: PlayerSelectGroup): number {
	return group === 'ru' ? 0 : 1;
}

/** Участники для селекта: сначала Ru, затем En; внутри группы — по алфавиту. */
export function comparePlayersForSelect(a: User, b: User): number {
	const ga = playerSelectGroup(a);
	const gb = playerSelectGroup(b);
	const byGroup = groupOrder(ga) - groupOrder(gb);
	if (byGroup !== 0) return byGroup;

	const locale = ga === 'ru' ? 'ru' : 'en';
	const na = a.username ?? '';
	const nb = b.username ?? '';
	return na.localeCompare(nb, locale, { sensitivity: 'base' });
}

export function sortPlayersForSelect(players: User[]): User[] {
	return [...players].sort(comparePlayersForSelect);
}
