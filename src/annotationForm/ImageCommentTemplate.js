import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import { maeTargetToIiifTarget } from '../IIIFUtils';
import {
  TARGET_VIEW, template, defaultToolState,
} from './AnnotationFormUtils';
import { KONVA_MODE } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';
import AnnotationDrawing from './AnnotationFormOverlay/AnnotationDrawing';
import AnnotationFormOverlay from './AnnotationFormOverlay/AnnotationFormOverlay';
import AnnotationFormFooter from './AnnotationFormFooter';
import { playerReferences } from '../playerReferences';

/**
 * Image Comment template
 * @param annoState
 * @param commentingType
 * @param currentTime
 * @param setAnnoState
 * @param windowId
 * @returns {Element}
 * @constructor
 */
export default function ImageCommentTemplate(
  {
    annotation,
    canvases,
    currentTime,
    closeFormCompanionWindow,
    debugMode,
    saveAnnotation,
    windowId,
  },
) {
  let maeAnnotation = annotation;

  if (!maeAnnotation.id) {
    // If the annotation does not have maeData, the annotation was not created with mae
    maeAnnotation = {
      body: {
        id: null,
        type: 'Image',
        value: '',
      },
      maeData: {
        drawingState: null, // Add full target
        target: null,
        templateType: template.IMAGE_TYPE,
      },
      motivation: 'commenting',
      target: null,
    };
  } else if (maeAnnotation.maeData.target.drawingState && typeof maeAnnotation.maeData.target.drawingState === 'string') {
    maeAnnotation.maeData.target.drawingState = JSON.parse(
      maeAnnotation.maeData.target.drawingState,
    );
  }

  const [annotationState, setAnnotationState] = useState(maeAnnotation);

  /** updateTargetState with maeDate * */
  const updateTargetState = (target) => {
    const newMaeData = annotationState.maeData;
    newMaeData.target = target;
    setAnnotationState({
      ...annotationState,
      maeData: newMaeData,
    });
  };

  /** save Function * */
  const saveFunction = () => {
    const promises = canvases.map(async (canvas) => {
      // Adapt target to the canvas
      // eslint-disable-next-line no-param-reassign
      annotationState.maeData.target.drawingState = drawingState;
      if (drawingState.shapes) {
        // TODO check if only one shape is allowed
        annotationState.body.id = drawingState.shapes[0].url;
      }
      annotationState.target = maeTargetToIiifTarget(annotationState.maeData.target, canvas.id);
      annotationState.maeData.drawingState = JSON.stringify(drawingState);
      // delete annotationState.maeData.target;
      return saveAnnotation(annotationState, canvas.id);
    });
    Promise.all(promises)
      .then(() => {
        closeFormCompanionWindow();
      });
  };

  /** Update Annotation with body Text * */
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

  /** Initialize drawingState * */
  const initDrawingState = () => {
    if (annotationState.maeData.drawingState) {
      return {
        ...JSON.parse(annotationState.maeData.drawingState),
        isDrawing: false,
      };
    }
    return {
      currentShape: null,
      isDrawing: false,
      shapes: [],
    };
  };

  const [drawingState, setDrawingState] = useState(initDrawingState());

  const [scale, setScale] = useState(playerReferences.getZoom());
  const [isMouseOverSave, setIsMouseOverSave] = useState(false);
  const [viewTool, setViewTool] = useState(TARGET_VIEW);

  useEffect(() => {

  }, [toolState.fillColor, toolState.strokeColor, toolState.strokeWidth]);

  /** Change scale from container / canva */
  const updateScale = () => {
    setScale(playerReferences.getZoom());
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

  /** Update CurrentShape * */
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
        currentShape: null,
        shapes: drawingState.shapes,
      });
    }
  };

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Typography variant="formSectionTitle">
          Image
        </Typography>
      </Grid>
      <Grid item>
        <AnnotationDrawing
          scale={scale}
          annotation={annotation}
          closed={toolState.closedMode === 'closed'}
          windowId={windowId}
          // we need to pass the width and height of the image to the annotation drawing component
          updateScale={updateScale}
          setColorToolFromCurrentShape={setColorToolFromCurrentShape}
          drawingState={drawingState}
          isMouseOverSave={isMouseOverSave}
          setDrawingState={setDrawingState}
          showFragmentSelector={false}
          tabView={viewTool}
          updateCurrentShapeInShapes={updateCurrentShapeInShapes}
          closeFormCompanionWindow={closeFormCompanionWindow}
          displayMode={KONVA_MODE.IMAGE}
          toolState={toolState}
        />
      </Grid>
      <Grid item>
        <AnnotationFormOverlay
          toolState={toolState}
          deleteShape={deleteShape}
          setToolState={setToolState}
          shapes={drawingState.shapes}
          currentShape={drawingState.currentShape}
          setViewTool={setViewTool}
          updateCurrentShapeInShapes={updateCurrentShapeInShapes}
          showStyleTools
          displayMode={KONVA_MODE.IMAGE}
        />
      </Grid>
      <Grid item>
        <TextFormSection
          annoHtml={annotationState.body.value}
          updateAnnotationBody={updateAnnotationTextualBodyValue}
        />
      </Grid>
      <TargetFormSection
        currentTime={currentTime}
        onChangeTarget={updateTargetState}
        target={annotationState.maeData.target}
        windowId={windowId}
        closeFormCompanionWindow={closeFormCompanionWindow}
        timeTarget
        spatialTarget={false}
        debugMode={debugMode}
      />
      <Grid item>
        <AnnotationFormFooter
          closeFormCompanionWindow={closeFormCompanionWindow}
          saveAnnotation={saveFunction}
        />
      </Grid>

    </Grid>
  );
}

ImageCommentTemplate.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  annotation: PropTypes.oneOfType([
    PropTypes.shape({
      body: PropTypes.shape({
        format: PropTypes.string,
        id: PropTypes.string,
        type: PropTypes.string,
        value: PropTypes.string,
      }),
      // eslint-disable-next-line react/forbid-prop-types
      drawingState: PropTypes.object,
      id: PropTypes.string,
      manifestNetwork: PropTypes.string,
      motivation: PropTypes.string,
      target: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  canvases: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeFormCompanionWindow: PropTypes.func.isRequired,
  currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]).isRequired,
  debugMode: PropTypes.bool.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,

};
