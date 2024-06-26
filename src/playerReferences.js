import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import { mediaTypes } from './annotationForm/AnnotationFormUtils';

export const playerReferences = (function () {
  let _canvases;
  let _media;
  let _mediaType;
  let _overlay;
  let _actions;

  return {
    getCanvasHeight() {
      return _overlay.canvasHeight;
    },
    getCanvasWidth() {
      return _overlay.canvasWidth;
    },
    getCanvases() {
      return _canvases;
    },
    getContainer() {
      if (_mediaType === mediaTypes.IMAGE) {
        return _media.current.container;
      }
      if (_mediaType === mediaTypes.VIDEO) {
        return _media.ref.current.parentElement;
      }
      return null;
    },
    getContainerHeight() {
      return _overlay.containerHeight;
    },
    getContainerWidth() {
      return _overlay.containerWidth;
    },
    getHeight() {
      if (_mediaType === mediaTypes.IMAGE) {
        return _canvases[0].__jsonld.height;
      }
      if (_mediaType === mediaTypes.VIDEO) {
        return _media.props.canvas.__jsonld.height;
      }
      console.error('Unknown media type');
      return undefined;
    },
    getMediaDuration() {
      return _media.props.canvas.__jsonld.duration;
    },
    getMediaType() {
      return _mediaType;
    },
    getOverlay() {
      return _overlay;
    },
    getWidth() {
      if (_mediaType === mediaTypes.IMAGE) {
        return _canvases[0].__jsonld.width;
      }
      if (_mediaType === mediaTypes.VIDEO) {
        return _media.props.canvas.__jsonld.width;
      }
      return undefined;
    },
    init(state, windowId, playerRef, actions) {
      _canvases = getVisibleCanvases(state, { windowId });
      _mediaType = _canvases[0].__jsonld.items ? mediaTypes.VIDEO : mediaTypes.IMAGE;
      _actions = actions;
      _media = playerRef.get(windowId);
      if(_media) {
        switch (_mediaType) {
          case mediaTypes.IMAGE:
            _overlay = {
              canvasHeight: _media.current.canvas.clientHeight,
              canvasWidth: _media.current.canvas.clientWidth,
              containerHeight: _media.current.canvas.clientHeight,
              containerWidth: _media.current.canvas.clientWidth,
            };
            break;
          case mediaTypes.VIDEO:
            _overlay = _media.canvasOverlay;
            break;
          default:
            console.error('Unknown media type');
            break;
        }
      }
    },

    isInitialized(){
      return !!_media;
    },

    // TODO internalize actions
    setCurrentTime(windowId, ...args) {
      if (_mediaType === mediaTypes.VIDEO) {
        return _actions.setWindowCurrentTime(windowId, ...args);
      }
      console.error('Cannot set current time for image');
    },
    setSeekTo(windowId, ...args) {
      if (_mediaType === mediaTypes.VIDEO) {
        return _actions.setWindowSeekTo(windowId, ...args);
      }
      console.error('Cannot seek time for image');
    },
  };
}());
