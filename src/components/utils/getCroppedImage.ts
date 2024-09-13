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
		throw new Error('Failed to get canvas context');
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

	const resizedCanvas = document.createElement('canvas');
	const resizedCtx = resizedCanvas.getContext('2d');
	const maxSize = 150;
	let width = canvas.width;
	let height = canvas.height;

	if (width > maxSize || height > maxSize) {
		if (width > height) {
			height = Math.round((height * maxSize) / width);
			width = maxSize;
		} else {
			width = Math.round((width * maxSize) / height);
			height = maxSize;
		}
	}

	resizedCanvas.width = width;
	resizedCanvas.height = height;

	if (resizedCtx) {
		resizedCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);
		return new Promise<File>((resolve, reject) => {
			resizedCanvas.toBlob((blob) => {
				if (!blob) {
					reject(new Error('Failed to create blob'));
					return;
				}
				resolve(new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' }));
			}, 'image/jpeg');
		});
	} else {
		throw new Error('Failed to get resized canvas context');
	}
};

export default getCroppedImage;
