import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Layer, Rect, Transformer } from 'react-konva';

/**
 * Represents the spatial target of the annotation.
 * For now it's just a rectangle with xy coordinates and width and height.
 * @returns {JSX.Element} The SpatialTarget component.
 */
function SpatialTarget({
  handleDrag,
  onTransform,
  scale,
  shape,
  tabView,
  showTransformer,
}) {
  const shapeRef = useRef();
  const trRef = useRef();

  if (trRef.current) {
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer()
      .batchDraw();
  }

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
          strokeWidth={10}
          draggable={showTransformer}
          onTransform={onTransform}
          onDrag={handleDrag}
          onDragEnd={handleDrag}
          dash={[30 / scale, 30]}
        />

        <Transformer
          ref={trRef}
          visible={showTransformer}
          rotateEnabled={false}
          borderEnabled={false}
        />
      </>
    </Layer>
  );
}

SpatialTarget.propTypes = {
  handleDrag: PropTypes.func.isRequired,
  onTransform: PropTypes.func.isRequired,
  scale: PropTypes.number.isRequired,
  shape: PropTypes.shape({
    height: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  tabView: PropTypes.string.isRequired,
  showTransformer: PropTypes.bool.isRequired,
};
export default SpatialTarget;
