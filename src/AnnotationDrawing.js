/* eslint-disable require-jsdoc */
import React, { Component, useEffect, useState, useLayoutEffect,useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  Stage, Layer, Rect, Ellipse, Arrow, Line, Text, Transformer, Group,
} from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import ParentComponent from './shapes/ParentComponent';

/** All the stuff to draw on the canvas */

function AnnotationDrawing(props) {

 // console.log('AnnotationDrawing props', props);
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [lines, setLines] = React.useState([]); // For free drawing
  const [redraw, setRedraw] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });


  // useEffect(() => {
  //   if (containerRef.current) {
  //     setDimensions({
  //       width: containerRef.current.offsetWidth,
  //       height: containerRef.current.offsetHeight,
  //     });
  //   }
  // }, []);


  const { fillColor, strokeColor, strokeWidth } = props;


  /** Debug function facility */
  const debug = (command) => {
    // if(config.debugMode) {
      console.debug('***************************');
      console.debug(command);
      console.debug('shapes', shapes);
      console.debug('shapes taille', shapes.length);
      console.debug('currentShape', currentShape);
      console.debug('isDrawing', isDrawing);
      console.debug('props.activeTool', props.activeTool);
      console.debug('-----------------------------');
    // }
  };

  /** */
  useEffect(() => {

   // if tool is cursor or edit select latest shape

    if (!isDrawing) {
      const newCurrentShape = shapes[shapes.length - 1];
          // get latest shape in the list
         if(newCurrentShape) {
          setCurrentShape(newCurrentShape );
         
         }
    
    }


    // console.log('shapes', shapes);
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
    const newShapes = shapes.filter((s) => s.id !== shape.id); // remove shape from the list
     newShapes.push(shape); // add shape to the end of the list
     setShapes(newShapes); // update shapes list

    setSelectedShapeId(shape.id);
    // find shape by id
    setCurrentShape(shapes.find((s) => s.id === shape.id));
    props.setShapeProperties(shape);
  };

  /** */
  const handleKeyPress = (e) => {
    e.stopPropagation();
    //  debug('handleKeyPress debut');
    const unnalowedKeys = ['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'Escape', 'Tab','AltGraph','CapsLock','NumLock','ScrollLock','Pause','Insert','Home','PageUp','PageDown','End','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ContextMenu','PrintScreen','Help','Clear','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','OS']

    if (!currentShape) {
      return;
    }

    if (e.key === 'Delete') {

      const newShapes = shapes.filter((shape) => shape.id !== currentShape.id);
      setShapes(newShapes);



      //  window.removeEventListener('keydown', handleKeyPress);
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
     // const relativePos = e.target.getStage().getRelativePointerPosition();
      //  debug('mouse down debut');
      let shape = null;
      switch (props.activeTool) {
        case 'rectangle':
        case 'ellipse':

          shape = {
            fill: props.fillColor,
            id: uuidv4(),
            stroke: props.strokeColor,
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


        case 'freehand':
          // Not totally functionnal
          // TODO Not sure for this one
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
            type: 'freehand',

            x: 0,
            y: 0,
      
         
          };
          setShapes([...shapes, shape]);
          setCurrentShape(shape);

          //    window.addEventListener('keydown', handleKeyPress);
          break;

        case 'polygon':
          setIsDrawing(true);
          // eslint-disable-next-line no-case-declarations

          shape = {
            fill: props.fillColor,
            stroke: props.strokeColor,

            id: uuidv4(),

            points: [pos.x, pos.y],
            type: 'polygon',

            x: 0,
            y: 0,
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
            fill: props.fillColor || "red",
            stroke: props.fillColor || "red",
            pointerLength: 20,
            pointerWidth: 20,
            id: uuidv4(),
            points: [pos.x, pos.y, pos.x, pos.y],
            type: 'arrow'


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
      const pos = e.target.getStage().getRelativePointerPosition();
   

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
        case 'freehand':
     
          const shape = { ...currentShape };

          const lastpoints = shape.lines[shape.lines.length - 1].points;

          shape.lines.push({
            points: [lastpoints[2].x, lastpoints[2].y, pos.x, pos.y],
            stroke: props.strokeColor,
            strokeWidth: props.strokeWidth,
          });
      
          setCurrentShape(shape);
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


          break;

        default:
          break;
      }
      // setRedraw(prevRedraw => !prevRedraw);
    } catch (error) {
      console.log('error', error);
    }
  };

  /** Stop drawing */
  const handleMouseUp = (e) => {


    const pos = e.target.getStage().getRelativePointerPosition();
    try {
      //  if (!isDrawing) return;
      if (!currentShape) return;


      // For these cases, the action is similar: stop drawing and add the shape
      setIsDrawing(false);
      // setCurrentShape({...currentShape});
      // updateCurrentShapeInShapes();




    } catch (error) {
      console.log('error', error);
    }
  };

  /** */
  const drawKonvas = () => {

    // debug('draw konva debut', props.activeTool);





    return (
    
      <Stage

        width={ props.width}  
        height={ props.height}
        style={{ position: 'absolute', top: 0, left: 0 ,
        width: "100%",
        height: "auto",
        objectFit: "contain",
        overflowClipMargin: "content-box",
        overflow: "clip"
      
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
          style={{ position: 'absolute', top: 0, left: 0 ,width: "100%", height: "auto",objectFit: "contain",overflowClipMargin: "content-box",overflow: "clip"}}
          scale={props.scale}
          width={props.originalWidth}
          height={props.originalHeight}

        />

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
