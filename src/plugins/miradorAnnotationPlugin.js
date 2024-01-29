import React, {useState, useCallback, useEffect} from 'react';
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
function MiradorAnnotation({ targetProps, TargetComponent, annotationEdit}) {
  const [annotationExportDialogOpen, setAnnotationExportDialogOpen] = useState(false);
  const [singleCanvasDialogOpen, setSingleCanvasDialogOpen] = useState(false);
  const [currentCompanionWindowId, setCurrentCompanionWindowId] = useState(null);

  const dispatch = useDispatch();
  /** Open the companion window for annotation */
  const addCompanionWindow = (content, additionalProps) => {
    setCurrentCompanionWindowId(targetProps.windowId);
    dispatch(actions.addCompanionWindow(targetProps.windowId, { content, ...additionalProps }));
  };

  useEffect(() => {
  }, [annotationEdit]);
  /** */
  const switchToSingleCanvasView = () => {
    dispatch(actions.setWindowViewType(targetProps.windowId, 'single'));
  };

  const windowViewType = useSelector((state) => getWindowViewType(state, { windowId: targetProps.windowId }));
  const canvases = useSelector((state) => getVisibleCanvases(state, { windowId: targetProps.windowId }));
  const config = useSelector((state) => state.config);

  const openCreateAnnotationCompanionWindow = useCallback((e) => {
    addCompanionWindow('annotationCreation', {
      position: 'right',
    });
  }, [targetProps.windowId]);

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
      <TargetComponent {...targetProps} />
      <MiradorMenuButton
        aria-label="Create new annotation"
        onClick={windowViewType === 'single' ? openCreateAnnotationCompanionWindow : toggleSingleCanvasDialogOpen}
        size="small"
        disabled={!annotationEdit}
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
  createAnnotation: PropTypes.bool.isRequired,
};

export default MiradorAnnotation;
