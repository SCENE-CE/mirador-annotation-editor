import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import { getVisibleCanvasAudioResources, getVisibleCanvasVideoResources } from 'mirador/dist/es/src/state/selectors';
import { MEDIA_TYPES } from './annotationForm/AnnotationFormUtils';

// TODO All the code related to the video player must be moved in MAEV plugin
export const playerReferencesFactory = (function () {
  let canvases;
  let media;
  let mediaType;
  let overlay;
  let actions;
  let audio;
  let windowId;

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

  /**
   * Return MEDIA_TYPE (so fat Image, Video, Audio
   * @returns {*}
   */
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

  /** *****************
   * Get audioElement linked
   * @returns {HTMLAudioElement}
   */
  function getAudioElement() {
    if (mediaType === MEDIA_TYPES.AUDIO) {
      return document.querySelector('audio');
    }
    console.error('Something is wrong with audio ressource');
    return null;
  }

  function getWindowId() {
    return windowId;
  }

  /** ***********************************************************
   * Spatial stuff
   *********************************************************** */
  /**
   * Get IIIF Canvas Height
   * @returns {*}
   */
  function getCanvasHeight() {
    return overlay.canvasHeight;
  }

  /**
   * Get IIIF Canvas Width
   * @returns {*}
   */
  function getCanvasWidth() {
    return overlay.canvasWidth;
  }

  /**
   * Get container aka the player
   * @returns {HTMLElement|*|null}
   */
  function getContainer() {
    if (mediaType === MEDIA_TYPES.IMAGE) {
      return media.current.container;
    }
    if (mediaType === MEDIA_TYPES.VIDEO) {
      return media.ref.current.parentElement;
    }
    return null;
  }

  /**
   * Get container height aka player height
   * @returns {*}
   */
  function getContainerHeight() {
    return overlay.containerHeight;
  }

  /**
   * Get container width aka player width
   * @returns {*}
   */
  function getContainerWidth() {
    return overlay.containerWidth;
  }

  /**
   * Get displayed height of the media. It include zoom and scale stuff
   * @returns {undefined|*|number}
   */
  function getDisplayedMediaHeight() {
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

  /**
   * Get displayed width of the media. It include zoom and scale stuff
   * @returns {undefined|*|number}
   */
  function getDisplayedMediaWidth() {
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

  /**
   * Get media height as described in manifest
   * @returns {undefined|*}
   */
  function getMediaTrueHeight() {
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

  /**
   * Get true width of the media
   * @returns {undefined|*}
   */
  function getMediaTrueWidth() {
    if (mediaType === MEDIA_TYPES.IMAGE) {
      return canvases[0].__jsonld.width;
    }
    if (mediaType === MEDIA_TYPES.VIDEO) {
      // TODO not perfect becasue we use the canvas size and not the video size
      return media.player.props.iiifVideoInfos.getWidth();
    }
    return undefined;
  }

  /**
   * Get scale between true size of media and size displayed
   * @returns {number}
   */
  function getScale() {
    return this.getDisplayedMediaWidth() / this.getMediaTrueWidth();
  }

  /**
   * Some players allow zoom/unzoom
   * @returns {undefined|number}
   */
  function getZoom() {
    if (mediaType === MEDIA_TYPES.IMAGE) {
      const currentZoom = media.current.viewport.getZoom();
      const maxZoom = media.current.viewport.getMaxZoom();
      let zoom = currentZoom / maxZoom;
      zoom = Math.round(zoom * 100) / 100;
      return zoom;
    }
    if (mediaType === MEDIA_TYPES.VIDEO) {
      return this.getDisplayedMediaWidth() / this.getMediaTrueWidth();
    }
    return undefined;
  }

  /**
   * Some players allow to move on the image
   * @returns {undefined|{x: number, y: number}}
   */
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

  /**
   * Get Current time of the media
   * @returns {*|null}
   */
  function getCurrentTime() {
    if (mediaType !== MEDIA_TYPES.IMAGE) {
      return media.props.currentTime;
    }
    return null;
  }

  /**
   * Get media duration
   * @returns {*}
   */
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
    return 0;
  }

  /**
   * Send setCurrentTime action to mirador
   * @param windowId
   * @param args
   * @returns {*}
   */
  function setCurrentTime(windowId, ...args) {
    if (mediaType === MEDIA_TYPES.VIDEO) {
      return actions.setWindowCurrentTime(windowId, ...args);
    }
    console.error('Cannot set current time for image');
  }

  /**
   * Send setSeekToAction to mirador
   * @param windowId
   * @param args
   * @returns {*}
   */
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
    windowId = windowId;

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

  /**
   * Get player initialisation status
   * @returns {*|boolean}
   */
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
    getDisplayedMediaHeight,
    getDisplayedMediaWidth,
    getImagePosition,
    getMediaDuration,
    getMediaTrueHeight,
    getMediaTrueWidth,
    getMediaType,
    getScale,
    getWindowId,
    getZoom,
    init,
    isInitialized,
    setCurrentTime,
    setSeekTo,

  };
});
