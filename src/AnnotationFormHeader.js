import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

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
      <ChevronLeftIcon onClick={goBackToTemplateSelection} />
      {templateType.label}
      {templateType.icon}
    </ContainerAnnotationFormHeader>
  );
}

const ContainerAnnotationFormHeader = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '10px',
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
