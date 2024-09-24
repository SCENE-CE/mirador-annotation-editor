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
    getDisplayedImageWidth() {
      if (_mediaType === mediaTypes.IMAGE) {
        const viewer = _media.current;
        if (viewer && viewer.world.getItemCount() > 0) {
          const percentageWidth = _canvases[0].__jsonld.width * viewer.viewport.getZoom();
          const containerWidth = viewer.container.clientWidth;
          const actualWidthInPixels = Math.round(containerWidth * percentageWidth);
          return actualWidthInPixels;
        }
      }
      return undefined;
    },
    getDisplayedImageHeight() {
      if (_mediaType === mediaTypes.IMAGE) {
        const viewer = _media.current;
        if (viewer) {
          const percentageHeight = _canvases[0].__jsonld.height * viewer.viewport.getZoom();
          const containerWidth = viewer.container.clientWidth;
          const actualHeightInPixels = Math.round(containerWidth * percentageHeight);
          return actualHeightInPixels;
        }
      }
      return undefined;
    },
    getImagePosition() {
      // TODO: Index off the IIIF canvas instead of the first image
      if (_mediaType === mediaTypes.IMAGE) {
        const viewer = _media.current;
        if (viewer) {
          // Assuming one image in OpenSeadragon for now
          const tiledImage = viewer.world.getItemAt(0);
          // Get the bounds of the image in viewport coordinates
          const bounds = tiledImage.getBounds();
          // Convert the top-left corner of the bounds to pixel coordinates
          const topLeft = viewer.viewport.viewportToViewerElementCoordinates(bounds.getTopLeft());
          // Round the coordinates for consistency
          const position = {
            x: Math.round(topLeft.x),
            y: Math.round(topLeft.y),
          };
          return position;
        }
      }
      return undefined;
    },
    getZoom() {
      if (_mediaType === mediaTypes.IMAGE) {
        const currentZoom = _media.current.viewport.getZoom();
        const maxZoom = _media.current.viewport.getMaxZoom();
        let zoom = currentZoom / maxZoom;
        zoom = Math.round(zoom * 100) / 100;
        return zoom;
      }
      return undefined;
    },
    getMediaType() {
      return _mediaType;
    },
    checkMediaType(state, windowId) {
      let canvas = getVisibleCanvases(state, { windowId })[0];
      console.debug('checkMediaType', canvas);
      let mediaType = canvas.__jsonld.items[0].items[0].body.type;
      if(mediaType === 'Video'){
        return mediaTypes.VIDEO;
      }
      if(mediaType === 'Image'){
        return mediaTypes.IMAGE;
      }

      return mediaTypes.UNKNOWN;
    },
    init(state, windowId, playerRef, actions) {
      _actions = actions;
      _media = playerRef.get(windowId);
      _mediaType = this.checkMediaType(state, windowId);

      if (_media) {
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
      console.debug('Player is initialized', this.isInitialized());
      console.debug('Player type', _mediaType);
    },

    isInitialized() {
      // TODO this part must be clarified
      // Its not exactly initialisation but if the player is available for the media type
      return _media && (_media.current || _media.video) && (_mediaType !== mediaTypes.UNKNOWN && _mediaType !== mediaTypes.AUDIO);
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
