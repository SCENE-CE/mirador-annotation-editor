import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {
    Stage, Layer, Star, Text, Circle, Rect
    , Ellipse, Transformer,Shape, Line,

} from 'react-konva';





class LineNode extends React.Component {

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
        const isSelected = this.props.selectedShapeId === this.props.shape.id
      
        return (
            <React.Fragment>
                <Line
                    // map props to konva
                    ref={this.shapeRef}
                    x={this.props.x || 0}
                    y={this.props.y || 0}
                 
                    points={this.props.points || [0, 0, 0, 0, 100, 100]}
                    fill={this.props.fill }
                    stroke={this.props.fill }
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


export default LineNode;