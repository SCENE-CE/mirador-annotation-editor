/* eslint-disable require-jsdoc */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Ellipse, Transformer } from 'react-konva';
import ArrowNode from "./ArrowNode";

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
        stroke={shape.stroke}
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

ArrowNode.propTypes = {
  activeTool: PropTypes.string,
  handleDragEnd: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onShapeClick: PropTypes.func.isRequired,
  onTransform: PropTypes.func.isRequired,
  shape: PropTypes.object.isRequired,
};


export default EllipseNode;
