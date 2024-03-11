import {
  Accordion, AccordionDetails, AccordionSummary, Divider, IconButton, ListItem, Paper,
} from '@mui/material';
import React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import {styled} from "@mui/material/styles";
import ListItemText from '@mui/material/ListItemText';
import MenuList from "@mui/material/MenuList";


/**
 * Accordion presentation of shapes
 * @param shapes
 * @param deleteShape
 * @param currentShapeId
 * @returns {Element}
 * @constructor
 */
const ListItemContent = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

function ShapesList({shapes, deleteShape, currentShapeId,updateCurrentShapeInShapes}) {

  return (
    <MenuList>
      {shapes.map((shape) => (
          <div>
          <ListItemContent sx={{padding:0}}>
            <div>
            <Typography  onClick={()=> updateCurrentShapeInShapes(shape)} sx={{color: 'black'}} >{shape.type}</Typography>
            </div>
          <IconButton
              onClick={() => deleteShape(shape.id)}
          >
            <DeleteIcon />
          </IconButton>
          </ListItemContent>
          <Divider/>
          </div>
  ))}
    </MenuList>
  );
}

ShapesList.propTypes = {
  shapes: PropTypes.array.isRequired,
  deleteShape: PropTypes.func.isRequired,
  currentShapeId: PropTypes.string.isRequired,
};

export default ShapesList;
