import React, { useEffect } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { MiradorMenuButton } from 'mirador/dist/es/src/components/MiradorMenuButton';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

/**
 * React component for rendering the header of the annotation form.
 * */
export default function AnnotationFormHeader({ templateType, setCommentingType, annotation }) {
  /**
     * Function to navigate back to the template selection.
     */
  const goBackToTemplateSelection = () => {
    setCommentingType(null);
  };

  return (
    <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{marginRight:"10px"}}
        spacing={2}
    >
      <Grid item>
        {annotation.id == null
        && (
          <MiradorMenuButton>
            <ChevronLeftIcon onClick={goBackToTemplateSelection} />
          </MiradorMenuButton>
        )}
      </Grid>
      <Grid item>
        {templateType.icon}
      </Grid>
    </Grid>
  );
}
AnnotationFormHeader.propTypes = {
  setCommentingType: PropTypes.func.isRequired,
  templateType: PropTypes.arrayOf(PropTypes.shape(
    {
      description: PropTypes.string,
      icon: PropTypes.element,
      id: PropTypes.string,
      label: PropTypes.string,
    },
  )).isRequired,
};
