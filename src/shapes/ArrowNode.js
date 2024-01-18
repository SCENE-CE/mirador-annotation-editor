import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Arrow, Transformer } from 'react-konva';
//

//  x: stage.width() / 4,
// y: stage.height() / 4,
// points: [0, 0, width / 2, height / 2],
// pointerLength: 20,
// pointerWidth: 20,
// fill: 'black',
// stroke: 'black',
// strokeWidth: 4,


function ArrowNode({
  onShapeClick, shape, activeTool, isSelected, x, y, width, height, fill, stroke, strokeWidth,
  pointerLength, pointerWidth,
  points,


}) {
  const shapeRef = useRef();
  const trRef = useRef();

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
      <Arrow
        ref={shapeRef}
        x={x || 100}
        y={y || 100}
        width={width || 100}
        height={height || 100}
        fill={fill || 'red'}
        stroke={stroke || 'black'}
        strokeWidth={strokeWidth || 1}
        id={shape.id}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
        pointerLength={20}
        pointerWidth={20}
        points={points || [0, 0, width / 2, height / 2]}
      />

      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

ArrowNode.propTypes = {
  onShapeClick: PropTypes.func.isRequired,
  shape: PropTypes.object.isRequired,
  activeTool: PropTypes.string.isRequired,
  selectedShapeId: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
};

ArrowNode.defaultProps = {
  selectedShapeId: null,
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 1,
};

export default ArrowNode;
