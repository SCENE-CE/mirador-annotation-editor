import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Button, Grid } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import ImageFormField from './AnnotationFormOverlay/ImageFormField';
import { defaultToolState } from '../AnnotationFormUtils';

/**
 * Section for Image Template
 * @param setAnnoState
 * @param annoState
 * @returns {Element}
 * @constructor
 */
export default function ImageFormSection(
  {
    annoState,
    setAnnoState,
  },
) {
  const [imageState, setimageState] = useState(defaultToolState.image);

  /** TODO Code duplicate ?? */
  const handleImgChange = (newUrl) => {
    setimageState( { id: newUrl });
  };
    /**
     * handleImageAdd button click
     * */
  const addImage = () => {
    const data = {
      id: imageState?.image?.id,
      uuid: uuidv4(),
    };

    setAnnoState({
      ...imageState,
      image: { id: null },
      imageEvent: data,
    });
  };

  return (
    <>
      <Typography variant="overline">
        Add image from URL
      </Typography>
      <Grid container>
        <ImageFormField xs={8} image={imageState} onChange={handleImgChange} />
      </Grid>
      <StyledDivButtonImage>
        <Button onClick={addImage} variant="contained">
          <AddPhotoAlternateIcon />
        </Button>
      </StyledDivButtonImage>
    </>
  );
}

const StyledDivButtonImage = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '5px',
}));

ImageFormSection.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  annoState: PropTypes.object.isRequired,
  setAnnoState: PropTypes.func.isRequired,
};
