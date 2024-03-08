import React, { useEffect, useState } from 'react';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import PropTypes from 'prop-types';
import uuid from 'draft-js/lib/uuid';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import AnnotationDrawing from './AnnotationDrawing';

import {
  maeTargetToIiifTarget,
  manifestTypes,
  TARGET_VIEW,
  template,
} from '../AnnotationFormUtils';
import { defaultToolState } from '../AnnotationCreationUtils';
import AnnotationFormOverlay from './AnnotationFormOverlay/AnnotationFormOverlay';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import AnnotationFormFooter from './AnnotationFormFooter';

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
  // TODO Do something with this
  /** **************************************
   *  Form stuff
   *************************************** */

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
        target: null, // Add full target
        templateType: template.KONVA_TYPE,
        drawingState: null,
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

  let player;
  if (manifestType === manifestTypes.VIDEO) {
    player = VideosReferences.get(windowId);
  }
  if (manifestType === manifestTypes.IMAGE) {
    player = OSDReferences.get(windowId);
  }

  const saveFunction = () => {
    canvases.forEach(async (canvas) => {
      // Adapt target to the canvas
      // eslint-disable-next-line no-param-reassign
      annotationState.target = maeTargetToIiifTarget(annotationState.maeData.target, canvas.id);
      annotationState.maeData.drawingState = JSON.stringify(drawingState);
      // delete annotationState.maeData.target;
      saveAnnotation(annotationState, canvas.id);
    });
    closeFormCompanionWindow();
  };

  const updateAnnotationTextualBodyValue = (newTextValue) => {
    const newBody = annotationState.body;
    newBody.value = newTextValue;
    setAnnotationState({
      ...annotationState,
      body: newBody,
    });
  };

  /** ****************************************
   * Drawing stuff
   ***************************************** */
  const [toolState, setToolState] = useState(defaultToolState);

  const initDrawingState = () => {
    if (annotationState.maeData.drawingState) {
      return JSON.parse(annotationState.maeData.drawingState);
    }
    return {
      currentShape: null,
      isDrawing: false,
      shapes: [],
    };
  };

  const [drawingState, setDrawingState] = useState(initDrawingState());

  const [scale, setScale] = useState(1);
  const [isMouseOverSave, setIsMouseOverSave] = useState(false);
  const [viewTool, setViewTool] = useState(TARGET_VIEW);

  useEffect(() => {

  }, [toolState.fillColor, toolState.strokeColor, toolState.strokeWidth]);

  /** Change scale from container / canva */
  const updateScale = () => {
    setScale(overlay.containerWidth / overlay.canvasWidth);
  };

  // TODO Check how to use it

  /*   /!**
     * Update annoState with the svg and position of kanva item
     * @param svg
     * @param xywh
     *!/
  const updateGeometry = ({ svg, xywh }) => {
    setAnnoState((prevState) => ({
      ...prevState,
      svg,
      xywh,
    }));
  }; */

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
      Check the width height originalW originalW */}
      <AnnotationDrawing
        scale={scale}
        activeTool={toolState.activeTool}
        annotation={annotation}
        fillColor={toolState.fillColor}
        strokeColor={toolState.strokeColor}
        strokeWidth={toolState.strokeWidth}
        closed={toolState.closedMode === 'closed'}
        windowId={windowId}
        player={player}
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
        overlay={overlay}
        setDrawingState={setDrawingState}
        tabView={viewTool}
      />
      <AnnotationFormOverlay
        toolState={toolState}
        deleteShape={deleteShape}
        setToolState={setToolState}
        shapes={drawingState.shapes}
        currentShape={drawingState.currentShape}
        setViewTool={setViewTool}
        showStyleTools
      />
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
        spatialTarget={false}
        target={annotationState.maeData.target}
        timeTarget
        windowId={windowId}
      />
      <AnnotationFormFooter
        closeFormCompanionWindow={closeFormCompanionWindow}
        saveAnnotation={saveFunction}
      />
    </>
  );
}

DrawingTemplate.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
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
  currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]).isRequired,
  manifestType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  overlay: PropTypes.object.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  templateType: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};
