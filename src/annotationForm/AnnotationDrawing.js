/* eslint-disable require-jsdoc */
import React, {
  useEffect, useState, useLayoutEffect,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes, { object } from 'prop-types';
import { Stage } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line import/no-extraneous-dependencies
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
// eslint-disable-next-line import/no-extraneous-dependencies
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import ParentComponent from './KonvaDrawing/shapes/ParentComponent';

/** All the stuff to draw on the canvas */
function AnnotationDrawing(props) {
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const { height, width } = VideosReferences.get(props.windowId).ref.current;

  useEffect(() => {
    const overlay = VideosReferences.get(props.windowId).ref.current;
    props.updateScale(overlay.containerWidth / overlay.canvasWidth);
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

    setShapes([...shapes, shape]);
    setCurrentShape(shape);
  }, [props.imageEvent]);

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
    if (!isDrawing) {
      const newCurrentShape = shapes[shapes.length - 1];
      // get latest shape in the list
      if (newCurrentShape) {
        setCurrentShape(newCurrentShape);
      }
    }
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
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [currentShape]);

  /** */
  const onShapeClick = async (shape) => {
    const newShapes = shapes.filter((s) => s.id !== shape.id); // remove shape from the list
    newShapes.push(shape); // add shape to the end of the list
    setShapes(newShapes); // update shapes list
    // find shape by id
    setCurrentShape(shapes.find((s) => s.id === shape.id));
    props.setShapeProperties(shape); // TODO Check that code ?
    props.setColorToolFromCurrentShape(
        {
          fillColor: shape.fill,
          strokeColor: shape.stroke,
          strokeWidth: shape.strokeWidth,
        })
  };

  const onTransform = (evt) => {
 
    const modifiedshape = evt.currentTarget.attrs;



    const shape = shapes.find((s) => s.id === modifiedshape.id);
    // TODO improve
   
    // shape.scaleY = modifiedshape.scaleY || shape.scaleY;
    Object.assign(shape, modifiedshape);
   
    setCurrentShape({ ...shape });
    updateCurrentShapeInShapes();
  };

  const handleDragEnd = (evt) => {
  
    const modifiedshape = evt.currentTarget.attrs;
    const shape = shapes.find((s) => s.id === modifiedshape.id);
    shape.x = modifiedshape.x;
    shape.y = modifiedshape.y;

    setCurrentShape({ ...shape });
    updateCurrentShapeInShapes();
  };

  /** */
  const handleKeyPress = (e) => {
    e.stopPropagation();
    const unnalowedKeys = ['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'Escape', 'Tab', 'AltGraph', 'CapsLock', 'NumLock', 'ScrollLock', 'Pause', 'Insert', 'Home', 'PageUp', 'PageDown', 'End', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ContextMenu', 'PrintScreen', 'Help', 'Clear', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'OS'];

    if (!currentShape) {
      return;
    }

    if (e.key === 'Delete') {
      const newShapes = shapes.filter((shape) => shape.id !== currentShape.id);
      setShapes(newShapes);
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

      // TODO Check
      /* setCurrentShape({ ...currentShape, text: newText }); */
      const newCurrentShape = { ...currentShape, text: newText };
      setCurrentShape(newCurrentShape);

      // setShapes(shapes.map((shape) => (shape.id === currentShape.id ? currentShape : shape)));
      const newShapes = shapes.map((shape) => (shape.id === currentShape.id ? newCurrentShape : shape));
      setShapes(newShapes);
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
      const pos = e.target.getStage().getRelativePointerPosition();
      pos.x /= props.scale;
      pos.y /= props.scale;
      let shape = null;
      switch (props.activeTool) {
        case 'rectangle':
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
          setIsDrawing(true);
          setShapes([...shapes, shape]);
          setCurrentShape(shape);
        case 'ellipse':
          shape = {
            fill: props.fillColor,
            height: 1,
            id: uuidv4(),
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: props.strokeColor,
            strokeWidth: props.strokeWidth,
            radiusX: 1,
            radiusY: 1,
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
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            text: 'text',
            type: 'text',
            x: pos.x,
            y: pos.y,
          };

          setShapes([...shapes, shape]);
          setCurrentShape(shape);
          break;
        case 'freehand':
          // Not totally functionnal
          setIsDrawing(true);
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
            type: 'freehand',
            x: 0,
            y: 0,
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
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: props.strokeColor,
            strokeWidth: props.strokeWidth,
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
            fill: props.fillColor,
            id: uuidv4(),
            pointerLength: 20,
            pointerWidth: 20,
            points: [pos.x, pos.y, pos.x, pos.y],
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: props.strokeColor,
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
      console.error('error', error);
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
      const pos = e.target.getStage().getRelativePointerPosition();
      pos.x /= props.scale;
      pos.y /= props.scale;

      switch (props.activeTool) {
        case 'rectangle':

        setCurrentShape({
          ...currentShape,
          height: pos.y - currentShape.y,
          width: pos.x - currentShape.x,
        });
        updateCurrentShapeInShapes();
        case 'ellipse':
          // prevent negative radius for ellipse
         
            if (pos.x < currentShape.x) {
              pos.x = currentShape.x;
            }
            if (pos.y < currentShape.y) {
              pos.y = currentShape.y;
            }
          

          setCurrentShape({
            ...currentShape,
            height: pos.y - currentShape.y,
            radiusX: (pos.x - currentShape.x) / 2,
             width: pos.x - currentShape.x,
            radiusY: (pos.y - currentShape.y) / 2,
          });
          updateCurrentShapeInShapes();

          break;
        case 'freehand':
          const shape = { ...currentShape };
          shape.lines.push({
            points: [pos.x, pos.y, pos.x, pos.y],
            stroke: props.strokeColor,
            strokeWidth: props.strokeWidth,
          });
          setCurrentShape(shape);
          updateCurrentShapeInShapes();
          break;
        case 'polygon':
          const polygonShape = { ...currentShape };
          polygonShape.points[2] = pos.x;
          polygonShape.points[3] = pos.y;
          setCurrentShape(polygonShape);
          updateCurrentShapeInShapes();
          break;
        case 'arrow':
          // TODO improve
          const arrowShape = {};
          // update points
          arrowShape.points = [currentShape.points[0], currentShape.points[1], pos.x, pos.y];
          arrowShape.id = currentShape.id;
          arrowShape.type = currentShape.type;
          arrowShape.pointerLength = currentShape.pointerLength;
          arrowShape.pointerWidth = currentShape.pointerWidth;
          arrowShape.x = currentShape.x;
          arrowShape.y = currentShape.y;
          arrowShape.fill = props.fillColor;
          arrowShape.stroke = props.strokeColor;
          arrowShape.strokeWidth = props.strokeWidth;
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
    const pos = e.target.getStage().getRelativePointerPosition();
    pos.x /= props.scale;
    pos.y /= props.scale;
    try {
      if (!currentShape) {
        return;
      }
      // For these cases, the action is similar: stop drawing and add the shape
      setIsDrawing(false);
    } catch (error) {
      console.error('error', error);
    }
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
      <ParentComponent
        shapes={shapes}
        onShapeClick={onShapeClick}
        activeTool={props.activeTool}
        selectedShapeId={currentShape?.id}
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
        scale={props.scale}
        width={props.originalWidth}
        height={props.originalHeight}
        onTransform={onTransform}
        handleDragEnd={handleDragEnd}
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
  fillColor: 'red',
  selectedShapeId: null,
  strokeColor: '#00BFFF',
  strokeWidth: 1,
  svg: null,
};

export default AnnotationDrawing;