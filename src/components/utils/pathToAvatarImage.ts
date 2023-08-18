export default function pathToAvatarImage(avatarName: string | undefined): string {
  const avatarBasePath = `${process.env.PUBLIC_URL}/upload/avatars/`;
  if (!avatarName) {
    return `${avatarBasePath}cool_man.jpg`;
  }
  return `${avatarName.toLowerCase().replace(/\s/g, '_')}.jpg`;
  //   const avatarFileNameJPG = `${avatarName.toLowerCase().replace(/\s/g, '_')}.jpg`;
  //   const avatarFileNamePNG = `${avatarName.toLowerCase().replace(/\s/g, '_')}.png`;

  //   if (fileExists(avatarBasePath + avatarFileNameJPG)) {
  //     return avatarBasePath + avatarFileNameJPG;
  //   }
  //   if (fileExists(avatarBasePath + avatarFileNamePNG)) {
  //     return avatarBasePath + avatarFileNamePNG;
  //   }
  //   return `${avatarBasePath}cool_man.jpg`;
  // }

  // function fileExists(url: string): boolean {
  //   const http = new XMLHttpRequest();
  //   http.open('HEAD', url, false);
  //   http.send();
  //   return http.status !== 404;
}
