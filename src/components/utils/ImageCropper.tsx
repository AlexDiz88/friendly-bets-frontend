/* eslint-disable import/named */
import { useRef, useState } from 'react';
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper = ({
	src,
	onCropComplete,
	setImageElement,
}: {
	src: string;
	onCropComplete: (crop: PixelCrop) => void;
	setImageElement: (img: HTMLImageElement) => void;
}): JSX.Element => {
	const [crop, setCrop] = useState<Crop>();
	const imgRef = useRef<HTMLImageElement>(null);

	const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>): void => {
		const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
		const newCrop = centerCrop(
			makeAspectCrop({ unit: '%', width: 80 }, 1, width, height),
			width,
			height
		);
		setCrop(newCrop);

		if (imgRef.current) {
			setImageElement(imgRef.current);
		}
	};

	const onCropChange = (newCrop: Crop): void => {
		setCrop(newCrop);
	};

	const handleCrop = (newCrop: PixelCrop): void => {
		onCropComplete(newCrop);
	};

	return (
		<>
			{!!src && (
				<ReactCrop crop={crop} onChange={onCropChange} onComplete={handleCrop} aspect={1}>
					<img
						ref={imgRef}
						alt="Crop me"
						src={src}
						style={{ maxWidth: '20rem', maxHeight: '20rem' }}
						onLoad={onImageLoad}
					/>
				</ReactCrop>
			)}
		</>
	);
};

export default ImageCropper;
