import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';


import FreeHand from './FreeHand';
import Rectangle from './Rectangle';

import EllipseNode from './EllipseNode';
import TextNode from './TextNode';
import {
    Stage, Layer, Star, Text, Circle, Rect
    , Ellipse, Transformer,Shape

} from 'react-konva';

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
                        case 'ellipse':
                            
                            return (
                                <EllipseNode

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
                                    width={shape.width}
                                    height={shape.height}
                                    fill={shape.fill}
                                    stroke={shape.strokeColor}
                                    strokeWidth={shape.strokeWidth}
                                    draggable={this.props.activeTool === 'cursor'}
                                    onClick={this.props.activeTool === 'cursor' ? () => this.setState({ currentShape: shape }) : null}
                                    //   onDragEnd={this.handleDragEnd(shape.id)} // Add this line
                                    onDblClick={this.handleShapeDblClick}


                                />
                            );
                            break;
                        case 'freehand':
                            return (
                                <FreeHand

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
                                    points={shape.points}
                                    fill={shape.fill}
                                    stroke={shape.strokeColor}
                                    strokeWidth={shape.strokeWidth}
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


ParentComponent.propTypes = {
    shapes: PropTypes.arrayOf(PropTypes.object).isRequired,
    onShapeClick: PropTypes.func.isRequired,
    selectedShapeId: PropTypes.string,
    activeTool: PropTypes.string.isRequired,
};

ParentComponent.defaultProps = {
    selectedShapeId: null,
};

export default ParentComponent;