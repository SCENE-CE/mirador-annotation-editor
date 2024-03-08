import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import AnnotationDrawing from './AnnotationDrawing';
import { defaultToolState, targetSVGToolState } from '../AnnotationCreationUtils';
import { manifestTypes, TARGET_VIEW } from '../AnnotationFormUtils';
import AnnotationFormOverlay from './AnnotationFormOverlay/AnnotationFormOverlay';

export function TargetSpatialInput({
  xywh, setXywh, svg, overlay, windowId, manifestType, onChange, targetDrawingState
}) {
  const [toolState, setToolState] = useState(targetSVGToolState);
  const [viewTool, setViewTool] = useState(TARGET_VIEW);

  const initDrawingState = () => {
    if(targetDrawingState) {
      return JSON.parse(targetDrawingState);
    }

    return {
      currentShape: null,
      isDrawing: false,
      shapes: [],
    };
  };

  const [drawingState, setDrawingState] = useState(initDrawingState());

  const [scale, setScale] = useState(1);
  /** Change scale from container / canva */
  const updateScale = () => {
    setScale(overlay.containerWidth / overlay.canvasWidth);
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

  let player;
  if (manifestType === manifestTypes.VIDEO) {
    player = VideosReferences.get(windowId);
  }
  if (manifestType === manifestTypes.IMAGE) {
    player = OSDReferences.get(windowId);
  }

  // TODO save drawing state on change

  return (
    <>
      <p>TargetSpatialInput</p>
      ;
      <p>{xywh}</p>
      <Typography variant="h6">Target SVG</Typography>
      <AnnotationDrawing
        scale={scale}
        activeTool={toolState.activeTool}
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
        setColorToolFromCurrentShape={() => {}}
        drawingState={drawingState}
        overlay={overlay}
        setDrawingState={setDrawingState}
        tabView="edit" // TODO change
      />
      <AnnotationFormOverlay
        toolState={toolState}
        deleteShape={deleteShape}
        setToolState={setToolState}
        shapes={drawingState.shapes}
        currentShape={drawingState.currentShape}
        setViewTool={setViewTool}
      />
    </>

  );
}

TargetSpatialInput.propTypes = {
  setXywh: PropTypes.func.isRequired,
  xywh: PropTypes.string.isRequired,
};
