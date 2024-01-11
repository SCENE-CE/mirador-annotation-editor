import React, { Component, useState } from 'react';

import PropTypes from 'prop-types';


import {
    Stage, Layer, Star, Text, Circle, Rect
    , Ellipse, Transformer,Shape

} from 'react-konva';


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
        const isSelected = this.props.selectedShapeId === this.props.shape.id
      
   
        console.log('rect props', this.props);
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



Rectangle.propTypes = {
    shape: PropTypes.object.isRequired,
    onShapeClick: PropTypes.func.isRequired,
    activeTool: PropTypes.string.isRequired,
    selected: PropTypes.bool,
};

Rectangle.defaultProps = {
    selected: false,
};

export default Rectangle;