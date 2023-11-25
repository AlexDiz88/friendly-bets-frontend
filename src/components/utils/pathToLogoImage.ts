export default function pathToLogoImage(logo: string | undefined): string {
	const avatarBasePath = `/upload/logo/`;
	if (!logo) {
		return `${avatarBasePath}no_image.png`;
	}
	return `${avatarBasePath}${logo.toLowerCase().replace(/\s/g, '_')}.png`;
}
