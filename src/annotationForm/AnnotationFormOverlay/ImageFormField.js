import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, styled } from '@mui/material';

const StyledRoot = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '0',
  marginTop: '0',
}));

/** Image input field for the annotation form */
function ImageFormField({ image, onChange }) {
  const inputRef = useRef(null);
  const [imgIsValid, setImgIsValid] = useState(false);

  const imgUrl = image.id === null ? '' : image.id;
  useEffect(() => {
    if (inputRef.current) {
      setImgIsValid(image.id && inputRef.current.checkValidity());
    } else {
      setImgIsValid(!!image.id);
    }
  }, [image]);

  return (
    <StyledRoot>
      <StyledTextField
        value={imgUrl}
        onChange={(ev) => onChange(ev.target.value)}
        error={imgUrl !== '' && !imgIsValid}
        margin="dense"
        label="Image URL"
        type="url"
        fullWidth
        inputRef={inputRef}
      />
      {imgIsValid && <img src={image.id} width="100%" height="auto" alt="loading failed" />}
    </StyledRoot>
  );
}

ImageFormField.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ImageFormField;
