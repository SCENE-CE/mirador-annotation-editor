import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ResizeObserver from 'react-resize-observer';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import { renderWithPaperScope, PaperContainer, Size } from '@psychobolt/react-paperjs';
import
{
  EllipseTool,
  PolygonTool,
  RectangleTool,
  FreeformPathTool,
}
from '@psychobolt/react-paperjs-editor';
import { Point } from 'paper';
import flatten from 'lodash/flatten';
import EditTool from './EditTool';
import { mapChildren } from './utils';

/** */
class AnnotationDrawing extends Component {
  /** */
  constructor(props) {
    super(props);

    this.paper = null;
    this.getViewProps = this.getViewProps.bind(this);
    this.onPaperResize = this.onPaperResize.bind(this);
    this.paperDidMount = this.paperDidMount.bind(this);
    this.addPath = this.addPath.bind(this);
  }

  /** */
  addPath(path) {
    const { closed, strokeWidth, updateGeometry } = this.props;
    // TODO: Compute xywh of bounding container of layers
    const { bounds } = path;
    const {
      x, y, width, height,
    } = bounds;
    path.closed = closed; // eslint-disable-line no-param-reassign
    // Reset strokeWidth for persistence
    path.strokeWidth = strokeWidth; // eslint-disable-line no-param-reassign
    path.data.state = null; // eslint-disable-line no-param-reassign
    const svgExports = flatten(path.project.layers.map((layer) => (
      flatten(mapChildren(layer)).map((aPath) => aPath.exportSVG({ asString: true }))
    )));
    svgExports.unshift("<svg xmlns='http://www.w3.org/2000/svg'>");
    svgExports.push('</svg>');
    updateGeometry({
      svg: svgExports.join(''),
      xywh: [
        Math.floor(x),
        Math.floor(y),
        Math.floor(width),
        Math.floor(height),
      ].join(','),
    });
  }

  onPaperResize(ev) {
    if (this.paper) {
      console.debug('size: ', this.paper.view.viewSize);
      console.debug('el: ', this.paper.view.element);
      const { canvasOverlay } = VideosReferences.get(this.props.windowId);
      const height = canvasOverlay.ref.current.height;
      const width = canvasOverlay.ref.current.width;
      this.paper.view.viewSize = new this.paper.Size(width, height);
      this.paper.view.zoom = canvasOverlay.scale;
      console.debug('new scale: ', canvasOverlay.scale);
    }
  }

  getViewport() {
    const { canvasOverlay } = VideosReferences.get(this.props.windowId);
    const height = canvasOverlay.ref.current.height;
    const width = canvasOverlay.ref.current.width;
    return {
      getCenter: () => ({ x: width / 2, y: height / 2 }),
      getFlip: () => false,
      getRotation: () => false,
      getZoom: () => canvasOverlay.scale,
    };
  }

  getViewProps() {
    const { windowId } = this.props;
    let viewport = null;
    let img = null;
    if (OSDReferences.get(windowId)) {
      viewport = OSDReferences.get(windowId).current.viewport;
      img = OSDReferences.get(windowId).current.world.getItemAt(0);
    } else if (VideosReferences.get(windowId)) {
      viewport = this.getViewport();
    }
    // Setup Paper View to have the same center and zoom as the OSD Viewport/video canvas
    const center = img
      ? img.viewportToImageCoordinates(viewport.getCenter(true))
      : viewport.getCenter();
    const flipped = viewport.getFlip();

    return {
      center: new Point(center.x, center.y),
      rotation: viewport.getRotation(),
      scaling: new Point(flipped ? -1 : 1, 1),
      zoom: img ? img.viewportToImageZoom(viewport.getZoom()) : viewport.getZoom(),
    };
  }

  componentDidMount() {
    console.debug('componentDidMount');
    this.onPaperResize();
  }

  componentDidUpdate() {
    console.debug('componentDidUpdate');
    this.onPaperResize();
  }

  paperDidMount(paper) {
    console.debug('paper mounted: ', paper);
    this.paper = paper;
  }

  /** */
  paperThing() {
    const {
      activeTool, fillColor, strokeColor, strokeWidth, svg,
    } = this.props;
    if (!activeTool || activeTool === 'cursor') return null;
    let ActiveTool = RectangleTool;
    switch (activeTool) {
      case 'rectangle':
        ActiveTool = RectangleTool;
        break;
      case 'ellipse':
        ActiveTool = EllipseTool;
        break;
      case 'polygon':
        ActiveTool = PolygonTool;
        break;
      case 'freehand':
        ActiveTool = FreeformPathTool;
        break;
      case 'edit':
        ActiveTool = EditTool;
        break;
      default:
        break;
    }

    const { canvasOverlay } = VideosReferences.get(this.props.windowId);
    const height = canvasOverlay.ref.current.height;
    const width = canvasOverlay.ref.current.width;

      // canvasProps={{ style: { left: 0, position: 'absolute', top: 0}, height: height, width: width, resize: 'true' }}
    return (
      <div
      className="foo"
      style={{
        height: '100%', left: 0, position: 'absolute', top: 0, width: '100%',
      }}
      >
      <PaperContainer
      canvasProps={{ style: { position: 'absolute', left: 0, top: 0 }, height, width }}
      viewProps={this.getViewProps}
      onMount={this.paperDidMount}
      >
      {renderWithPaperScope((paper) => {
        const paths = flatten(paper.project.layers.map((layer) => (
          flatten(mapChildren(layer)).map((aPath) => aPath)
        )));
        if (svg && paths.length === 0) {
          paper.project.importSVG(svg);
        }
        paper.settings.handleSize = 10; // eslint-disable-line no-param-reassign
        paper.settings.hitTolerance = 10; // eslint-disable-line no-param-reassign
        return (
          <ActiveTool
          onPathAdd={this.addPath}
          pathProps={{
            fillColor,
              strokeColor,
              strokeWidth: strokeWidth / paper.view.zoom,
          }}
          paper={paper}
          />
        );
      })}
      </PaperContainer>
      <ResizeObserver onResize={this.onPaperResize} />
      </div>
    );
  }

  /** */
  render() {
    const { windowId } = this.props;
    console.log('[render] videoref : ', VideosReferences.get(windowId));
    const container = OSDReferences.get(windowId)
      ? OSDReferences.get(windowId).current.element
      : VideosReferences.get(windowId).ref.current.parentElement;
    return (
      ReactDOM.createPortal(this.paperThing(), container)
    );
  }
}

AnnotationDrawing.propTypes = {
  activeTool: PropTypes.string,
  closed: PropTypes.bool,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
  strokeWidth: PropTypes.number,
  svg: PropTypes.string,
  updateGeometry: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

AnnotationDrawing.defaultProps = {
  activeTool: null,
  closed: true,
  fillColor: null,
  strokeColor: '#00BFFF',
  strokeWidth: 1,
  svg: null,
};

export default AnnotationDrawing;
