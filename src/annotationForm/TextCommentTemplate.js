import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'draft-js/lib/uuid';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import AnnotationFormFooter from './AnnotationFormFooter';
import {
  extractTargetFromAnnotation,
  maeTargetToIiifTarget,
  manifestTypes,
  template
} from '../AnnotationFormUtils';

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
  },
) {
  console.log('annotation', annotation);

  let maeAnnotation = annotation;

  if (maeAnnotation.id) {

  } else {
    // If the annotation does not have maeData, the annotation was not created with mae
    maeAnnotation = {
      motivation: 'commenting',
      body: {
        id: uuid(),
        type: 'TextualBody',
        value: '',
      },
      maeData: {
        templateType: template.TEXT_TYPE,
        target: null,
      },
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
      annotationState.target = maeTargetToIiifTarget(annotationState.maeTarget, canvas.id);
      delete annotationState.maeTarget;
      saveAnnotation(annotationState, canvas.id);
    });
    closeFormCompanionWindow();
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
        onChangeTarget={updateTargetState}
        setCurrentTime={setCurrentTime}
        setSeekTo={setSeekTo}
        spatialTarget={false}
        target={annotationState.maeData.target}
        timeTarget={true}
        windowId={windowId}
        manifestType={manifestType}
      />
      <AnnotationFormFooter
        closeFormCompanionWindow={closeFormCompanionWindow}
        saveAnnotation={saveFunction}
      />
    </div>
  );
}

TextCommentTemplate.propTypes = {
  currentTime: PropTypes.number.isRequired,
  manifestType: PropTypes.string.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  closeFormCompanionWindow: PropTypes.func.isRequired,
  canvases: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TextCommentTemplate;
