import { Avatar, Box, type SxProps, type Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { leagueLogoAvatarSx } from './custom/avatar/LeagueAvatar';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from './utils/teamDisplay';

export type MatchTeamSide = {
	title?: string | null;
	logoKey?: string | null;
};

export type MatchTeamsPair = {
	home?: MatchTeamSide | null;
	away?: MatchTeamSide | null;
};

/**
 * Home/away titles with logos always to the left of each name.
 */
export default function MatchTeamsWithLogos({
	home,
	away,
	height = 18,
	sx,
}: {
	home?: MatchTeamSide | null;
	away?: MatchTeamSide | null;
	height?: number;
	sx?: SxProps<Theme>;
}): JSX.Element | null {
	const { i18n } = useTranslation();
	const homeTitle = home?.title?.trim() || '';
	const awayTitle = away?.title?.trim() || '';
	if (!homeTitle && !awayTitle) {
		return null;
	}
	const homeName = resolveTeamDisplayName({ title: homeTitle }, i18n.language) || homeTitle;
	const awayName = resolveTeamDisplayName({ title: awayTitle }, i18n.language) || awayTitle;
	const avatarSx = [{ height, width: height, flexShrink: 0 }, leagueLogoAvatarSx] as SxProps<Theme>;

	return (
		<Box
			component="span"
			sx={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 0.5,
				flexWrap: 'wrap',
				minWidth: 0,
				...((sx as object) || {}),
			}}
		>
			{homeTitle ? (
				<Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, minWidth: 0 }}>
					<Avatar
						variant="square"
						alt=""
						src={resolveTeamLogoUrl({ title: homeTitle, logoKey: home?.logoKey || undefined })}
						sx={avatarSx}
					/>
					<Box component="span" sx={{ lineHeight: 1.2 }}>
						{homeName}
					</Box>
				</Box>
			) : null}
			{homeTitle && awayTitle ? (
				<Box component="span" sx={{ opacity: 0.65, px: 0.15 }}>
					-
				</Box>
			) : null}
			{awayTitle ? (
				<Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, minWidth: 0 }}>
					<Avatar
						variant="square"
						alt=""
						src={resolveTeamLogoUrl({ title: awayTitle, logoKey: away?.logoKey || undefined })}
						sx={avatarSx}
					/>
					<Box component="span" sx={{ lineHeight: 1.2 }}>
						{awayName}
					</Box>
				</Box>
			) : null}
		</Box>
	);
}
