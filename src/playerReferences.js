import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import { getVisibleCanvasAudioResources, getVisibleCanvasVideoResources } from 'mirador/dist/es/src/state/selectors';
import { MEDIA_TYPES } from './annotationForm/AnnotationFormUtils';

// TODO All the code related to the video player must be moved in MAEV plugin
export const playerReferences = (function () {
  let canvases;
  let media;
  let mediaType;
  let overlay;
  let actions;
  let audio;

  /** ***********************************************************
   * Global stuff
   *********************************************************** */

  /** ***********************
   * Get media type of visible canvas
   * @param state
   * @param windowId
   * @returns {string}
   */
  function checkMediaType(state, windowId) {
    const audioResources = getVisibleCanvasAudioResources(state, { windowId }) || [];
    const videoResources = getVisibleCanvasVideoResources(state, { windowId }) || [];

    if (videoResources.length > 0) {
      return MEDIA_TYPES.VIDEO;
    }
    if (audioResources.length > 0) {
      return MEDIA_TYPES.AUDIO;
    }

    return MEDIA_TYPES.IMAGE;
  }

  function getMediaType() {
    return mediaType;
  }
  /** *******************
   * Get all canvases
   * @returns {*}
   */
  function getCanvases() {
    return canvases;
  }
  function getAudioElement() {
    return document.querySelector('audio');
  }

  /** ***********************************************************
   * Spatial stuff
   *********************************************************** */
  function getCanvasHeight() {
    return overlay.canvasHeight;
  }

  function getCanvasWidth() {
    return overlay.canvasWidth;
  }

  function getContainer() {
    if (mediaType === MEDIA_TYPES.IMAGE) {
      return media.current.container;
    }
    if (mediaType === MEDIA_TYPES.VIDEO) {
      return media.ref.current.parentElement;
    }
    return null;
  }

  function getContainerHeight() {
    return overlay.containerHeight;
  }

  function getContainerWidth() {
    return overlay.containerWidth;
  }

  function getDisplayedImageHeight() {
    // TODO This function can cause problem in multiple window context
    if (mediaType === MEDIA_TYPES.IMAGE) {
      const viewer = media.current;
      if (viewer) {
        const percentageHeight = canvases[0].__jsonld.height * viewer.viewport.getZoom();
        const containerWidth = viewer.container.clientWidth;
        const actualHeightInPixels = Math.round(containerWidth * percentageHeight);
        return actualHeightInPixels;
      }
    }
    if (mediaType === MEDIA_TYPES.VIDEO) {
      return overlay.containerHeight;
    }
    return undefined;
  }

  function getDisplayedImageWidth() {
    // TODO This function can cause problem in multiple window context
    if (mediaType === MEDIA_TYPES.IMAGE) {
      const viewer = media.current;
      if (viewer && viewer.world.getItemCount() > 0) {
        const percentageWidth = canvases[0].__jsonld.width * viewer.viewport.getZoom();
        const containerWidth = viewer.container.clientWidth;
        const actualWidthInPixels = Math.round(containerWidth * percentageWidth);
        return actualWidthInPixels;
      }
    }
    if (mediaType === MEDIA_TYPES.VIDEO) {
      // TODO: Implement displayed width for video
      // From video file return Math.round(_media.video.getBoundingClientRect().width);
      // return _media.video.getSize().width;
      return overlay.containerWidth;
    }

    return undefined;
  }

  function getHeight() {
    // TODO This function can cause problem in multiple window context
    if (mediaType === MEDIA_TYPES.IMAGE) {
      return canvases[0].__jsonld.height;
    }
    if (mediaType === MEDIA_TYPES.VIDEO) {
      // TODO not perfect becasue we use the canvas size and not the video size
      return media.player.props.iiifVideoInfos.getHeight();
    }
    console.error('Unknown media type');
    return undefined;
  }

  function getScale() {
    return this.getDisplayedImageWidth() / this.getWidth();
  }

  function getWidth() {
    if (mediaType === MEDIA_TYPES.IMAGE) {
      return canvases[0].__jsonld.width;
    }
    if (mediaType === MEDIA_TYPES.VIDEO) {
      // TODO not perfect becasue we use the canvas size and not the video size
      return media.player.props.iiifVideoInfos.getWidth();
    }
    return undefined;
  }

  function getZoom() {
    if (mediaType === MEDIA_TYPES.IMAGE) {
      const currentZoom = media.current.viewport.getZoom();
      const maxZoom = media.current.viewport.getMaxZoom();
      // console.log("Max Zoom", maxZoom);
      let zoom = currentZoom / maxZoom;
      zoom = Math.round(zoom * 100) / 100;
      return zoom;
    }
    if (mediaType === MEDIA_TYPES.VIDEO) {
      return overlay.containerWidth / this.getWidth();
    }
    return undefined;
  }
  function getImagePosition() {
    if (mediaType === MEDIA_TYPES.IMAGE) {
      const viewer = media.current;
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
    if (mediaType === MEDIA_TYPES.VIDEO) {
      const position = {
        x: 0,
        y: 0,
      };
      return position;
    }
    return undefined;
  }

  /** ***********************************************************
   * Time stuff
   *********************************************************** */
  function getCurrentTime() {
    if (mediaType !== MEDIA_TYPES.IMAGE) {
      return media.props.currentTime;
    }
    return null;
  }

  function getMediaDuration() {
    if (mediaType === MEDIA_TYPES.VIDEO) {
      return media.props.canvas.__jsonld.duration;
    }
    if (mediaType === MEDIA_TYPES.AUDIO) {
      if (audio) {
        return audio[0].__jsonld.duration;
      }
      console.error('Something is wrong about audio');
    }
  }

  function setCurrentTime(windowId, ...args) {
    if (mediaType === MEDIA_TYPES.VIDEO) {
      return actions.setWindowCurrentTime(windowId, ...args);
    }
    console.error('Cannot set current time for image');
  }

  function setSeekTo(windowId, ...args) {
    if (mediaType === MEDIA_TYPES.VIDEO) {
      return actions.setWindowSeekTo(windowId, ...args);
    }
    console.error('Cannot seek time for image');
  }

  /** ***********************************************************
   * Init stuff
   *********************************************************** */
  function init(state, windowId, playerRef, miradorActions) {
    actions = miradorActions;
    media = playerRef.get(windowId);
    mediaType = this.checkMediaType(state, windowId);
    canvases = getVisibleCanvases(state, { windowId });

    if (media) {
      switch (mediaType) {
        case MEDIA_TYPES.IMAGE:
          overlay = {
            canvasHeight: media.current.canvas.clientHeight,
            canvasWidth: media.current.canvas.clientWidth,
            containerHeight: media.current.canvas.clientHeight,
            containerWidth: media.current.canvas.clientWidth,
          };
          break;
        case MEDIA_TYPES.VIDEO:
          overlay = media.canvasOverlay;
          break;
        case MEDIA_TYPES.AUDIO:
          audio = getVisibleCanvasAudioResources(state, { windowId });
          break;
        default:
          console.error('Unknown media type');
          break;
      }
    }
  }

  function isInitialized() {
    // TODO this part must be clarified
    // Its not exactly initialisation but if the player is available for the media type
    return media && (media.current || media.video)
      && (mediaType !== MEDIA_TYPES.UNKNOWN && mediaType !== MEDIA_TYPES.AUDIO);
  }

  return {
    checkMediaType,
    getAudioElement,
    getCanvases,
    getCanvasHeight,
    getCanvasWidth,
    getContainer,
    getContainerHeight,
    getContainerWidth,
    getCurrentTime,
    getDisplayedImageHeight,
    getDisplayedImageWidth,
    getHeight,
    getImagePosition,
    getMediaDuration,
    getMediaType,
    getScale,
    getWidth,
    getZoom,
    init,
    isInitialized,
    setCurrentTime,
    setSeekTo,

  };
}());
