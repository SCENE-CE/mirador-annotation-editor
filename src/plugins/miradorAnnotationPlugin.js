import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddBoxIcon from '@mui/icons-material/AddBox';
import GetAppIcon from '@mui/icons-material/GetApp';
import {getCompanionWindowsForContent, getWindowViewType} from 'mirador/dist/es/src/state/selectors';
import * as actions from 'mirador/dist/es/src/state/actions';
import { MiradorMenuButton } from 'mirador/dist/es/src/components/MiradorMenuButton';
import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import SingleCanvasDialog from '../SingleCanvasDialog';
import AnnotationExportDialog from '../AnnotationExportDialog';
import LocalStorageAdapter from '../LocalStorageAdapter';

/** */
class MiradorAnnotation extends Component {
  /** */
  constructor(props) {
    super(props);
    this.state = {
      annotationExportDialogOpen: false,
      singleCanvasDialogOpen: false,
      creationAnnotationIsOpen: false,
      id: "",
      payload:{}
    };
    this.handleAnnotationCompanionWindow = this.handleAnnotationCompanionWindow.bind(this);
    this.toggleCanvasExportDialog = this.toggleCanvasExportDialog.bind(this);
    this.toggleSingleCanvasDialogOpen = this.toggleSingleCanvasDialogOpen.bind(this);
  }

  /** */
  handleAnnotationCompanionWindow(e) {
    const {
      addCompanionWindow,
      closeCompanionWindow,
        targetProps
    } = this.props;
    if(!this.state.creationAnnotationIsOpen){


    const myAnnotationPannel = addCompanionWindow('annotationCreation', {
      position: 'right',
    });

    this.setState({creationAnnotationIsOpen: true});
    this.setState({id: myAnnotationPannel.id})
    this.setState({payload: myAnnotationPannel.payload})

    }else{
      closeCompanionWindow(this.state.id)
      this.setState({creationAnnotationIsOpen: false})
    }
  }

  /** */
  toggleSingleCanvasDialogOpen() {
    const { singleCanvasDialogOpen } = this.state;
    this.setState({
      singleCanvasDialogOpen: !singleCanvasDialogOpen,
    });
  }

  /** */
  toggleCanvasExportDialog(e) {
    const { annotationExportDialogOpen } = this.state;
    const newState = {
      annotationExportDialogOpen: !annotationExportDialogOpen,
    };
    this.setState(newState);
  }

  /** */
  render() {
    const {
      canvases,
      config,
      switchToSingleCanvasView,
      TargetComponent,
      targetProps,
      windowViewType,
      createAnnotation
    } = this.props;
    const { annotationExportDialogOpen, singleCanvasDialogOpen } = this.state;
    const storageAdapter = config.annotation && config.annotation.adapter('poke');
    const offerExportDialog = config.annotation && storageAdapter instanceof LocalStorageAdapter
      && config.annotation.exportLocalStorageAnnotations;
    return (
      <div>
        <TargetComponent
          {...targetProps} // eslint-disable-line react/jsx-props-no-spreading
        />
        <MiradorMenuButton
          aria-label="Create new annotation"
          onClick={windowViewType === 'single' ? this.handleAnnotationCompanionWindow : this.toggleSingleCanvasDialogOpen}
          size="small"
          disabled={!createAnnotation}
        >
          <AddBoxIcon />
        </MiradorMenuButton>
        { singleCanvasDialogOpen && (
          <SingleCanvasDialog
            open={singleCanvasDialogOpen}
            handleClose={this.toggleSingleCanvasDialogOpen}
            switchToSingleCanvasView={switchToSingleCanvasView}
          />
        )}
        { offerExportDialog && (
          <MiradorMenuButton
            aria-label="Export local annotations for visible items"
            onClick={this.toggleCanvasExportDialog}
            size="small"
          >
            <GetAppIcon />
          </MiradorMenuButton>
        )}
        { offerExportDialog && (
          <AnnotationExportDialog
            canvases={canvases}
            config={config}
            handleClose={this.toggleCanvasExportDialog}
            open={annotationExportDialogOpen}
          />
        )}
      </div>
    );
  }
}

MiradorAnnotation.propTypes = {
  addCompanionWindow: PropTypes.func.isRequired,
  canvases: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, index: PropTypes.number }),
  ).isRequired,
  config: PropTypes.shape({
    annotation: PropTypes.shape({
      adapter: PropTypes.func,
      exportLocalStorageAnnotations: PropTypes.bool,
    }),
  }).isRequired,
  switchToSingleCanvasView: PropTypes.func.isRequired,
  TargetComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  targetProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  windowViewType: PropTypes.string.isRequired,
  closeCompanionWindow: PropTypes.func.isRequired,
  createAnnotation: PropTypes.bool.isRequired,
};

/** */
const mapDispatchToProps = (dispatch, props) => ({
  addCompanionWindow: (content, additionalProps) => dispatch(
    actions.addCompanionWindow(props.targetProps.windowId, { content, ...additionalProps }),
  ),
  switchToSingleCanvasView: () => dispatch(
    actions.setWindowViewType(props.targetProps.windowId, 'single'),
  ),
  closeCompanionWindow: (id) => dispatch(
    actions.removeCompanionWindow(props.targetProps.windowId, id),
  )
});

/** */
function mapStateToProps(state, { targetProps: { windowId } }) {
  const annotationCreationCompanionWindows = getCompanionWindowsForContent(state, { content: 'annotationCreation', windowId });
  let annotationEdit = true;
  if (Object.keys(annotationCreationCompanionWindows).length !== 0) {
    annotationEdit = false;
  }

  return {
    canvases: getVisibleCanvases(state, { windowId }),
    config: state.config,
    createAnnotation: annotationEdit,
    windowViewType: getWindowViewType(state, { windowId }),
  }
}
export default {
  component: MiradorAnnotation,
  mapDispatchToProps,
  mapStateToProps,
  mode: 'wrap',
  target: 'AnnotationSettings',
};
