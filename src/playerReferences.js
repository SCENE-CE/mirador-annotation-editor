import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import { getVisibleCanvasAudioResources, getVisibleCanvasVideoResources } from 'mirador/dist/es/src/state/selectors';
import { mediaTypes } from './annotationForm/AnnotationFormUtils';


// TODO All the code related to the video player must be moved in MAEV plugin
export const playerReferences = (function () {
  let _canvases;
  let _media;
  let _mediaType;
  let _overlay;
  let _actions;

  return {
    getScale() {
      return this.getContainerWidth() / this.getWidth();
    },
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
        // TODO not perfect becasue we use the canvas size and not the video size
        return _media.player.props.iiifVideoInfos.getHeight();
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
        // TODO not perfect becasue we use the canvas size and not the video size
        return _media.player.props.iiifVideoInfos.getWidth();
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
      if (_mediaType === mediaTypes.VIDEO) {
        // TODO: Implement displayed width for video
        // From video file return Math.round(_media.video.getBoundingClientRect().width);
        // return _media.video.getSize().width;
        return _overlay.containerWidth;
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
      if (_mediaType === mediaTypes.VIDEO) {
        return _overlay.containerHeight;
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
      if (_mediaType === mediaTypes.VIDEO) {
        const { video } = _media;
        const position = {
          x: 0,
          y: 0,
        }; // TODO need to implement position on vertical video
        return position;
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
      if (_mediaType === mediaTypes.VIDEO) {
        // TODO: Implement zoom for video

        return _overlay.containerWidth / this.getWidth();

        // return _media.video.getBoundingClientRect().width / _media.video.videoWidth;
      }
      return undefined;
    },
    getMediaType() {
      return _mediaType;
    },
    checkMediaType(state, windowId) {
      const audioResources = getVisibleCanvasAudioResources(state, { windowId }) || [];
      const videoResources = getVisibleCanvasVideoResources(state, { windowId }) || [];

      if (videoResources.length > 0) {
        return mediaTypes.VIDEO;
      }
      if (audioResources.length > 0) {
        return mediaTypes.AUDIO;
      }

      return mediaTypes.IMAGE;
    },
    init(state, windowId, playerRef, actions) {
      _actions = actions;
      _media = playerRef.get(windowId);
      _mediaType = this.checkMediaType(state, windowId);
      _canvases = getVisibleCanvases(state, { windowId });

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
      console.debug('_media', _media);
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
