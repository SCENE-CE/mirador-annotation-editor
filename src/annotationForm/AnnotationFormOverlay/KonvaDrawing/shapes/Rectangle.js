import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Rect, Transformer } from 'react-konva';
import {KONVA_MODE} from "../KonvaUtils";
/**
 * Represents a rectangle node component.
 * @returns {JSX.Element} The TextNode component.
 */
function Rectangle({
  displayMode,
  shape,
  onShapeClick,
  activeTool,
    displayMode,
  isSelected,
  onTransform,
  handleDragEnd,
  handleDragStart,
}) {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  /**
   * Handles the click event on the shape by invoking the provided callback function.
   * @function handleClick
   *- The shape object representing the properties of the clicked shape.
   * @returns {void}
   */
  const handleClick = () => {
    onShapeClick(shape);
  };

  console.log()
  return (
    <>
      <Rect
        ref={shapeRef}
        x={shape.x || 0}
        y={shape.y || 0}
        scaleX={shape.scaleX}
        scaleY={shape.scaleY}
        width={shape.width || 1}
        height={shape.height || 1}
        fill={displayMode !== KONVA_MODE.TARGET ? shape.fill : null}
        stroke={displayMode !== KONVA_MODE.TARGET ? shape.stroke : 'red'}
        strokeWidth={shape.strokeWidth || 1}
        id={shape.id}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
        onMousedown={handleClick}
        onTransform={onTransform}
        onDrag={handleDragEnd}
        onDragStart={handleDragStart}
        dash={[1000/50]}
        dashEnabled={displayMode === KONVA_MODE.TARGET}
      />
      <Transformer
        rotateEnabled={displayMode !== 'target'}
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

Rectangle.propTypes = {
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
    rotation: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    text: PropTypes.string,
    type: PropTypes.string,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,

};

export default Rectangle;
