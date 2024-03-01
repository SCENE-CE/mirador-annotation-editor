import React, { useEffect, useState } from 'react';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import PropTypes from 'prop-types';
import AnnotationDrawing from './AnnotationDrawing';
import DrawingTemplateForm from './DrawingTemplateForm';
import { manifestTypes, TARGET_VIEW } from '../AnnotationFormUtils';
import { defaultToolState } from '../AnnotationCreationUtils';
/**
 * Template for Konva annotations (drawing)
 * @param annotation
 * @param currentTime
 * @param windowId
 * @param mediaVideo
 * @param annoState
 * @param overlay
 * @param setAnnoState
 * @param setCurrentTime
 * @param setSeekTo
 * @param commentingType
 * @param manifestType
 * @returns {Element}
 * @constructor
 */
export default function DrawingTemplate(
  {
    annoState,
    annotation,
    templateType,
    currentTime,
    manifestType,
    mediaVideo,
    overlay,
    setAnnoState,
    setCurrentTime,
    setSeekTo,
    windowId,
  },
) {
  const [toolState, setToolState] = useState(defaultToolState);
  const [drawingState, setDrawingState] = useState({
    currentShape: null,
    isDrawing: false,
    shapes: [],
  });

  if (annoState.drawingState) {
    setDrawingState(annoState.drawingState);
  }
  const [scale, setScale] = useState(1);
  const [isMouseOverSave, setIsMouseOverSave] = useState(false);
  const [viewTool, setViewTool] = useState(TARGET_VIEW);

  useEffect(() => {

  }, [toolState.fillColor, toolState.strokeColor, toolState.strokeWidth]);

  /** Change scale from container / canva */
  const updateScale = () => {
    setScale(overlay.containerWidth / overlay.canvasWidth);
  };

  /**
     * Update annoState with the svg and position of kanva item
     * @param svg
     * @param xywh
     */
  const updateGeometry = ({ svg, xywh }) => {
    setAnnoState((prevState) => ({
      ...prevState,
      svg,
      xywh,
    }));
  };

  /**
     * Updates the tool state by merging the current color state with the existing tool state.
     * @param {object} colorState - The color state to be merged with the tool state.
     * @returns {void}
     */
  const setColorToolFromCurrentShape = (colorState) => {
    setToolState((prevState) => ({
      ...prevState,
      ...colorState,
    }));
  };

  /**
   * Deletes a shape from the drawing state based on its ID.
   * If no shape ID is provided, clears all shapes from the drawing state.
   *
   * @param {string} [shapeId] - The ID of the shape to delete.
   * If not provided, clears all shapes.
   */
  const deleteShape = (shapeId) => {
    if (!shapeId) {
      setDrawingState((prevState) => ({
        ...prevState,
        currentShape: null,
        shapes: [],
      }));
    } else {
      setDrawingState((prevState) => ({
        ...prevState,
        currentShape: null,
        shapes: prevState.shapes.filter((shape) => shape.id !== shapeId),
      }));
    }
  };

  return (
    <>
      {/* Rename AnnotationDrawing in Drawing Stage */}
      {/* Check the useless props : annotation ?
      Check the width height originalW originalW*/}
      <AnnotationDrawing
        scale={scale}
        activeTool={toolState.activeTool}
        annotation={annotation}
        fillColor={toolState.fillColor}
        strokeColor={toolState.strokeColor}
        strokeWidth={toolState.strokeWidth}
        closed={toolState.closedMode === 'closed'}
        updateGeometry={updateGeometry}
        windowId={windowId}
        player={manifestType === manifestTypes.VIDEO ? mediaVideo : OSDReferences.get(windowId)}
            // we need to pass the width and height of the image to the annotation drawing component
        width={overlay ? overlay.containerWidth : 1920}
        height={overlay ? overlay.containerHeight : 1080}
        originalWidth={overlay ? overlay.canvasWidth : 1920}
        originalHeight={overlay ? overlay.canvasHeight : 1080}
        updateScale={updateScale}
        imageEvent={toolState.imageEvent}
        setColorToolFromCurrentShape={setColorToolFromCurrentShape}
        drawingState={drawingState}
        isMouseOverSave={isMouseOverSave}
        mediaVideo={mediaVideo}
        setDrawingState={setDrawingState}
        tabView={viewTool}
      />
      <DrawingTemplateForm
        mediaIsVideo={manifestType === manifestTypes.VIDEO}
        setCurrentTime={setCurrentTime}
        setSeekTo={setSeekTo}
        setAnnoState={setAnnoState}
        windowId={windowId}
        manifestType={manifestType}
        commentingType={templateType}
        toolState={toolState}
        setToolState={setToolState}
        shapes={drawingState.shapes}
        annoState={annoState}
        currentTime={currentTime}
        currentShape={drawingState.currentShape}
        deleteShape={deleteShape}
        setViewTool={setViewTool}
      />
    </>
  );
}

DrawingTemplate.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  annoState: PropTypes.object.isRequired,
  annotation: PropTypes.oneOfType([
    PropTypes.shape({
      body: PropTypes.shape({
        format: PropTypes.string,
        id: PropTypes.string,
        type: PropTypes.string,
        value: PropTypes.string,
      }),
      drawingState: PropTypes.string,
      id: PropTypes.string,
      manifestNetwork: PropTypes.string,
      motivation: PropTypes.string,
      target: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,
  templateType: PropTypes.string.isRequired,
  currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]).isRequired,
  manifestType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  mediaVideo: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  overlay: PropTypes.object.isRequired,
  setAnnoState: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};
