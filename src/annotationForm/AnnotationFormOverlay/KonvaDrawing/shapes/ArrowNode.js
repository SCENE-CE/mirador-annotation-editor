import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Arrow, Transformer } from 'react-konva';

/**  */
function ArrowNode({
  onShapeClick, shape, activeTool, isSelected, onTransform, handleDragEnd,
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
        onTransform={onTransform}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragEnd}
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
  handleDragStart: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onShapeClick: PropTypes.func.isRequired,
  onTransform: PropTypes.func.isRequired,
  shape: PropTypes.object.isRequired,
};


export default ArrowNode;
