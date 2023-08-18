import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import { getProfile } from '../features/auth/api';
import { selectUser } from '../features/auth/selectors';

interface UploadFormProps {
  onClose: () => void;
}

function UploadForm({ onClose }: UploadFormProps): JSX.Element {
  const user = useSelector(selectUser);
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!image) {
      console.log('Файл не выбран');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', image);
      let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/files/upload/avatars`;
      if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
        url = '/api/files/upload/avatars';
      }
      const response = await fetch(`${url}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Файл загружен на сервер');
        setImage(null);
        onClose();
        window.location.reload();
      } else {
        console.log('Произошла ошибка при загрузке файла на сервер');
      }
    } catch (error) {
      console.log('Произошла ошибка при загрузке файла на сервер:', error);
    }
  };

  const handleCancel = (): void => {
    onClose();
  };

  useEffect(() => {
    getProfile();
  }, [user]);

  return (
    <Box>
      <Typography sx={{ fontSize: '1.1rem', fontFamily: 'Literata' }}>
        Изменить фото
      </Typography>
      <FormControl component="form" onSubmit={handleSubmit}>
        <InputLabel htmlFor="imageInput" />
        <TextField
          type="file"
          id="imageInput"
          inputProps={{ accept: 'image/jpeg' }}
          onChange={handleImageChange}
        />
        <Box sx={{ mt: 1, mb: 1, mr: 1 }}>
          <Button
            sx={{ height: '1.8rem', px: 1, mr: 1 }}
            variant="contained"
            color="error"
            onClick={handleCancel}
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Отмена
            </Typography>
          </Button>
          <Button
            type="submit"
            sx={{ height: '1.8rem', px: 1 }}
            variant="contained"
            color="success"
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Изменить
            </Typography>
          </Button>
        </Box>
      </FormControl>
    </Box>
  );
}

export default UploadForm;
