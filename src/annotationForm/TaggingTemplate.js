import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import uuid from 'draft-js/lib/uuid';
import Typography from '@mui/material/Typography';
import AnnotationFormFooter from './AnnotationFormFooter';
import { maeTargetToIiifTarget, template } from '../AnnotationFormUtils';
import TargetFormSection from './TargetFormSection';

export default function TaggingTemplate(
  {
    annotation,
    currentTime,
    manifestType,
    overlay,
    setCurrentTime,
    setSeekTo,
    windowId,
    canvases,
    closeFormCompanionWindow,
    saveAnnotation,
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

  const updateTargetState = (target) => {
    const newMaeData = annotationState.maeData;
    newMaeData.target = target;
    setAnnotationState({
      ...annotationState,
      maeData: newMaeData,
    });
  };

  /**Save function **/
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

  return (
    <div>
      <Typography variant="formSectionTitle">Tag</Typography>
      <TextField
        id="outlined-basic"
        label="Your tag here :"
        defaultValue=""
        variant="outlined"
      />
      <TargetFormSection
        currentTime={currentTime}
        manifestType={manifestType}
        onChangeTarget={updateTargetState}
        setCurrentTime={setCurrentTime}
        setSeekTo={setSeekTo}
        spatialTarget
        target={annotationState.maeData.target}
        timeTarget
        windowId={windowId}
        overlay={overlay}
      />
      <AnnotationFormFooter
        closeFormCompanionWindow={closeFormCompanionWindow}
        saveAnnotation={saveFunction}
      />
    </div>
  );
}
