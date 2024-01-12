import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { OSDReferences } from '../mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from '../mirador/dist/es/src/plugins/VideosReferences';
import { v4 as uuidv4 } from 'uuid';

import {
    Stage, Layer, Star, Text, Circle, Rect
    , Ellipse, Transformer, Shape

} from 'react-konva';



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

        // if delete is pressed we whant to delete the shape

        if (e.key === 'Delete') {
            console.log('delete key pressed');
            const { shapes } = this.state;
            const index = shapes.findIndex((shape) => shape.id === selectedShapeId);
            shapes.splice(index, 1);
            this.setState({ shapes: shapes, selectedShapeId: null });
            return;
        }


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

        console.log('did update', this.props.activeTool);
        // check for selectined fhape, if colors are changesd we update the shape
        // Remove global key press event listener
        window.removeEventListener('keypress', this.handleKeyPress);
  






    }



    handleMouseDown = (e) => {

        try {

            const pos = e.target.getStage().getPointerPosition();
            console.log('mouse down', this.props.activeTool);
            let shape = null;
            switch (this.props.activeTool) {
                case 'rectangle':
                case 'ellipse':
                    this.setState({
                        isDrawing: true,
                        currentShape: {
                            type: this.props.activeTool,
                            x: pos.x,
                            y: pos.y,
                            width: 0,
                            height: 0,
                            strokeColor: this.props.strokeColor,
                            strokeWidth: this.props.strokeWidth,
                            fill: this.props.fillColor,
                            id: uuidv4(),
                        },
                    }, () => {
                        // Add global key press event listener
                        window.addEventListener('keydown', this.handleKeyPress);
                    });
                    break;
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


                    this.setState({

                        shapes: [...this.state.shapes, shape],
                        selectedShape: shape,
                        selectedShapeId: shape.id,
                        newShape: shape,
                        currentShape: shape,
                    }, () => {
                        // Add global key press event listener
                        window.addEventListener('keydown', this.handleKeyPress);
                    });
                    console.log('text', shape);
                    break;


                case "line":
                    shape = {
                        type: 'line',
                        x: pos.x,
                        y: pos.y,
                        with: 10,
                        height: 10,
                        fill: this.props.fillColor,
                        points: [0, 0, 0, 0, 0, 0],
                        id: uuidv4(),
                    };

                    this.setState({

                        shapes: [...this.state.shapes, shape],
                        selectedShape: shape,
                        selectedShapeId: shape.id,
                        newShape: shape,
                        currentShape: shape,
                    }, () => {
                        // Add global key press event listener
                        window.addEventListener('keydown', this.handleKeyPress);
                    });
                    break;


                case "freehand":


                    const points = [pos.x, pos.y];

                    shape = {
                        type: 'freehand',
                        x: pos.x,
                        y: pos.y,
                        with: 1920,
                        height: 1080,
                        fill: this.props.fillColor,
                        points: points,
                        id: uuidv4(),
                    };

                    this.setState({

                        shapes: [...this.state.shapes, shape],
                        selectedShape: shape,
                        selectedShapeId: shape.id,
                        newShape: shape,
                        currentShape: shape,
                    }, () => {
                        // Add global key press event listener
                        window.addEventListener('keydown', this.handleKeyPress);
                    });

                // other cases
            }



            if (this.state.currentShape === null) return;
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

        } catch (e) {
            console.log('error', e);
        }
    };

    // handleMouseMove = (e) => {
    //     // Check if we're currently drawing
    //     if (!this.state.isDrawing) return;


    //     // Add the new point to the current shape

    // };


    handleMouseMove = (e) => {

        try {
            console.log('mouse move', this.props.activeTool);
            if (!this.state.isDrawing) return;


            if (this.state.currentShape === null) return;
            const pos = e.target.getStage().getPointerPosition();

            switch (this.props.activeTool) {
                case 'rectangle':
                case 'ellipse':

                    // prevent negative radius for ellipse

                    if (this.state.currentShape.type === 'ellipse') {
                        if (pos.x < this.state.currentShape.x) {
                            pos.x = this.state.currentShape.x;
                        }
                        if (pos.y < this.state.currentShape.y) {
                            pos.y = this.state.currentShape.y;
                        }
                    }



                    this.setState({
                        currentShape: {
                            ...this.state.currentShape,
                            width: pos.x - this.state.currentShape.x,
                            height: pos.y - this.state.currentShape.y,
                        },
                    });

                    break;
                case "line":
                    // update ponts 




                    this.setState({
                        currentShape: {
                            ...this.state.currentShape,
                            points: [0, 0, 0, 0, pos.x, pos.y],
                        },
                    });
                case "freehand":
                    this.setState({
                        shapes: this.state.shapes.map(shape => shape.id === this.state.selectedShapeId
                            ? { ...shape, points: [...shape.points, e.evt.clientX, e.evt.clientY] }
                            : shape)
                    });
                    break;

                default:
                    break;
            }

        } catch (e) {
            console.log('error', e);
        }

    };

    handleMouseUp = () => {
        // Stop drawing

        try {
            console.log('mouse up', this.props.activeTool);
            if (!this.state.isDrawing) return;
            if (!this.state.currentShape) return;

            switch (this.props.activeTool) {

                case 'rectangle':
                case 'ellipse':

                    this.setState((prevState) => ({
                        isDrawing: false,
                        shapes: [...prevState.shapes, prevState.currentShape],
                        currentShape: null,
                    }));
                    break;
                case "line":
                    this.setState((prevState) => ({
                        isDrawing: false,
                        shapes: [...prevState.shapes, prevState.currentShape],
                        currentShape: null,
                    }));
                    break;
                case "freehand":
                    this.setState((prevState) => ({
                        isDrawing: false,
                        shapes: [...prevState.shapes, prevState.currentShape],
                        currentShape: null,
                    }));
                    break;
                default:


            }
        }
        catch (e) {
            console.log('error', e);
        }
    };






    drawKonvas() {




        const { shapes, currentShape, newShape, isDrawing } = this.state;
        const { windowId } = this.props;

     

        const shape = shapes.find((shape) => shape.id === this.state.selectedShapeId);

        if (shape) {
            
        

            // if all the props are the same we don't update the shape

            if (this.props.fillColor !== shape.fill || this.props.strokeColor !== shape.strokeColor || this.props.strokeWidth !== shape.strokeWidth) {
                shape.fill = this.props.fillColor;
                shape.strokeColor = this.props.strokeColor;
                shape.strokeWidth = this.props.strokeWidth;
            
    
    
            const index = shapes.findIndex((shape) => shape.id === this.state.selectedShapeId);
            shapes[index] = shape;
            this.setState({ shapes: shapes });
               
            }


         

    }




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
                //  onDblClick={this.handleKonvasDblClick}
                id={windowId}



            >


                {<ParentComponent shapes={shapes}
                    onShapeClick={this.onShapeClick}
                    activeTool={this.props.activeTool}
                    selectedShapeId={this.state.selectedShapeId}
                />}

                <Layer>

                    {isDrawing && currentShape && (
                        currentShape.type === 'rectangle' ? (
                            <Rect
                                x={currentShape.x}
                                y={currentShape.y}
                                width={currentShape.width}
                                height={currentShape.height}
                                fill={this.props.fillColor}
                                stroke={this.props.strokeColor}
                            // other props
                            />
                        ) : (
                            <Ellipse
                                x={currentShape.x}
                                y={currentShape.y}
                                radiusX={currentShape.width / 2}
                                radiusY={currentShape.height / 2}
                                fill={this.props.fillColor}
                                stroke={this.props.strokeColor}
                            // other props
                            />
                        )
                    )}
                </Layer>


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
