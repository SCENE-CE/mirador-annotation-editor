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
    annoState,
    currentTime,
    manifestType,
    setAnnoState,
    setCurrentTime,
    setSeekTo,
    windowId,
    saveAnnotation,
    closeFormCompanionWindow,
  },
) {

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
        annoHtml={annoState.textBody}
        updateAnnotationBody={updateAnnotationTextBody}
      />
      <TargetFormSection
        onChange={updateTargetState}
        currentTime={currentTime}
        setAnnoState={setAnnoState}
        annoState={annoState}
        setCurrentTime={setCurrentTime}
        setSeekTo={setSeekTo}
        windowId={windowId}
        spatialTarget={false}
        timeTarget={manifestType === manifestTypes.VIDEO}
      />
      <AnnotationFormFooter
        closeFormCompanionWindow={closeFormCompanionWindow}
        saveAnnotation={saveFunction}
      />
    </div>
  );
}

TextCommentTemplate.propTypes = {
  annoState: PropTypes.shape(
    {
      textBody: PropTypes.string,
    },
  ).isRequired,
  currentTime: PropTypes.number.isRequired,
  manifestType: PropTypes.string.isRequired,
  setAnnoState: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  templateType: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  closeFormCompanionWindow: PropTypes.func.isRequired,
};

export default TextCommentTemplate;
