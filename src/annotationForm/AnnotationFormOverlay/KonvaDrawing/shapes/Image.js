import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';

function ImageShape({
  onShapeClick, shape, activeTool, isSelected, onTransform, handleDragEnd, handleDragStart,
}) {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(shape.url);

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
        onTransform={onTransform}
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
  activeTool: PropTypes.string,
  isSelected: PropTypes.bool.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  onTransform: PropTypes.func.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
};

ImageShape.defaultProps = {
  x: 100,
  y: 100,
};

export default ImageShape;
