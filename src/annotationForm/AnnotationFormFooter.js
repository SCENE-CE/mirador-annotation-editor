import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  saveAnnotationInEachCanvas,
} from '../AnnotationCreationUtils';
import { removeHTMLTags, secondsToHMS } from '../utils';
import {
  getKonvaAsDataURL,
} from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';

const StyledButtonDivSaveOrCancel = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
}));

/** Annotation form footer, save or cancel the edition/creation of an annotation */
function AnnotationFormFooter({
  annotation,
  canvases,
  closeFormCompanionWindow,
  config,
  drawingState,
  receiveAnnotation,
  resetStateAfterSave,
  state,
  windowId,
}) {
  /**
   * Validate form and save annotation
   */
  const submitAnnotationForm = async (e) => {
    e.preventDefault();
    // TODO Possibly problem of syncing
    // TODO Improve this code
    // If we are in edit mode, we have the transformer on the stage saved in the annotation
    /* if (viewTool === OVERLAY_VIEW && state.activeTool === 'edit') {
      setState((prevState) => ({
        ...prevState,
        activeTool: 'cursor',
      }));
      return;
    } */

    const {
      textBody,
      xywh,
      tstart,
      tend,
      manifestNetwork,
    } = state;

    // Temporal target of the annotation
    const target = {
      t: (tstart && tend) ? `${tstart},${tend}` : null,
      xywh, // TODO retrouver calcul de xywh
    };

    let annotationText;
    if (textBody.length == 0 || removeHTMLTags(textBody).length == 0) {
      if (target.t) {
        annotationText = `${new Date().toLocaleString()} - ${secondsToHMS(tstart)} -> ${secondsToHMS(tend)}`;
      } else {
        annotationText = new Date().toLocaleString();
      }
    } else {
      annotationText = textBody;
    }

    let id = annotation?.id ? annotation.id : `https://${uuid()}`;
    id = id.split('#')[0];
    if (manifestNetwork) {
      id = `${id}#${manifestNetwork}`;
    }

    const annotationToSaved = {
      body: {
        id: null, // Will be updated after
        type: 'Image',
        format: 'image/svg+xml',
        value: annotationText,
      },
      drawingState: JSON.stringify(drawingState),
      id,
      manifestNetwork,
      motivation: 'commenting',
      target: null,
      type: 'Annotation', // Will be updated in saveAnnotationInEachCanvas
    };

    const isNewAnnotation = !annotation;

    // Save jpg image of the drawing in a data url
    getKonvaAsDataURL(windowId).then((dataURL) => {
      console.log('dataURL:', dataURL);
      const annotation = { ...annotationToSaved };
      annotation.body.id = dataURL;
      saveAnnotationInEachCanvas(canvases, config, receiveAnnotation, annotation, target, isNewAnnotation);
      closeFormCompanionWindow();
      resetStateAfterSave();
    });
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
  annotation: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  canvases: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeFormCompanionWindow: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  drawingState: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  receiveAnnotation: PropTypes.func.isRequired,
  resetStateAfterSave: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  windowId: PropTypes.string.isRequired,
};

export default AnnotationFormFooter;
