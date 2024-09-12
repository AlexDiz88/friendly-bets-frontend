export const avatarBase64Converter = (avatar: string | undefined): string => {
	return avatar ? `data:image/jpg;base64,${avatar}` : '/upload/avatars/no_image.png';
};

export const pathToLogoImage = (logo: string | undefined): string => {
	const avatarBasePath = `/upload/logo/`;
	if (!logo) {
		return `${avatarBasePath}no_image.png`;
	}
	return `${avatarBasePath}${logo.toLowerCase().replace(/\s/g, '_')}.png`;
};

// deprecated
export const pathToAvatarImage = (avatarName: string | undefined): string => {
	const avatarBasePath = `/upload/avatars/`;
	if (!avatarName) {
		return `${avatarBasePath}no_image.png`;
	}
	return `${avatarBasePath}${avatarName}`;
};
