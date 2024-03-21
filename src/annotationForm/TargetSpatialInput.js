import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { Grid } from '@mui/material';
import AnnotationDrawing from './AnnotationDrawing';
import { targetSVGToolState } from '../AnnotationCreationUtils';
import { mediaTypes, TARGET_VIEW } from '../AnnotationFormUtils';
import AnnotationFormOverlay from './AnnotationFormOverlay/AnnotationFormOverlay';
import { KONVA_MODE } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';
import { Debug } from './Debug';

/** Handle target spacial for annot templates * */
export function TargetSpatialInput({
  closeFormCompanionWindow,
  mediaType,
  overlay,
  setTargetDrawingState,
  targetDrawingState,
  windowId,
}) {
  // TODO the targetSVGToolSTate is not used. Why the defaultToolState is used?
  const [toolState, setToolState] = useState(targetSVGToolState);
  const [viewTool, setViewTool] = useState(TARGET_VIEW);

  const [scale, setScale] = useState(1);
  /** Change scale from container / canva */
  const updateScale = () => {
    setScale(overlay.containerWidth / overlay.canvasWidth);
  };

  const [drawingState, setDrawingState] = useState({
    ...targetDrawingState,
    currentShape: null,
    isDrawing: false,
  });
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
    if (currentShape) {
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
    } else {
      setDrawingState({
        ...drawingState,
        currentShape,
      });
    }
  };
  const showSVGSelector = true;

  return (
    <Grid container direction="column">
      { showSVGSelector && (
        <Grid item container direction="column">
          <Typography variant="subFormSectionTitle">SVG selection</Typography>
          <Grid item direction="row" spacing={2}>
            <AnnotationDrawing
              scale={scale}
              closed={toolState.closedMode === 'closed'}
              windowId={windowId}
              player={player}
            // we need to pass the width and height of the image to the annotation drawing component
              width={overlay ? overlay.containerWidth : 1920}
              height={overlay ? overlay.containerHeight : 1080}
              originalWidth={overlay ? overlay.canvasWidth : 1920}
              originalHeight={overlay ? overlay.canvasHeight : 1080}
              updateScale={updateScale}
              setColorToolFromCurrentShape={() => {}}
              drawingState={drawingState}
              overlay={overlay}
              updateCurrentShapeInShapes={updateCurrentShapeInShapes}
              setDrawingState={setDrawingState}
              tabView="edit" // TODO change
              showStyleTools
              mediaType={mediaType}
              closeFormCompanionWindow={closeFormCompanionWindow}
              displayMode={KONVA_MODE.TARGET}
              isMouseOverSave={false} // TODO remove
              toolState={toolState}
            />

            <AnnotationFormOverlay
              toolState={toolState}
              deleteShape={deleteShape}
              setToolState={setToolState}
              shapes={drawingState.shapes}
              currentShape={drawingState.currentShape}
              setViewTool={setViewTool}
              displayMode={KONVA_MODE.TARGET}
              updateCurrentShapeInShapes={updateCurrentShapeInShapes}
            />
          </Grid>
          <Grid item>
            <Debug
              overlay={overlay}
              scale={scale}
              drawingState={drawingState}
              displayMode={KONVA_MODE.TARGET}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

TargetSpatialInput.propTypes = {
  closeFormCompanionWindow: PropTypes.func.isRequired,
  mediaType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  overlay: PropTypes.object.isRequired,
  setTargetDrawingState: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  targetDrawingState: PropTypes.object.isRequired,
  windowId: PropTypes.string.isRequired
};
