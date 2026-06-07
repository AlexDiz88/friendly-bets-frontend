import { Box } from '@mui/material';
import CustomCancelButton from '../custom/btn/CustomCancelButton';
import CustomSuccessButton from '../custom/btn/CustomSuccessButton';
import { profileEditActionsRowSx, profileEditActionsSx } from './profilePageStyles';

type ProfileEditActionsProps = {
	onCancel: () => void;
	onSave: () => void;
	saveText: string;
	/** В одну строку на всех ширинах (загрузка фото) */
	inline?: boolean;
};

export default function ProfileEditActions({
	onCancel,
	onSave,
	saveText,
	inline = false,
}: ProfileEditActionsProps): JSX.Element {
	return (
		<Box sx={inline ? profileEditActionsRowSx : profileEditActionsSx}>
			<CustomCancelButton onClick={onCancel} sx={inline ? { mr: 0 } : undefined} />
			<CustomSuccessButton onClick={onSave} buttonText={saveText} sx={inline ? { mr: 0 } : undefined} />
		</Box>
	);
}
