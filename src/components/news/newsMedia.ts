const VIDEO_SRC_PATTERN = /\.(mp4|webm|ogg)(\?.*)?$/i;

/** Default playback volume for news cover videos (0–1). */
export const NEWS_VIDEO_DEFAULT_VOLUME = 0.3;

export function isNewsVideoSrc(src: string): boolean {
	return VIDEO_SRC_PATTERN.test(src);
}

export function applyNewsVideoVolume(video: HTMLVideoElement): void {
	video.volume = NEWS_VIDEO_DEFAULT_VOLUME;
}
