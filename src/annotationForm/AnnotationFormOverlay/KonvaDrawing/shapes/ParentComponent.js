import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layer } from 'react-konva';
import Rectangle from './Rectangle';
import EllipseNode from './EllipseNode';
import TextNode from './TextNode';
import ArrowNode from './ArrowNode';
import Polygon from './Polygon';
import Freehand from './Freehand';
import ImageShape from './Image';

/** Loads Konva and display in function of their type */
function ParentComponent({
  isMouseOverSave,
  scale, onTransform, handleDragEnd,
  shapes, onShapeClick, selectedShapeId, activeTool, handleDragStart, trview,
}) {
  // TODO Simplify these state
  const [selectedShape, setSelectedShape] = useState(null);

  useEffect(() => {
   /* if (shapes.length === 1 && !selectedShapeId) {
      setSelectedShape(shapes[0]);
    }*/
  }, [shapes, selectedShapeId]);

  useEffect(() => {

  }, [selectedShape]);

  /**
    * Triggered onShapeClick provided function when a shape is clicked
    * @param {object} shape
    */
  const handleShapeClick = (shape) => {
    onShapeClick(shape);
    setSelectedShape(shape);
  };

  return (
    <Layer
      scaleX={scale}
      scaleY={scale}
    >
      {/* eslint-disable-next-line consistent-return */}
      {shapes.map((shape, i) => {
        // eslint-disable-next-line max-len
        const isSelected = selectedShapeId === shape.id && isMouseOverSave === false && trview === true;
        switch (shape.type) {
          case 'rectangle':
            return (
              <Rectangle
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                key={i}
              />
            );
          case 'text':
            return (
              <TextNode
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                key={i}
              />
            );
          case 'ellipse':
            return (
              <EllipseNode
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                key={i}
              />
            );
          case 'freehand':
            return (
              <Freehand
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                key={i}
              />
            );
          case 'polygon':
            return (
              <Polygon
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                key={i}
              />
            );
          case 'arrow':
            return (
              <ArrowNode
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                key={i}
              />
            );
          case 'image':
            return (
              <ImageShape
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                  src: shape.src,
                }}
                key={i}
              />
            );
        }
      })}
    </Layer>
  );
}

ParentComponent.propTypes = {
  activeTool: PropTypes.string.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  isMouseOverSave: PropTypes.bool.isRequired,
  onShapeClick: PropTypes.func.isRequired,
  onTransform: PropTypes.func.isRequired,
  scale: PropTypes.number.isRequired,
  selectedShapeId: PropTypes.string.isRequired,
  shapes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    rotation: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    type: PropTypes.string,
    url: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
  })).isRequired,
  trview: PropTypes.bool.isRequired,
};
export default ParentComponent;
