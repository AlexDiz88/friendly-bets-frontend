export const resolveBetCodes = (
	group: { codes?: number[]; range?: [number, number] },
	allCodes: number[]
): number[] => {
	if (group.codes) return group.codes;
	if (group.range) {
		const [min, max] = group.range;
		return allCodes.filter((code) => code >= min && code <= max);
	}
	return [];
};
