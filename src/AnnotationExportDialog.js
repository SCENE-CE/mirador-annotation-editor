import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import GetAppIcon from '@mui/icons-material/GetApp';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:focus': {
    backgroundColor: theme.palette.action.focus,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

/**
 *
 * @param canvases
 * @param config
 * @param handleClose
 * @param open
 * @param t
 * @returns {JSX.Element}
 * @constructor AnnotationExportDialog
 */
function AnnotationExportDialog({
  canvases,
  config,
  handleClose,
  open,
  t,
}) {
  const [exportLinks, setExportLinks] = useState([]);

  useEffect(() => {
    if (!open) return;

    /**
     * Fetch export links for annotations
     * @returns {Promise<void>}
     */
    const fetchExportLinks = async () => {
      /**
       * Reducer function to fetch annotations for each canvas
       * @param acc
       * @param canvas
       * @returns {Promise<[...*,{canvasId, id: *, label: *, url: string}]|*>}
       */
      const reducer = async (acc, canvas) => {
        const store = config.annotation.adapter(canvas.id);
        const resolvedAcc = await acc;
        const content = await store.all();
        if (content) {
          // eslint-disable-next-line no-underscore-dangle
          const label = (canvas.__jsonld && canvas.__jsonld.label) || canvas.id;
          const data = new Blob([JSON.stringify(content)], { type: 'application/json' });
          const url = window.URL.createObjectURL(data);
          return [...resolvedAcc, {
            canvasId: canvas.id,
            id: content.id || content['@id'],
            label,
            url,
          }];
        }
        return resolvedAcc;
      };

      if (canvases && canvases.length > 0) {
        const links = await canvases.reduce(reducer, []);
        setExportLinks(links);
      }
    };

    fetchExportLinks();
  }, [canvases, config, open]);

  /**
   * Close dialog window
   */
  const closeDialog = () => {
    setExportLinks([]);
    handleClose();
  };

  return (
    <Dialog
      aria-labelledby="annotation-export-dialog-title"
      id="annotation-export-dialog"
      onClose={handleClose}
      onEscapeKeyDown={closeDialog}
      open={open}
    >
      <DialogTitle id="annotation-export-dialog-title" disableTypography>
        <Typography variant="h2">{t('export_annotation')}</Typography>
      </DialogTitle>
      <DialogContent>
        {exportLinks.length === 0 ? (
          <Typography variant="body1">{t('no_annotation')}</Typography>
        ) : (
          <MenuList>
            {exportLinks.map((dl) => (
              <StyledMenuItem
                button
                component="a"
                key={dl.canvasId}
                aria-label={t('export_annotation_for')}
                href={dl.url}
                download={`${dl.id}.json`}
              >
                <ListItemIcon>
                  <GetAppIcon />
                </ListItemIcon>
                <ListItemText>
                  {t('export_annotation_for')}
                </ListItemText>
              </StyledMenuItem>
            ))}
          </MenuList>
        )}
      </DialogContent>
    </Dialog>
  );
}

AnnotationExportDialog.propTypes = {
  canvases: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string }),
  ).isRequired,
  config: PropTypes.shape({
    annotation: PropTypes.shape({
      adapter: PropTypes.func,
    }),
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default AnnotationExportDialog;
