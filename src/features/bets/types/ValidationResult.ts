export interface ValidationResult {
	valid: boolean;
	errors: {
		fullTime?: string;
		firstTime?: string;
		overTime?: string;
		penalty?: string;
	};
}
