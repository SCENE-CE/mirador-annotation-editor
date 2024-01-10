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
        this.props.onShapeClick(this.props.id);
      
    };


    componentDidMount() {
        if (this.trRef.current) {
            this.trRef.current.nodes([this.shapeRef.current]);
            this.trRef.current.getLayer().batchDraw();
        }
    }

    render() {
        const { activeTool } = this.props;
        console.log("selectedId", this.props.selectedShapeId);

        const isSelected = this.props.id === this.props.selectedShapeId;


        return (
            <React.Fragment>
                <Text
                    ref={this.shapeRef}
                    x={this.props.x}
                    y={this.props.y}
                    fontSize={this.props.fontSize}
                    fill={this.props.fill}
                    text={this.props.text}


                    //dragable if tool is cursor or edit
                    draggable={activeTool === 'cursor' || activeTool === 'edit'}
                    onClick={this.handleClick}
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
        this.props.onShapeClick(this.props.id);
      
    };

    render() {
        const { activeTool } = this.props;
        console.log('active tool ===>', activeTool);
        console.log("selectedId", this.props.selectedShapeId);
        const isSelected = this.props.id === this.props.selectedShapeId;


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

                    draggable={activeTool === 'cursor' || activeTool === 'edit'}
                    onClick={this.handleClick}



                />





                <Transformer ref={this.trRef}

                    visible={activeTool === 'edit'}
                />




            </React.Fragment>
        );
    }
}



class ParentComponent extends React.Component {
    constructor(props) {
        super(props);

        
    }


    handleShapeClick = (id) => {
        console.log('shape clicked', id);
        this.setState({ selectedShapeId: id });
    };

    render() {

        const { shapes, selectedShapeId
         } = this.props;

        console.log("selectedId", this.props.selectedShapeId);
        return (
            <Layer>
                {shapes.map((shape, i) => {
                    console.log('shape', shape);
                    switch (shape.type) {

                        case 'rectangle':

                            return (
                                <Rectangle

                                    selectedShapeId={this.props.selectedShapeId}
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
                                    onShapeClick={this.handleShapeClick}




                                />
                            );
                            break;
                        case 'text':
                            return (
                                <TextNode

                                    activeTool={this.props.activeTool}
                                    selectedShapeId={this.props.selectedShapeId}
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
                                    onShapeClick={this.handleShapeClick}

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






    //on dbl click
    handleKonvasDblClick = (e) => {


        console.log('db click', this.props);

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



        console.log('draw konvas', this.props);

        const { shapes, newShape, currentShape } = this.state;




        // console.log(JSON.stringify(shapes, null, 2));


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
                    selectedShapeId
                    activeTool={this.props.activeTool}
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
