import { Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { exportStageSVG } from 'react-konva-to-svg';
import { playerReferences } from '../playerReferences';
import { resizeKonvaStage } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';

/** Annotation form footer, save or cancel the edition/creation of an annotation */
function AnnotationFormFooter({
  closeFormCompanionWindow,
  saveAnnotation,
  windowId,
}) {
  /**
   * Validate form and save annotation
   */
  const submitAnnotationForm = async (e) => {
    resizeStage();
    saveAnnotation();
  };

  /**
   * Resize the Konva stage to the true size of the image, trigger by UI
   */
  const resizeStage = () => {
    // Resize Konva to the true size of the image
    resizeKonvaStage(
      windowId,
      playerReferences.getWidth(),
      playerReferences.getHeight(),
      1 / playerReferences.getScale(),
    );
  };

  /**
   * Resize the Konva stage to the true size of the image, trigger by UI
   */
  const unResizeStage = () => {
    // We resize the stage to the previous displayed image size
    resizeKonvaStage(
      windowId,
      playerReferences.getDisplayedImageWidth(),
      playerReferences.getDisplayedImageHeight(),
      1,
    );
  };

  /**
   * Trigger bu UI for debug purpose
   * @param e
   * @returns {Promise<void>}
   */
  const handleSVG = async (e) => {
    const { stages } = window.Konva;
    stages.forEach((stage) => {
      console.log('Stages', stage.toJSON());
    });
    const stage = window.Konva.stages.find((s) => s.attrs.id === windowId);

    console.log('Stage sekected', stage.toJSON());
    // stage.find('Transformer').forEach((tr) => {tr.destroy();});
    // console.log('Stage sekected', stage.toJSON());
    const result = await exportStageSVG(stage, false);
    console.log(result);
  };

  return (
    <Grid container item spacing={1} justifyContent="flex-end">
      <Button onClick={closeFormCompanionWindow}>
        Cancel
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSVG}
      >
        SVG
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={resizeStage}
      >
        Resize stage
      </Button>
      {' '}
      <Button
        variant="contained"
        color="primary"
        onClick={unResizeStage}
      >
        UnResize stage
      </Button>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={submitAnnotationForm}
      >
        Save
      </Button>
    </Grid>
  );
}
AnnotationFormFooter.propTypes = {
  closeFormCompanionWindow: PropTypes.func.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
};

export default AnnotationFormFooter;
