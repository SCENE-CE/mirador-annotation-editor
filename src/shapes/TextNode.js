import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, Transformer } from 'react-konva';

function TextNode({
  shape, selectedShapeId, x, y, fontSize, fill, text, onShapeClick, activeTool, isSelected,
  onTransformEnd, handleDragEnd
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
    
        fontSize={fontSize}

        fill={fill}
        text={text}
        id={shape.id}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
        onTransformEnd={onTransformEnd}
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
