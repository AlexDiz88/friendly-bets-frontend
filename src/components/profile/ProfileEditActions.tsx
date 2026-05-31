import { Box } from '@mui/material';
import CustomCancelButton from '../custom/btn/CustomCancelButton';
import CustomSuccessButton from '../custom/btn/CustomSuccessButton';
import { profileEditActionsSx } from './profilePageStyles';

type ProfileEditActionsProps = {
	onCancel: () => void;
	onSave: () => void;
	saveText: string;
};

export default function ProfileEditActions({
	onCancel,
	onSave,
	saveText,
}: ProfileEditActionsProps): JSX.Element {
	return (
		<Box sx={profileEditActionsSx}>
			<CustomCancelButton onClick={onCancel} />
			<CustomSuccessButton onClick={onSave} buttonText={saveText} />
		</Box>
	);
}
