/**
 * Canonical UI colors for external-data layers (SCHEDULE / ODDS / LIVE / FULL_MATCH).
 * Single source of truth — use everywhere (admin, sandbox, monitoring, error-logs).
 */
export type ExternalDataLayer = 'SCHEDULE' | 'ODDS' | 'LIVE' | 'FULL_MATCH';

export type ExternalDataLayerPalette = {
	/** Solid accent for titles, bars, borders */
	accent: string;
	/** Soft fill (light theme) */
	soft: string;
	/** Soft fill (dark theme) */
	softDark: string;
	/** Header gradient start (light) */
	header: string;
	/** Header gradient start (dark) */
	headerDark: string;
	/** Card / section surface tint (light) */
	surface: string;
	/** Card / section surface tint (dark) */
	surfaceDark: string;
	/** Border (light) */
	border: string;
	/** Border (dark) */
	borderDark: string;
};

export const EXTERNAL_DATA_LAYERS: ExternalDataLayer[] = [
	'SCHEDULE',
	'ODDS',
	'LIVE',
	'FULL_MATCH',
];

/**
 * Layer accents:
 * - SCHEDULE — blue `#0284c7`
 * - ODDS — amber `#d97706`
 * - LIVE — green `#059669`
 * - FULL_MATCH — violet `#7c3aed`
 */
export const EXTERNAL_DATA_LAYER_PALETTE: Record<ExternalDataLayer, ExternalDataLayerPalette> = {
	SCHEDULE: {
		accent: '#0284c7',
		soft: 'rgba(14,165,233,0.14)',
		softDark: 'rgba(56,189,248,0.16)',
		header: 'rgba(14,165,233,0.18)',
		headerDark: 'rgba(56,189,248,0.16)',
		surface: 'rgba(224,242,254,0.75)',
		surfaceDark: 'rgba(12,74,110,0.35)',
		border: 'rgba(2,132,199,0.35)',
		borderDark: 'rgba(56,189,248,0.32)',
	},
	ODDS: {
		accent: '#d97706',
		soft: 'rgba(245,158,11,0.16)',
		softDark: 'rgba(251,191,36,0.15)',
		header: 'rgba(245,158,11,0.2)',
		headerDark: 'rgba(251,191,36,0.14)',
		surface: 'rgba(255,247,237,0.9)',
		surfaceDark: 'rgba(120,53,15,0.35)',
		border: 'rgba(217,119,6,0.38)',
		borderDark: 'rgba(251,191,36,0.3)',
	},
	LIVE: {
		accent: '#059669',
		soft: 'rgba(16,185,129,0.14)',
		softDark: 'rgba(52,211,153,0.14)',
		header: 'rgba(16,185,129,0.18)',
		headerDark: 'rgba(52,211,153,0.14)',
		surface: 'rgba(236,253,245,0.9)',
		surfaceDark: 'rgba(6,78,59,0.35)',
		border: 'rgba(5,150,105,0.35)',
		borderDark: 'rgba(52,211,153,0.3)',
	},
	FULL_MATCH: {
		accent: '#7c3aed',
		soft: 'rgba(139,92,246,0.14)',
		softDark: 'rgba(167,139,250,0.16)',
		header: 'rgba(139,92,246,0.18)',
		headerDark: 'rgba(167,139,250,0.14)',
		surface: 'rgba(245,243,255,0.9)',
		surfaceDark: 'rgba(76,29,149,0.35)',
		border: 'rgba(124,58,237,0.35)',
		borderDark: 'rgba(167,139,250,0.32)',
	},
};

/** Accent-only map (tabs, titles, chips). */
export const EXTERNAL_DATA_LAYER_ACCENT: Record<ExternalDataLayer, string> = {
	SCHEDULE: EXTERNAL_DATA_LAYER_PALETTE.SCHEDULE.accent,
	ODDS: EXTERNAL_DATA_LAYER_PALETTE.ODDS.accent,
	LIVE: EXTERNAL_DATA_LAYER_PALETTE.LIVE.accent,
	FULL_MATCH: EXTERNAL_DATA_LAYER_PALETTE.FULL_MATCH.accent,
};

export function isExternalDataLayer(value: string | null | undefined): value is ExternalDataLayer {
	return (
		value === 'SCHEDULE' || value === 'ODDS' || value === 'LIVE' || value === 'FULL_MATCH'
	);
}

export function externalDataLayerPalette(layer: ExternalDataLayer): ExternalDataLayerPalette {
	return EXTERNAL_DATA_LAYER_PALETTE[layer];
}

/** Accent for a known layer name; undefined if not a layer. */
export function externalDataLayerAccent(layer: string | null | undefined): string | undefined {
	if (!isExternalDataLayer(layer)) return undefined;
	return EXTERNAL_DATA_LAYER_ACCENT[layer];
}
