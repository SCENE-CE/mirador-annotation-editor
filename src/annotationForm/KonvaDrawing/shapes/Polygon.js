import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {Transformer, Shape, Line} from 'react-konva';

/** FreeHand shape displaying */
function Polygon({
  activeTool,  onShapeClick, isSelected, shape, 
  onTransform, handleDragEnd
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
      <Line
          ref={shapeRef}
          id={shape.id}
          points={shape.points}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth || 5}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          closed={false}
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
          onDragEnd={ handleDragEnd}

      />

      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

Polygon.propTypes = {
  activeTool: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.number,
  onShapeClick: PropTypes.func.isRequired,
  points: PropTypes.arrayOf(PropTypes.number),
  shape: PropTypes.object.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
};

Polygon.defaultProps = {
  fill: 'red',
  height: 1080,
  points: [0, 0, 100, 0, 100, 100],
  stroke: 'black',
  strokeWidth: 1,
  width: 1920,
};

export default Polygon;
