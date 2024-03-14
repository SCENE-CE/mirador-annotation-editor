import {
  Button, Grid, Paper,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import TitleIcon from '@mui/icons-material/Title';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import CategoryIcon from '@mui/icons-material/Category';
import CursorIcon from '../../icons/Cursor';
import AnnotationFormOverlayTool from './AnnotationFormOverlayTool';
import { defaultToolState, OVERLAY_TOOL } from '../../AnnotationCreationUtils';
import { OVERLAY_VIEW, TARGET_VIEW } from '../../AnnotationFormUtils';
import { KONVA_MODE } from './KonvaDrawing/KonvaUtils';

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

const OverlayIconAndTitleContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

/** All the stuff to manage to choose the drawing tool */
function AnnotationFormOverlay(
  {
    displayMode,
    setToolState,
    toolState,
    deleteShape,
    currentShape,
    updateCurrentShapeInShapes,
    setViewTool,
    shapes,
    drawingMode,
  },
) {
  useEffect(() => {

  }, [toolState.fillColor, toolState.strokeColor, toolState.strokeWidth]);

  /**
   * Handle tool's change
   * @param e
   * @param tool
   */
  const changeTool = (e, tool) => {
    if (tool === OVERLAY_TOOL.SHAPE) {
      setToolState({
        ...defaultToolState,
        activeTool: tool,
      });
    } else {
      setToolState({
        ...toolState,
        activeTool: tool,
      });
    }
  };
  /**
   * Handle Tab change to set the shapes focusable
   * @param event
   * @param TabIndex
   */
  const tabHandler = (event, TabIndex) => setViewTool(TabIndex);
  const {
    activeTool,
  } = toolState;

  return (

        <Grid container>
          <OverlayIconAndTitleContainer item xs={12}>
            <StyledToggleButtonGroup
              value={activeTool} // State or props ?
              exclusive
              onChange={changeTool}
              aria-label="tool selection"
              size="small"
            >
              <ToggleButton value={OVERLAY_TOOL.EDIT} aria-label="select cursor" onClick={tabHandler(TARGET_VIEW)}>
                <CursorIcon />
              </ToggleButton>
              <ToggleButton value={OVERLAY_TOOL.SHAPE} aria-label="select cursor" onClick={tabHandler(OVERLAY_VIEW)}>
                <CategoryIcon />
              </ToggleButton>
              {
                displayMode === KONVA_MODE.DRAW && (
                  <ToggleButton value={OVERLAY_TOOL.TEXT} aria-label="select text" onClick={tabHandler(OVERLAY_VIEW)}>
                    <TitleIcon />
                  </ToggleButton>
                )
              }
              <ToggleButton value={OVERLAY_TOOL.DELETE} aria-label="select cursor" onClick={tabHandler(OVERLAY_VIEW)}>
                <DeleteIcon />
              </ToggleButton>
            </StyledToggleButtonGroup>

            <AnnotationFormOverlayTool
              toolState={toolState}
              setToolState={setToolState}
              currentShape={currentShape}
              shapes={shapes}
              deleteShape={deleteShape}
              drawingMode={drawingMode}
              updateCurrentShapeInShapes={updateCurrentShapeInShapes}
            />
          </OverlayIconAndTitleContainer>
        </Grid>
  );
}

AnnotationFormOverlay.propTypes = {
  currentShape: PropTypes.shape({
    id: PropTypes.string,
    rotation: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    type: PropTypes.string,
    url: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  deleteShape: PropTypes.func.isRequired,
  setToolState: PropTypes.func.isRequired,
  setViewTool: PropTypes.func.isRequired,
  shapes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      rotation: PropTypes.number,
      scaleX: PropTypes.number,
      scaleY: PropTypes.number,
      type: PropTypes.string,
      url: PropTypes.string,
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ).isRequired,
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

export default AnnotationFormOverlay;
