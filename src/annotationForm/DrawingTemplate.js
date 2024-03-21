import React, { useEffect, useState } from 'react';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import PropTypes from 'prop-types';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import AnnotationDrawing from './AnnotationDrawing';
import { maeTargetToIiifTarget } from '../IIIFUtils';

import {
  mediaTypes,
  TARGET_VIEW,
  template,
} from '../AnnotationFormUtils';
import { defaultToolState } from '../AnnotationCreationUtils';
import AnnotationFormOverlay from './AnnotationFormOverlay/AnnotationFormOverlay';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import AnnotationFormFooter from './AnnotationFormFooter';
import { getKonvaAsDataURL, KONVA_MODE } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';
import { Debug } from './Debug';

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
 * @param mediaType
 * @returns {Element}
 * @constructor
 */
export default function DrawingTemplate(
  {
    annotation,
    canvases,
    closeFormCompanionWindow,
    currentTime,
    debugMode,
    mediaType,
    overlay,
    setCurrentTime,
    setSeekTo,
    windowId,
    saveAnnotation,
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
        id: null,
        type: 'Image',
        value: '',
      },
      maeData: {
        drawingState: null, // Add full target
        target: null,
        templateType: template.KONVA_TYPE,
      },
      motivation: 'commenting',
      target: null,
    };
  }

  const [annotationState, setAnnotationState] = useState(maeAnnotation);
  /** Update AnnotationState with Target * */
  const updateTargetState = (target) => {
    const newMaeData = annotationState.maeData;
    newMaeData.target = target;
    setAnnotationState({
      ...annotationState,
      maeData: newMaeData,
    });
  };

  let player;
  if (mediaType === mediaTypes.VIDEO) {
    player = VideosReferences.get(windowId);
  }
  if (mediaType === mediaTypes.IMAGE) {
    player = OSDReferences.get(windowId);
  }
  /** save Function * */
  const saveFunction = () => {
    const promises = canvases.map(async (canvas) => {
      // Adapt target to the canvas
      // eslint-disable-next-line no-param-reassign
      annotationState.body.id = await getKonvaAsDataURL(windowId);
      annotationState.target = maeTargetToIiifTarget(annotationState.maeData.target, canvas.id);
      annotationState.maeData.drawingState = JSON.stringify(drawingState);
      // delete annotationState.maeData.target;
      return saveAnnotation(annotationState, canvas.id);
    });
    Promise.all(promises).then(() => {
      closeFormCompanionWindow();
    });
  };
  /** Update annotation state with text body* */
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
  /** initialise drawing State* */
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
  /** Update currentShape * */
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
      {/* Rename AnnotationDrawing in Drawing Stage */}
      {/* Check the useless props : annotation ?
      Check the width height originalW originalW */}
      <Grid item>
        <Typography variant="formSectionTitle">
          Overlay
        </Typography>
      </Grid>
      <Grid item>
        <AnnotationDrawing
          scale={scale}
          toolState={toolState}
          annotation={annotation}
          windowId={windowId}
          player={player}
            // we need to pass the width and height of the image to the annotation drawing component
          width={overlay ? overlay.containerWidth : 1920}
          height={overlay ? overlay.containerHeight : 1080}
          originalWidth={overlay ? overlay.canvasWidth : 1920}
          originalHeight={overlay ? overlay.canvasHeight : 1080}
          updateScale={updateScale}
          setColorToolFromCurrentShape={setColorToolFromCurrentShape}
          drawingState={drawingState}
          isMouseOverSave={isMouseOverSave}
          overlay={overlay}
          setDrawingState={setDrawingState}
          showFragmentSelector={false}
          tabView={viewTool}
          updateCurrentShapeInShapes={updateCurrentShapeInShapes}
          mediaType={mediaType}
          closeFormCompanionWindow={closeFormCompanionWindow}
          displayMode={KONVA_MODE.DRAW}
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
          displayMode={KONVA_MODE.DRAW}
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
        mediaType={mediaType}
        onChangeTarget={updateTargetState}
        setCurrentTime={setCurrentTime}
        setSeekTo={setSeekTo}
        target={annotationState.maeData.target}
        windowId={windowId}
        overlay={overlay}
        closeFormCompanionWindow={closeFormCompanionWindow}
        timeTarget
        debugMode={debugMode}
      />
      <Grid item>
        <Debug
          overlay={overlay}
          scale={scale}
          drawingState={drawingState}
        />
      </Grid>
      <Grid item>
        <AnnotationFormFooter
          closeFormCompanionWindow={closeFormCompanionWindow}
          saveAnnotation={saveFunction}
        />
      </Grid>

    </Grid>
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
  // eslint-disable-next-line react/forbid-prop-types
  canvases: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeFormCompanionWindow: PropTypes.func.isRequired,
  currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]).isRequired,
  mediaType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  overlay: PropTypes.object.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,

};
