import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import { getVisibleCanvasAudioResources, getVisibleCanvasVideoResources } from 'mirador/dist/es/src/state/selectors';
import { MEDIA_TYPES } from './annotationForm/AnnotationFormUtils';

// TODO All the code related to the video player must be moved in MAEV plugin
/** */
export class WindowPlayer {
  actions;

  mediaType;

  canvases;

  playerReferencesWindowId;

  overlay;

  /**
   * Constructor
   * @param state
   * @param windowId
   * @param media
   * @param miradorActions
   */
  constructor(state, windowId, media, miradorActions) {
    /** ***********************************************************
     * Init stuff
     *********************************************************** */
    this.actions = miradorActions;
    this.media = media;
    this.mediaType = checkMediaType(state, windowId);
    this.canvases = getVisibleCanvases(state, { windowId });
    this.playerReferencesWindowId = windowId;

    if (this.isInitializedCorrectly()) {
      switch (this.mediaType) {
        case MEDIA_TYPES.IMAGE:
          this.overlay = {
            canvasHeight: this.media.current.canvas.clientHeight,
            canvasWidth: this.media.current.canvas.clientWidth,
            containerHeight: this.media.current.canvas.clientHeight,
            containerWidth: this.media.current.canvas.clientWidth,
          };
          break;
        case MEDIA_TYPES.VIDEO:
          this.overlay = this.media.canvasOverlay;
          break;
        case MEDIA_TYPES.AUDIO:
          this.audio = getVisibleCanvasAudioResources(state, { windowId });
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
  isInitializedCorrectly() {
    return this.media && (this.media.current || this.media.video)
      && (this.mediaType !== MEDIA_TYPES.UNKNOWN && this.mediaType !== MEDIA_TYPES.AUDIO);
  }

  /** ***********************************************************
   * Global stuff
   *********************************************************** */

  /**
   * Return MEDIA_TYPE (so fat Image, Video, Audio
   * @returns {*}
   */
  getMediaType() {
    return this.mediaType;
  }

  /** *******************
   * Get all canvases
   * @returns {*}
   */
  getCanvases() {
    return this.canvases;
  }

  /** *****************
   * Get audioElement linked
   * @returns {HTMLAudioElement}
   */
  getAudioElement() {
    if (this.mediaType === MEDIA_TYPES.AUDIO) {
      return document.querySelector('audio');
    }
    console.error('Something is wrong with audio ressource');
    return null;
  }

  /**
   * Get windowId
   * @returns {*}
   */
  getWindowId() {
    return this.playerReferencesWindowId;
  }

  /** ***********************************************************
   * Spatial stuff
   *********************************************************** */
  /**
   * Get IIIF Canvas Height
   * @returns {*}
   */
  getCanvasHeight() {
    return this.overlay.canvasHeight;
  }

  /**
   * Get IIIF Canvas Width
   * @returns {*}
   */
  getCanvasWidth() {
    return this.overlay.canvasWidth;
  }

  /**
   * Get container aka the player
   * @returns {HTMLElement|*|null}
   */
  getContainer() {
    if (this.mediaType === MEDIA_TYPES.IMAGE) {
      return this.media.current.container;
    }
    if (this.mediaType === MEDIA_TYPES.VIDEO) {
      return this.media.ref.current.parentElement;
    }
    return null;
  }

  /**
   * Get container height aka player height
   * @returns {*}
   */
  getContainerHeight() {
    return this.overlay.containerHeight;
  }

  /**
   * Get container width aka player width
   * @returns {*}
   */
  getContainerWidth() {
    return this.overlay.containerWidth;
  }

  /**
   * Get displayed height of the media. It include zoom and scale stuff
   * @returns {undefined|*|number}
   */
  getDisplayedMediaHeight() {
    // TODO This can cause problem in multiple window context
    if (this.mediaType === MEDIA_TYPES.IMAGE) {
      const viewer = this.media.current;
      if (viewer) {
        const percentageHeight = this.getCanvasHeight() * viewer.viewport.getZoom();
        const containerWidth = viewer.container.clientWidth;
        const actualHeightInPixels = Math.round(containerWidth * percentageHeight);
        return actualHeightInPixels;
      }
    }
    if (this.mediaType === MEDIA_TYPES.VIDEO) {
      return this.overlay.containerHeight;
    }
    return undefined;
  }

  /**
   * Get displayed width of the media. It include zoom and scale stuff
   * @returns {undefined|*|number}
   */
  getDisplayedMediaWidth() {
    // TODO This can cause problem in multiple window context
    if (this.mediaType === MEDIA_TYPES.IMAGE) {
      const viewer = this.media.current;
      if (viewer && viewer.world.getItemCount() > 0) {
        const percentageWidth = this.getCanvasWidth() * viewer.viewport.getZoom();
        const containerWidth = viewer.container.clientWidth;
        const actualWidthInPixels = Math.round(containerWidth * percentageWidth);
        return actualWidthInPixels;
      }
    }
    if (this.mediaType === MEDIA_TYPES.VIDEO) {
      // TODO: Implement displayed width for video
      // From video file return Math.round(_media.video.getBoundingClientRect().width);
      // return _media.video.getSize().width;
      return this.overlay.containerWidth;
    }

    return undefined;
  }

  /**
   * Get media height as described in manifest
   * @returns {undefined|*}
   */
  getMediaTrueHeight() {
    // TODO This can cause problem in multiple window context
    if (this.mediaType === MEDIA_TYPES.IMAGE) {
      // return this.canvases[0].__jsonld.height;
      return this.getCanvasHeight();
    }
    if (this.mediaType === MEDIA_TYPES.VIDEO) {
      // TODO not perfect becasue we use the canvas size and not the video size
      return this.media.player.props.iiifVideoInfos.getHeight();
    }
    console.error('Unknown media type');
    return undefined;
  }

  /**
   * Get true width of the media
   * @returns {undefined|*}
   */
  getMediaTrueWidth() {
    if (this.mediaType === MEDIA_TYPES.IMAGE) {
      // return this.canvases[0].__jsonld.width;
      return this.getCanvasWidth();
    }
    if (this.mediaType === MEDIA_TYPES.VIDEO) {
      // TODO not perfect becasue we use the canvas size and not the video size
      return this.media.player.props.iiifVideoInfos.getWidth();
    }
    return undefined;
  }

  /**
   * Get scale between true size of media and size displayed
   * @returns {number}
   */
  getScale() {
    return this.getDisplayedMediaWidth() / this.getMediaTrueWidth();
  }

  /**
   * Some players allow zoom/unzoom
   * @returns {undefined|number}
   */
  getZoom() {
    if (this.mediaType === MEDIA_TYPES.IMAGE) {
      const currentZoom = this.media.current.viewport.getZoom();
      const maxZoom = this.media.current.viewport.getMaxZoom();
      let zoom = currentZoom / maxZoom;
      zoom = Math.round(zoom * 100) / 100;
      return zoom;
    }
    if (this.mediaType === MEDIA_TYPES.VIDEO) {
      return this.getDisplayedMediaWidth() / this.getMediaTrueWidth();
    }
    return undefined;
  }

  /**
   * Some players allow to move on the image
   * @returns {undefined|{x: number, y: number}}
   */
  getImagePosition() {
    if (this.mediaType === MEDIA_TYPES.IMAGE) {
      const viewer = this.media.current;
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
    if (this.mediaType === MEDIA_TYPES.VIDEO) {
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
  getCurrentTime() {
    if (this.mediaType !== MEDIA_TYPES.IMAGE) {
      return this.media.props.currentTime;
    }
    return null;
  }

  /**
   * Get media duration
   * @returns {*}
   */
  getMediaDuration() {
    if (this.mediaType === MEDIA_TYPES.VIDEO) {
      return this.media.props.canvas.__jsonld.duration;
    }
    if (this.mediaType === MEDIA_TYPES.AUDIO) {
      if (this.audio) {
        return this.audio[0].__jsonld.duration;
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
  setCurrentTime(windowId, ...args) {
    if (this.mediaType === MEDIA_TYPES.VIDEO) {
      return this.actions.setWindowCurrentTime(windowId, ...args);
    }
    return null;
    console.error('Cannot set current time for image');
  }

  /**
   * Send setSeekToAction to mirador
   * @param windowId
   * @param args
   * @returns {*}
   */
  setSeekTo(windowId, ...args) {
    // TODO use windowId from this
    if (this.mediaType === MEDIA_TYPES.VIDEO) {
      return this.actions.setWindowSeekTo(windowId, ...args);
    }
    console.error('Cannot seek time for image');
  }
}

/** ***********************
 * Get media type of visible canvas
 * @param state
 * @param windowId
 */
export function checkMediaType(state, windowId) {
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
