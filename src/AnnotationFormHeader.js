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
        alignItems="center"
    >
      <Grid container item xs={2}>
        {annotation.id == null
        && (
          <MiradorMenuButton>
            <ChevronLeftIcon onClick={goBackToTemplateSelection} />
          </MiradorMenuButton>
        )}
      </Grid>
      <Grid
          justifyContent="space-between"
          container
          item xs={10}>
        <Typography>{templateType.label}</Typography>
        {templateType.icon}
      </Grid>
    </Grid>
  );
}

const ContainerAnnotationFormHeader = styled(Grid)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  padding: '10px',
  width: '100%',
}));

const TitleLogoContainer = styled(Grid)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
}));

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
