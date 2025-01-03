import { Button, Grid, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/** Annotation form footer, save or cancel the edition/creation of an annotation */
function AnnotationFormFooter({
  closeFormCompanionWindow,
  saveAnnotation,
}) {
  /**
     * Validate form and save annotation
     */

  return (
    <Grid container item spacing={1} justifyContent="flex-end">
      <Tooltip title="cancel">
        <Button onClick={closeFormCompanionWindow}>
          Cancel
        </Button>
      </Tooltip>
      <Tooltip title="save">
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={saveAnnotation}
        >
          Save
        </Button>
      </Tooltip>
    </Grid>
  );
}
AnnotationFormFooter.propTypes = {
  closeFormCompanionWindow: PropTypes.func.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
};

export default AnnotationFormFooter;
