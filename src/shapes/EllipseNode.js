/* eslint-disable require-jsdoc */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Ellipse, Transformer } from 'react-konva';

function EllipseNode({
  onShapeClick, shape, activeTool, isSelected, x, y, width, height, fill, stroke, strokeWidth,
}) {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleClick = () => {
    onShapeClick(shape);
  };

  return (
    <>
      <Ellipse
        ref={shapeRef}
        x={x || 100}
        y={y || 100}
        width={width || 100}
        height={height || 100}
        fill={fill || 'red'}
        stroke={stroke || 'black'}
        strokeWidth={strokeWidth || 1}
        id={shape.id}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
      />

      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

EllipseNode.propTypes = {
  onShapeClick: PropTypes.func.isRequired,
  shape: PropTypes.object.isRequired,
  activeTool: PropTypes.string.isRequired,
  selectedShapeId: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
};

EllipseNode.defaultProps = {
  selectedShapeId: null,
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 1,
};

export default EllipseNode;
