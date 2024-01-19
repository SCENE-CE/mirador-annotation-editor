import React, { Component, useEffect, useState,useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  Stage, Layer, Rect, Ellipse,Arrow, Line, Text, Transformer, Group,
} from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import { OSDReferences } from '../mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from '../mirador/dist/es/src/plugins/VideosReferences';
import ParentComponent from './shapes/ParentComponent';

/** All the stuff to draw on the canvas */

let unscoppedshapes = [];
let selectedShape = null;
function AnnotationDrawing(props) {

 // console.log('AnnotationDrawing props', props);
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [lines, setLines] = React.useState([]); // For free drawing
  const [redraw, setRedraw] = useState(false);

  const {fillColor, strokeColor, strokeWidth} = props;
  // TODO A supprimer ?
  const shapeRefs = {};
  const transformerRefs = {};




  const debug = ( command ) => {
    // console.log('***************************');
    // console.log( command );
    // console.log( 'shapes', shapes );
    // console.log( 'shapes taille', shapes.length );
    // console.log( 'currentShape', currentShape );
    // console.log('isDrawing', isDrawing );
    // console.log('props.activeTool', props.activeTool );
    // console.log('-----------------------------');
  };

  useEffect(() => {
    // Perform an action when fillColor, strokeColor, or strokeWidth change

    // update current shape
    if (currentShape) {
      console.log('update current shape');
      console.log('fillColor', currentShape.fill,fillColor);
      console.log('strokeColor', currentShape.strokeColor,strokeColor);
      console.log('strokeWidth', currentShape.strokeWidth,strokeWidth);
      currentShape.fill = fillColor;
      currentShape.strokeColor = strokeColor;
      currentShape.strokeWidth = strokeWidth;
      
      setCurrentShape({...currentShape});
      updateCurrentShapeInShapes();
      
    }

  }, [fillColor, strokeColor, strokeWidth]);

  // TODO useful ?
  useEffect(() => {
 

    return () => {
      console.log('component will unmount');

    };
  }, []);

  // TODO Can be removed ?
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

    console.log("onShapeClick")

    setSelectedShapeId(shape.id);
    // find shape by id
    setCurrentShape(shapes.find((s) => s.id === shape.id));
    props.setShapeProperties(shape);
 

  };

  /** */
  const handleKeyPress = (e) => {
    e.stopPropagation();
  //  debug('handleKeyPress debut');
    const unnalowedKeys = ['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'Escape'];
  
    if (!currentShape) {
      return;
    }
  
    if (e.key === 'Delete') {
    
      const newShapes = shapes.filter((shape) => shape.id !== currentShape.id);
      setShapes(newShapes);
      setCurrentShape(null);
  
      window.removeEventListener('keydown', handleKeyPress);
      return;
    }
  
    if (currentShape.type === 'text') {
  //    debug('add text debut');
  
      let newText = currentShape.text;
      if (e.key === 'Backspace') {
        newText = newText.slice(0, -1);
      } else {
        if (unnalowedKeys.includes(e.key)) {
          return;
        }
        newText += e.key;
      }
  
      const newCurrentShape = { ...currentShape, text: newText };
      setCurrentShape(newCurrentShape);
  
      const newShapes = shapes.map((shape) =>
        shape.id === currentShape.id ? newCurrentShape : shape
      );
      setShapes(newShapes);
  
 
    }
  };

  const updateCurrentShapeInShapes = () => {

      const index = shapes.findIndex((s) => s.id === currentShape.id);

      if(index !== -1){
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
      const relativePos = e.target.getStage().getRelativePointerPosition();
    //  debug('mouse down debut');
      let shape = null;
      switch (props.activeTool) {
        case 'rectangle':
        case 'ellipse':

        shape={
          fill: props.fillColor,
          id: uuidv4(),
          strokeColor: props.strokeColor,
          strokeWidth: props.strokeWidth,
          type: props.activeTool,
          width: 1,
          height: 1,
          x: pos.x,
          y: pos.y,
        }
          setIsDrawing(true);
        
          setShapes([...shapes, shape]);
          setCurrentShape(shape);
    
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

         
          setShapes([...shapes, shape]);
          setCurrentShape(shape);
        
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
         
       //   window.addEventListener('keydown', handleKeyPress);
          break;
          case "arrow":

            setIsDrawing(true);
            shape = {
              fill: props.fillColor,
              height: 10,
              id: uuidv4(),
              points: [0, 0, 0, 0, 0, 0],
              type: 'arrow',
              width: 10,
              x: pos.x,
              y: pos.y,
            };
            setShapes([...shapes, shape]);
            setCurrentShape(shape);

        case 'debug':
          debug('debug');
        default:
          // Handle other cases if any
      }



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
          updateCurrentShapeInShapes();

          break;
        case 'line':
          // update ponts

          setCurrentShape({
            ...currentShape,
            points: [0, 0, 0, 0, pos.x, pos.y],
          });
          updateCurrentShapeInShapes();

            break;
        case 'freehand':
          currentShape.points.push(pos.x );
          currentShape.points.push(pos.y );

          setCurrentShape(currentShape);
          // setShapes(shapes.map((shape) => (shape.id === currentShape.id
          //   ? { ...shape, points: [...shape.points, e.evt.clientX, e.evt.clientY] }
          //   : shape)));

          updateCurrentShapeInShapes();


          break;
        case 'arrow':
          // update ponts
          currentShape.points[2] = pos.x;
          currentShape.points[3] = pos.y;
          setCurrentShape(currentShape);
          updateCurrentShapeInShapes();
          break;  

        default:
          break;
      }
      setRedraw(prevRedraw => !prevRedraw);
    } catch (error) {
      console.log('error', error);
    }
  };

  /** Stop drawing */
  const handleMouseUp = (e) => {
  

    const pos = e.target.getStage().getPointerPosition();

    try {
    //  if (!isDrawing) return;
      if (!currentShape) return;

      switch (props.activeTool) {
        case 'rectangle':
        case 'ellipse':
        case 'line':
        case 'freehand':
        case 'arrow':
          // For these cases, the action is similar: stop drawing and add the shape
          setIsDrawing(false);
          updateCurrentShapeInShapes();
          setCurrentShape(currentShape);
          debug('in mouse up after');
          //setCurrentShape(null);
          break;
        case 'text':
          updateCurrentShapeInShapes();
          setCurrentShape(currentShape);
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
    ) : currentShape.type === 'ellipse' ? (
      <Ellipse
        x={currentShape.x}
        y={currentShape.y}
        radiusX={currentShape.width / 2}
        radiusY={currentShape.height / 2}
        fill={props.fillColor}
        stroke={props.strokeColor}
      />
    ) : currentShape.type === 'arrow' ? (
      <Arrow
        points={[currentShape.x, currentShape.y, currentShape.width, currentShape.height]}
        fill={props.fillColor}
        stroke={props.strokeColor}
      />
    ) : null
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
