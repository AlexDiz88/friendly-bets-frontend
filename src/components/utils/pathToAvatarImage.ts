export default function pathToAvatarImage(avatarName: string | undefined): string {
	const avatarBasePath = `${process.env.PUBLIC_URL || ''}/upload/avatars/`;
	if (!avatarName) {
		return `${avatarBasePath}no_image.png`;
		//  return `${avatarBasePath}cool_man.jpg`;
	}
	return `${avatarBasePath}${avatarName}`;
}
