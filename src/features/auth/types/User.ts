export default interface User {
	id: string;
	email: string;
	emailIsConfirmed?: boolean;
	role: string;
	username?: string;
	avatar?: string;
	language?: string;
}
