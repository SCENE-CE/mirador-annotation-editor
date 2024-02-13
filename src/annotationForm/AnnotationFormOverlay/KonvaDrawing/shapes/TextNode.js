import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, Transformer } from 'react-konva';

function TextNode({
  shape, onShapeClick, activeTool, isSelected,
  onTransform, handleDragEnd, handleDragStart,
}) {
  const shapeRef = useRef();
  const trRef = useRef();

  const handleClick = () => {
    onShapeClick(shape);
  };

  useEffect(() => {
    if (trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, []); // Empty array to mimic componentDidMount behavior

  return (
    <>
      <Text
        ref={shapeRef}
        scaleX={shape.scaleX}
        scaleY={shape.scaleY}
        rotation={shape.rotation}
        x={shape.x}
        y={shape.y}
        fontSize={40}
        fill={shape.fill}
        text={shape.text}
        id={shape.id}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
        onMousedown={handleClick}
        onTransform={onTransform}
        onDrag={handleDragEnd}
        onDragStart={handleDragStart}
      />
      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

export default TextNode;
