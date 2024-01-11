import React, { Component, useState } from 'react';

import PropTypes from 'prop-types';


import {
    Stage, Layer, Star, Text, Circle, Rect
    , Ellipse, Transformer,Shape

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
        const isSelected = this.props.selectedShapeId === this.props.shape.id
      

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


export default TextNode;