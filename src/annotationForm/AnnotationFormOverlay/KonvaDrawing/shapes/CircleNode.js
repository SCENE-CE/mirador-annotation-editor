import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Circle, Transformer } from 'react-konva';
/**
 * Represents a Elipse node component.
 * @returns {JSX.Element} The TextNode component.
 */
function CircleNode({
  activeTool,
  displayMode,
  handleDragEnd,
  handleDragStart,
  isSelected,
  onShapeClick,
  onTransform,
  shape,
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

  return (
    <>
      <Circle
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        fill={shape.fill}
        height={shape.height}
        id={shape.id}
        onClick={handleClick}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onMousedown={handleClick}
        onTransform={onTransform}
        radius={shape.radius}
        ref={shapeRef}
        rotation={shape.rotation}
        scaleX={shape.scaleX}
        scaleY={shape.scaleY}
        stroke={shape.stroke}
        // This line cause SVG export error
        strokeScaleEnabled={false}
        strokeWidth={shape.strokeWidth}
        width={shape.width}
        x={shape.x}
        y={shape.y}
      />

      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

CircleNode.propTypes = {
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
    radius: PropTypes.number,
    rotation: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    type: PropTypes.string,
    url: PropTypes.string,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};
export default CircleNode;
