import { Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { exportStageSVG } from 'react-konva-to-svg';
import { playerReferences } from '../playerReferences';
import { getKonvaStage, resizeKonvaStage } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';
import {
  rgbaToObj,
} from './AnnotationFormOverlay/AnnotationFormOverlayToolOptions';

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
      <Button onClick={closeFormCompanionWindow}>
        Cancel
      </Button>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={saveAnnotation}
      >
        Save
      </Button>
    </Grid>
  );
}
AnnotationFormFooter.propTypes = {
  closeFormCompanionWindow: PropTypes.func.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default AnnotationFormFooter;
