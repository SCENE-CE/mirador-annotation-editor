import React, {
  useEffect, useState, useLayoutEffect,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Stage } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import ParentComponent from './AnnotationFormOverlay/KonvaDrawing/shapes/ParentComponent';
import { OVERLAY_TOOL, SHAPES_TOOL } from '../AnnotationCreationUtils';
import Surface from './AnnotationFormOverlay/KonvaDrawing/Surface';

/** All the stuff to draw on the canvas */
export default function AnnotationDrawing({
  drawingState, originalWidth, orignalHeight, setDrawingState, height, width, imageEvent, ...props
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [surfacedata, setSurfaceData] = useState({
    height: height / props.scale,
    scaleX: 1,
    scaleY: 1,
    width: width / props.scale,
    x: 1,
    y: 1,
  });

  useEffect(() => {
    const overlay = props.mediaVideo ? props.mediaVideo.ref.current : null;
    if (overlay) {
      props.updateScale(overlay.containerWidth / overlay.canvasWidth);
    }
    const newSurfaceData = { ...surfacedata };
    newSurfaceData.width = overlay.width / props.scale;
    newSurfaceData.height = overlay.height / props.scale;
    // compare newSurfaceData and surfacedata, if different, update surfacedata
    // eslint-disable-next-line max-len
    if (newSurfaceData.width !== surfacedata.width || newSurfaceData.height !== surfacedata.height) {
      setSurfaceData(newSurfaceData);
    }
  }, [{ height, width }]);

  useEffect(() => {
    // TODO clean
    if (!props.imageEvent) return;
    if (!props.imageEvent.id) return;
    const shape = {
      id: uuidv4(),
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      type: 'image',
      url: props.imageEvent.id,
      x: 0,
      y: 0,
    };

    setDrawingState({
      ...drawingState,
      currentShape: shape,
      shapes: [...drawingState.shapes, shape],
    });
  }, [drawingState, imageEvent, props.imageEvent, setDrawingState]);

  const { fillColor, strokeColor, strokeWidth } = props;

  /** */
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

  /** */
  useEffect(() => {
    if (!isDrawing) {
      const newCurrentShape = drawingState[drawingState.shapes.length - 1];
      // get latest shape in the list
      if (newCurrentShape) {
        updateCurrentShapeInShapes(newCurrentShape);
      }
    }
  }, [drawingState]);

  useEffect(() => {
    // Perform an action when fillColor, strokeColor, or strokeWidth change
    // update current shape
    if (drawingState.currentShape) {
      drawingState.currentShape.fill = fillColor;
      drawingState.currentShape.stroke = strokeColor;
      drawingState.currentShape.strokeWidth = strokeWidth;
      updateCurrentShapeInShapes(drawingState.currentShape);
    }
  }, [fillColor, strokeColor, strokeWidth]);

  /** */
  const handleKeyPress = (e) => {
    e.stopPropagation();
    const unnalowedKeys = ['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'Escape', 'Tab', 'AltGraph', 'CapsLock', 'NumLock', 'ScrollLock', 'Pause', 'Insert', 'Home', 'PageUp', 'PageDown', 'End', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ContextMenu', 'PrintScreen', 'Help', 'Clear', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'OS'];

    if (!drawingState.currentShape) {
      return;
    }

    if (e.key === 'Delete') {
      // eslint-disable-next-line max-len
      const shapesWithoutTheDeleted = drawingState.shapes.filter((shape) => shape.id !== drawingState.currentShape.id);
      setDrawingState({
        ...drawingState,
        shapes: shapesWithoutTheDeleted,
      });
      return;
    }

    // TODO This comportment must be handle by the text component
    if (drawingState.currentShape.type === 'text') {
      let newText = drawingState.currentShape.text;
      if (e.key === 'Backspace') {
        newText = newText.slice(0, -1);
      } else {
        if (unnalowedKeys.includes(e.key)) {
          return;
        }
        newText += e.key;
      }

      // Potentially bug during the update
      const newCurrentShape = { ...drawingState.currentShape, text: newText };

      setDrawingState({
        ...drawingState,
        currentShape: newCurrentShape,
        // eslint-disable-next-line max-len
        shapes: drawingState.shapes.map((shape) => (shape.id === drawingState.currentShape.id ? newCurrentShape : shape)),
      });
    }
  };
  // TODO Can be removed ? --> move currentSHape and shapes in the same state
  useLayoutEffect(() => {
    if (drawingState.shapes.find((s) => s.id === drawingState.currentShape?.id)) {
      window.addEventListener('keydown', handleKeyPress);

      // Set here all the properties of the current shape for the tool options
      props.setColorToolFromCurrentShape(
        {
          fillColor: drawingState.currentShape.fill,
          strokeColor: drawingState.currentShape.stroke,
          strokeWidth: drawingState.currentShape.strokeWidth,
          text: drawingState.currentShape.text,
        },
      );

      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [drawingState.currentShape]);

  /** */
  const onShapeClick = async (shp) => {
    // return if we are not in edit or cursor mode
    if (props.activeTool !== 'edit' && props.activeTool !== 'cursor' && props.activeTool !== 'delete') {
      return;
    }
    console.log('shape clicked', shp);
    const shape = drawingState.shapes.find((s) => s.id === shp.id);
    if (props.activeTool === 'delete') {
      const newShapes = drawingState.shapes.filter((s) => s.id !== shape.id);
      setDrawingState({
        ...drawingState,
        shapes: newShapes,
      });
      return;
    }

    setDrawingState({
      ...drawingState,
      currentShape: shape,
    });

    // props.setShapeProperties(shape); // TODO Check that code ?
    props.setColorToolFromCurrentShape(
      {
        fillColor: shape.fill,
        strokeColor: shape.stroke,
        strokeWidth: shape.strokeWidth,
      },
    );
  };

  /**
   * Handles the transformation event on a shape. It updates the shape's properties
   * with the modified attributes from the event target, finds the corresponding shape
   * in the global state by ID, and updates the current shape in the global shapes array.
   * Finally, it invokes the update function to reflect these changes in the global state.
   *
   * @param {Object} evt - The event object containing the target shape's modified attributes.
   */
  const onTransform = (evt) => {
    const modifiedshape = evt.target.attrs;

    const shape = drawingState.shapes.find((s) => s.id === modifiedshape.id);

    Object.assign(shape, modifiedshape);
    drawingState.currentShape = shape;
    updateCurrentShapeInShapes(drawingState.currentShape);
  };

  /**
   * Handles the drag end event for a shape.
   * @param {Event} evt - The drag end event object.
   */
  const handleDragEnd = (evt) => {
    const modifiedshape = evt.currentTarget.attrs;
    const shape = drawingState.shapes.find((s) => s.id === modifiedshape.id);
    shape.x = modifiedshape.x;
    shape.y = modifiedshape.y;

    updateCurrentShapeInShapes(shape);
  };

  /**
   * Handles the drag start event.
   * @param {Event} evt - The drag start event object.
   * @returns {void}
   */
  const handleDragStart = (evt) => {
    const modifiedshape = evt.currentTarget.attrs;

    setDrawingState({
      ...drawingState,
      currentShape: drawingState.shapes.find((s) => s.id === modifiedshape.id),
    });
  };

  /**
   * Handles the transformation event on a surface element.
   * @param {Event} evt - The transformation event object.
   */
  const onSurfaceTransform = (evt) => {
    const modifiedshape = evt.target.attrs;
    const shape = surfacedata;
    Object.assign(shape, modifiedshape);
    setSurfaceData({ ...shape });
  };

  /**
   * Handles the drag event on a surface element.
   * Updates the surface data with the new position.
   * @param {Event} evt - The drag event object.
   */
  const handleSurfaceDrag = (evt) => {
    const modifiedshape = evt.currentTarget.attrs;
    const shape = { ...surfacedata };
    shape.x = modifiedshape.x;
    shape.y = modifiedshape.y;
    setSurfaceData({ ...shape });
  };

  /** */
  const handleMouseDown = (e) => {
    try {
      const pos = e.target.getStage().getRelativePointerPosition();
      pos.x /= props.scale;
      pos.y /= props.scale;
      let shape = null;
      switch (props.activeTool) {
        case SHAPES_TOOL.RECTANGLE:
          shape = {
            fill: props.fillColor,
            height: 1,
            id: uuidv4(),
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: props.strokeColor,
            strokeWidth: props.strokeWidth,
            type: props.activeTool,
            width: 1,
            x: pos.x,
            y: pos.y,
          };
          setDrawingState({
            currentShape: shape,
            isDrawing: true,
            shapes: [...drawingState.shapes, shape],
          });
          break;
        case SHAPES_TOOL.ELLIPSE:
          shape = {
            fill: props.fillColor,
            height: 1,
            id: uuidv4(),
            radiusX: 1,
            radiusY: 1,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: props.strokeColor,
            strokeWidth: props.strokeWidth,
            type: props.activeTool,
            width: 1,
            x: pos.x,
            y: pos.y,
          };
          setDrawingState({
            currentShape: shape,
            isDrawing: true,
            shapes: [...drawingState.shapes, shape],
          });
          break;
        case 'text':
          shape = {
            fill: props.fillColor,
            fontSize: 20,
            id: uuidv4(),
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            text: 'text',
            type: OVERLAY_TOOL.TEXT,
            x: pos.x,
            y: pos.y,
          };

          setDrawingState({
            ...drawingState,
            currentShape: shape,
            shapes: [...drawingState.shapes, shape],
          });
          break;
        case SHAPES_TOOL.FREEHAND:
          shape = {
            fill: props.fillColor,
            id: uuidv4(),
            lines: [
              {
                points: [pos.x, pos.y, pos.x, pos.y],
                stroke: props.strokeColor,
                strokeWidth: props.strokeWidth,
                x: 0,
                y: 0,
              },
            ],
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: props.strokeColor,
            strokeWidth: props.strokeWidth,
            type: SHAPES_TOOL.FREEHAND,
            x: 0,
            y: 0,
          };
          setDrawingState({
            currentShape: shape,
            isDrawing: true,
            shapes: [...drawingState.shapes, shape],
          });
          break;
        case SHAPES_TOOL.POLYGON:
          shape = {
            fill: props.fillColor,
            id: uuidv4(),
            points: [pos.x, pos.y],
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: props.strokeColor,
            strokeWidth: props.strokeWidth,
            type: SHAPES_TOOL.POLYGON,
            x: 0,
            y: 0,
          };
          setDrawingState({
            currentShape: shape,
            isDrawing: true,
            shapes: [...drawingState.shapes, shape],
          });
          break;
        case SHAPES_TOOL.ARROW:
          shape = {
            fill: props.fillColor,
            id: uuidv4(),
            pointerLength: 20,
            pointerWidth: 20,
            points: [pos.x, pos.y, pos.x, pos.y],
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: props.strokeColor,
            strokeWidth: props.strokeWidth,
            type: SHAPES_TOOL.ARROW,
          };
          setDrawingState({
            currentShape: shape,
            isDrawing: true,
            shapes: [...drawingState.shapes, shape],
          });
          break;
        default:
          // Handle other cases if any
          break;
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  /** */
  const handleMouseMove = (e) => {
    try {
      if (!drawingState.isDrawing) {
        return;
      }
      if (!drawingState.currentShape) {
        return;
      }
      const pos = e.target.getStage().getRelativePointerPosition();
      pos.x /= props.scale;
      pos.y /= props.scale;

      switch (props.activeTool) {
        case SHAPES_TOOL.RECTANGLE:
          updateCurrentShapeInShapes({
            ...drawingState.currentShape,
            height: pos.y - drawingState.currentShape.y,
            width: pos.x - drawingState.currentShape.x,
          });
          break;
        case SHAPES_TOOL.ELLIPSE:
          // prevent negative radius for ellipse
          if (pos.x < drawingState.currentShape.x) {
            pos.x = drawingState.currentShape.x;
          }
          if (pos.y < drawingState.currentShape.y) {
            pos.y = drawingState.currentShape.y;
          }

          updateCurrentShapeInShapes({
            ...drawingState.currentShape,
            height: pos.y - drawingState.currentShape.y,
            radiusX: (pos.x - drawingState.currentShape.x) / 2,
            radiusY: (pos.y - drawingState.currentShape.y) / 2,
            width: pos.x - drawingState.currentShape.x,
          });

          break;
        case SHAPES_TOOL.FREEHAND:
          // eslint-disable-next-line max-len
          const freehandShape = drawingState.currentShape; // TODO Check if not nuse { ...drawingState.currentShape };
          freehandShape.lines.push({
            points: [pos.x, pos.y, pos.x, pos.y],
            stroke: props.strokeColor,
            strokeWidth: props.strokeWidth,
          });
          updateCurrentShapeInShapes(freehandShape);
          break;
        case SHAPES_TOOL.POLYGON:
          const polygonShape = drawingState.currentShape;
          polygonShape.points[2] = pos.x;
          polygonShape.points[3] = pos.y;
          updateCurrentShapeInShapes(polygonShape);
          break;
        case SHAPES_TOOL.ARROW:
          // TODO improve
          const arrowShape = {};
          // update points
          // eslint-disable-next-line max-len
          arrowShape.points = [drawingState.currentShape.points[0], drawingState.currentShape.points[1], pos.x, pos.y];
          arrowShape.id = drawingState.currentShape.id;
          arrowShape.type = drawingState.currentShape.type;
          arrowShape.pointerLength = drawingState.currentShape.pointerLength;
          arrowShape.pointerWidth = drawingState.currentShape.pointerWidth;
          arrowShape.x = drawingState.currentShape.x;
          arrowShape.y = drawingState.currentShape.y;
          arrowShape.fill = props.fillColor;
          arrowShape.stroke = props.strokeColor;
          arrowShape.strokeWidth = props.strokeWidth;
          updateCurrentShapeInShapes(arrowShape);
          setIsDrawing(true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  /** Stop drawing */
  const handleMouseUp = (e) => {
    setDrawingState({
      ...drawingState,
      isDrawing: false,
    });
  };

  /** */
  const drawKonvas = () => (
    <Stage
      width={width}
      height={height}
      style={{
        height: 'auto',
        left: 0,
        objectFit: 'contain',
        overflow: 'clip',
        overflowClipMargin: 'content-box',
        position: 'absolute',
        top: 0,
        width: '100%',
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      id={props.windowId}
    >

      {props.tabView !== 'target' && (

      <Surface
        shape={surfacedata}
        onTransform={onSurfaceTransform}
        handleDrag={handleSurfaceDrag}
        trview={false}
        width={width}
        height={height}
        scale={props.scale}
      />
      )}

      <ParentComponent
        shapes={drawingState.shapes}
        onShapeClick={onShapeClick}
        activeTool={props.activeTool}
        selectedShapeId={drawingState.currentShape?.id}
        scale={props.scale}
        width={originalWidth}
        height={orignalHeight}
        onTransform={onTransform}
        handleDragEnd={handleDragEnd}
        handleDragStart={handleDragStart}
        isMouseOverSave={props.isMouseOverSave}
        trview={props.tabView !== 'target'}
      />
      {props.tabView === 'target' && (

      <Surface
        shape={surfacedata}
        onTransform={onSurfaceTransform}
        handleDrag={handleSurfaceDrag}
        trview
        width={width}
        height={height}
        scale={props.scale}
      />
      )}
    </Stage>
  );
  const osdref = OSDReferences.get(props.windowId);
  const videoref = VideosReferences.get(props.windowId);
  if (!osdref && !videoref) {
    throw new Error("Unknown or missing data player, didn't found OpenSeadragon (image viewer) nor the video player");
  }
  if (osdref && videoref) {
    throw new Error('Unhandled case: both OpenSeadragon (image viewer) and video player on the same canvas');
  }
  const container = osdref ? osdref.current.container : videoref.ref.current.parentElement;

  return ReactDOM.createPortal(drawKonvas(), container);
}

AnnotationDrawing.propTypes = {
  activeTool: PropTypes.string.isRequired,
  closed: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  drawingState: PropTypes.object.isRequired,
  fillColor: PropTypes.string.isRequired,
  originalHeight: PropTypes.number.isRequired,
  originalWidth: PropTypes.number.isRequired,
  selectedShapeId: PropTypes.string.isRequired,
  strokeColor: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  svg: PropTypes.func.isRequired,
  updateGeometry: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};
