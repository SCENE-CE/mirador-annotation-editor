import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import AnnotationFormFooter from './AnnotationFormFooter';
import { manifestTypes, template } from '../AnnotationFormUtils';
import uuid from 'draft-js/lib/uuid';

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
  },
) {

  console.log('annotation', annotation);

  let maeAnnotation = annotation;

  if (maeAnnotation.id) {

  } else {
    // If the annotation does not have maeData, the annotation was not created with mae
    maeAnnotation = {
      body: {
        id: uuid(),
        type: 'TextualBody',
        value: '',
      },
      maeData: {
        templateType: template.TEXT_TYPE,
      },
    };
  }

  const [annotationState, setAnnotationState] = useState(maeAnnotation);
  const [targetState, setTargetState] = useState({});

  /**
     * Update the annotation's Body
     * */
  const updateAnnotationTextBody = (newBody) => {
    setAnnotationState({
      ...annotationState,
      textBody: newBody,
    });
  };

  const updateTargetState = (newTarget) => {
    setTargetState(newTarget);
  }

  const saveFunction = () => {
    saveAnnotation(annotationState);
  }

  return (
    <div style={{ padding: '5px' }}>
      <TextFormSection
        annoHtml={annotationState.body.value}
        updateAnnotationBody={updateAnnotationTextBody}
      />
      <TargetFormSection
        currentTime={currentTime}
        onChange={updateTargetState}
        setCurrentTime={setCurrentTime}
        setSeekTo={setSeekTo}
        spatialTarget={false}
        target={targetState}
        //timeTarget={manifestType === manifestTypes.VIDEO}
        timeTarget={false}
        windowId={windowId}
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
};

export default TextCommentTemplate;
