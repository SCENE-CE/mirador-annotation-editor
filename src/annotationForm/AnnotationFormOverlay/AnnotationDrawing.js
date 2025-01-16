import React, {
  useEffect, useState, useLayoutEffect,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Stage } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import ParentComponent from './KonvaDrawing/shapes/ParentComponent';
import { OVERLAY_TOOL, SHAPES_TOOL } from './KonvaDrawing/KonvaUtils';

/** All the stuff to draw on the canvas */
export default function AnnotationDrawing(
  {
    displayMode,
    drawingState,
    isMouseOverSave,
    playerReferences,
    scale,
    setColorToolFromCurrentShape,
    setDrawingState,
    tabView,
    toolState,
    updateCurrentShapeInShapes,
    updateScale,
    windowId,
  },
) {
  const width = playerReferences.getMediaTrueWidth();

  const [isDrawing, setIsDrawing] = useState(false);

  // This useEffect is necessary to update the scale when the window is resized. If not drawing
  // stage is not aligned with the image.
  useEffect(() => {
    updateScale(playerReferences.getZoom());
  }, [{ width }]);

  useEffect(() => {
    if (toolState.imageEvent?.id) {
      const imageShape = {
        id: uuidv4(),
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        type: SHAPES_TOOL.IMAGE,
        url: toolState.imageEvent.id,
        x: 30,
        y: 30,
      };

      setDrawingState({
        ...drawingState,
        currentShape: imageShape,
        shapes: [...drawingState.shapes, imageShape],
      });
    }
    setIsDrawing(false);
  }, [toolState]);

  useEffect(() => {
    if (!isDrawing) {
      const newCurrentShape = drawingState[drawingState.shapes.length - 1];
      // get the latest shape in the list
      if (newCurrentShape) {
        updateCurrentShapeInShapes(newCurrentShape);
      }
    }
  }, [drawingState]);

  useEffect(() => {
    // Perform an action when fillColor, strokeColor, or strokeWidth change
    // update current shape
    if (drawingState.currentShape) {
      // eslint-disable-next-line no-param-reassign
      drawingState.currentShape.fill = toolState.fillColor;
      // eslint-disable-next-line no-param-reassign
      drawingState.currentShape.stroke = toolState.strokeColor;
      // eslint-disable-next-line no-param-reassign
      drawingState.currentShape.strokeWidth = toolState.strokeWidth;
      // eslint-disable-next-line no-param-reassign
      drawingState.currentShape.text = toolState.text;
      updateCurrentShapeInShapes(drawingState.currentShape);
    }
  }, [toolState]);

  // eslint-disable-next-line consistent-return
  useLayoutEffect(() => {
    if (drawingState.shapes.find((s) => s.id === drawingState.currentShape?.id)) {
      window.addEventListener('keydown', handleKeyPress);

      // Set here all the properties of the current shape for the tool options
      setColorToolFromCurrentShape(
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
  const handleKeyPress = (e) => {
    e.stopPropagation();

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

    // release the drawing
    if (e.key === 'Escape') {
      if (toolState.activeTool === SHAPES_TOOL.POLYGON) {
        drawingState.currentShape.points.splice(-2, 2);
        updateCurrentShapeInShapes({
          points: [drawingState.currentShape.points],
          ...drawingState.currentShape,
        });
      }

      setDrawingState({
        ...drawingState,
        currentShape: null,
        isDrawing: false,
      });
      return;
    }

    if (drawingState.currentShape.type === 'text') {
      const newCurrentShape = { ...drawingState.currentShape };
      setDrawingState((prevState) => ({
        ...prevState,
        currentShape: newCurrentShape,
        shapes: prevState.shapes.map((shape) => (shape.id === newCurrentShape.id
          ? { ...shape, ...newCurrentShape }
          : shape)),
      }));
    }
  };

  /** */
  const onShapeClick = async (shp) => {
    // return if we are not in edit or cursor mode
    if (toolState.activeTool !== 'edit' && toolState.activeTool !== 'cursor' && toolState.activeTool !== 'delete') {
      return;
    }
    const shape = drawingState.shapes.find((s) => s.id === shp.id);
    if (toolState.activeTool === 'delete') {
      const newShapes = drawingState.shapes.filter((s) => s.id !== shape.id);
      setDrawingState({
        ...drawingState,
        currentShape: null,
        shapes: newShapes,
      });
      return;
    }

    setDrawingState({
      ...drawingState,
      currentShape: shape,
    });

    setColorToolFromCurrentShape(
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
    const modifiedShape = evt.target.attrs;

    const shape = drawingState.shapes.find((s) => s.id === modifiedShape.id);

    Object.assign(shape, modifiedShape);
    if (shape.type === 'image') {
      shape.width = modifiedShape.image.width * modifiedShape.scaleX;
      shape.height = modifiedShape.image.height * modifiedShape.scaleY;
    }
    updateCurrentShapeInShapes(shape);
  };

  /**
   * Handles the drag end event for a shape.
   * @param {Event} evt - The drag end event object.
   */
  const handleDragEnd = (evt) => {
    const editedShape = evt.currentTarget.attrs;
    const shape = drawingState.shapes.find((s) => s.id === editedShape.id);

    Object.assign(shape, editedShape);
    shape.x = editedShape.x;
    shape.y = editedShape.y;

    if (shape.type === 'image') {
      shape.width = editedShape.image.width * editedShape.scaleX;
      shape.height = editedShape.image.height * editedShape.scaleY;
    }
  };

  /**
   * Handles the drag start event.
   * @param {Event} evt - The drag start event object.
   * @returns {void}
   */
  const handleDragStart = (evt) => {
    const editedShape = evt.currentTarget.attrs;
    setDrawingState({
      ...drawingState,
      currentShape: drawingState.shapes.find((s) => s.id === editedShape.id),
    });
  };

  /** */
  const handleMouseDown = (e) => {
    try {
      const pos = e.target.getStage().getRelativePointerPosition();
      pos.x /= scale;
      pos.y /= scale;
      let shape = null;
      switch (toolState.activeTool) {
        case SHAPES_TOOL.RECTANGLE:
          shape = {
            fill: toolState.fillColor,
            height: 30,
            id: uuidv4(),
            scaleX: 1,
            scaleY: 1,
            stroke: toolState.strokeColor,
            strokeWidth: toolState.strokeWidth,
            type: toolState.activeTool,
            width: 30,
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
            fill: toolState.fillColor,
            height: 1,
            id: uuidv4(),
            radiusX: 1,
            radiusY: 1,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: toolState.strokeColor,
            strokeWidth: toolState.strokeWidth,
            type: toolState.activeTool,
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
        case SHAPES_TOOL.CIRCLE:
          shape = {
            fill: toolState.fillColor,
            height: 1,
            id: uuidv4(),
            radius: 30,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: toolState.strokeColor,
            strokeWidth: toolState.strokeWidth,
            type: toolState.activeTool,
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
            fill: toolState.fillColor,
            fontSize: 20,
            id: uuidv4(),
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            text: 'Change me',
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
            fill: toolState.fillColor,
            id: uuidv4(),
            lines: [
              {
                points: [pos.x, pos.y, pos.x, pos.y],
                stroke: toolState.strokeColor,
                strokeWidth: toolState.strokeWidth,
                x: 0,
                y: 0,
              },
            ],
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: toolState.strokeColor,
            strokeWidth: toolState.strokeWidth,
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
          if (drawingState.isDrawing) {
            drawingState.currentShape.points.splice(-2, 2, pos.x, pos.y);
            drawingState.currentShape.points.push(pos.x, pos.y);
            updateCurrentShapeInShapes({
              points: [drawingState.currentShape.points],
              ...drawingState.currentShape,
            });
          } else {
            shape = {
              fill: toolState.fillColor,
              id: uuidv4(),
              points: [pos.x, pos.y, pos.x, pos.y],
              rotation: 0,
              scaleX: 1,
              scaleY: 1,
              stroke: toolState.strokeColor,
              strokeWidth: toolState.strokeWidth,
              type: SHAPES_TOOL.POLYGON,
              x: 0,
              y: 0,
            };
            setDrawingState({
              currentShape: shape,
              isDrawing: true,
              shapes: [...drawingState.shapes, shape],
            });
            setIsDrawing(true);
          }
          break;
        case SHAPES_TOOL.ARROW:
          shape = {
            fill: toolState.fillColor,
            id: uuidv4(),
            pointerLength: 20,
            pointerWidth: 20,
            points: [pos.x, pos.y, pos.x, pos.y],
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: toolState.strokeColor,
            strokeWidth: toolState.strokeWidth,
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
    console.log("debug toolState.strokeWidth", toolState.strokeWidth);
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
      pos.x /= scale;
      pos.y /= scale;

      switch (toolState.activeTool) {
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
        case SHAPES_TOOL.CIRCLE:
          if (pos.x < drawingState.currentShape.x) {
            pos.x = drawingState.currentShape.x;
          }
          if (pos.y < drawingState.currentShape.y) {
            pos.y = drawingState.currentShape.y;
          }

          updateCurrentShapeInShapes({
            ...drawingState.currentShape,
            height: pos.y - drawingState.currentShape.y,
            radius: Math.sqrt(
              (pos.x - drawingState.currentShape.x) ** 2
              + (pos.y - drawingState.currentShape.y) ** 2,
            ),
            width: pos.x - drawingState.currentShape.x,
          });
          break;
        case SHAPES_TOOL.FREEHAND:
          // eslint-disable-next-line react/prop-types
          drawingState.lines.push({
            points: [pos.x, pos.y, pos.x, pos.y],
            stroke: toolState.strokeColor,
            strokeWidth: toolState.strokeWidth,
          });
          updateCurrentShapeInShapes({
            ...drawingState.currentShape,
          });
          break;
        case SHAPES_TOOL.POLYGON:
          drawingState.currentShape.points.splice(-2, 2, pos.x, pos.y);
          updateCurrentShapeInShapes({
            ...drawingState.currentShape,
          });
          break;
        case SHAPES_TOOL.ARROW:
          updateCurrentShapeInShapes({
            ...drawingState.currentShape,
            fill: toolState.fillColor,
            points: [
              drawingState.currentShape.points[0],
              drawingState.currentShape.points[1],
              pos.x,
              pos.y,
            ],
            stroke: toolState.strokeColor,
            strokeWidth: toolState.strokeWidth,
          });
          setIsDrawing(true);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  /** Stop drawing */
  const handleMouseUp = () => {
    if (toolState.activeTool !== SHAPES_TOOL.POLYGON) {
      setDrawingState({
        ...drawingState,
        isDrawing: false,
      });
    }
  };

  /** */
  const drawKonvas = () => (
    <Stage
      width={playerReferences.getDisplayedMediaWidth()}
      height={playerReferences.getDisplayedMediaHeight()}
      style={{
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        height: 'auto',
        left: playerReferences.getImagePosition().x,
        objectFit: 'contain',
        overflow: 'clip',
        overflowClipMargin: 'content-box',
        position: 'absolute',
        top: playerReferences.getImagePosition().y,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      id={windowId}
    >
      <ParentComponent
        activeTool={toolState.activeTool}
        displayMode={displayMode}
        handleDragEnd={handleDragEnd}
        handleDragStart={handleDragStart}
        isMouseOverSave={isMouseOverSave}
        onShapeClick={onShapeClick}
        onTransform={onTransform}
        scale={scale}
        selectedShapeId={drawingState.currentShape?.id}
        shapes={drawingState.shapes}
        trview={tabView !== 'target'}
      />
    </Stage>
  );

  /** ***************************
   * Return
   **************************** */
  const container = playerReferences.getContainer();
  if (container) {
    return ReactDOM.createPortal(drawKonvas(), container);
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

const shapeObjectPropTypes = PropTypes.shape({
  fill: PropTypes.string,
  id: PropTypes.string,
  lines: ({
    pointerLength: PropTypes.number,
    points: PropTypes.arrayOf([PropTypes.number]),
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
  }),
  pointerLength: PropTypes.number,
  pointerWidth: PropTypes.number,
  points: PropTypes.number,
  rotation: PropTypes.number,
  scaleX: PropTypes.number,
  scaleY: PropTypes.number,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  text: PropTypes.string,
  type: PropTypes.string,
  url: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
});

AnnotationDrawing.propTypes = {
  displayMode: PropTypes.string.isRequired,
  drawingState: PropTypes.oneOfType([
    PropTypes.shape({
      currentShape: shapeObjectPropTypes,
      isDrawing: PropTypes.bool,
      shapes: PropTypes.arrayOf(shapeObjectPropTypes),
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        currentShape: PropTypes.shape({
          id: PropTypes.string,
          rotation: PropTypes.number,
          scaleX: PropTypes.number,
          scaleY: PropTypes.number,
          type: PropTypes.string,
          url: PropTypes.string,
          x: PropTypes.number,
          y: PropTypes.number,
        }),
        isDrawing: PropTypes.bool,
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
        ),
      }),
    ),
  ]).isRequired,
  isMouseOverSave: PropTypes.bool.isRequired,
  overlay: PropTypes.shape({
    canvasHeight: PropTypes.number,
    canvasWidth: PropTypes.number,
    containerHeight: PropTypes.number,
    containerWidth: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  playerReferences: PropTypes.object.isRequired,
  scale: PropTypes.number.isRequired,
  setColorToolFromCurrentShape: PropTypes.func.isRequired,
  setDrawingState: PropTypes.func.isRequired,
  tabView: PropTypes.string.isRequired,
  toolState: PropTypes.oneOfType(
    PropTypes.string,
    PropTypes.string,
    PropTypes.string,
    PropTypes.oneOfType(
      PropTypes.string,
    ),
    PropTypes.string,
    PropTypes.string,
    PropTypes.number,
  ).isRequired,
  updateCurrentShapeInShapes: PropTypes.func.isRequired,
  updateScale: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};
