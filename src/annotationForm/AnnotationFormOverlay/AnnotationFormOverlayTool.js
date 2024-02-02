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
import { Button, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import AnnotationFormOverlayToolOptions from './AnnotationFormOverlayToolOptions';
import { isShapesTool, OVERLAY_TOOL, SHAPES_TOOL } from '../../AnnotationCreationUtils';
import AccordionShapes from './Accordion';

const StyledLi = styled('li')(({ theme }) => ({
  display: 'flex',
  wordBreak: 'break-word',
}));

const StyledUl = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  listStyle: 'none',
  paddingLeft: '0',
}));

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
  toolState, updateToolState, currentShape, shapes, deleteShape,
}) {
  /** Change the active overlay tool */
  const changeTool = (e, tool) => {
    updateToolState({
      ...toolState,
      activeTool: tool,
    });
  };

  /** Stay in edit mode when a shape is selected */
  const customUpdateToolState = (newState) => {
    updateToolState({
      ...newState,
      activeTool: OVERLAY_TOOL.EDIT,
    });
  };

  return (
    <>
      {
          toolState.activeTool === OVERLAY_TOOL.EDIT && (
          <>
            {
            currentShape && (
            <Paper>
              <Typography variant="overline">
                Forme selectionnée
              </Typography>

              <ul>
                {
                  Object.keys(currentShape).sort().map((key) => (
                    <>
                      { key !== 'lines' && (
                        <li key={key}>
                          {key}
                          :
                          {currentShape[key]}
                        </li>
                      )}
                    </>
                  ))
                }
              </ul>
              <AnnotationFormOverlayToolOptions
                toolState={{
                  ...toolState,
                  activeTool: currentShape.type,
                  closedMode: currentShape.closedMode,
                  fillColor: currentShape.fill,
                  strokeColor: currentShape.stroke,
                  strokeWidth: currentShape.strokeWidth,
                }}
                updateToolState={customUpdateToolState}
              />
            </Paper>
            )
            }
            <AccordionShapes
              currentShapeId={currentShape?.id}
              shapes={shapes}
              deleteShape={deleteShape}
            />
          </>

          )
      }
      {
        isShapesTool(toolState.activeTool) && (
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
          </StyledToggleButtonGroup>
        )
      }
      {
        toolState.activeTool === OVERLAY_TOOL.DELETE && (
        <>
          <p>
            Cliquer sur les formes pour les supprimer
          </p>
          <Button
            onClick={() => deleteShape()}
          >
            <span>Supprimer toutes les formes</span>
            <DeleteIcon color="red" />
          </Button>
        </>
        )
      }
      <AnnotationFormOverlayToolOptions
        toolState={toolState}
        updateToolState={updateToolState}
      />
    </>
  );
}

AnnotationFormOverlayTool.propTypes = {
  currentShape: PropTypes.object.isRequired,
  deleteShape: PropTypes.func.isRequired,
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
  updateToolState: PropTypes.func.isRequired,

};

export default AnnotationFormOverlayTool;
