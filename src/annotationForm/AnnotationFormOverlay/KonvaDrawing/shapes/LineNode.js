import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line, Transformer } from 'react-konva';

function LineNode({
  onShapeClick, shape, activeTool, selectedShapeId,
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
        x={shape.x || 0}
        y={shape.y || 0}
        points={shape.points }
        fill={shape.fill}
        stroke={shape.fill}
        strokeWidth={shape.strokeWidth || 1}
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
  handleDragEnd: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onShapeClick: PropTypes.func.isRequired,
  onTransform: PropTypes.func.isRequired,
  shape: PropTypes.object.isRequired,
};


export default LineNode;
