import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line, Transformer } from 'react-konva';
/**
 * Represents a line node component.
 * @returns {JSX.Element} The TextNode component.
 */
function LineNode({
  onShapeClick,
  shape,
  activeTool,
  selectedShapeId,
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
        points={shape.points}
        fill={shape.fill}
        stroke={shape.fill}
        strokeWidth={shape.strokeWidth || 1}
        id={shape.id}
        closed={false}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
        onMousedown={handleClick}
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
  onShapeClick: PropTypes.func.isRequired,
  selectedShapeId: PropTypes.string.isRequired,
  shape: PropTypes.shape({
    id: PropTypes.string,
    rotation: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    type: PropTypes.string,
    url: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};

export default LineNode;
