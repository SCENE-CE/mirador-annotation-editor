import ToggleButton from '@mui/material/ToggleButton';
import RectangleIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import PolygonIcon from '@mui/icons-material/Timeline';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import AnnotationFormOverlayToolOptions from './AnnotationFormOverlayToolOptions';
import {
  isShapesTool,
  OVERLAY_TOOL,
  SHAPES_TOOL,
  KONVA_MODE,
} from './KonvaDrawing/KonvaUtils';
import ShapesList from './ShapesList';
import { StyledToggleButtonGroup } from '../AnnotationFormUtils';

/** All the form part for the overlay view */
function AnnotationFormOverlayTool({
  currentShape,
  deleteShape,
  displayMode,
  setToolState,
  shapes,
  t,
  toolState,
  updateCurrentShapeInShapes,
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

  /** Set DefaultTool shape Option to Rectangle * */
  if (toolState.activeTool === OVERLAY_TOOL.SHAPE) {
    setToolState({
      ...toolState,
      activeTool: SHAPES_TOOL.RECTANGLE,
    });
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
                    {t('selected_object')}
                  </Typography>
                  <AnnotationFormOverlayToolOptions
                    t={t}
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
                    {t('object_list')}
                  </Typography>
                  <ShapesList
                    currentShapeId={currentShape?.id}
                    shapes={shapes}
                    deleteShape={deleteShape}
                    updateCurrentShapeInShapes={updateCurrentShapeInShapes}
                    t={t}
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
              {t('shape')}
            </Typography>
            <StyledToggleButtonGroup
              value={toolState.activeTool} // State or props ?
              exclusive
              onChange={changeTool}
              aria-label={t('tool_selection')}
              size="small"
            >
              <Tooltip title={t('rectangle')}>
                <ToggleButton value={SHAPES_TOOL.RECTANGLE} aria-label={t('add_a_rectangle')}>
                  <RectangleIcon />
                </ToggleButton>
              </Tooltip>

              <Tooltip title={t('circle')}>
                <ToggleButton value={SHAPES_TOOL.CIRCLE} aria-label={t('add_a_circle')}>
                  <CircleIcon />
                </ToggleButton>
              </Tooltip>
              <div>
                <Tooltip title={t('line')}>
                  <ToggleButton
                    value={SHAPES_TOOL.POLYGON}
                    aria-label={t('add_a_line')}
                  >
                    <PolygonIcon />
                  </ToggleButton>
                </Tooltip>
                {/* <Tooltip title={t('freehand')}>
                  <ToggleButton
                    value={SHAPES_TOOL.FREEHAND}
                    aria-label={t('add_a_free_hand_shape')}>
                    <GestureIcon />
                  </ToggleButton>
                </Tooltip> */}
              </div>
              {
                (displayMode === KONVA_MODE.DRAW) && (
                  <>
                    {/*  <Tooltip title="Ellipse shape">
                      <ToggleButton value={SHAPES_TOOL.ELLIPSE} aria-label="add an ellipse">
                        <CircleIcon />
                      </ToggleButton>
                    </Tooltip> */}
                    <Tooltip title={t('arrow')}>
                      <ToggleButton value={SHAPES_TOOL.ARROW} aria-label={t('add an arrow')}>
                        <ArrowOutwardIcon />
                      </ToggleButton>
                    </Tooltip>
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
              {t('delete')}
            </Typography>
            <p>
              {t('click_to_delete_shape')}
            </p>
            <Button
              onClick={() => deleteShape()}
            >
              <span>{t('delete_all')}</span>
              <DeleteIcon color="red" />
            </Button>
          </>
        )
      }
      <AnnotationFormOverlayToolOptions
        t={t}
        toolState={toolState}
        setToolState={setToolState}
        displayMode={displayMode}
        currentShape={currentShape}
      />
    </>
  );
}

AnnotationFormOverlayTool.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  currentShape: PropTypes.object.isRequired,
  deleteShape: PropTypes.func.isRequired,
  displayMode: PropTypes.string.isRequired,
  setToolState: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  shapes: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
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
  updateCurrentShapeInShapes: PropTypes.func.isRequired,
};

export default AnnotationFormOverlayTool;
