import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import isEqual from 'lodash/isEqual';
import * as actions from 'mirador/dist/es/src/state/actions';
import LocalStorageAdapter from '../LocalStorageAdapter';
import AnnototAdapter from '../AnnototAdapter';
import { AnnotationAdapter } from '../annotationAdapter/AnnotationAdapterUtils';

// TODO: Change this classComponent into functional component
/** */
class ExternalStorageAnnotation extends Component {
  /** */
  constructor(props) {
    super(props);
    this.retrieveAnnotations = this.retrieveAnnotations.bind(this);
  }

  /** */
  componentDidMount() {
    const { canvases } = this.props;
    this.retrieveAnnotations(canvases);
  }

  /** */
  componentDidUpdate(prevProps) {
    const { canvases } = this.props;
    const currentCanvasIds = canvases.map((canvas) => canvas.id);
    const prevCanvasIds = prevProps.canvases.map((canvas) => canvas.id);
    if (!isEqual(currentCanvasIds, prevCanvasIds)) {
      this.retrieveAnnotations(canvases);
    }
  }

  /** */
  retrieveAnnotations(canvases) {
    const { config, receiveAnnotation } = this.props;

    canvases.forEach((canvas) => {
      // TODO Actually when exporting workspace, adapter is not saved.
      // So, we can manually add : adapter : 'localStorage' or 'annotot'
      if (typeof config.annotation.adapter === 'string' && config.annotation.adapter === AnnotationAdapter.LOCAL_STORAGE) {
        config.annotation.adapter = (canvasId) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`);
      }
      if(typeof config.annotation.adapter === 'string' && config.annotation.adapter  === AnnotationAdapter.ANNOTOT) {
        const endpointUrl = 'http://127.0.0.1:3000/annotations';
        config.annotation.adapter = (canvasId) => new AnnototAdapter(canvasId, endpointUrl);
      }
      if (!config.annotation.adapter) {
        // Default adapter set to LocalStorageAdapter
        config.annotation.adapter = (canvasId) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`);
      }
      const storageAdapter = config.annotation.adapter(canvas.id);
      console.log(config.annotation);
      storageAdapter.all().then((annoPage) => {
        if (annoPage) {
          receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
        }
      });
    });
  }

  /** */
  render() {
    const { PluginComponents, TargetComponent, targetProps } = this.props;
    return (
      <TargetComponent
        {...targetProps} // eslint-disable-line react/jsx-props-no-spreading
        PluginComponents={PluginComponents}
      />
    );
  }
}

ExternalStorageAnnotation.propTypes = {
  canvases: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, index: PropTypes.number }),
  ),
  config: PropTypes.shape({
    annotation: PropTypes.shape({
      adapter: PropTypes.func,
    }),
  }).isRequired,
  PluginComponents: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  receiveAnnotation: PropTypes.func.isRequired,
  TargetComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  targetProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

ExternalStorageAnnotation.defaultProps = {
  canvases: [],
  PluginComponents: [],
};

/** */
const mapDispatchToProps = {
  receiveAnnotation: actions.receiveAnnotation,
};

/** */
function mapStateToProps(state, { targetProps }) {
  return {
    canvases: getVisibleCanvases(state, { windowId: targetProps.windowId }),
    config: state.config,
  };
}

export default {
  component: ExternalStorageAnnotation,
  mapDispatchToProps,
  mapStateToProps,
  mode: 'wrap',
  target: 'Window',
};
