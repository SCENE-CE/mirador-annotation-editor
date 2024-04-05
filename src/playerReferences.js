import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import * as actions from 'mirador/dist/es/src/state/actions';
import { mediaTypes } from './AnnotationFormUtils';

export const playerReferences = (function () {
  let _canvases;
  let _media;
  let _mediaType;
  let _overlay;

  return {
    setCanvases(state, windowId) {
      _canvases = getVisibleCanvases(state, { windowId });
      _mediaType = _canvases[0].__jsonld.items ? mediaTypes.VIDEO : mediaTypes.IMAGE;
      this.setMedia(windowId, _mediaType);
    },

    getCanvases() {
      return _canvases;
    },

    getMediaDuration() {
      return _media.props.canvas.__jsonld.duration;
    },

    getMediaType() {
      return _mediaType;
    },

    getHeight() {
      if (_mediaType === mediaTypes.IMAGE) {
        return _canvases[0].__jsonld.height;
      } if (_mediaType === mediaTypes.VIDEO) {
        return _media.props.canvas.__jsonld.height;
      }
      return undefined;
    },

    getWidth() {
      if (_mediaType === mediaTypes.IMAGE) {
        return _canvases[0].__jsonld.width;
      } if (_mediaType === mediaTypes.VIDEO) {
        return _media.props.canvas.__jsonld.width;
      }
      return undefined;
    },

    getContainerWidth() {
      return _overlay.containerWidth;
    },
    getContainerHeight() {
      return _overlay.containerHeight;
    },

    getCanvasWidth() {
      return _overlay.canvasWidth;
    },
    getCanvasHeight() {
      return _overlay.canvasHeight;
    },
    getContainer() {
      if (_mediaType === mediaTypes.IMAGE) {
        return _media.current.container;
      }
      if (_mediaType === mediaTypes.VIDEO) {
        return _media.ref.current.parentElement;
      }
    },

    setCurrentTime(windowId, ...args) {
      return actions.setWindowCurrentTime(windowId, ...args);
    },
    setSeekTo(windowId, ...args) {
      return actions.setWindowSeekTo(windowId, ...args);
    },

    setMedia(windowId) {
      if (_mediaType === mediaTypes.IMAGE) {
        _media = OSDReferences.get(windowId);
      }
      if (_mediaType === mediaTypes.VIDEO) {
        _media = VideosReferences.get(windowId);
      }
    },

    setOverlay() {
      if (_mediaType === mediaTypes.IMAGE) {
        _overlay = {
          canvasHeight: _media.current.canvas.clientHeight,
          canvasWidth: _media.current.canvas.clientWidth,
          containerHeight: _media.current.canvas.clientHeight,
          containerWidth: _media.current.canvas.clientWidth,
        };
      } else if (_mediaType === mediaTypes.VIDEO) {
        _overlay = _media.canvasOverlay;
      } else {
        _overlay = {
          canvasHeight: 500,
          canvasWidth: 1000,
          containerHeight: 500,
          containerWidth: 1000,
        };
      }
    },

    getOverlay() {
      return _overlay;
    },
    // /* *********************************************************** */

    // getTimeControlFunction() {
    //
    // },
    // setTimeControlFunctions() {
    //
    // },
    // getPlayerType() {
    //
    // },
    // setPlayerName(playerName) {
    //   _playerName = playerName;
    // },
    // getPlayerName() {
    //     return _playerName;
    // },
  };
}());
