import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Rect, Transformer } from 'react-konva';

function Rectangle({
  shape, onShapeClick, activeTool, isSelected,
  onTransformEnd, handleDragEnd
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
      <Rect
        ref={shapeRef}
        x={shape.x || 100}
        y={shape.y || 100}
        scaleX={shape.scaleX}
        scaleY={shape.scaleY}
        rotation={shape.rotation}
        width={shape.width || 100}
        height={shape.height || 100}
        fill={shape.fill || 'red'}
        stroke={shape.stroke || 'black'}
        strokeWidth={shape.strokeWidth || 1}
        id={shape.id}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
        onTransformEnd={onTransformEnd}
        onDragEnd={handleDragEnd}
      />

      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

Rectangle.propTypes = {
  activeTool: PropTypes.string.isRequired,
  fill: PropTypes.string,
  height: PropTypes.number,
  onShapeClick: PropTypes.func.isRequired,
  selectedShapeId: PropTypes.string,
  shape: PropTypes.object.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};

Rectangle.defaultProps = {
  selectedShapeId: null,
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 1,
};

export default Rectangle;
