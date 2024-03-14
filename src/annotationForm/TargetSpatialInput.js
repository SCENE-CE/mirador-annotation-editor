import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import ToggleButton from '@mui/material/ToggleButton';
import { Grid, TextField } from '@mui/material';
import AnnotationDrawing from './AnnotationDrawing';
import { defaultToolState, OVERLAY_TOOL, targetSVGToolState } from '../AnnotationCreationUtils';
import { mediaTypes, TARGET_VIEW } from '../AnnotationFormUtils';
import AnnotationFormOverlay from './AnnotationFormOverlay/AnnotationFormOverlay';
import CursorIcon from '../icons/Cursor';

export function TargetSpatialInput({
  closeFormCompanionWindow,
  mediaType,
  onChange,
  overlay,
  setTargetDrawingState,
  setXywh,
  svg,
  targetDrawingState,
  windowId,
  xywh,
}) {
  const [toolState, setToolState] = useState(targetSVGToolState);
  const [viewTool, setViewTool] = useState(TARGET_VIEW);

  const [scale, setScale] = useState(1);
  /** Change scale from container / canva */
  const updateScale = () => {
    setScale(overlay.containerWidth / overlay.canvasWidth);
  };

  const [drawingState, setDrawingState] = useState(targetDrawingState);

  useEffect(() => {
    setTargetDrawingState({ drawingState });
  }, [drawingState.shapes]);

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
  if (mediaType === mediaTypes.VIDEO) {
    player = VideosReferences.get(windowId);
  }
  if (mediaType === mediaTypes.IMAGE) {
    player = OSDReferences.get(windowId);
  }
  const updateCurrentShapeInShapes = (currentShape) => {
    const index = drawingState.shapes.findIndex((s) => s.id === currentShape.id);

    if (index !== -1) {
      // eslint-disable-next-line max-len
      const updatedShapes = drawingState.shapes.map((shape, i) => (i === index ? currentShape : shape));
      setDrawingState({
        ...drawingState,
        currentShape,
        shapes: updatedShapes,
      });
    } else {
      setDrawingState({
        ...drawingState,
        currentShape,
        shapes: [...drawingState.shapes, currentShape],
      });
    }
  };
  const showSVGSelector = true;

  const TARGET_MODE = 'target';

  return (
    <Grid container direction="column">
      { showSVGSelector && (
        <Grid item container direction="column">
          <Typography variant="subFormSectionTitle">SVG selection</Typography>
          <Grid item direction="row" spacing={2}>
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
              updateCurrentShapeInShapes={updateCurrentShapeInShapes}
              setDrawingState={setDrawingState}
              tabView="edit" // TODO change
              showStyleTools
              mediaType={mediaType}
              closeFormCompanionWindow={closeFormCompanionWindow}
            />
            <AnnotationFormOverlay
              toolState={toolState}
              deleteShape={deleteShape}
              setToolState={setToolState}
              shapes={drawingState.shapes}
              currentShape={drawingState.currentShape}
              setViewTool={setViewTool}
              showStyleTools={false}
              displayMode={TARGET_MODE}
              updateCurrentShapeInShapes={updateCurrentShapeInShapes}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
