import React, { useEffect, useRef } from 'react';
import PropTypes, { number } from 'prop-types';
import { Transformer, Line, Group } from 'react-konva';

/** FreeHand shape displaying */
function Freehand({
  activeTool, onShapeClick, isSelected, shape, onTransform, handleDragEnd, handleDragStart,
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

  /** */
  const handleClick = () => {
    onShapeClick(shape);
  };

  return (
    <>
      <Group
        ref={shapeRef}
        onClick={handleClick}
        onMousedown={handleClick}
        onTransform={onTransform}
        scaleX={shape.scaleX}
        scaleY={shape.scaleY}
        rotation={shape.rotation}
        x={shape.x}
        y={shape.y}
        width={shape.width || 1920}
        height={shape.height || 1080}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        id={shape.id}
      >
        {shape.lines.map((line, i) => (
          <Line
            key={i}
            fill={shape.stroke}
            points={line.points}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        ))}
      </Group>
      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

Freehand.propTypes = {
  activeTool: PropTypes.string.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onShapeClick: PropTypes.func.isRequired,
  onTransform: PropTypes.func.isRequired,
  shape: PropTypes.shape({
    fill: PropTypes.string,
    height: PropTypes.number,
    id: PropTypes.string,
    lines: PropTypes.arrayOf({
      points: PropTypes.arrayOf(number),
      stroke: PropTypes.string,
      strokeWidth: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    rotation: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    type: PropTypes.string,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};

export default Freehand;
