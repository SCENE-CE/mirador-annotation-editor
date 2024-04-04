import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import AnnotationDrawing from './AnnotationDrawing';
import { targetSVGToolState } from '../AnnotationCreationUtils';
import { TARGET_VIEW } from '../AnnotationFormUtils';
import AnnotationFormOverlay from './AnnotationFormOverlay/AnnotationFormOverlay';
import { KONVA_MODE } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';
import { Debug } from './Debug';
import { playerReferences } from '../playerReferences';

/** Handle target spacial for annot templates * */
export function TargetSpatialInput({
  closeFormCompanionWindow,
  debugMode,
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
    setScale(playerReferences.getContainerWidth() / playerReferences.getCanvasWidth());
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

  /** handle the update of currentShape into drawingState */
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
              windowId={windowId}
            // we need to pass the width and height of the image to the annotation drawing component
              width={playerReferences.getContainerWidth()}
              height={playerReferences.getContainerHeight()}
              originalWidth={playerReferences.getCanvasWidth()}
              originalHeight={playerReferences.getCanvasHeight()}
              updateScale={updateScale}
              setColorToolFromCurrentShape={() => {}}
              drawingState={drawingState}
              updateCurrentShapeInShapes={updateCurrentShapeInShapes}
              setDrawingState={setDrawingState}
              tabView="edit" // TODO change
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
          {debugMode && (
          <Grid item>
            <Debug
              scale={scale}
              drawingState={drawingState}
              displayMode={KONVA_MODE.TARGET}
            />
          </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
}

TargetSpatialInput.propTypes = {
  closeFormCompanionWindow: PropTypes.func.isRequired,
  setTargetDrawingState: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  targetDrawingState: PropTypes.object.isRequired,
  windowId: PropTypes.string.isRequired,
};
