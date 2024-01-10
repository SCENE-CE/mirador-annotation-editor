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
        this.props.onShapeClick(this.props._id);
      
    };


    componentDidMount() {
        if (this.trRef.current) {
            this.trRef.current.nodes([this.shapeRef.current]);
            this.trRef.current.getLayer().batchDraw();

            // add event listener for key down
           // this.shapeRef.current.addEventListener('keydown', this.handleKeyDown);
        }
    }

    handleKeyDown = (e) => {
        // if (e.keyCode === 13) {
        //     this.shapeRef.current.blur();
        // }
        //type text content
        console.log('Key down:', e.evt.key);
        //update text content


        if (e.evt.key === 'Backspace') {
            const { shapes } = this.state;
            const { selectedShapeId } = this.state;
          
            // update text of selected shape

            const newShapes = shapes.map((shape) => {
                if (shape.id === selectedShapeId) {
                    shape.text = shape.text.slice(0, -1);
                }
                return shape;
            }
            );

            this.setState({ shapes: newShapes });
        }else{

            const { shapes } = this.state;
            const { selectedShapeId } = this.state;
          
            // update text of selected shape

            const newShapes = shapes.map((shape) => {
                if (shape.id === selectedShapeId) {
                    shape.text = shape.text + e.evt.key;
                }
                return shape;
            }
            );

            this.setState({ shapes: newShapes });


        }


      

        

    }

    render() {
        const { activeTool } = this.props;
        console.log("selectedId", this.props._id, window.selectedShapeId);

        const isSelected = this.props._id === window.selectedShapeId;

        console.log('is selected', this.props._id,isSelected);


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
        this.props.onShapeClick(this.props._id);
      
    };

    render() {
        const { activeTool } = this.props;
        console.log("selectedId", this.props._id, window.selectedShapeId);

        const isSelected = this.props._id === window.selectedShapeId;

        console.log('is selected', this.props._id,isSelected);

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
            currentShape: null,
        };
        
    }


    handleShapeClick = (id) => {
        console.log('shape clicked', id);
        window.selectedShapeId = id;
        this.setState({ selectedShapeId: id });
    


        // this.setState({ selectedShapeId: id });
    };

    //handle key down

    // handleKeyPress = (e) => {
    //     console.log('key press', e);
    //     if (e.key === 'Backspace') {
    //         const { shapes } = this.state;
    //         const { selectedShapeId } = this.state;
    //         const newShapes = shapes.filter((shape) => shape.id !== selectedShapeId);
    //         this.setState({ shapes: newShapes });
    //     }
    
    //     if (e.key === 'Escape') {
    //         this.setState({ currentShape: null });
    //         window.removeEventListener('keydown', this.handleKeyPress);
    //     }

    //     if (e.key === 'Enter') {
    //         this.setState({ currentShape: null });
    //         window.removeEventListener('keydown', this.handleKeyPress);
    //     }


    //     if (e.key === 'Delete') {
    //         const { shapes } = this.state;
    //         const { selectedShapeId } = this.state;
    //         const newShapes = shapes.filter((shape) => shape.id !== selectedShapeId);
    //         this.setState({ shapes: newShapes });
    //     }


    // }

    render() {

        const { shapes
         } = this.props;

         console.log('shapes', this.props.shapes);
      
        return (
            <Layer>
                {shapes.map((shape, i) => {
                   
                    switch (shape.type) {

                        case 'rectangle':

                            return (
                                <Rectangle

                                
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

        const { shapes, newShape  } = this.state;

        // update selected shape with new props if any
        // for (let shape of shapes) {
        //     if (shape.id === window.selectedShapeId) {

        //         shape.strokeColor = this.props.strokeColor;
        //         shape.strokeWidth = this.props.strokeWidth;
        //         shape.fill = this.props.fillColor;

        //         // update shape in state
        //         this.setState({ shapes: [...shapes] });
            

                
        //     }
            
        // }




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
