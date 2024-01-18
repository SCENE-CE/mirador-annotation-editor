import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, Transformer } from 'react-konva';

function TextNode({
  shape, selectedShapeId, x, y, fontSize, fill, text, onShapeClick, activeTool, isSelected,
}) {
  const shapeRef = useRef();
  const trRef = useRef();

    console.log('Shape', shape);

  const handleClick = () => {
      console.log("TextNode handleClick", shape.id);
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
        x={x}
        y={y}
        fontSize={fontSize}
        fill={fill}
        text={text}
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

export default TextNode;
