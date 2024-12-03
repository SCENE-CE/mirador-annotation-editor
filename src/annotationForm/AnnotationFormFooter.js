import { Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { exportStageSVG } from 'react-konva-to-svg';
import { playerReferences } from '../playerReferences';
import { getKonvaStage, resizeKonvaStage } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';
import {
  rgbaToObj,
} from '../../es/annotationForm/AnnotationFormOverlay/AnnotationFormOverlayToolOptions';

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
    const stage = getKonvaStage(windowId);

    console.log('Stage selected', stage.toJSON());

    stage.find('Transformer').forEach((node) => node.destroy());
    console.log('Stage selected after destroy', stage.toJSON());
    stage.draw();

    resizeStage();
    console.log('Stage selected after resize', stage.toJSON());

    stage.find('Rect').map((node) => {
    /*   node.x(Math.floor(node.x() / 100));
      node.y(Math.floor(node.y() / 100));
      node.width(Math.floor(node.width() / 100));
      node.height(Math.floor(node.height() / 100)); */
      const {
        r, g, b, a,
      } = rgbaToObj(node.stroke());

      node.strokeScaleEnabled(true);
      node.stroke(`rgb(${r},${g},${b}`);
    });

    stage.draw();

    console.log('Stage selected after draw', stage.toJSON());

    let result = 'toto';
    result = await exportStageSVG(stage, false, {
      onBefore: ([stage, layer]) => {},
      onAfter: ([stage, layer]) => {},
    });
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
