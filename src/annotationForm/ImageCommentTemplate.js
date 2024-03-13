import React from 'react';
import PropTypes from 'prop-types';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import ImageFormSection from './ImageFormSection';

/**
 * Image Comment template
 * @param annoState
 * @param commentingType
 * @param currentTime
 * @param mediaType
 * @param setAnnoState
 * @param setCurrentTime
 * @param setSeekTo
 * @param windowId
 * @returns {Element}
 * @constructor
 */
export default function ImageCommentTemplate(
  {
    annoState,
    templateType,
    currentTime,
    mediaType,
    setAnnoState,
    setCurrentTime,
    setSeekTo,
    windowId,
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

  /**
     * Update Annotation state with the image URL
     * @param newImage
     */
  const updateAnnotationImage = (newImage) => {
    setAnnoState({
      ...annoState,
      image: newImage,
    });
  };
  return (
    <>
      <ImageFormSection
        annoState={annoState}
        onChange={updateAnnotationImage}
      />
      <TextFormSection
        annoHtml={annoState.textBody}
        updateAnnotationBody={updateAnnotationTextBody}
      />
      <TargetFormSection
        setAnnoState={setAnnoState}
        annoState={annoState}
        setCurrentTime={setCurrentTime}
        setSeekTo={setSeekTo}
        windowId={windowId}
        commentingType={templateType}
        mediaType={mediaType}
        currentTime={currentTime}
        spatialTarget={false}
      />
    </>
  );
}

ImageCommentTemplate.propTypes = {
  annoState: PropTypes.shape(
    {
      textBody: PropTypes.string,
    },
  ).isRequired,
  currentTime: PropTypes.number.isRequired,
  mediaType: PropTypes.string.isRequired,
  setAnnoState: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  templateType: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};
