import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import AddBoxIcon from '@mui/icons-material/AddBox';
import GetAppIcon from '@mui/icons-material/GetApp';
import { getWindowViewType } from 'mirador/dist/es/src/state/selectors';
import * as actions from 'mirador/dist/es/src/state/actions';
import { MiradorMenuButton } from 'mirador/dist/es/src/components/MiradorMenuButton';
import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import { useDispatch, useSelector } from 'react-redux';
import SingleCanvasDialog from '../SingleCanvasDialog';
import AnnotationExportDialog from '../AnnotationExportDialog';
import LocalStorageAdapter from '../LocalStorageAdapter';

/** */
function MiradorAnnotation(props) {
  const [annotationExportDialogOpen, setAnnotationExportDialogOpen] = useState(false);
  const [singleCanvasDialogOpen, setSingleCanvasDialogOpen] = useState(false);

  const dispatch = useDispatch();

  const addCompanionWindow = (content, additionalProps) => {
    dispatch(actions.addCompanionWindow(props.targetProps.windowId, { content, ...additionalProps }));
  };

  const switchToSingleCanvasView = () => {
    dispatch(actions.setWindowViewType(props.targetProps.windowId, 'single'));
  };

  const windowViewType = useSelector((state) => getWindowViewType(state, { windowId: props.targetProps.windowId }));
  const canvases = useSelector((state) => getVisibleCanvases(state, { windowId: props.targetProps.windowId }));
  const config = useSelector((state) => state.config);

  const openCreateAnnotationCompanionWindow = useCallback((e) => {
    addCompanionWindow('annotationCreation', {
      position: 'right',
    });
  }, [props]);

  const toggleSingleCanvasDialogOpen = useCallback(() => {
    setSingleCanvasDialogOpen(!singleCanvasDialogOpen);
  }, [singleCanvasDialogOpen]);

  const toggleCanvasExportDialog = useCallback((e) => {
    setAnnotationExportDialogOpen(!annotationExportDialogOpen);
  }, [annotationExportDialogOpen]);

  const storageAdapter = config.annotation && config.annotation.adapter('poke');
  const offerExportDialog = config.annotation && storageAdapter instanceof LocalStorageAdapter
      && config.annotation.exportLocalStorageAnnotations;

  return (
    <div>
      <props.TargetComponent {...props.targetProps} />
      <MiradorMenuButton
        aria-label="Create new annotation"
        onClick={windowViewType === 'single' ? openCreateAnnotationCompanionWindow : toggleSingleCanvasDialogOpen}
        size="small"
      >
        <AddBoxIcon />
      </MiradorMenuButton>
      {singleCanvasDialogOpen && (
        <SingleCanvasDialog
          open={singleCanvasDialogOpen}
          handleClose={toggleSingleCanvasDialogOpen}
          switchToSingleCanvasView={switchToSingleCanvasView}
        />
      )}
      {offerExportDialog && (
        <MiradorMenuButton
          aria-label="Export local annotations for visible items"
          onClick={toggleCanvasExportDialog}
          size="small"
        >
          <GetAppIcon />
        </MiradorMenuButton>
      )}
      {offerExportDialog && (
        <AnnotationExportDialog
          canvases={canvases}
          config={config}
          handleClose={toggleCanvasExportDialog}
          open={annotationExportDialogOpen}
        />
      )}
    </div>
  );
}

MiradorAnnotation.propTypes = {
  canvases: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, index: PropTypes.number }),
  ).isRequired,
  config: PropTypes.shape({
    annotation: PropTypes.shape({
      adapter: PropTypes.func,
      exportLocalStorageAnnotations: PropTypes.bool,
    }),
  }).isRequired,
  TargetComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  targetProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  windowViewType: PropTypes.string.isRequired,
};


export default {
  component: MiradorAnnotation,
  mode: 'wrap',
  target: 'AnnotationSettings',
};
