import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layer, Rect, Transformer } from 'react-konva';

// eslint-disable-next-line require-jsdoc
function Surface({
  shape, activeTool, tabView,
  onTransform, handleDrag, trview,
  width, height, scale,
}) {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [tabView]);

  return (
    <Layer

      scaleX={scale}
      scaleY={scale}
    >
      <>
        <Rect
          ref={shapeRef}
          x={shape.x}
          y={shape.y}
          scaleX={shape.scaleX}
          scaleY={shape.scaleY}

          width={shape.width}
          height={shape.height}
          fill="transparent"
          stroke="#1967d2"

          strokeWidth={1}

          draggable={trview}
          onTransform={onTransform}
          onDrag={handleDrag}
          onDragEnd={handleDrag}
          dash={[10, 5]}
        />

        <Transformer
          ref={trRef}
          visible={trview}
          rotateEnabled={false}
          borderEnabled={false}
        />
      </>
    </Layer>
  );
}

Surface.propTypes = {
  activeTool: PropTypes.string.isRequired,
  fill: PropTypes.string,
  height: PropTypes.number,
  onShapeClick: PropTypes.func.isRequired,
  selectedShapeId: PropTypes.string,
  shape: PropTypes.object.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};

Surface.defaultProps = {
  fill: 'red',
  height: 100,
  selectedShapeId: null,
  stroke: 'black',
  strokeWidth: 1,
  width: 100,
  x: 100,
  y: 100,
};

export default Surface;
