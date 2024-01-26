import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Arrow, Transformer } from 'react-konva';

/**  */
function ArrowNode({
  onShapeClick, shape, activeTool, isSelected, onTransformEnd, handleDragEnd,
}) {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  /** handle click on the arrow */
  const handleClick = () => {
    onShapeClick(shape);
  };

  return (
    <>
      <Arrow
        ref={shapeRef}
        fill={shape.fill}
        scaleX={shape.scaleX}
        scaleY={shape.scaleY}
        rotation={shape.rotation}
        x={shape.x}
        y={shape.y}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        points={shape.points}
        id={shape.id}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
        pointerLength={shape.pointerLength}
        pointerWidth={shape.pointerWidth}
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

ArrowNode.propTypes = {
  activeTool: PropTypes.string.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onShapeClick: PropTypes.func.isRequired,
  onTransformEnd: PropTypes.func.isRequired,
  shape: PropTypes.object.isRequired,
};

ArrowNode.defaultProps = {
  isSelected: false,
};

export default ArrowNode;
