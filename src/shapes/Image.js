import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';

function ImageShape({
  onShapeClick, shape, activeTool, isSelected, x, y, src, onTransformEnd, handleDragEnd
}) {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(src);

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
      <Image
        ref={shapeRef}
        scaleX={shape.scaleX}
        scaleY={shape.scaleY}
        rotation={shape.rotation}
        x={shape.x}
        y={shape.y}
        image={image}
        id={shape.id}
        draggable={activeTool === 'cursor' || activeTool === 'edit'}
        onClick={handleClick}
        onTransformEnd={onTransformEnd}
        onDragEnd={handleDragEnd}
      />

      <Transformer
        ref={trRef}
        visible={activeTool === 'edit' && isSelected}
      />
    </>
  );
}

ImageShape.propTypes = {
  onShapeClick: PropTypes.func.isRequired,
  shape: PropTypes.object.isRequired,
  activeTool: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  src: PropTypes.string.isRequired,
  onTransformEnd: PropTypes.func.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
};

ImageShape.defaultProps = {
  x: 100,
  y: 100,
};

export default ImageShape;