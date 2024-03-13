import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'draft-js/lib/uuid';
import { Grid } from '@mui/material';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import AnnotationFormFooter from './AnnotationFormFooter';
import {
  maeTargetToIiifTarget,
  template,
} from '../AnnotationFormUtils';

/** Form part for edit annotation content and body */
function TextCommentTemplate(
  {
    annotation,
    currentTime,
    mediaType,
    setCurrentTime,
    setSeekTo,
    windowId,
    saveAnnotation,
    closeFormCompanionWindow,
    canvases,
    overlay,
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
        templateType: template.TEXT_TYPE,
      },
      motivation: 'commenting',
      target: null,
    };
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

  const updateTargetState = (target) => {
    const newMaeData = annotationState.maeData;
    newMaeData.target = target;
    setAnnotationState({
      ...annotationState,
      maeData: newMaeData,
    });
  };

  const saveFunction = () => {
    canvases.forEach(async (canvas) => {
      // Adapt target to the canvas
      // eslint-disable-next-line no-param-reassign
      annotationState.target = maeTargetToIiifTarget(annotationState.maeData.target, canvas.id);
      // delete annotationState.maeData.target;
      saveAnnotation(annotationState, canvas.id);
    });
    closeFormCompanionWindow();
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
          mediaType={mediaType}
          onChangeTarget={updateTargetState}
          setCurrentTime={setCurrentTime}
          setSeekTo={setSeekTo}
          spatialTarget
          target={annotationState.maeData.target}
          timeTarget
          windowId={windowId}
          overlay={overlay}
          closeFormCompanionWindow={closeFormCompanionWindow}
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
  mediaType: PropTypes.string.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default TextCommentTemplate;
