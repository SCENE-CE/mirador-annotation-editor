import React from 'react';
import Typography from '@mui/material/Typography';
import { Button, Grid } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import ImageFormField from './AnnotationFormOverlay/ImageFormField';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import ImageFormSection from './ImageFormSection';

/**
 * Image Comment template
 * @param annoState
 * @param commentingType
 * @param currentTime
 * @param manifestType
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
    manifestType,
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
        manifestType={manifestType}
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
  templateType: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
  manifestType: PropTypes.string.isRequired,
  setAnnoState: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};
