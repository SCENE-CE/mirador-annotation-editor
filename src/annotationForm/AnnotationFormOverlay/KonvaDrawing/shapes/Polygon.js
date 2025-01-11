import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Transformer, Shape, Line } from 'react-konva';

/** FreeHand shape displaying */
function Polygon({
  activeTool, onShapeClick, isSelected, shape,
  onTransform, handleDragEnd, handleDragStart,
}) {
  // TODO check if selectedShapeId is needed
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, shape]);

  /**
   * Handles the click event on the shape by invoking the provided callback function.
   * @function handleClick
   *- The shape object representing the properties of the clicked shape.
   * @returns {void}
   */
  const handleClick = () => {
    onShapeClick(shape);
  };

  return (

    <>
      <Line
        ref={shapeRef}
        id={shape.id}
        points={shape.points}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth || 5}
        lineCap="round"
        lineJoin='round'
        closed={false}
        onMousedown={handleClick}
        onClick={handleClick}
        fill={shape.fill}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        globalCompositeOperation="source-over"
        onTransform={onTransform}
        scaleX={shape.scaleX}
        scaleY={shape.scaleY}
        rotation={shape.rotation}
        x={shape.x}
        y={shape.y}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}

      />
      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

Polygon.propTypes = {
  activeTool: PropTypes.string.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onShapeClick: PropTypes.func.isRequired,
  onTransform: PropTypes.func.isRequired,
  shape: PropTypes.shape({
    fill: PropTypes.string,
    id: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.number),
    rotation: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    type: PropTypes.string,
    url: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};

export default Polygon;
