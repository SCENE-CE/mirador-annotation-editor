import React, { useRef, useState } from 'react';
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
  showTransformer,
}) {
  const shapeRef = useRef();
  const trRef = useRef();

  const [originalSpatialTarget, setOriginalSpatialTarget] = useState(true);

  if (trRef.current) {
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer()
      .batchDraw();
  }
  /**
   * Function to handle the first transformation on a spatial target.
   * @param {Event} event - The event triggering the transformation.
   * @returns {void}
   */
  const onSpatialTargetFirstTransformation = (event) => {
    onTransform(event);
    setOriginalSpatialTarget(false);
  };

  return (
    <Layer
      scaleX={scale}
      scaleY={scale}
    >
      <>
        <Rect
          ref={shapeRef}
          x={originalSpatialTarget ? shape.x + 15 : shape.x}
          y={originalSpatialTarget ? shape.y + 15 : shape.y}
          scaleX={shape.scaleX}
          scaleY={shape.scaleY}
          width={originalSpatialTarget ? shape.width - 30 : shape.width}
          height={originalSpatialTarget ? shape.height - 30 : shape.height}
          fill="transparent"
          stroke="#1967d2"
          strokeWidth={10}
          draggable={showTransformer}
          onTransform={onSpatialTargetFirstTransformation}
          onDrag={handleDrag}
          onDragEnd={handleDrag}
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
  showTransformer: PropTypes.bool.isRequired,
};
export default SpatialTarget;
