import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Ellipse, Transformer } from 'react-konva';
/**
 * Represents a Elipse node component.
 * @returns {JSX.Element} The TextNode component.
 */
function EllipseNode({
  onShapeClick, shape, activeTool, isSelected,
  onTransform, handleDragEnd, handleDragStart,
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
      <Ellipse
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        fill={shape.fill}
        id={shape.id}
        onClick={handleClick}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onMousedown={handleClick}
        onTransform={onTransform}
        radiusX={shape.width}
        radiusY={shape.height}
        ref={shapeRef}
        rotation={shape.rotation}
        scaleX={shape.scaleX}
        scaleY={shape.scaleY}
        stroke={shape.stroke}
        strokeScaleEnabled={false}
        strokeWidth={shape.strokeWidth || 1}
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

EllipseNode.propTypes = {
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
    type: PropTypes.string,
    url: PropTypes.string,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};
export default EllipseNode;
