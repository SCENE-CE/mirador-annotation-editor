import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'draft-js/lib/uuid';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import AnnotationFormFooter from './AnnotationFormFooter';
import {
  maeTargetToIiifTarget,
  template,
} from '../AnnotationFormUtils';
import { getKonvaAsDataURL, getSvg } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';

/** Form part for edit annotation content and body */
function TextCommentTemplate(
  {
    annotation,
    currentTime,
    manifestType,
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
  } else if (maeAnnotation.maeData.target.drawingState && typeof maeAnnotation.maeData.target.drawingState === 'string') {
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

  const updateTargetState = (target) => {
    const newMaeData = annotationState.maeData;
    newMaeData.target = target;
    setAnnotationState({
      ...annotationState,
      maeData: newMaeData,
    });
  };

  const saveFunction = () => {
    // Iterate over all canvases and save the annotation, then close the form

    const promises = canvases.map(async (canvas) => {
      // Adapt target to the canvas
      // eslint-disable-next-line no-param-reassign
      console.log(annotation.maeData);
      annotationState.maeData.target.svg = await getSvg(windowId);
      // annotationState.maeData.target.dataUrl = await getKonvaAsDataURL(windowId);
      annotationState.target = maeTargetToIiifTarget(annotationState.maeData.target, canvas.id);
      annotationState.maeData.target.drawingState = JSON.stringify(annotationState.maeData.target.drawingState);
      annotationState.maeData.target.svg = JSON.stringify(annotationState.maeData.target);
      console.log('annotationState', annotationState.target);
      // delete annotationState.maeData.target;
      return saveAnnotation(annotationState, canvas.id);
    });
    Promise.all(promises).then(() => {
      closeFormCompanionWindow();
    });
  };

  useEffect(() => {

  }, [annotationState.maeData.target]);

  return (
    <div style={{ padding: '5px' }}>
      <TextFormSection
        annoHtml={annotationState.body.value}
        updateAnnotationBody={updateAnnotationTextualBodyValue}
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

TextCommentTemplate.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  annotation: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  canvases: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeFormCompanionWindow: PropTypes.func.isRequired,
  currentTime: PropTypes.number.isRequired,
  manifestType: PropTypes.string.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default TextCommentTemplate;
