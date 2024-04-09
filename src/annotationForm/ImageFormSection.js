import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Button, Grid } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import ImageFormField from './AnnotationFormOverlay/ImageFormField';
import { defaultToolState } from './AnnotationFormUtils';

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
    onChange,
  },
) {
  const [imageState, setImageState] = useState(defaultToolState.image);

  /** TODO Code duplicate ?? */
  const handleImgChange = (newUrl) => {
    setImageState({ id: newUrl });
  };
    /**
     * handleImageAdd button click
     * */
  const addImage = () => {
    const data = {
      id: imageState?.image?.id,
      uuid: uuidv4(),
    };
    // TODO: Qu'est ce que doit être data ? l'url de l'image ?
    onChange(data);
  };

  return (
    <>
      <Typography variant="overline">
        Add image from URL
      </Typography>
      <Grid container>
        <ImageFormField xs={8} imageUrl={imageState.id} onChange={handleImgChange} />
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
  onChange: PropTypes.string.isRequired,
};
