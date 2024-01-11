import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {
    Stage, Layer, Star, Text, Circle, Rect
    , Ellipse, Transformer,Shape

} from 'react-konva';



class EllipseNode extends React.Component {

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
                <Ellipse
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



EllipseNode.propTypes = {
    onShapeClick: PropTypes.func.isRequired,
    shape: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    activeTool: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
};

export default EllipseNode;

