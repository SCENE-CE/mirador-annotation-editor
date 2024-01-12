import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { OSDReferences } from '../mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from '../mirador/dist/es/src/plugins/VideosReferences';
import { v4 as uuidv4 } from 'uuid';

import {
    Stage, Layer, Star, Text, Circle, Rect
    , Ellipse, Transformer,Shape

} from 'react-konva';
import { exportStageSVG } from 'react-konva-to-svg';



import ParentComponent from './shapes/ParentComponent';








/** Create a portal with a drawing canvas and a form to fill annotations details */
class AnnotationDrawing extends Component {
    /** */
    constructor(props) {
        super(props);


        this.paper = null;
    


        // this.addPath = this.addPath.bind(this);
        this.drawKonvas = this.drawKonvas.bind(this);
        this.state = {
            shapes: [],
            newShape: null,
            currentShape: null,
            isDrawing: false,
            svg:  async () => {
          
                
    
                // stage is the one with same windowId
    
                const stage = window.Konva.stages.find((stage) => stage.attrs.id === this.props.windowId);
            
                const svg = await exportStageSVG(stage);
                   
            
                console.log('svg',svg);
                    return svg;
            
              },
        };
        this.shapeRefs = {};
        this.transformerRefs = {};




        
        
      


    }


    onShapeClick = (shape) => {

        this.setState({ selectedShapeId: shape.id });
        const id = shape.id;
        // find shape by id 
        const currentshape = this.state.shapes.find((shape) => shape.id === id);
        console.log('current shape', currentshape);


    };


