import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'draft-js/lib/uuid';
import { Grid } from '@mui/material';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import AnnotationFormFooter from './AnnotationFormFooter';
import { TEMPLATE } from './AnnotationFormUtils';
import { convertAnnotationStateToBeSaved, maeTargetToIiifTarget } from '../IIIFUtils';
import { getSvg, resizeKonvaStage } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';
import { playerReferences } from '../playerReferences';

/** Form part for edit annotation content and body */
function TextCommentTemplate(
  {
    annotation,
    closeFormCompanionWindow,
    currentTime,
    debugMode,
    getMediaAudio,
    saveAnnotation,
    windowId,
  },
) {
  let maeAnnotation = annotation;

  if (!maeAnnotation.id) {
    // If the annotation does not have maeData, the annotation was not created with mae
    maeAnnotation = {
      body: {
        id: uuid(),
        type: 'TextualBody',
        value: '',
      },
      maeData: {
        target: null,
        templateType: TEMPLATE.TEXT_TYPE,
      },
      motivation: 'commenting',
      target: null,
    };
  } else if (maeAnnotation.maeData.target.drawingState && typeof maeAnnotation.maeData.target.drawingState === 'string') {
    // eslint-disable-next-line max-len
    maeAnnotation.maeData.target.drawingState = JSON.parse(maeAnnotation.maeData.target.drawingState);
  }

  const [annotationState, setAnnotationState] = useState(maeAnnotation);

  /**
   * Update the annotation's Body
   * */
  const updateAnnotationTextualBodyValue = (newTextValue) => {
    const newBody = annotationState.body;
    newBody.value = newTextValue;
    setAnnotationState({
      ...annotationState,
      body: newBody,
    });
  };

  /** this code update annotationState with maeDate * */
  const updateTargetState = (target) => {
    const newMaeData = annotationState.maeData;
    newMaeData.target = target;
    setAnnotationState({
      ...annotationState,
      maeData: newMaeData,
    });
  };

  /** Save function * */
  const saveFunction = () => {
    resizeKonvaStage(
      windowId,
      playerReferences.getWidth(),
      playerReferences.getHeight(),
      1 / playerReferences.getScale(),
    );
    saveAnnotation(annotationState);
  };

  useEffect(() => {

  }, [annotationState.maeData.target]);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>

        <TextFormSection
          annoHtml={annotationState.body.value}
          updateAnnotationBody={updateAnnotationTextualBodyValue}
        />
      </Grid>
      <Grid item>
        <TargetFormSection
          currentTime={currentTime}
          onChangeTarget={updateTargetState}
          target={annotationState.maeData.target}
          windowId={windowId}
          timeTarget
          spatialTarget
          closeFormCompanionWindow={closeFormCompanionWindow}
          getMediaAudio={getMediaAudio}
          debugMode={debugMode}
        />
      </Grid>
      <Grid item>

        <AnnotationFormFooter
          closeFormCompanionWindow={closeFormCompanionWindow}
          saveAnnotation={saveFunction}
        />
      </Grid>
    </Grid>
  );
}

TextCommentTemplate.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  annotation: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  canvases: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeFormCompanionWindow: PropTypes.func.isRequired,
  currentTime: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  getMediaAudio: PropTypes.object.isRequired,
  mediaType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  overlay: PropTypes.object.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default TextCommentTemplate;
