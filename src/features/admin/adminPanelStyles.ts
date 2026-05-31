/** Page container for admin cabinet. */
export const ADMIN_PAGE_SX = {
	maxWidth: 420,
	mx: 'auto',
	px: { xs: 2, sm: 2.5 },
	pb: 10,
	pt: 2,
} as const;

export const ADMIN_PAGE_HEADER_SX = {
	mb: 3,
	textAlign: 'left',
} as const;

export const ADMIN_PAGE_TITLE_SX = {
	fontSize: { xs: '1.5rem', sm: '1.75rem' },
	fontWeight: 700,
	letterSpacing: '-0.02em',
	mb: 0.5,
} as const;

export const ADMIN_PAGE_SUBTITLE_SX = {
	color: 'text.secondary',
	fontSize: '0.875rem',
	lineHeight: 1.5,
} as const;

export const ADMIN_GROUP_HEADING_SX = {
	display: 'block',
	typography: 'overline',
	color: 'text.secondary',
	fontWeight: 700,
	letterSpacing: '0.08em',
	mb: 1,
	mt: 2.5,
	textAlign: 'left',
	'&:first-of-type': { mt: 0 },
} as const;

/** Card-style section — shared layout for admin blocks. */
export const ADMIN_PANEL_SX = {
	mb: 1.5,
	p: 2,
	borderRadius: 2,
	border: 1,
	borderColor: 'divider',
	bgcolor: 'background.paper',
	textAlign: 'left',
	width: '100%',
	boxSizing: 'border-box',
} as const;

export const ADMIN_SECTION_DANGER_SX = {
	borderColor: 'error.light',
	bgcolor: 'action.hover',
} as const;

export const ADMIN_SECTION_TITLE_SX = {
	fontSize: '1.05rem',
	fontWeight: 600,
	mb: 0.5,
	letterSpacing: '-0.01em',
} as const;

export const ADMIN_SECTION_HINT_SX = {
	color: 'text.secondary',
	mb: 1.5,
	lineHeight: 1.45,
	fontSize: '0.8125rem',
} as const;

export const ADMIN_FORM_PANEL_SX = {
	mt: 1,
	mb: 1.5,
	p: 1.5,
	borderRadius: 1.5,
	bgcolor: 'action.hover',
	border: 1,
	borderColor: 'divider',
} as const;

export const ADMIN_INLINE_WARNING_CARD_SX = {
	border: 1,
	borderColor: 'warning.light',
	borderRadius: 1.5,
	p: 1.25,
	bgcolor: 'action.hover',
	textAlign: 'left',
} as const;

export const ADMIN_LIST_ITEM_CARD_SX = {
	border: 1,
	borderColor: 'divider',
	borderRadius: 1.5,
	p: 1.25,
	mb: 1,
	bgcolor: 'background.default',
	fontSize: '0.875rem',
} as const;

export const ADMIN_ACTIONS_ROW_SX = {
	display: 'flex',
	flexDirection: 'column',
	gap: 1,
	alignItems: 'stretch',
} as const;

export const ADMIN_BUTTON_STACK_SX = {
	display: 'flex',
	flexDirection: 'column',
	gap: 1,
	alignItems: 'stretch',
	'& .MuiButton-root': { width: '100%' },
} as const;
