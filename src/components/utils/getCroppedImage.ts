/* eslint-disable import/named */
import { PixelCrop } from 'react-image-crop';

const getCroppedImage = async (image: HTMLImageElement, crop: PixelCrop): Promise<File> => {
	const canvas = document.createElement('canvas');
	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;
	canvas.width = crop.width * scaleX;
	canvas.height = crop.height * scaleY;
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		throw new Error('error.failedToGetCanvasContext');
	}

	ctx.drawImage(
		image,
		crop.x * scaleX,
		crop.y * scaleY,
		crop.width * scaleX,
		crop.height * scaleY,
		0,
		0,
		canvas.width,
		canvas.height
	);

	return new Promise<File>((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject(new Error('error.canvasIsEmpty'));
				return;
			}
			resolve(new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' }));
		}, 'image/jpeg');
	});
};

export default getCroppedImage;
