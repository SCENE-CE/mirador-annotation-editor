import ToggleButton from '@mui/material/ToggleButton';
import RectangleIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import PolygonIcon from '@mui/icons-material/Timeline';
import GestureIcon from '@mui/icons-material/Gesture';
import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import AnnotationFormOverlayToolOptions from './AnnotationFormOverlayToolOptions';
import {
  isShapesTool,
  OVERLAY_TOOL,
  SHAPES_TOOL,
} from '../../AnnotationCreationUtils';
import ShapesList from './ShapesList';
import { KONVA_MODE } from './KonvaDrawing/KonvaUtils';

// TODO WIP code duplicated
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '&:first-of-type': {
    borderRadius: theme.shape.borderRadius,
  },
  '&:not(:first-of-type)': {
    borderRadius: theme.shape.borderRadius,
  },
  border: 'none',
  margin: theme.spacing(0.5),
}));

/** All the form part for the overlay view */
function AnnotationFormOverlayTool({
  toolState,
  setToolState,
  currentShape,
  updateCurrentShapeInShapes,
  shapes,
  deleteShape,
  displayMode,
  handleTextChange,
}) {
  /** Change the active overlay tool */
  const changeTool = (e, tool) => {
    setToolState({
      ...toolState,
      activeTool: tool,
    });
  };

  /** Stay in edit mode when a shape is selected */
  const customUpdateToolState = (newState) => {
    setToolState({
      ...newState,
      activeTool: OVERLAY_TOOL.EDIT,
    });
  };

  /** Set DefaultTool Option to Rectangle **/
  if(toolState.activeTool === OVERLAY_TOOL.SHAPE){
    setToolState({
      ...toolState,
      activeTool: SHAPES_TOOL.RECTANGLE
    })
  }

  return (
    <>
      {
          toolState.activeTool === OVERLAY_TOOL.EDIT && (
          <>
            {
              currentShape && displayMode === KONVA_MODE.DRAW && (
              <div>
                <Typography variant="subFormSectionTitle">
                  Selected object
                </Typography>
                <AnnotationFormOverlayToolOptions
                  toolState={{
                    ...toolState,
                    activeTool: currentShape.type,
                    closedMode: currentShape.closedMode,
                    fillColor: currentShape.fill,
                    image: { id: currentShape.url },
                    strokeColor: currentShape.stroke,
                    strokeWidth: currentShape.strokeWidth,
                    text: currentShape.text,
                  }}
                  setToolState={customUpdateToolState}
                  displayMode={displayMode}
                />
              </div>
              )
            }
            {
              (displayMode === KONVA_MODE.DRAW && shapes.length > 0) && (
              <>
                <Typography variant="subFormSectionTitle">
                  Object lists
                </Typography>
                <ShapesList
                  currentShapeId={currentShape?.id}
                  shapes={shapes}
                  deleteShape={deleteShape}
                  updateCurrentShapeInShapes={updateCurrentShapeInShapes}
                />
              </>
              )
            }
          </>

          )
      }
      {
        isShapesTool(toolState.activeTool) && (
        <>
          <Typography variant="subFormSectionTitle">
            Shapes
          </Typography>
          <StyledToggleButtonGroup
            value={toolState.activeTool} // State or props ?
            exclusive
            onChange={changeTool}
            aria-label="tool selection"
            size="small"
          >
            <ToggleButton value={SHAPES_TOOL.RECTANGLE} aria-label="add a rectangle">
              <RectangleIcon />
            </ToggleButton>
            {
              (displayMode === KONVA_MODE.DRAW) && (
                <>
                  <ToggleButton value={SHAPES_TOOL.ELLIPSE} aria-label="add a circle">
                    <CircleIcon />
                  </ToggleButton>
                  <ToggleButton value={SHAPES_TOOL.ARROW} aria-label="add an arrow">
                    <ArrowOutwardIcon />
                  </ToggleButton>
                  <ToggleButton value={SHAPES_TOOL.POLYGON} aria-label="add a polygon" style={{ display: 'none' }}>
                    <PolygonIcon />
                  </ToggleButton>
                  <ToggleButton value={SHAPES_TOOL.FREEHAND} aria-label="free hand polygon">
                    <GestureIcon />
                  </ToggleButton>
                </>
              )
            }
          </StyledToggleButtonGroup>
        </>
        )
      }
      {
        toolState.activeTool === OVERLAY_TOOL.DELETE && (
        <>
          <Typography variant="overline">
            Delete
          </Typography>
          <p>
            Click on object to remove it.
          </p>
          <Button
            onClick={() => deleteShape()}
          >
            <span>Delete all</span>
            <DeleteIcon color="red" />
          </Button>
        </>
        )
      }
      <AnnotationFormOverlayToolOptions
          handleTextChange={handleTextChange}
        toolState={toolState}
        setToolState={setToolState}
        displayMode={displayMode}
      />
    </>
  );
}

AnnotationFormOverlayTool.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  currentShape: PropTypes.object.isRequired,
  deleteShape: PropTypes.func.isRequired,
  setToolState: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  shapes: PropTypes.array.isRequired,
  toolState: PropTypes.shape({
    activeTool: PropTypes.string.isRequired,
    closedMode: PropTypes.bool.isRequired,
    fillColor: PropTypes.string.isRequired,
    image: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    strokeColor: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    updateColor: PropTypes.func.isRequired,
  }).isRequired,

};

export default AnnotationFormOverlayTool;
