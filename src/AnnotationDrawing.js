/* eslint-disable require-jsdoc */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  Stage, Layer, Rect, Ellipse, Arrow, Line, Text, Transformer, Group,
} from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line import/no-extraneous-dependencies
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
// eslint-disable-next-line import/no-extraneous-dependencies
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import ParentComponent from './shapes/ParentComponent';

/** All the stuff to draw on the canvas */

function AnnotationDrawing(props) {
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const { fillColor, strokeColor, strokeWidth } = props;

  /** Debug function facility */
  const debug = (command) => {
    console.debug('***************************');
    console.debug(command);
    console.debug('shapes', shapes);
    console.debug('shapes taille', shapes.length);
    console.debug('currentShape', currentShape);
    console.debug('isDrawing', isDrawing);
    console.debug('props.activeTool', props.activeTool);
    console.debug('-----------------------------');
  };

  /** */
  useEffect(() => {
    // Perform a repaint when shapes change
  }, [shapes]);

  useEffect(() => {
    // Perform an action when fillColor, strokeColor, or strokeWidth change
    // update current shape
    if (currentShape) {
      currentShape.fill = fillColor;
      currentShape.stroke = strokeColor;
      currentShape.strokeWidth = strokeWidth;
      setCurrentShape({ ...currentShape });
      updateCurrentShapeInShapes();
    }
  }, [fillColor, strokeColor, strokeWidth]);

  // TODO Can be removed ? --> move currentSHape and shapes in the same state
  useLayoutEffect(() => {
    if (shapes.find((s) => s.id === currentShape?.id)) {
      console.log('useLayoutEffect shapes', shapes);
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [currentShape]);

  /** */
  const onShapeClick = async (shape) => {
    // find shape by id
    setCurrentShape(shapes.find((s) => s.id === shape.id));
    props.setShapeProperties(shape);
  };

  /** */
  const handleKeyPress = (e) => {
    e.stopPropagation();
    const unnalowedKeys = ['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'Escape'];

    if (!currentShape) {
      return;
    }

    if (e.key === 'Delete') {
      const newShapes = shapes.filter((shape) => shape.id !== currentShape.id);
      setShapes(newShapes);
      // get latest shape in the list
      const newCurrentShape = newShapes[newShapes.length - 1];
      setCurrentShape(newShapes.length > 0 ? newCurrentShape : null);
      updateCurrentShapeInShapes();
      return;
    }

    // TODO This comportment must be handle by the text component
    if (currentShape.type === 'text') {
      let newText = currentShape.text;
      if (e.key === 'Backspace') {
        newText = newText.slice(0, -1);
      } else {
        if (unnalowedKeys.includes(e.key)) {
          return;
        }
        newText += e.key;
      }

      setCurrentShape({ ...currentShape, text: newText });
      setShapes(shapes.map((shape) => (shape.id === currentShape.id ? currentShape : shape)));
    }
  };

  const updateCurrentShapeInShapes = () => {
    const index = shapes.findIndex((s) => s.id === currentShape.id);

    if (index !== -1) {
      shapes[index] = currentShape;
      setShapes([...shapes]);
    } else {
      setShapes([...shapes, currentShape]);
    }
  };

  /** */
  const handleMouseDown = (e) => {
    try {
      const pos = e.target.getStage().getPointerPosition();
      let shape = null;
      switch (props.activeTool) {
        case 'rectangle':
        case 'ellipse':
          shape = {
            fill: props.fillColor,
            height: 1,
            id: uuidv4(),
            stroke: props.strokeColor,
            strokeWidth: props.strokeWidth,
            type: props.activeTool,
            width: 1,
            x: pos.x,
            y: pos.y,
          };
          setIsDrawing(true);

          setShapes([...shapes, shape]);
          setCurrentShape(shape);
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
          break;

        case 'line':
          setIsDrawing(true);
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
          break;
        case 'polygon':
          setIsDrawing(true);
          shape = {
            fill: props.fillColor,
            id: uuidv4(),
            points: [pos.x, pos.y],
            stroke: props.strokeColor,
            type: 'polygon',
            x: 0,
            y: 0,
          };
          setShapes([...shapes, shape]);
          setCurrentShape(shape);
          break;
        case 'arrow':
          setIsDrawing(true);
          shape = {
            fill: props.fillColor || 'red',
            id: uuidv4(),
            pointerLength: 20,
            pointerWidth: 20,
            points: [pos.x, pos.y, pos.x, pos.y],
            stroke: props.fillColor || 'red',
            type: 'arrow',
          };

          setShapes([...shapes, shape]);
          setCurrentShape(shape);

        case 'debug':
          debug('debug');
          break;
        default:
          // Handle other cases if any
          break;
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  /** */
  const handleMouseMove = (e) => {
    try {
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
          updateCurrentShapeInShapes();

          break;
        case 'line':
          setCurrentShape({
            ...currentShape,
            points: [0, 0, 0, 0, pos.x, pos.y],
          });
          // TODO simplify in one state
          updateCurrentShapeInShapes();
          break;
        case 'polygon':


          const polygonShape = { ...currentShape }

          polygonShape.points[2] = pos.x;
          polygonShape.points[3] = pos.y;

          setCurrentShape(polygonShape);


          updateCurrentShapeInShapes();
          break;
        case 'arrow':
          // update ponts
          const arrowShape = {}
          arrowShape.points = [currentShape.points[0], currentShape.points[1], pos.x, pos.y];
          arrowShape.id = currentShape.id;
          arrowShape.type = currentShape.type;
          arrowShape.pointerLength = currentShape.pointerLength;
          arrowShape.pointerWidth = currentShape.pointerWidth;
          arrowShape.x = currentShape.x;
          arrowShape.y = currentShape.y;
          arrowShape.fill = props.fillColor || "red";
          arrowShape.stroke = props.fillColor || "red";
          setCurrentShape(arrowShape);
          updateCurrentShapeInShapes();
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
    try {
      if (!currentShape) return;

      setIsDrawing(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  /** */
  const drawKonvas = () => (
    <Stage
      width={props.width || 1920}
      height={props.height || 1080}
      style={{
        height: '100%', left: 0, position: 'absolute', top: 0, width: '100%',
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      id={props.windowId}
    >
      <ParentComponent
        shapes={shapes}
        onShapeClick={onShapeClick}
        activeTool={props.activeTool}
        selectedShapeId={currentShape?.id}
      />
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
  const container = osdref ? osdref.current.element : videoref.ref.current.parentElement;

  return ReactDOM.createPortal(drawKonvas(), container);
}

AnnotationDrawing.propTypes = {
  activeTool: PropTypes.string,
  closed: PropTypes.bool,
  fillColor: PropTypes.string,
  selectedShapeId: PropTypes.string,
  strokeColor: PropTypes.string,
  strokeWidth: PropTypes.number,
  svg: PropTypes.func.isRequired,
  updateGeometry: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

AnnotationDrawing.defaultProps = {
  activeTool: null,
  closed: true,
  fillColor: null,
  selectedShapeId: null,
  strokeColor: '#00BFFF',
  strokeWidth: 1,
  svg: null,
};

export default AnnotationDrawing;
