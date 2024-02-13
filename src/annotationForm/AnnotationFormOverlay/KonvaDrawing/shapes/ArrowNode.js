import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Arrow, Transformer } from 'react-konva';
import {StayPrimaryPortrait} from "@mui/icons-material";

/**
 * Represents a arrow node component.
 * @returns {JSX.Element} The TextNode component.
 */function ArrowNode({
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
        onMousedown={handleClick}
        pointerLength={shape.pointerLength}
        pointerWidth={shape.pointerWidth}
        onTransform={onTransform}
        onDrag={handleDragEnd}
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
  activeTool: PropTypes.string.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onShapeClick: PropTypes.func.isRequired,
  onTransform: PropTypes.func.isRequired,
  shape: PropTypes.shape({
    fill: PropTypes.string,
    id: PropTypes.string,
    pointerLength: PropTypes.number,
    pointerWidth: PropTypes.number,
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

export default ArrowNode;
