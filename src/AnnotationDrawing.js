import React, { Component, useEffect, useState,useLayoutEffect } from 'react';
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

let unscoppedshapes = [];
let selectedShape = null;
function AnnotationDrawing(props) {

  console.log('AnnotationDrawing props', props);
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [lines, setLines] = React.useState([]); // For free drawing


  // TODO A supprimer ?
  const shapeRefs = {};
  const transformerRefs = {};

  const debug = ( command ) => {
    console.log('***************************');
    console.log( command );
    console.log( 'shapes', shapes );
    console.log( 'shapes taille', shapes.length );
    console.log( 'currentShape', currentShape );
    console.log('isDrawing', isDrawing );
    console.log('props.activeTool', props.activeTool );
    console.log('-----------------------------');
  };

  // TODO useful ?
  useEffect(() => {
    // ComponentDidMount logic here
    // Add event listeners

    debug('UseEffect 1');

    // current shape intex in  shaes
    //const index = shapes.findIndex((shape) => shape.id === currentShape?.id);

    // ComponentWillUnmount logic
    return () => {
      console.log('component will unmount');

    };
  }, []);

  // TODO Can be removed ?
  useLayoutEffect(() => {
    debug('useEffect 2');
    //console.log('eventListener ', window.getEventListeners(window).keydown.length);



    if (shapes.find((s) => s.id === currentShape?.id)) {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };

    }
  }, [currentShape]);

  /** */
  const onShapeClick = (shape) => {
    debug('onShapeClick');
    setSelectedShapeId(shape.id);
    // find shape by id
    setCurrentShape(shapes.find((s) => s.id === shape.id));
    debug('onShapeClickEnd');
  };

  /** */
  const handleKeyPress = (e) => {
    e.stopPropagation();
    debug('handleKeyPress debut');
    const unnalowedKeys = ['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'Escape'];

    if (!currentShape) {
      return;
    }

    if (e.key === 'Delete') {
      debug('delete debut');
      const index = shapes.findIndex((shape) => shape.id === currentShape.id);
      if(index !== -1) {
        shapes.splice(index, 1);
        setShapes(shapes);
      }
      //setCurrentShape(shapes[shapes.length - 1]); Multidelete
      setCurrentShape(null);
      debug('delete fin');
      window.removeEventListener('keydown', handleKeyPress);
      return;
    }

    if (currentShape.type === 'text') {
      debug('add text debut');

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
      debug('add text fin');

      updateCurrentShapeInShapes();
      setCurrentShape(currentShape);

     debug('Handle key press fin');
    }
  };

  const updateCurrentShapeInShapes = () => {

      const index = shapes.findIndex((s) => s.id === currentShape.id);

      if(index !== -1){
        shapes[index] = currentShape;
        setShapes(shapes);
      } else {
        setShapes([...shapes, currentShape]);
      }
  };

  /** */
  const handleMouseDown = (e) => {

    try {
      const pos = e.target.getStage().getPointerPosition();
      const relativePos = e.target.getStage().getRelativePointerPosition();
     debug('mouse down debut');
      let shape = null;
      switch (props.activeTool) {
        case 'rectangle':
        case 'ellipse':

        shape={
          fill: props.fillColor,
          height: 0,
          id: uuidv4(),
          strokeColor: props.strokeColor,
          strokeWidth: props.strokeWidth,
          type: props.activeTool,
          width: 0,
          x: pos.x,
          y: pos.y,
        }
          setIsDrawing(true);
          setCurrentShape(shape);
          unscoppedshapes.push(shape);
          // Add global key press event listener
        //  window.addEventListener('keydown', handleKeyPress);
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

          console.log('Mouse Down shapes ' , shapes);
          console.log('Mouse Down current shape ' , currentShape);
          setShapes([...shapes, shape]);
          setCurrentShape(shape);
          console.log('Mouse Down after shapes ' , shapes);
          console.log('Mouse Down after current shape ' , currentShape);
          unscoppedshapes.push(shape);

       //   window.addEventListener('keydown', handleKeyPress);


          break;

        case 'line':
          // Not totally functionnal
          // TODO Not sure for this one
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
          unscoppedshapes.push(shape);
      //    window.addEventListener('keydown', handleKeyPress);
          break;

        case 'freehand':
          setIsDrawing(true);
          // eslint-disable-next-line no-case-declarations
          const tool = 'pen';
          shape = {
            fill: props.fillColor,
            height: 10,
            id: uuidv4(),
            lines: [pos.x, pos.y],
            points: [0, 0, 0, 0, 0, 0],
            type: 'freehand',
            width: 10,
            x: pos.x,
            y: pos.y,
          };
          // shape = {
          //   fill: props.fillColor,
          //   height: 1080, // TODO Why ? Check Konva bounding box
          //   id: uuidv4(),
          //   points,
          //   type: 'freehand',
          //   width: 1920, // TODO Why ? Check Konva bounding box
          //   x: pos.x,
          //   y: pos.y,
          // };
          // Get KOnva bounding box
            // eslint-disable-next-line no-case-declarations
           // const bb = shapeRefs[shape.id].getClientRect();

          setShapes([...shapes, shape]);
          setCurrentShape(shape);
          unscoppedshapes.push(shape);
       //   window.addEventListener('keydown', handleKeyPress);
          break;
        case 'debug':
          debug('debug');
        default:
          // Handle other cases if any
      }

      debug('mouse down fin');

      // if (!currentShape) {
      //   return;
      // }
      // // Check if the current shape is a freehand object
      // if (currentShape.type === 'freehand') {
      //   // Start drawing
      //   setIsDrawing(true);
      //   setShapes(shapes.map((s) => (s.id === currentShape.id
      //     ? { ...s, points: [...s.points, e.evt.clientX, e.evt.clientY] }
      //     : shape)));
      // }
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

          break;
        case 'line':
          // update ponts

          setCurrentShape({
            ...currentShape,
            points: [0, 0, 0, 0, pos.x, pos.y],
          });

            break;
        case 'freehand':
          currentShape.lines.push(pos.x );
          currentShape.lines.push(pos.y );

          setCurrentShape(currentShape);
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
    debug('mouse up debut');

    try {
    //  if (!isDrawing) return;
      if (!currentShape) return;

      switch (props.activeTool) {
        case 'rectangle':
        case 'ellipse':
        case 'line':
        case 'freehand':
          // For these cases, the action is similar: stop drawing and add the shape
          setIsDrawing(false);
          debug('in mouse up');
          console.log('Test' , [...shapes, currentShape]);
          updateCurrentShapeInShapes();
          debug('in mouse up after');
          //setCurrentShape(null);
          break;
        case 'text':

        default:
          // Handle any other cases if necessary
      }
      debug('mouse up fin');

    } catch (error) {
      console.log('error', error);
    }
  };

  /** */
  const drawKonvas = () => {

   // debug('draw konva debut', props.activeTool);



    const shape = shapes.find((s) => s.id === currentShape?.id);

    if (shape) {
      // if all the props are the same we don't update the shape
      // Update graphical properties of my shape
      if (props.fillColor !== shape.fill || props.strokeColor !== shape.strokeColor || props.strokeWidth !== shape.strokeWidth) {
        shape.fill = props.fillColor;
        shape.strokeColor = props.strokeColor;
        shape.strokeWidth = props.strokeWidth;

        /*const index = shapes.findIndex((s) => s.id === currentShape.id);
        shapes[index] = shape;
        setShapes(shapes);*/
      }
    }

    debug('Drow shape avant render');


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
          selectedShapeId={currentShape?.id}
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
