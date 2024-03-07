import React from 'react';
import PropTypes from 'prop-types';
import AnnotationFormOverlay from './AnnotationFormOverlay/AnnotationFormOverlay';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';

/**
 * Template for target and too of drawing Template
 * @param annoState
 * @param commentingType
 * @param currentShape
 * @param currentTime
 * @param deleteShape
 * @param manifestType
 * @param setAnnoState
 * @param setCurrentTime
 * @param setSeekTo
 * @param setToolState
 * @param shapes
 * @param toolState
 * @param windowId
 * @returns {Element}
 * @constructor
 */
export default function DrawingTemplateForm(
  {
    annoState,
    commentingType,
    currentShape,
    currentTime,
    deleteShape,
    manifestType,
    setAnnoState,
    setCurrentTime,
    setSeekTo,
    setToolState,
    setViewTool,
    shapes,
    toolState,
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
  return (
    <>

    </>
  );
}

DrawingTemplateForm.propTypes = {
  annoState: PropTypes.shape(
    {
      textBody: PropTypes.string,
    },
  ).isRequired,
  commentingType: PropTypes.string.isRequired,
  currentShape: PropTypes.shape({
    id: PropTypes.string,
    rotation: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    type: PropTypes.string,
    url: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  currentTime: PropTypes.number.isRequired,
  deleteShape: PropTypes.shape({
    id: PropTypes.string,
    rotation: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    type: PropTypes.string,
    url: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  manifestType: PropTypes.string.isRequired,
  setAnnoState: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  setToolState: PropTypes.func.isRequired,
  setViewTool: PropTypes.func.isRequired,
  shapes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      rotation: PropTypes.number,
      scaleX: PropTypes.number,
      scaleY: PropTypes.number,
      type: PropTypes.string,
      url: PropTypes.string,
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  toolState: PropTypes.object.isRequired,
  windowId: PropTypes.string.isRequired,
};
