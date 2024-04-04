import * as actions from 'mirador/dist/es/src/state/actions';
import { getCompanionWindow } from 'mirador/dist/es/src/state/selectors/companionWindows';
import { getWindowCurrentTime, getWindowPausedStatus } from 'mirador/dist/es/src/state/selectors/window';
import { getVisibleCanvasAudioResources, getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import { getPresentAnnotationsOnSelectedCanvases } from 'mirador/dist/es/src/state/selectors/annotations';
import annotationForm from '../AnnotationForm';
import { playerReferences } from '../playerReferences';
/** */
const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  closeCompanionWindow: () => dispatch(
    actions.removeCompanionWindow(windowId, id),
  ),
  receiveAnnotation: (targetId, annoId, annotation) => dispatch(
    actions.receiveAnnotation(targetId, annoId, annotation),
  ),
  setCurrentTime: (...args) => dispatch(actions.setWindowCurrentTime(windowId, ...args)),
  setSeekTo: (...args) => dispatch(actions.setWindowSeekTo(windowId, ...args)),
});

/** */
function mapStateToProps(state, { id: companionWindowId, windowId }) {
  const currentTime = getWindowCurrentTime(state, { windowId });
  const cw = getCompanionWindow(state, { companionWindowId, windowId });
  const { annotationid } = cw;
  playerReferences.setCanvases(state, windowId);
  playerReferences.setMediaType();
  let annotation = getPresentAnnotationsOnSelectedCanvases(state, { windowId })
    .flatMap((annoPage) => annoPage.json.items || [])
    .find((annot) => annot.id === annotationid);

  // if (mediaVideo) {

  //   playerReferences.setPlayerName(mediaVideo);
  //
  //   // playerReferences = {
  //   //   mediaType: mediaTypes.VIDEO,
  //   //   overlay: mediaVideo.canvasOverlay,
  //   //   setCurrentTime: actions.setWindowCurrentTime(),
  //   //   setSeekTo: actions.setWindowSeekTo(),
  //   //
  //   // };
  // }
  if (osdref) {
    // playerReferences = {
    //   mediaTypes: mediaTypes.IMAGE,
    //   overlay: {
    //     canvasHeight: osdref.current.canvas.clientHeight,
    //     canvasWidth: osdref.current.canvas.clientWidth,
    //     containerHeight: osdref.current.canvas.clientHeight,
    //     containerWidth: osdref.current.canvas.clientWidth,
    //   },
    // };
  }

  // New annotation has no ID and no templateType defined
  if (!annotation) {
    annotation = {
      id: null,
      maeData: {
        templateType: null,
      },
    };
  }

  return {
    annotation,
    config: state.config,
    currentTime,
    mediaVideo,
    osdref,
    getMediaAudio: getVisibleCanvasAudioResources(state, { windowId }),
    getVisibleCanvase: getVisibleCanvases(state, { windowId }),
    paused: getWindowPausedStatus(state, { windowId }),
  };
}

export default {
  companionWindowKey: 'annotationCreation',
  component: annotationForm,
  mapDispatchToProps,
  mapStateToProps,
};
