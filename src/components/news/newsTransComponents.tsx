import { Link } from '@mui/material';

/** Shared rich-text tags for siteNews Trans blocks. */
export const newsTransComponents = {
	strong: <strong />,
	em: <em />,
	br: <br />,
	accent: <strong style={{ color: 'brown' }} />,
	closing: <strong style={{ color: 'green' }} />,
	mongoLink: (
		<Link href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" />
	),
};
