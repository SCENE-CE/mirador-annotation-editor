import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ResizeObserver from 'react-resize-observer';
import { OSDReferences } from '../mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from '../mirador/dist/es/src/plugins/VideosReferences';
import { renderWithPaperScope, PaperContainer } from '@psychobolt/react-paperjs';
import { v4 as uuidv4 } from 'uuid';
import {
  EllipseTool,
  PolygonTool,
  RectangleTool,
  FreeformPathTool,
}
  from '@psychobolt/react-paperjs-editor';

import {
  Stage, Layer, Star, Text, Circle, Rect
  , Ellipse, Transformer,

} from 'react-konva';


import { Point } from 'paper';
import flatten from 'lodash/flatten';
import EditTool from './EditTool';
import { mapChildren } from './utils';


class TextNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTransformer: false,
    };
    this.shapeRef = React.createRef();
    this.trRef = React.createRef();
  }

  componentDidMount() {
    if (this.trRef.current) {
    this.trRef.current.nodes([this.shapeRef.current]);
    this.trRef.current.getLayer().batchDraw();
    }
  }

  handleClick = () => {
    this.setState(prevState => ({ showTransformer: !prevState.showTransformer }));
    this.props.onClick && this.props.onClick();
  };
  render() {
    const { activeTool } = this.props;
    const { showTransformer } = this.state;
    return (
      <React.Fragment>
        <Text
          ref={this.shapeRef}
          x={this.props.x}
          y={this.props.y}
          fontSize={this.props.fontSize}
          fill={this.props.fill}
          text={this.props.text}
          draggable={this.props.draggable}
          onClick={this.props.onClick}
          onDragEnd={this.props.onDragEnd}
          onDblClick={this.props.onDblClick}

          
        />
           { showTransformer && (
          <Transformer ref={this.trRef} />
        )}
      </React.Fragment>
    );
  }


}


class Rectangle extends React.Component {
  constructor(props) {
    super(props);
    this.shapeRef = React.createRef();
    this.trRef = React.createRef();
  }

  componentDidMount() {
    if (this.trRef.current) {
    this.trRef.current.nodes([this.shapeRef.current]);
    this.trRef.current.getLayer().batchDraw();
    }
  }

  render() {
    const { activeTool } = this.props;
    console.log('active tool ===>', activeTool);
    return (
      <React.Fragment>
        <Rect
        // map props to konva
          ref={this.shapeRef}
          x={this.props.x}
          y={this.props.y}
          width={this.props.width}
          height={this.props.height}
          fill={this.props.fill}
          stroke={this.props.stroke}
          strokeWidth={this.props.strokeWidth}
          draggable={this.props.draggable}
          onClick={this.props.onClick}
      
        />
        {activeTool === 'edit' && (
            <Transformer ref={this.trRef} enabledAnchors={['middle-left', 'middle-right', 'bottom-left', 'bottom-right', 'top-left', 'top-right', 'top-center', 'bottom-center']} />
     
        )}
       

      </React.Fragment>
    );
  }
}



