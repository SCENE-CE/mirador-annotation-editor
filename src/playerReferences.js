import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import { mediaTypes } from './AnnotationFormUtils';

export const playerReferences = (function () {
  let _canvases;
  let _mediaType;
  let _overlay;
  let _media;

  return {
    setCanvases(state, windowId) {
      _canvases = getVisibleCanvases(state, { windowId });
    },

    getCanvases() {
      return _canvases;
    },

    setMediaType() {
      _mediaType = _canvases[0].__jsonld.items[0].items[0].body.type;
    },

    getMediaType() {
      return _mediaType;
    },

    setMedia(windowId) {
      if (_mediaType === mediaTypes.IMAGE) {
        _media = OSDReferences.get(windowId);
      }
      if (_mediaType === mediaTypes.VIDEO) {
        VideosReferences.get(windowId);
      }
    },

    setOverlay() {
      if (_mediaType === mediaTypes.IMAGE) {
        _overlay = _media.canvasOverlay;
      } else if (_mediaType === mediaTypes.VIDEO) {
        _overlay = {
          canvasHeight: _media.current.canvas.clientHeight,
          canvasWidth: _media.current.canvas.clientWidth,
          containerHeight: _media.current.canvas.clientHeight,
          containerWidth: _media.current.canvas.clientWidth,
        };
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
    // getTimeInfos() {
    //   return _timeInfos;
    // },
    // setTimeInfos(newTimeInfos) {
    //   _timeInfos = newTimeInfos;
    // },
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
