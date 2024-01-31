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
  marginTop:"0",
  marginBottom:"0",
}));

function ImageFormField({ value: image, onChange }) {
  const inputRef = useRef(null);
  const [imgIsValid, setImgIsValid] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      setImgIsValid(image.id && inputRef.current.checkValidity());
    } else {
      setImgIsValid(!!image.id);
    }
}, [image]);

  const imgUrl = image.id === null ? '' : image.id;

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
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

export default ImageFormField;
