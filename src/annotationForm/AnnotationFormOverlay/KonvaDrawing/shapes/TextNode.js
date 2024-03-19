import React, { useRef, useEffect } from 'react';
import { Text, Transformer } from 'react-konva';
import PropTypes from 'prop-types';
/**
 * Represents a text node component.
 * @returns {JSX.Element} The TextNode component.
 */
function TextNode({
  shape, onShapeClick, activeTool, isSelected,
  onTransform, handleDragEnd, handleDragStart,
}) {
  const shapeRef = useRef();
  const trRef = useRef();

  /**
     * Handles the click event on the shape by invoking the provided callback function.
     * @function handleClick
     *- The shape object representing the properties of the clicked shape.
     * @returns {void}
     */
  const handleClick = () => {
    onShapeClick(shape);
  };
  useEffect(() => {
    if (trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, []);

  return (
    <>
      <Text
        ref={shapeRef}
        scaleX={shape.scaleX}
        scaleY={shape.scaleY}
        rotation={shape.rotation}
        x={shape.x}
        y={shape.y}
        fontSize={40}
        fill={shape.fill}
        text={shape.text}
        id={shape.id}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
        onMousedown={handleClick}
        onTransform={onTransform}
        onDrag={handleDragEnd}
        onDragStart={handleDragStart}
      />
      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

TextNode.propTypes = {
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

export default TextNode;
