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
import PropTypes, { arrayOf } from 'prop-types';
import { styled } from '@mui/material/styles';
import CategoryIcon from '@mui/icons-material/Category';
import CursorIcon from '../../icons/Cursor';
import AnnotationFormOverlayTool from './AnnotationFormOverlayTool';
import { defaultToolState, OVERLAY_TOOL } from '../../AnnotationCreationUtils';

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

const MainTitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.8em',
}));

/** All the stuff to manage to choose the drawing tool */
function AnnotationFormOverlay({
  updateToolState, toolState, deleteShape, currentShape, shapes,
}) {
  useEffect(() => {

  }, [toolState.fillColor, toolState.strokeColor, toolState.strokeWidth]);

  const changeTool = (e, tool) => {
    if (tool === OVERLAY_TOOL.SHAPE) {
      updateToolState({
        ...defaultToolState,
        activeTool: tool,
      });
    } else {
      updateToolState({
        ...toolState,
        activeTool: tool,
      });
    }
  };

  const {
    activeTool,
  } = toolState;

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <MainTitleTypography variant="overline" component="h1">
            Overlay
          </MainTitleTypography>
        </Grid>
        <Grid item xs={12}>
          <StyledToggleButtonGroup
            value={activeTool} // State or props ?
            exclusive
            onChange={changeTool}
            aria-label="tool selection"
            size="small"
          >
            <ToggleButton value={OVERLAY_TOOL.EDIT} aria-label="select cursor">
              <CursorIcon />
            </ToggleButton>
            <ToggleButton value={OVERLAY_TOOL.SHAPE} aria-label="select cursor">
              <CategoryIcon />
            </ToggleButton>
            <ToggleButton value={OVERLAY_TOOL.IMAGE} aria-label="select cursor">
              <ImageIcon />
            </ToggleButton>
            <ToggleButton value={OVERLAY_TOOL.TEXT} aria-label="select text">
              <TitleIcon />
            </ToggleButton>
            <ToggleButton value={OVERLAY_TOOL.DELETE} aria-label="select cursor">
              <DeleteIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>
          <AnnotationFormOverlayTool
            toolState={toolState}
            updateToolState={updateToolState}
            currentShape={currentShape}
            shapes={shapes}
            deleteShape={deleteShape}
          />
        </Grid>
      </Grid>
    </div>
  );
}
const shape = PropTypes.shape(
  {
    closedMode: PropTypes.bool,
    fill: PropTypes.string,
    id: PropTypes.string,
    pointerLength: PropTypes.number,
    pointerWidth: PropTypes.number,
    points: arrayOf(PropTypes.number),
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    text: PropTypes.string,
    type: PropTypes.string,
    url: PropTypes.string,
    x: null,
    y: null,
  },
);
AnnotationFormOverlay.propTypes = {
  currentShape: shape.isRequired,
  deleteShape: PropTypes.func.isRequired,
  shapes: PropTypes.arrayOf(shape).isRequired,
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

export default AnnotationFormOverlay;
