import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layer } from 'react-konva';

import FreeHand from './FreeHand';
import Rectangle from './Rectangle';
import EllipseNode from './EllipseNode';
import TextNode from './TextNode';
import LineNode from './LineNode';

/** Loads Konva and display in function of their type */

function ParentComponent({
  shapes, onShapeClick, selectedShapeIdProp, activeTool,
}) {
  // TODO Simplify these state
  const [selectedShapeId, setSelectedShapeId] = useState(selectedShapeIdProp);
  const [selectedShape, setSelectedShape] = useState(null);

  useEffect(() => {
    if (shapes.length === 1 && !selectedShapeId) {
      setSelectedShapeId(shapes[0].id);
      setSelectedShape(shapes[0]);
    }
  }, [shapes, selectedShapeId]);

  /**
    * Triggered onShapeClick provided function when a shape is clicked
    * @param {object} shape
    */
  const handleShapeClick = (shape) => {
    console.log("handleShapeClick", shape);
    setSelectedShapeId(shape.id);
    setSelectedShape(shape);
    onShapeClick(shape);
  };

  console.log("ParentComponent", shapes.length);
  console.log("ParentComponent", shapes[shapes.length - 1]);

  return (
    <Layer>
      {shapes.map((shape, i) => {
        const isSelected = selectedShape?.id === shape.id;
        switch (shape.type) {
          case 'rectangle':
            return (
              <Rectangle
                {...{
                  ...shape, activeTool, isSelected, onShapeClick: handleShapeClick, shape,
                }}
                key={i}
              />
            );
          case 'text':
            return (
              <TextNode
                {...{
                  ...shape, activeTool, isSelected, onShapeClick: handleShapeClick, shape,
                }}
                key={i}
              />
            );
          case 'ellipse':
            return (
              <EllipseNode
                {...{
                  ...shape, activeTool, isSelected, onShapeClick: handleShapeClick, shape,
                }}
                key={i}
              />
            );
          case 'freehand':
            return (
              <FreeHand
                {...{
                  ...shape, activeTool, isSelected, onShapeClick: handleShapeClick, shape,
                }}
                key={i}
              />
            );
          case 'line':
            return (
              <LineNode
                {...{
                  ...shape, activeTool, isSelected, onShapeClick: handleShapeClick, shape,
                }}
                key={i}
              />
            );
          default:
            return null;
        }
      })}
    </Layer>
  );
}

ParentComponent.propTypes = {
  shapes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onShapeClick: PropTypes.func.isRequired,
  selectedShapeIdProp: PropTypes.string,
  activeTool: PropTypes.string.isRequired,
};

ParentComponent.defaultProps = {
  selectedShapeIdProp: null,
};

export default ParentComponent;
