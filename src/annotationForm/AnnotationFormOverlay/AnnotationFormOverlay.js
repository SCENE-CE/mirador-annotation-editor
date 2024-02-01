import {
  Button, ClickAwayListener, Divider, Grid, MenuItem, MenuList, Paper, Popover,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import TitleIcon from '@mui/icons-material/Title';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';

import React, { useEffect } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { SketchPicker } from 'react-color';
import { v4 as uuidv4 } from 'uuid';
import CategoryIcon from '@mui/icons-material/Category';
import CursorIcon from '../../icons/Cursor';
import ImageFormField from './ImageFormField.js';
import AnnotationFormOverlayToolOptions from './AnnotationFormOverlayToolOptions.js';

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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '5px',
}));

const StyledDivButtonImage = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '5px',
}));

const rgbaToObj = (rgba = 'rgba(255,255,255,0.5)') => {
  const rgbaArray = rgba.split(',');
  const r = Number(rgbaArray[0].split('(')[1]);
  const g = Number(rgbaArray[1]);
  const b = Number(rgbaArray[2]);
  const a = Number(rgbaArray[3].split(')')[0]);
  return {
    // eslint-disable-next-line sort-keys
    r, g, b, a,
  };
};

const objToRgba = (obj = {
  // eslint-disable-next-line sort-keys
  r: 255, g: 255, b: 255, a: 0.5,
}) => `rgba(${obj.r},${obj.g},${obj.b},${obj.a})`;

/** Check if we are using an overlay tool or selecting the overlay view */
function isOverlayTool(activeTool) {
  switch (activeTool) {
    case 'rectangle':
    case 'ellipse':
    case 'arrow':
    case 'polygon':
    case 'freehand':
    case 'shapes':
      return true;
      break;
    default:
      return false;
  }
}

/** All the stuff to manage to choose the drawing tool */
function AnnotationFormOverlay({
  updateToolState, toolState, handleImgChange, shapes, deleteShape,
}) {
  useEffect(() => {

  }, [toolState.fillColor, toolState.strokeColor, toolState.strokeWidth]);

  /** */
  const openChooseLineWeight = (e) => {
    updateToolState({
      ...toolState,
      lineWeightPopoverOpen: true,
      popoverLineWeightAnchorEl: e.currentTarget,
    });
  };

  /** Close color popover window */
  const closeChooseColor = (e) => {
    updateToolState({
      ...toolState,
      colorPopoverOpen: false,
      currentColorType: null,
      popoverAnchorEl: null,
    });
  };

  /** Update color : fillColor or strokeColor */
  const updateStrokeColor = (color) => {
    updateToolState({
      ...toolState,
      [toolState.currentColorType]: objToRgba(color.rgb),
    });
  };
  /** */
  const openChooseColor = (e) => {
    updateToolState({
      ...toolState,
      colorPopoverOpen: true,
      currentColorType: e.currentTarget.value,
      popoverAnchorEl: e.currentTarget,
    });
  };

  /** */
  const handleCloseLineWeight = (e) => {
    updateToolState({
      ...toolState,
      lineWeightPopoverOpen: false,
      popoverLineWeightAnchorEl: null,
    });
  };

  /** */
  const handleLineWeightSelect = (e) => {
    updateToolState({
      ...toolState,
      lineWeightPopoverOpen: false,
      popoverLineWeightAnchorEl: null,
      strokeWidth: e.currentTarget.value,
    });
  };

  const changeTool = (e, tool) => {
    updateToolState({
      ...toolState,
      activeTool: tool,
    });
  };

  const changeClosedMode = (e) => {
    updateToolState({
      ...toolState,
      closedMode: e.currentTarget.value,
    });
  };

  /**
   *
   */
  const addImage = () => {
    const data = {
      id: image?.id,
      uuid: uuidv4(),
    };

    updateToolState({
      ...toolState,
      image: { id: null },
      imageEvent: data,
    });
  };

  const {
    activeTool,
    closedMode,
    image,
    lineWeightPopoverOpen,
    popoverLineWeightAnchorEl,
    fillColor,
    strokeColor,
    strokeWidth,
    colorPopoverOpen,
    popoverAnchorEl,
    currentColorType,
  } = toolState;

  return (
    <StyledPaper>
      <div>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="overline">
              Overlay
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <StyledToggleButtonGroup
              value={activeTool} // State or props ?
              exclusive
              onChange={changeTool}
              aria-label="tool selection"
              size="small"
            >
              <ToggleButton value="edit" aria-label="select cursor">
                <CursorIcon />
              </ToggleButton>
              <ToggleButton value="shapes" aria-label="select cursor">
                <CategoryIcon />
              </ToggleButton>
              <ToggleButton value="images" aria-label="select cursor">
                <ImageIcon />
              </ToggleButton>
              <ToggleButton value="text" aria-label="select text">
                <TitleIcon />
              </ToggleButton>
              <ToggleButton value="delete" aria-label="select cursor">
                <DeleteIcon />
              </ToggleButton>
            </StyledToggleButtonGroup>
            {
              activeTool === 'edit' && (
                <StyledUl>
                  {shapes && shapes.map((shape) => (
                    <StyledLi key={shape.id}>
                      {shape.id}
                      <Button onClick={() => deleteShape(shape.id)}>
                        <DeleteIcon />
                      </Button>
                    </StyledLi>
                  ))}
                </StyledUl>
              )
            }
            {
              isOverlayTool(activeTool) && (
                <AnnotationFormOverlayToolOptions
                  activeTool={activeTool}
                  onChange={changeTool}
                  openChooseColor={openChooseColor}
                  strokeColor={strokeColor}
                  openChooseLineWeight={openChooseLineWeight}
                  fillColor={fillColor}
                  closedMode={closedMode}
                  changeClosedMode={changeClosedMode}
                />
              )
            }
            {
              activeTool === 'images' && (
                <>
                  <Grid container>
                    <ImageFormField xs={8} value={image} onChange={handleImgChange} />
                  </Grid>
                  <StyledDivButtonImage>
                    <Button variant="contained" onClick={addImage}>
                      <AddPhotoAlternateIcon />
                    </Button>
                  </StyledDivButtonImage>
                </>
              )
            }
            {
                activeTool === 'text' && (
                <Typography>
                  Ajouter un input text
                </Typography>
                )
            }
          </Grid>
        </Grid>
      </div>
      <Popover
        open={lineWeightPopoverOpen}
        anchorEl={popoverLineWeightAnchorEl}
      >
        <Paper>
          <ClickAwayListener onClickAway={handleCloseLineWeight}>
            <MenuList autoFocus role="listbox">
              {[1, 3, 5, 10, 50].map((option, index) => (
                <MenuItem
                  key={option}
                  onClick={handleLineWeightSelect}
                  value={option}
                  selected={option == strokeWidth}
                  role="option"
                  aria-selected={option == strokeWidth}
                >
                  {option}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popover>
      <Popover
        open={colorPopoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={closeChooseColor}
      >
        <SketchPicker
          disableAlpha={false}
          color={rgbaToObj(toolState[currentColorType])}
          onChangeComplete={updateStrokeColor}
        />
      </Popover>
    </StyledPaper>
  );
}

AnnotationFormOverlay.propTypes = {
  handleImgChange: PropTypes.func,
  toolState: PropTypes.object,
  updateToolState: PropTypes.func,
  shapes: PropTypes.object,
  deleteShape: PropTypes.func,
};

export default AnnotationFormOverlay;