    handleKeyPress = (e) => {


        console.log('key press', e);
        const unnalowedKeys = ['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'Escape'];
        // get selected shape
        const { selectedShapeId } = this.state;

        console.log('selected shape id', selectedShapeId);
        if (!selectedShapeId) {
            return;
        }

        const { shapes } = this.state;


        const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

        if (!selectedShape) {
            return;
        }

        if (selectedShape.type === 'text') {
            console.log('text selected', selectedShape.text);

            // update text
            // let's handle text update
            if (e.key === 'Backspace') {
                selectedShape.text = selectedShape.text.slice(0, -1);
            } else {

                // return if not a letter 
                if (e.key.length !== 1) {
                    return;
                }

                // return if special char
                if (unnalowedKeys.includes(e.key)) {
                    return;
                }

                selectedShape.text += e.key;
                // update state


            }

            const index = shapes.findIndex((shape) => shape.id === selectedShapeId);
            shapes[index] = selectedShape;
            this.setState({ shapes: shapes });


        }
        

       

    };

    componentDidUpdate(prevProps) {
        if (prevProps.activeTool === 'text' && this.props.activeTool !== 'text') {
            // Remove global key press event listener
            window.removeEventListener('keypress', this.handleKeyPress);
        }
    }


    //on dbl click
    handleKonvasDblClick = (e) => {


     

        const pos = e.target.getStage().getPointerPosition();

        let shape = null;
        console.log('dbl click', this.props.activeTool);
        switch (this.props.activeTool) {
            case 'rectangle':

                shape = {
                    type: 'rectangle', x: pos.x, y: pos.y, width: 0, height: 0,
                    strokeColor: this.props.strokeColor,
                    strokeWidth: this.props.strokeWidth,
                    fill: this.props.fillColor,
                    id: uuidv4(),
                };
                this.setState({
                    selectedShapeId: shape.id,
                    newShape: shape,
                    currentShape: shape,
                });


                break;
            case "ellipse":
                shape = {
                    type: 'ellipse', x: pos.x, y: pos.y, width: 0, height: 0,
                    stroke: this.props.strokeColor,
                    strokeWidth: this.props.strokeWidth,
                    fill: this.props.fillColor,
                    id: uuidv4(),
                };
                this.setState({
                    selectedShape: shape,
                    selectedShapeId: shape.id,
                    newShape: shape,
                    currentShape: shape,
                });
                break;
            // case "polygon":
            //   this.setState({ newShape: { type: 'circle', x: pos.x, y: pos.y, width: 0, height: 0 } });
            //   break;
            // case "freehand":
            //   this.setState({ newShape: { type: 'freehand', x: pos.x, y: pos.y, width: 0, height: 0 } });
            //   break;
            case "text":

                shape = {
                    type: 'text',
                    x: pos.x,
                    y: pos.y,

                    fontSize: 20,
                    fill: this.props.fillColor,


                    text: 'text',
                    id: uuidv4(),
                };

                this.setState({ newShape: shape }, () => {
                    // Add global key press event listener
                    window.addEventListener('keydown', this.handleKeyPress);
                });
                this.setState({

                    selectedShape: shape,
                    selectedShapeId: shape.id,
                    newShape: shape,
                    currentShape: shape,
                });

                break;
                case "freehand":

                const points = [pos.x, pos.y];

                    shape = {
                        type: 'freehand',
                        x: pos.x,
                        y: pos.y,
                        with:1920,
                        height:1080,
                      
                        fill: this.props.fillColor,
                        points: points,
    
    
                        id: uuidv4(),
                    };
                    // this.setState({ newShape: shape }, () => {
                    //     // Add global key press event listener
                    //     window.addEventListener('keydown', this.handleKeyPress);
                    // });
                    this.setState({

                        selectedShape: shape,
                        selectedShapeId: shape.id,
                        newShape: shape,
                        currentShape: shape,
                    });


            // Add cases for other shapes here
            default:
                break;
        }

        const { newShape, shapes, currentShape } = this.state;

        if (newShape) {
            this.setState({
                shapes: [...shapes, newShape],
                currentShape: newShape,
                newShape: null,

            });
        }


    };


    handleMouseDown = (e) => {
        // Check if the current shape is a freehand object
        if (this.state.selectedShapeId && this.state.currentShape.type === 'freehand') {
          // Start drawing
          this.setState({
            isDrawing: true,
            shapes: this.state.shapes.map(shape => shape.id === this.state.selectedShapeId 
              ? { ...shape, points: [...shape.points, e.evt.clientX, e.evt.clientY] } 
              : shape)
          });
        }
      };
    
      handleMouseMove = (e) => {
        // Check if we're currently drawing
        if (!this.state.isDrawing) return;
    
        // Add the new point to the current shape
        this.setState({
          shapes: this.state.shapes.map(shape => shape.id === this.state.selectedShapeId 
            ? { ...shape, points: [...shape.points, e.evt.clientX, e.evt.clientY] } 
            : shape)
        });
      };
    
      handleMouseUp = () => {
        // Stop drawing
        this.setState({ isDrawing: false });
      };






    drawKonvas() {




        const { shapes, newShape } = this.state;
        const { windowId } = this.props;
  

// potentiellement videoRef et windowId
        return (
            <Stage
                width={this.props.width || 1920}
                height={this.props.height || 1080}
                style={{
                    height: '100%', left: 0, position: 'absolute', top: 0, width: '100%',
                }}
                   onMouseDown={this.handleMouseDown}
                   onMouseUp={this.handleMouseUp}
                   onMouseMove={this.handleMouseMove}
                   onDblClick={this.handleKonvasDblClick}
                   id={windowId}
                  


            >


                <ParentComponent shapes={shapes}
                    onShapeClick={this.onShapeClick}
                    activeTool={this.props.activeTool}
                    selectedShapeId={this.state.selectedShapeId}
                />


            </Stage>
        );




    }




    /** */
    render() {
        const { windowId } = this.props;
        const osdref = OSDReferences.get(windowId);
        const videoref = VideosReferences.get(windowId);
        if (!osdref && !videoref) {
            throw new Error("Unknown or missing data player, didn't found OpenSeadragon (image viewer) nor the video player");
        }
        if (osdref && videoref) {
            throw new Error('Unhandled case: both OpenSeadragon (image viewer) and video player on the same canvas');
        }
        const container = osdref
            ? osdref.current.element
            : videoref.ref.current.parentElement;
        return (
            ReactDOM.createPortal(this.drawKonvas(), container)
        );
    }
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
