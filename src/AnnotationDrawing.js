import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  Stage, Layer, Rect, Ellipse,
} from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import { OSDReferences } from '../mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from '../mirador/dist/es/src/plugins/VideosReferences';
import ParentComponent from './shapes/ParentComponent';

/** All the stuff to draw on the canvas */
function AnnotationDrawing(props) {
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [newShape, setNewShape] = useState(null);

  const shapeRefs = {};
  const transformerRefs = {};

  useEffect(() => {
    // ComponentDidMount logic here
    // Add event listeners
    window.addEventListener('keydown', handleKeyPress);

    // ComponentWillUnmount logic
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    // componentDidUpdate logic for props.activeTool
  }, [props.activeTool]);

  /** */
  const onShapeClick = (shape) => {
    setSelectedShapeId(shape.id);
    // find shape by id
    setCurrentShape(shapes.find((s) => s.id === shape.id));
    console.log('current shape', currentShape);
  };

  /** */
  const handleKeyPress = (e) => {
    console.log('key press', e);
    const unnalowedKeys = ['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'Escape'];

    // if delete is pressed we whant to delete the shape

    if (e.key === 'Delete') {
      console.log('delete key pressed');
      const index = shapes.findIndex((shape) => shape.id === currentShape.id);
      setShapes(shapes.splice(index, 1));
      setCurrentShape(null);
      return;
    }

    if (!currentShape) {
      return;
    }

    if (currentShape.type === 'text') {
      console.log('text selected', currentShape.text);

      // update text
      // let's handle text update
      if (e.key === 'Backspace') {
        currentShape.text = currentShape.text.slice(0, -1);
      } else {
        // return if special char
        if (unnalowedKeys.includes(e.key)) {
          return;
        }
        currentShape.text += e.key;
      }

      // TODO Improve that
      const index = shapes.findIndex((shape) => shape.id === selectedShapeId);
      shapes[index] = currentShape;
      setShapes(shapes);
    }
  };

  /** */
  const handleMouseDown = (e) => {
    try {
      const pos = e.target.getStage().getPointerPosition();
      console.log('mouse down', props.activeTool);
      let shape = null;
      switch (props.activeTool) {
        case 'rectangle':
        case 'ellipse':
          setIsDrawing(true);
          setCurrentShape({
            fill: props.fillColor,
            height: 0,
            id: uuidv4(),
            strokeColor: props.strokeColor,
            strokeWidth: props.strokeWidth,
            type: props.activeTool,
            width: 0,
            x: pos.x,
            y: pos.y,
          });
          // Add global key press event listener
          window.addEventListener('keydown', this.handleKeyPress);
          break;
        case 'text':

          shape = {
            fill: props.fillColor,
            fontSize: 20,
            id: uuidv4(),
            text: 'text',
            type: 'text',
            x: pos.x,
            y: pos.y,
          };

          setShapes([...shapes, shape]);
          setCurrentShape(shape);
          console.log('text', shape);
          break;

        case 'line':
          shape = {
            fill: props.fillColor,
            height: 10,
            id: uuidv4(),
            points: [0, 0, 0, 0, 0, 0],
            type: 'line',
            width: 10,
            x: pos.x,
            y: pos.y,
          };
          setShapes([...shapes, shape]);
          setCurrentShape(shape);
          window.addEventListener('keydown', handleKeyPress);
          break;

        case 'freehand':
          // eslint-disable-next-line no-case-declarations
          const points = [pos.x, pos.y];
          shape = {
            fill: props.fillColor,
            height: 1080,
            id: uuidv4(),
            points,
            type: 'freehand',
            width: 1920,
            x: pos.x,
            y: pos.y,
          };
          setShapes([...shapes, shape]);
          setNewShape(shape);
          setCurrentShape(shape);
          window.addEventListener('keydown', handleKeyPress);
          break;
        default:
          // Handle other cases if any
      }

      if (!currentShape) {
        return;
      }
      // Check if the current shape is a freehand object
      if (currentShape.type === 'freehand') {
        // Start drawing
        setIsDrawing(true);
        setShapes(shapes.map((s) => (s.id === currentShape.id
          ? { ...s, points: [...s.points, e.evt.clientX, e.evt.clientY] }
          : shape)));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  /** */
  const handleMouseMove = (e) => {
    try {
      console.log('mouse move', props.activeTool);
      if (!isDrawing) {
        return;
      }
      if (!currentShape) {
        return;
      }
      const pos = e.target.getStage().getPointerPosition();

      switch (props.activeTool) {
        case 'rectangle':
        case 'ellipse':

          // prevent negative radius for ellipse
          if (currentShape.type === 'ellipse') {
            if (pos.x < currentShape.x) {
              pos.x = currentShape.x;
            }
            if (pos.y < currentShape.y) {
              pos.y = currentShape.y;
            }
          }

          setCurrentShape({
            ...currentShape,
            height: pos.y - currentShape.y,
            width: pos.x - currentShape.x,
          });

          break;
        case 'line':
          // update ponts

          setCurrentShape({
            ...currentShape,
            points: [0, 0, 0, 0, pos.x, pos.y],
          });

          // TODO Break missing ?
        case 'freehand':
          setShapes(shapes.map((shape) => (shape.id === currentShape.id
            ? { ...shape, points: [...shape.points, e.evt.clientX, e.evt.clientY] }
            : shape)));
          break;

        default:
          break;
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  /** Stop drawing */
  const handleMouseUp = () => {
    try {
      console.log('mouse up', props.activeTool);
      if (!isDrawing) return;
      if (!currentShape) return;

      switch (props.activeTool) {
        case 'rectangle':
        case 'ellipse':
        case 'line':
        case 'freehand':
          // For these cases, the action is similar: stop drawing and add the shape
          setIsDrawing(false);
          setShapes([...shapes, currentShape]);
          setCurrentShape(null);
          break;
        default:
          // Handle any other cases if necessary
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  /** */
  const drawKonvas = () => {
    const shape = shapes.find((s) => s.id === currentShape?.id);

    if (shape) {
      // if all the props are the same we don't update the shape
      if (props.fillColor !== shape.fill || props.strokeColor !== shape.strokeColor || props.strokeWidth !== shape.strokeWidth) {
        shape.fill = props.fillColor;
        shape.strokeColor = props.strokeColor;
        shape.strokeWidth = props.strokeWidth;

        // TODO breaking somethinh here ?
        const index = shapes.findIndex((s) => s.id === currentShape.id);
        shapes[index] = shape;
        setShapes(shapes);
      }
    }

    return (
      <Stage
        width={props.width || 1920}
        height={props.height || 1080}
        style={{
          height: '100%', left: 0, position: 'absolute', top: 0, width: '100%',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
            // onDblClick={handleKonvasDblClick}
        id={props.windowId}
      >
        <ParentComponent
          shapes={shapes}
          onShapeClick={onShapeClick}
          activeTool={props.activeTool}
          selectedShapeId={selectedShapeId}
        />

        <Layer>
          {isDrawing && currentShape && (
            currentShape.type === 'rectangle' ? (
              <Rect
                x={currentShape.x}
                y={currentShape.y}
                width={currentShape.width}
                height={currentShape.height}
                fill={props.fillColor}
                stroke={props.strokeColor}
              />
            ) : (
              <Ellipse
                x={currentShape.x}
                y={currentShape.y}
                radiusX={currentShape.width / 2}
                radiusY={currentShape.height / 2}
                fill={props.fillColor}
                stroke={props.strokeColor}
              />
            )
          )}
        </Layer>
      </Stage>
    );
  };

  const osdref = OSDReferences.get(props.windowId);
  const videoref = VideosReferences.get(props.windowId);
  if (!osdref && !videoref) {
    throw new Error("Unknown or missing data player, didn't found OpenSeadragon (image viewer) nor the video player");
  }
  if (osdref && videoref) {
    throw new Error('Unhandled case: both OpenSeadragon (image viewer) and video player on the same canvas');
  }
  const container = osdref ? osdref.current.element : videoref.ref.current.parentElement;

  return ReactDOM.createPortal(drawKonvas(), container);
}

AnnotationDrawing.propTypes = {
  activeTool: PropTypes.string,
  selectedShapeId: PropTypes.string,
  closed: PropTypes.bool,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
  strokeWidth: PropTypes.number,
  svg: PropTypes.func.isRequired,
  updateGeometry: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

AnnotationDrawing.defaultProps = {
  activeTool: null,
  selectedShapeId: null,
  closed: true,
  fillColor: null,
  strokeColor: '#00BFFF',
  strokeWidth: 1,
  svg: null,
};

export default AnnotationDrawing;
