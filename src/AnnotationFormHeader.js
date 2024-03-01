import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { MiradorMenuButton } from 'mirador/dist/es/src/components/MiradorMenuButton';
import Typography from '@mui/material/Typography';

/**
 * React component for rendering the header of the annotation form.
 * */
export default function AnnotationFormHeader({ templateType, setCommentingType }) {
  /**
     * Function to navigate back to the template selection.
     */
  const goBackToTemplateSelection = () => {
    setCommentingType(null);
  };

  return (
    <ContainerAnnotationFormHeader>
      <MiradorMenuButton>
        <ChevronLeftIcon onClick={goBackToTemplateSelection} />
      </MiradorMenuButton>
      <TitleLogoContainer>
        <StyledTitle>{templateType.label}</StyledTitle>
        {templateType.icon}
      </TitleLogoContainer>
    </ContainerAnnotationFormHeader>
  );
}

const ContainerAnnotationFormHeader = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
}));

const TitleLogoContainer = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '100%',
}));

const StyledTitle = styled(Typography, { name: 'CompanionWindow', slot: 'title' })({});


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
