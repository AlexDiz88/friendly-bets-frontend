import heic2any from 'heic2any';

const convertHeicToJpeg = async (file: File): Promise<File | null> => {
	try {
		const convertedBlob = await heic2any({ blob: file, toType: 'image/jpeg' });
		const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
		return new File([blob], file.name.replace(/\.heic$/, '.jpg'), { type: 'image/jpeg' });
	} catch {
		return null;
	}
};

export default convertHeicToJpeg;
