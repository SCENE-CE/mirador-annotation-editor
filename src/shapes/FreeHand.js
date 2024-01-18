import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {Transformer, Shape, Line} from 'react-konva';

/** FreeHand shape displaying */
function FreeHand({
  activeTool, fill, height, onShapeClick, points, isSelected, shape, stroke, strokeWidth, width, x, y,
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
          points={shape.lines}
          stroke="#df4b26"
          strokeWidth={5}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          onClick={handleClick}
          id={shape.id} // TODO check if id directly can be used
          ref={shapeRef}
          fill={fill || 'red'}
          globalCompositeOperation="source-over"
      />

      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

FreeHand.propTypes = {
  activeTool: PropTypes.string.isRequired,
  fill: PropTypes.string,
  height: PropTypes.number,
  onShapeClick: PropTypes.func.isRequired,
  points: PropTypes.arrayOf(PropTypes.number),
  shape: PropTypes.object.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
};

FreeHand.defaultProps = {
  fill: 'red',
  height: 1080,
  points: [0, 0, 100, 0, 100, 100],
  stroke: 'black',
  strokeWidth: 1,
  width: 1920,
};

export default FreeHand;
