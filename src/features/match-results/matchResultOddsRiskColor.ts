export type MatchResultOddsChipColors = {
	background: string;
	color: string;
	border: string;
};

type Rgb = { r: number; g: number; b: number };

/** Risk stops (dark enough for white text): &lt;2 green → 2–3 olive → 3–5 amber → &gt;5 red. */
const STOPS: Array<{ at: number; rgb: Rgb }> = [
	{ at: 1.01, rgb: { r: 15, g: 118, b: 55 } },
	{ at: 2.0, rgb: { r: 77, g: 124, b: 15 } },
	{ at: 3.0, rgb: { r: 161, g: 98, b: 7 } },
	{ at: 5.0, rgb: { r: 180, g: 83, b: 9 } },
	{ at: 8.0, rgb: { r: 153, g: 27, b: 27 } },
	{ at: 15.0, rgb: { r: 107, g: 18, b: 18 } },
];

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
	return {
		r: Math.round(lerp(a.r, b.r, t)),
		g: Math.round(lerp(a.g, b.g, t)),
		b: Math.round(lerp(a.b, b.b, t)),
	};
}

function clamp01(t: number): number {
	if (t < 0) return 0;
	if (t > 1) return 1;
	return t;
}

function interpolateOddsRgb(odds: number): Rgb {
	if (!Number.isFinite(odds) || odds <= STOPS[0].at) {
		return STOPS[0].rgb;
	}
	const last = STOPS[STOPS.length - 1];
	if (odds >= last.at) {
		return last.rgb;
	}
	for (let i = 0; i < STOPS.length - 1; i += 1) {
		const left = STOPS[i];
		const right = STOPS[i + 1];
		if (odds >= left.at && odds <= right.at) {
			const t = clamp01((odds - left.at) / (right.at - left.at));
			return lerpRgb(left.rgb, right.rgb, t);
		}
	}
	return last.rgb;
}

function darken(rgb: Rgb, amount: number): Rgb {
	const t = clamp01(amount);
	return {
		r: Math.round(rgb.r * (1 - t)),
		g: Math.round(rgb.g * (1 - t)),
		b: Math.round(rgb.b * (1 - t)),
	};
}

function toCss(rgb: Rgb, alpha = 1): string {
	if (alpha >= 1) {
		return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
	}
	return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function parseOddsValue(raw: string | null | undefined): number | null {
	if (raw == null || raw.trim() === '') {
		return null;
	}
	const normalized = raw.trim().replace(',', '.');
	const value = Number(normalized);
	if (!Number.isFinite(value) || value <= 1) {
		return null;
	}
	return value;
}

/** Dark saturated fill + white text (readable in light and dark themes). */
export function matchResultOddsChipColors(odds: number): MatchResultOddsChipColors {
	const rgb = interpolateOddsRgb(odds);
	return {
		background: toCss(rgb, 0.95),
		color: 'rgba(255, 255, 255, 0.96)',
		border: toCss(darken(rgb, 0.28), 0.9),
	};
}
