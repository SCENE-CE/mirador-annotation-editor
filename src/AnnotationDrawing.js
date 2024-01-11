import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { OSDReferences } from '../mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from '../mirador/dist/es/src/plugins/VideosReferences';
import { v4 as uuidv4 } from 'uuid';

import {
    Stage, Layer, Star, Text, Circle, Rect
    , Ellipse, Transformer,

} from 'react-konva';



class TextNode extends React.Component {
    constructor(props) {
        super(props);

        this.shapeRef = React.createRef();
        this.trRef = React.createRef();

    }

    handleClick = () => {
        this.props.onShapeClick(this.props.shape);

    };


    componentDidMount() {
        if (this.trRef.current) {
            this.trRef.current.nodes([this.shapeRef.current]);
            this.trRef.current.getLayer().batchDraw();

            // add event listener for key down
            // this.shapeRef.current.addEventListener('keydown', this.handleKeyDown);
        }
    }


    render() {
        const { activeTool } = this.props;
        const isSelected = this.props.selected
        console.log(this.props._id, 'is selected', isSelected);


        return (
            <React.Fragment>
                <Text
                    ref={this.shapeRef}
                    x={this.props.x}
                    y={this.props.y}
                    fontSize={this.props.fontSize}
                    fill={this.props.fill}
                    text={this.props.text}
                    id={this.props._id}


                    //dragable if tool is cursor or edit
                    draggable={activeTool === 'cursor' || activeTool === 'edit'}
                    onClick={this.handleClick}
                    onKeyDown={this.handleKeyDown}

                // onClick={activeTool === 'cursor' ? null : null}
                // onDblClick={acveTool === 'edit' ? this.handleClick : null}ti



                />

                <Transformer ref={this.trRef}

                    visible={activeTool === 'edit' && isSelected}
                />



            </React.Fragment>
        );
    }


}


class Rectangle extends React.Component {
    constructor(props) {
        super(props);
        this.shapeRef = React.createRef();
        this.trRef = React.createRef();
    }



    componentDidMount() {
        if (this.trRef.current) {
            this.trRef.current.nodes([this.shapeRef.current]);
            this.trRef.current.getLayer().batchDraw();
        }
    }

    handleClick = () => {
        this.props.onShapeClick(this.props.shape);

    };

    render() {
        const { activeTool } = this.props;
        const isSelected = this.props.selected
        console.log(this.props._id, 'is selected', isSelected);

        return (
            <React.Fragment>
                <Rect
                    // map props to konva
                    ref={this.shapeRef}
                    x={this.props.x || 100}
                    y={this.props.y || 100}
                    width={this.props.width || 100}
                    height={this.props.height || 100}
                    fill={this.props.fill || 'red'}
                    stroke={this.props.stroke || 'black'}
                    strokeWidth={this.props.strokeWidth || 1}
                    id={this.props._id}

                    draggable={activeTool === 'cursor' || activeTool === 'edit'}
                    onClick={this.handleClick}



                />





                <Transformer ref={this.trRef}

                    visible={activeTool === 'edit' && isSelected}
                />




            </React.Fragment>
        );
    }
}



class ParentComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedShapeId: this.props.selectedShapeId,
            selectedShape: null,

        };

    }


    handleShapeClick = (shape) => {

        this.setState({
            selectedShapeId: shape.id,
            selectedShape: shape
        });
        this.props.onShapeClick(shape);
        // this.setState({ selectedShapeId: id });
    };



    render() {

        const { shapes
        } = this.props;

        const { selectedShapeId } = this.state;
        let selected = false;
        let selid = selectedShapeId;
        let selectedShape = null;

        //if length is 1 and selected shape is null
        if (shapes.length === 1 && !selectedShapeId) {
            selected = true;
            selid = shapes[0].id;
            selectedShape = shapes[0];

        }

        return (
            <Layer>
                {shapes.map((shape, i) => {

                    if (selectedShape?.id === shape.id) {
                        selected = true;
                        selectedShape = shape;
                    }


                    switch (shape.type) {

                        case 'rectangle':

                            return (
                                <Rectangle


                                    shape={shape}
                                    selectedShapeId={selid}
                                    selectedShape={selectedShape}
                                    onShapeClick={this.handleShapeClick}
                                    activeTool={this.props.activeTool}
                                    _id={shape.id}
                                    key={i}
                                    x={shape.x}
                                    y={shape.y}
                                    width={shape.width}
                                    height={shape.height}
                                    fill={shape.fill}
                                    stroke={shape.strokeColor}
                                    strokeWidth={shape.strokeWidth}
                                    draggable={this.props.activeTool === 'cursor'}
                                    selected={selected}
                                // onShapeClick={this.handleShapeClick}




                                />
                            );
                            break;
                        case 'text':
                            return (
                                <TextNode

                                    shape={shape}
                                    selectedShapeId={selid}
                                    selectedShape={selectedShape}
                                    onShapeClick={this.handleShapeClick}
                                    activeTool={this.props.activeTool}
                                    selected={selected}

                                    _id={shape.id}
                                    key={i}
                                    x={shape.x}
                                    y={shape.y}
                                    fontSize={shape.fontSize}
                                    fill={shape.fill}
                                    text={shape.text}
                                    draggable={this.props.activeTool === 'cursor'}
                                    onClick={this.props.activeTool === 'cursor' ? () => this.setState({ currentShape: shape }) : null}
                                    //   onDragEnd={this.handleDragEnd(shape.id)} // Add this line
                                    onDblClick={this.handleShapeDblClick}


                                />
                            );
                            break;
                    }
                })}
            </Layer>
        );
    }
}

/** Create a portal with a drawing canvas and a form to fill annotations details */
class AnnotationDrawing extends Component {
    /** */
    constructor(props) {
        super(props);


        this.paper = null;
        this.konvas = null;


        // this.addPath = this.addPath.bind(this);
        this.drawKonvas = this.drawKonvas.bind(this);
        this.state = {
            shapes: [],
            newShape: null,
            currentShape: null,
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

                // retrun if not a letter 
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

            // Add cases for other shapes here
            default:
                break;
        }

        //     this.setState({
        //       shapes: [...shapes, newShape],
        //       currentShape: newShape,
        //       newShape: null,

        //     });
        const { newShape, shapes, currentShape } = this.state;

        if (newShape) {
            this.setState({
                shapes: [...shapes, newShape],
                currentShape: newShape,
                newShape: null,

            });
        }


    };









    drawKonvas() {




        const { shapes, newShape } = this.state;



        return (
            <Stage
                width={1920}
                height={1080}
                style={{
                    height: '100%', left: 0, position: 'absolute', top: 0, width: '100%',
                }}
                //   onMouseDown={this.handleMouseDown}
                //   onMouseUp={this.handleMouseUp}
                //   onMouseMove={this.handleMouseMove}
                onDblClick={this.handleKonvasDblClick}


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
    svg: PropTypes.string,
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
