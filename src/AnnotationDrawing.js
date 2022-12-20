import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ResizeObserver from 'react-resize-observer';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import { renderWithPaperScope, PaperContainer } from '@psychobolt/react-paperjs';
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

/** Create a portal with a drawing canvas and a form to fill annotations details */
class AnnotationDrawing extends Component {
  /** */
  constructor(props) {
    super(props);

    this.paper = null;
    this.getDisplayProps = this.getDisplayProps.bind(this);
    this.onPaperResize = this.onPaperResize.bind(this);
    this.paperDidMount = this.paperDidMount.bind(this);
    this.addPath = this.addPath.bind(this);
  }

  /** Sync drawing canvas on componentDidMount */
  componentDidMount() {
    this.onPaperResize();
  }

  /** Sync drawing canvas on componentDidUpdate */
  componentDidUpdate() {
    this.onPaperResize();
  }

  /** Sync drawing canvas size/zoom with annotations canvas */
  onPaperResize(ev) {
    const { windowId } = this.props;
    if (VideosReferences.get(windowId) && this.paper) {
      const { canvasOverlay } = VideosReferences.get(windowId);
      const { height } = canvasOverlay.ref.current;
      const { width } = canvasOverlay.ref.current;
      this.paper.view.viewSize = new this.paper.Size(width, height);
      this.paper.view.zoom = canvasOverlay.scale;
    }
  }

  /** Build parameters to paperjs View and canvas */
  getDisplayProps() {
    const { windowId } = this.props;
    const osdref = OSDReferences.get(windowId);
    const videoref = VideosReferences.get(windowId);

    if (osdref && videoref) {
      console.error('Unhandled case: both OpenSeadragon (picture viewer) and video player on the same canvas');
    }

    if (osdref) {
      const { viewport } = osdref.current;
      const img = osdref.current.world.getItemAt(0);
      const center = img.viewportToImageCoordinates(viewport.getCenter(true));
      return {
        canvasProps: { style: { height: '100%', width: '100%' } },
        viewProps: {
          center: new Point(center.x, center.y),
          rotation: viewport.getRotation(),
          scaling: new Point(viewport.getFlip() ? -1 : 1, 1),
          zoom: img.viewportToImageZoom(viewport.getZoom()),
        },
      };
    }

    if (videoref) {
      const { height, width } = videoref.canvasOverlay.ref.current;
      return {
        canvasProps: { height, style: { left: 0, position: 'absolute', top: 0 }, width },
        viewProps: {
          center: new Point(width / 2, height / 2),
          height,
          width,
          zoom: videoref.canvasOverlay.scale,
        },
      };
    }

    throw new Error('Unknown or missing data player, not OpenSeadragon (picture viewer) nor the video player');
  }

  /** Draw SVG on canvas */
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

  /** Save paperjs ref once created */
  paperDidMount(paper) {
    this.paper = paper;
  }

  /** */
  paperThing() {
    const { viewProps, canvasProps } = this.getDisplayProps();
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

    return (
      <div
        style={{
          height: '100%', left: 0, position: 'absolute', top: 0, width: '100%',
        }}
      >
        <PaperContainer
          canvasProps={canvasProps}
          viewProps={viewProps}
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
    const osdref = OSDReferences.get(windowId);
    const videoref = VideosReferences.get(windowId);
    if (!osdref && !videoref) {
      throw new Error("Unknown or missing data player, didn't found OpenSeadragon (image viewer) nor the video player");
    }
    const container = osdref
      ? osdref.current.element
      : videoref.ref.current.parentElement;
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
