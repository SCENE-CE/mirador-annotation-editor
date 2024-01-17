import React, {Component, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import { Transformer, Shape } from 'react-konva';

function FreeHand({
  activeTool, fill, height, onShapeClick, points, selectedShapeId, shape, stroke, strokeWidth, width,
}) {
  // TODO check if selectedShapeId is needed
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedShapeId, shape]);

  // TODO check if id directly can be used
  const isSelected = selectedShapeId === shape.id;

  /** */
  const handleClick = () => {
    onShapeClick(shape);
  };

  return (
    <>
      <Shape
        ref={shapeRef}
        x={0}
        y={0}
        width={width || 1920}
        height={height || 1080}
        points={points || [0, 0, 100, 0, 100, 100]}
        fill={fill || 'red'}
        stroke={stroke || 'black'}
        strokeWidth={strokeWidth || 1}
        id={shape.id} // TODO check if id directly can be used
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
        sceneFunc={(context, freeHandShape) => {
          for (let i = 0; i < points.length; i += 2) {
            context.beginPath();
            context.rect(points[i] - 2.5, points[i + 1] - 2.5, 5, 5);
            context.closePath();
            context.fillStrokeShape(freeHandShape);
          }
        }}
      />

      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

FreeHand.propTypes = {
  activeTool: PropTypes.string.isRequired,
  fill: PropTypes.string,
  height: PropTypes.number,
  onShapeClick: PropTypes.func.isRequired,
  points: PropTypes.array,
  shape: PropTypes.object.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
};

FreeHand.defaultProps = {
  fill: 'red',
  height: 1080,
  points: [0, 0, 100, 0, 100, 100],
  stroke: 'black',
  strokeWidth: 1,
  width: 1920,
};

export default FreeHand;
