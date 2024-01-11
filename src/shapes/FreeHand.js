import React, { Component, useState } from 'react';

import PropTypes from 'prop-types';


import {
    Stage, Layer, Star, Text, Circle, Rect
    , Ellipse, Transformer,Shape

} from 'react-konva';

class FreeHand extends React.Component {

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
        const { activeTool,points,fill } = this.props;
        const isSelected = this.props.selectedShapeId === this.props.shape.id
    
// will be a custom shape

        return (

           
            <React.Fragment>


                <Shape

                    ref={this.shapeRef}
                    x={0}
                    y={0}
                    width={this.props.width || 1920}
                    height={this.props.height || 1080}
                    points={this.props.points || [0, 0, 100, 0, 100, 100]}
                    fill={this.props.fill || 'red'}
                    stroke={this.props.stroke || 'black'}
                    strokeWidth={this.props.strokeWidth || 1}
                    id={this.props._id}
                    draggable={activeTool === 'cursor' || activeTool === 'edit'}
                    onClick={this.handleClick}
                    sceneFunc={(context, shape) => {
                        console.log('scene func',points);
                      
                         for (let i = 0; i < points.length; i += 2) {
                            context.beginPath();
                            //draw rect for each point
                            
                            context.rect(points[i] - 2.5, points[i + 1]- 2.5, 5, 5);
                            // fill rect with color
                            context.closePath();
                            

                            context.fillStrokeShape(shape);
                         }
                           
                     
                        // context.beginPath();
                        // context.moveTo(20, 50);
                        // context.lineTo(220, 80);
                        // context.quadraticCurveTo(150, 100, 260, 170);
                        // context.closePath();
                        // // (!) Konva specific method, it is very important
                        // context.fillStrokeShape(shape);



                    }}

                />

                <Transformer ref={this.trRef}

                    visible={activeTool === 'edit' && isSelected}
                />
            </React.Fragment>
        );

    }
  
  }


    FreeHand.propTypes = {
        activeTool: PropTypes.string.isRequired,
        fill: PropTypes.string,
        height: PropTypes.number,
        onShapeClick: PropTypes.func.isRequired,
        points: PropTypes.array,
        selected: PropTypes.bool,
        shape: PropTypes.object.isRequired,
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        width: PropTypes.number,
    };

    FreeHand.defaultProps = {
        fill: 'red',
        height: 1080,
        points: [0, 0, 100, 0, 100, 100],
        selected: false,
        stroke: 'black',
        strokeWidth: 1,
        width: 1920,
    };

    export default FreeHand;