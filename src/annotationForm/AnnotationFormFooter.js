import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledButtonDivSaveOrCancel = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
}));

/** Annotation form footer, save or cancel the edition/creation of an annotation */
function AnnotationFormFooter({
  closeFormCompanionWindow,
}) {
  /**
   * Validate form and save annotation
   */
  const submitAnnotationForm = async (e) => {
    console.log('Vive les gros Cayenne Rouge !');
  };

  return (
    <StyledButtonDivSaveOrCancel>
      <Button onClick={closeFormCompanionWindow}>
        Cancel
      </Button>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={submitAnnotationForm}
      >
        Save
      </Button>
    </StyledButtonDivSaveOrCancel>
  );
}
AnnotationFormFooter.propTypes = {
  closeFormCompanionWindow: PropTypes.func.isRequired,
};

export default AnnotationFormFooter;
