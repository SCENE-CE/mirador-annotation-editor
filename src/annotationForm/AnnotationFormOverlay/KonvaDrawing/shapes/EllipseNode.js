/* eslint-disable require-jsdoc */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Ellipse, Transformer } from 'react-konva';

function EllipseNode({
  onShapeClick, shape, activeTool, isSelected,
  onTransform, handleDragEnd,
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
        scaleX={shape.scaleX}
        scaleY={shape.scaleY}
        rotation={shape.rotation}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        stroke={`rgba(${shape.stroke.r},${shape.stroke.g},${shape.stroke.b},${shape.stroke.a})`}
        strokeWidth={shape.strokeWidth || 1}
        id={shape.id}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
        onTransform={onTransform}
        onDragEnd={handleDragEnd}
      />

      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

EllipseNode.propTypes = {

  fill: PropTypes.string.isRequired,
  height: PropTypes.number,
  onShapeClick: PropTypes.func.isRequired,
  selectedShapeId: PropTypes.string,
  shape: PropTypes.object.isRequired,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};

EllipseNode.defaultProps = {
  selectedShapeId: null,
  x: 100,
  y: 100,
  width: 100,
  height: 100,
};

export default EllipseNode;
