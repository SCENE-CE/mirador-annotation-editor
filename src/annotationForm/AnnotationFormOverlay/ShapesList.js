import {
  Divider, IconButton, ListItem, Tooltip,
} from '@mui/material';
import React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { styled } from '@mui/material/styles';
import MenuList from '@mui/material/MenuList';

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

// TODO TRAD missing

/**
 *
 * @param shapes
 * @param deleteShape
 * @param currentShapeId
 * @param updateCurrentShapeInShapes
 * @returns {JSX.Element}
 * @constructor
 */
function ShapesList({
  currentShapeId,
  deleteShape,
  shapes,
  t,
  updateCurrentShapeInShapes,
}) {
  return (
    <MenuList>
      {shapes.map((shape) => (
        <div>
          <ListItemContent sx={{ padding: 0 }}>
            <div>
              <Typography
                style={shape.id === currentShapeId ? { fontWeight: 'bold' } : {}}
                onClick={() => updateCurrentShapeInShapes(shape)}
                sx={{ color: 'black', cursor: 'pointer' }}
              >
                {shape.type}
              </Typography>
            </div>
            <Tooltip title={t('delete')}>
              <IconButton
                onClick={() => deleteShape(shape.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </ListItemContent>
          <Divider />
        </div>
      ))}
    </MenuList>
  );
}

ShapesList.propTypes = {
  currentShapeId: PropTypes.string.isRequired,
  deleteShape: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  shapes: PropTypes.array.isRequired,
  updateCurrentShapeInShapes: PropTypes.func.isRequired,
};

export default ShapesList;
