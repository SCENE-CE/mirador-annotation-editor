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
function ImageFormField({ value: image, onChange }) {
  const inputRef = useRef(null);
  const [imgIsValid, setImgIsValid] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      setImgIsValid(image && inputRef.current.checkValidity());
    } else {
      setImgIsValid(!!image);
    }

  }, [image]);

  return (
    <StyledRoot>
      <StyledTextField
        value={image}
        onChange={(ev) => onChange(ev.target.value)}
        error={image !== '' && !imgIsValid}
        margin="dense"
        label="Image URL"
        type="url"
        fullWidth
        inputRef={inputRef}
      />
      {imgIsValid && <img src={image} width="100%" height="auto" alt="loading failed" />}
    </StyledRoot>
  );
}

ImageFormField.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default ImageFormField;
