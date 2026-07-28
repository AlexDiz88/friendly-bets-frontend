/** Smooth scroll so element's top sits slightly below the viewport top (not flush / not nearest-no-op). */
export function softScrollToElement(el: HTMLElement, topOffsetPx = 100): void {
	const y = window.scrollY + el.getBoundingClientRect().top - topOffsetPx;
	window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
}

export function softScrollToId(elementId: string, topOffsetPx = 100): void {
	const el = document.getElementById(elementId);
	if (el) {
		softScrollToElement(el, topOffsetPx);
	}
}

/** Anchor for ExternalTeamAliasesPanel — scroll target after team alias save. */
export const ADMIN_EXTERNAL_TEAM_ALIASES_ID = 'admin-external-team-aliases';
