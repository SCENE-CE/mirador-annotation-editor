import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, Transformer } from 'react-konva';

function TextNode({
  shape, onShapeClick, activeTool, isSelected,
  onTransform, handleDragEnd
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
    
        fontSize={shape.fontSize}

        fill={`rgba(${shape.fill.r},${shape.fill.g},${shape.fill.b},${shape.fill.a})`}
        text={shape.text}
        id={shape.id}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
        onTransform={onTransform}
        onDragEnd={ handleDragEnd}
      />
      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

export default TextNode;
