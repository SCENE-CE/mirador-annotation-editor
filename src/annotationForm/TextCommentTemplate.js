import React from 'react';
import PropTypes from 'prop-types';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';

/** Form part for edit annotation content and body */
function TextCommentTemplate(
  {
    annoState,
    templateType,
    currentTime,
    manifestType,
    setAnnoState,
    setCurrentTime,
    setSeekTo,
    windowId,
    setSaveFunction,
  },
) {
  /**
     * Update the annotation's Body
     * */
  const updateAnnotationTextBody = (newBody) => {
    setAnnoState({
      ...annoState,
      textBody: newBody,
    });
  };

  return (
    <div style={{ padding: '5px' }}>
      <TextFormSection
        annoHtml={annoState.textBody}
        updateAnnotationBody={updateAnnotationTextBody}
      />
      <TargetFormSection
        currentTime={currentTime}
        setAnnoState={setAnnoState}
        annoState={annoState}
        setCurrentTime={setCurrentTime}
        setSeekTo={setSeekTo}
        windowId={windowId}
        commentingType={templateType}
        manifestType={manifestType}
        spatialTarget={false}
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
};

export default TextCommentTemplate;
