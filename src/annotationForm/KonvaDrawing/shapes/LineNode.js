import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line, Transformer } from 'react-konva';

function LineNode({
  onShapeClick, shape, activeTool, selectedShapeId, x, y, points, fill, strokeWidth,
}) {
  const shapeRef = useRef();
  const trRef = useRef();
  const isSelected = selectedShapeId === shape.id;

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
      <Line
        ref={shapeRef}
        x={x || 0}
        y={y || 0}
        points={points || [0, 0, 0, 0, 100, 100]}
        fill={fill}
        stroke={fill}
        strokeWidth={strokeWidth || 1}
        id={shape.id}
        closed={false}
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

LineNode.propTypes = {
  activeTool: PropTypes.string.isRequired,
  fill: PropTypes.string, // assuming shape is an object, adjust as necessary
  onShapeClick: PropTypes.func.isRequired,
  points: PropTypes.arrayOf(PropTypes.number),
  selectedShapeId: PropTypes.string,
  shape: PropTypes.object.isRequired,
  strokeWidth: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};

LineNode.defaultProps = {
  fill: 'black',
  points: [0, 0, 0, 0, 100, 100],
  selectedShapeId: null,
  strokeWidth: 1,
  x: 0,
  y: 0,
};

export default LineNode;
