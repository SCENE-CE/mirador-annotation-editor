import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layer, Rect, Transformer } from 'react-konva';

/**
 * Represents a surface component.
 * @returns {JSX.Element} The Surface component.
 */
function Surface({
  shape, tabView,
  onTransform, handleDrag, trview, scale,
}) {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [tabView]);
  // TODO: TabView may be useless in useEffect dependencies,
  //  Surface is never call with TabView Props
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
  trview: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};
export default Surface;