/** Create a portal with a drawing canvas and a form to fill annotations details */
class AnnotationDrawing extends Component {
  /** */
  constructor(props) {
    super(props);


    this.paper = null;
    this.konvas = null;
    this.getDisplayProps = this.getDisplayProps.bind(this);
    this.onPaperResize = this.onPaperResize.bind(this);
    this.paperDidMount = this.paperDidMount.bind(this);
    this.addPath = this.addPath.bind(this);
    this.state = {
      shapes: [],
      newShape: null,
      currentShape: null,
    };
    this.shapeRefs = {};
    this.transformerRefs = {};

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
      const { canvasOverlay, video } = VideosReferences.get(windowId);
      const { height, width } = canvasOverlay.ref.current;
      const { videoHeight, videoWidth } = video;
      this.paper.view.center = new Point(videoWidth / 2, videoHeight / 2);
      this.paper.view.zoom = canvasOverlay.scale;
      this.paper.view.viewSize = new this.paper.Size(width, height);
    }
  }

  /** Build parameters to paperjs View and canvas */
  getDisplayProps() {
    const { windowId } = this.props;
    const osdref = OSDReferences.get(windowId);
    const videoref = VideosReferences.get(windowId);

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
        canvasProps: {
          height,
          resize: 'true',
          style: {
            left: 0, position: 'absolute', top: 0,
          },
          width,
        },
        viewProps: {
          center: new Point(width / 2, height / 2),
          height,
          width,
          zoom: videoref.canvasOverlay.scale,
        },
      };
    }

    throw new Error('Unknown or missing data player, not OpenSeadragon (image viewer) nor the video player');
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
  handleMouseDown = (e) => {
    console.log('mouse down', this.props);

    const pos = e.target.getStage().getPointerPosition();

    let shape = null;
    switch (this.props.activeTool) {
      case 'rectangle':

        shape = {
          type: 'rectangle', x: pos.x, y: pos.y, width: 0, height: 0,
          strokeColor: this.props.strokeColor,
          strokeWidth: this.props.strokeWidth,
          fill: this.props.fillColor,
          id: uuidv4(),
        };
        this.setState({
          newShape: shape,
          currentShape: shape,
        });


        break;
      case "ellipse":
        shape = {
          type: 'ellipse', x: pos.x, y: pos.y, width: 0, height: 0,
          stroke: this.props.strokeColor,
          strokeWidth: this.props.strokeWidth,
          fill: this.props.fillColor,
          id: uuidv4(),
        };
        this.setState({
          newShape: shape,
          currentShape: shape,
        });
        break;
      // case "polygon":
      //   this.setState({ newShape: { type: 'circle', x: pos.x, y: pos.y, width: 0, height: 0 } });
      //   break;
      // case "freehand":
      //   this.setState({ newShape: { type: 'freehand', x: pos.x, y: pos.y, width: 0, height: 0 } });
      //   break;
      case "text":

        shape = {
          type: 'text',
          x: pos.x,
          y: pos.y,
          fontSize: 20,
          fill: this.props.fillColor,


          text: 'text',
          id: uuidv4(),
        };

        this.setState({ newShape: shape }, () => {
          // Add global key press event listener
          window.addEventListener('keydown', this.handleKeyPress);
        });
        this.setState({
          newShape: shape,
          currentShape: shape,
        });

        break;

      // Add cases for other shapes here
      default:
        break;
    }





  };

  handleMouseUp = () => {

    const { newShape, shapes, currentShape } = this.state;
    console.log('mouse up', newShape);
    if (newShape) {
      this.setState({
        shapes: [...shapes, newShape],
        currentShape: newShape,
        newShape: null,

      });
    }

  };

  handleMouseMove = (e) => {

    const { newShape, currentShape, currentColorType } = this.state;
    console.log('mouse move', newShape);
    if (newShape) {


      switch (newShape.type) {
        case 'rectangle':

          const pos = e.target.getStage().getPointerPosition();
          console.log('pos', pos);
          let width = pos.x - newShape.x;
          let height = pos.y - newShape.y;

          this.setState({
            newShape: {
              ...newShape,
              width,
              height,
            },
          })


        case 'ellipse':
          const pos3 = e.target.getStage().getPointerPosition();
          console.log('pos', pos);
          let width3 = pos3.x - newShape.x;
          let height3 = pos3.y - newShape.y;
          // Negative radius is not allowed

          if (width3 < 0) {
            width3 = Math.abs(width3);
            newShape.x = pos3.x;
          }
          if (height3 < 0) {
            height3 = Math.abs(height3);
            newShape.y = pos3.y;
          }




          break;

        case 'text':
          const pos2 = e.target.getStage().getPointerPosition();
          console.log('pos', pos2);

          this.setState({
            newShape: {
              ...newShape,

              x: pos2.x,
              y: pos2.y,

            }
          })

          break;
        default:
          break;

      }



    }
    // do we need to do something here ?
    if (currentShape) {

    }


  };

  handleKeyPress = (e) => {
    const { currentShape, shapes } = this.state;
    console.log('key press', e, e.key);

    if (currentShape) {
      console.log('current shape', currentShape);

      // if supr remove shape
      // ignore shift and ctrl enter and all special keys



      if (e.key === 'Shift' ||
        e.key === 'Control' ||
        e.key === 'Enter' ||
        e.key === 'Alt' ||
        e.key === 'Meta' ||
        e.key === 'Tab') {
        return;
      }


      if (e.key === 'Delete') {

        const index = shapes.findIndex((gshape) => shape.id === currentShape.id);
        console.log('index', index);
        const newShapes = [...shapes];
        newShapes.splice(index, 1);
        this.setState({
          shapes: newShapes,
          currentShape: null,
        });
      }
      // 

      if (e.key === 'Backspace') {
        // Remove the last character



        this.setState({

          currentShape: {
            ...currentShape,
            text: currentShape.text.slice(0, -1),
          },

        });

        const index = shapes.findIndex((shape) => shape.id === currentShape.id);
        console.log('index', index);
        const newShapes = [...shapes];
        newShapes[index] = currentShape;
        this.setState({
          shapes: newShapes,
        });



        //replace in array

      } else {
        // Add the character to the text
        this.setState({
          currentShape: {
            ...currentShape,
            text: currentShape.text + e.key,
          },
        });

        console.log('current shape', currentShape);
        const index = shapes.findIndex((shape) => shape.id === currentShape.id);
        console.log('index', index);
        const newShapes = [...shapes];
        newShapes[index] = currentShape;
        this.setState({
          shapes: newShapes,
        });
      }
    }




  };

  // ...
  handleShapeDblClick = (e) => {
    // deselect if clicked on the same shape
    console.log('dbl click', e);
    this.transformer.detach();
    this.transformer.attachTo(e.target);

  };
  componentDidUpdate(prevProps) {
    if (prevProps.activeTool === 'text' && this.props.activeTool !== 'text') {
      // Remove global key press event listener
      window.removeEventListener('keypress', this.handleKeyPress);
    }
  }





  drawKonvas() {




    const { shapes, newShape, currentShape } = this.state;


    console.log(JSON.stringify(shapes, null, 2));


    return (
      <Stage
        width={1920}
        height={1080}
        style={{
          height: '100%', left: 0, position: 'absolute', top: 0, width: '100%',
        }}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
      >
        <Layer>

          {shapes.map((shape, i) => {
            console.log('shape', shape);
            switch (shape.type) {

              case 'rectangle':

                return (
                  <Rectangle

                  activeTool={this.props.activeTool}
                    _id={shape.id}
                    key={i}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    fill={shape.fill}
                    stroke={shape.strokeColor}
                    strokeWidth={shape.strokeWidth}
                    draggable={this.props.activeTool === 'cursor'}

                  
                  />
                );
                break;
              case 'text':
                return (
                  <TextNode

                  activeTool={this.props.activeTool}
                  
                    _id={shape.id}
                    key={i}
                    x={shape.x}
                    y={shape.y}
                    fontSize={shape.fontSize}
                    fill={shape.fill}
                    text={shape.text}
                    draggable={this.props.activeTool === 'cursor'}
                    onClick={this.props.activeTool === 'cursor' ? () => this.setState({ currentShape: shape }) : null}
                    onDragEnd={this.handleDragEnd(shape.id)} // Add this line
                    onDblClick={this.handleShapeDblClick}

                  />
                );
                break;
            }
          })}

        </Layer>
      </Stage>
    );


    // return (
    //   <Stage width={1920} height={1080}

    //     style={{
    //       height: '100%', left: 0, position: 'absolute', top: 0, width: '100%',

    //     }}
    //     onMouseDown={this.handleMouseDown}
    //     onMouseUp={this.handleMouseUp}
    //     onMouseMove={this.handleMouseMove}

    //   >
    //     <Layer>

    //       {shapes.map((shape, i) => {
    //         console.log('shape', shape);
    //         switch (shape.type) {

    //           case 'rectangle':
    //             console.log('drawing rectangle');
    //             return (
    //               <React.Fragment key={shape.id}>
    //               <Rect
    //                 _id={shape.id}
    //                 key={i}
    //                 x={shape.x}
    //                 y={shape.y}
    //                 width={shape.width}
    //                 height={shape.height}
    //                 fill={shape.fill}
    //                 stroke={shape.strokeColor}
    //                 strokeWidth={shape.strokeWidth}
    //                 draggable={this.props.activeTool === 'cursor'}
    //                 onClick={this.props.activeTool === 'cursor' ? () => this.setState({ currentShape: shape }) : null}
    //                 onDragEnd={this.handleDragEnd(shape.id)} // Add this line
    //                 onDblClick={this.handleShapeClick}
    //               />
    //               {this.props.activeTool === 'edit' && (
    //               <Transformer
    //               ref={node => { this.transformerRefs[shape.id] = node; }}
    //               attachedShape={node => { return this.shapeRefs[shape.id]; }}
    //             />
    //               )}
    //             </React.Fragment>
    //             );

    //           case 'ellipse':
    //             return (
    //               <React.Fragment key={shape.id}>
    //               <Ellipse
    //                 _id={shape.id}
    //                 key={i}
    //                 x={shape.x}
    //                 y={shape.y}
    //                 radiusX={shape.width}
    //                 radiusY={shape.height}
    //                 stroke={shape.strokeColor}
    //                 fill={shape.fill}
    //                 strokeWidth={shape.strokeWidth}
    //                 draggable={this.props.activeTool === 'cursor'}
    //                 onClick={this.props.activeTool === 'cursor' ? () => this.setState({ currentShape: shape }) : null}
    //                 onDragEnd={this.handleDragEnd(shape.id)} // Add this line
    //                 onDblClick={this.handleShapeClick}


    //               />
    //                 {this.props.activeTool === 'edit' && (
    //               <Transformer
    //               ref={node => { this.transformerRefs[shape.id] = node; }}
    //               attachedShape={node => { return this.shapeRefs[shape.id]; }}
    //             />
    //               )}
    //             </React.Fragment>
    //             );
    //           case 'text':

    //             return (
    //               <React.Fragment key={shape.id}>
    //               <Text
    //                 //color$

    //                 _id={shape.id}
    //                 fill={shape.fill}
    //                 fontFamily="Calibri"
    //                 key={i}
    //                 x={shape.x}
    //                 y={shape.y}

    //                 text={shape.text}
    //                 fontSize={shape.fontSize}
    //                 draggable={this.props.activeTool === 'cursor'}
    //                 onClick={this.props.activeTool === 'cursor' ? () => this.setState({ currentShape: shape }) : null}
    //                 onDragEnd={this.handleDragEnd(shape.id)} // Add this line
    //                 onDblClick={this.handleShapeClick}
    //               />
    //                 {true && (
    //               <Transformer
    //               ref={node => { this.transformerRefs[shape.id] = node; }}
    //               attachedShape={node => { return this.shapeRefs[shape.id]; }}
    //             />
    //               )}
    //             </React.Fragment>
    //             );



    //           // Add cases for other shapes here
    //           default:
    //             return null;
    //         }
    //       })}
    //       {newShape && newShape.type === 'rectangle' && (
    //         <Rect
    //           x={newShape.x}
    //           y={newShape.y}
    //           width={newShape.width}
    //           height={newShape.height}
    //           stroke={newShape.strokeColor}
    //           fill={newShape.fill}
    //           strokeWidth={newShape.strokeWidth}
    //           draggable={this.props.activeTool === 'cursor'}

    //         />
    //       )}
    //       {newShape && newShape.type === 'ellipse' && (
    //         <Ellipse
    //           x={newShape.x}
    //           y={newShape.y}
    //           radiusX={newShape.width}
    //           radiusY={newShape.height}
    //           stroke={newShape.strokeColor}
    //           fill={newShape.fill}
    //           strokeWidth={newShape.strokeWidth}
    //           draggable={this.props.activeTool === 'cursor'}

    //         />
    //       )}
    //       {newShape && newShape.type === 'text' && (
    //         <Text
    //           x={newShape.x}
    //           y={newShape.y}
    //           text={newShape.text}
    //           fill={newShape.fill}
    //           fontSize={newShape.fontSize}
    //           draggable={this.props.activeTool === 'cursor'}

    //         />
    //       )}




    //       <Transformer ref={node => { this.transformer = node; }} />

    //     </Layer>
    //   </Stage>
    // );

  }


  handleDragEnd = (id) => (e) => {
    const { shapes } = this.state;
    const shapeNode = e.target;
    const updatedShapes = shapes.map(shape =>
      shape.id === id ? { ...shape, x: shapeNode.x(), y: shapeNode.y() } : shape
    );
    this.setState({ shapes: updatedShapes });

    // update the current shape
    const { currentShape } = this.state;
    if (currentShape && currentShape.id === id) {
      this.setState({ currentShape: { ...currentShape, x: shapeNode.x(), y: shapeNode.y() } });
    }


  };

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


    console.log('rendering konva');
    // replace with konva

    return (
      <Stage width={1920} height={1080}

        style={{
          height: '100%', left: 0, position: 'absolute', top: 0, width: '100%',

        }}

        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}

      >
        <Layer>


        </Layer>
      </Stage>
    );

    //  return (



    // <div
    //   style={{
    //     height: '100%', left: 0, position: 'absolute', top: 0, width: '100%',
    //   }}
    // >
    //   <PaperContainer
    //     canvasProps={canvasProps}
    //     viewProps={viewProps}
    //     onMount={this.paperDidMount}
    //   >
    //     {renderWithPaperScope((paper) => {
    //       const paths = flatten(paper.project.layers.map((layer) => (
    //         flatten(mapChildren(layer)).map((aPath) => aPath)
    //       )));
    //       if (svg && paths.length === 0) {
    //         paper.project.importSVG(svg);
    //       }
    //       paper.settings.handleSize = 10; // eslint-disable-line no-param-reassign
    //       paper.settings.hitTolerance = 10; // eslint-disable-line no-param-reassign
    //       return (
    //         <ActiveTool
    //           onPathAdd={this.addPath}
    //           pathProps={{
    //             fillColor,
    //             strokeColor,
    //             strokeWidth: strokeWidth / paper.view.zoom,
    //           }}
    //           paper={paper}
    //         />
    //       );
    //     })}
    //   </PaperContainer>
    //   <ResizeObserver onResize={this.onPaperResize} />
    //</div>
    //);
  }

  /** */
  render() {
    const { windowId } = this.props;
    const osdref = OSDReferences.get(windowId);
    const videoref = VideosReferences.get(windowId);
    if (!osdref && !videoref) {
      throw new Error("Unknown or missing data player, didn't found OpenSeadragon (image viewer) nor the video player");
    }
    if (osdref && videoref) {
      throw new Error('Unhandled case: both OpenSeadragon (image viewer) and video player on the same canvas');
    }
    const container = osdref
      ? osdref.current.element
      : videoref.ref.current.parentElement;
    return (
      ReactDOM.createPortal(this.drawKonvas(), container)
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
