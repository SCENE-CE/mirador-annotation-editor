import * as actions from 'mirador/dist/es/src/state/actions';
import { getCompanionWindow } from 'mirador/dist/es/src/state/selectors/companionWindows';
import { getVisibleCanvasAudioResources, getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import { getPresentAnnotationsOnSelectedCanvases } from 'mirador/dist/es/src/state/selectors/annotations';
import annotationForm from '../AnnotationForm';
import { playerReferences } from '../playerReferences';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
/** */
const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  closeCompanionWindow: () => dispatch(
    actions.removeCompanionWindow(windowId, id),
  ),
  receiveAnnotation: (targetId, annoId, annotation) => dispatch(
    actions.receiveAnnotation(targetId, annoId, annotation),
  ),
  // setCurrentTime: (...args) => dispatch(actions.setWindowCurrentTime(windowId, ...args)),
  // setSeekTo: (...args) => dispatch(actions.setWindowSeekTo(windowId, ...args)),
});

/** */
function mapStateToProps(state, { id: companionWindowId, windowId }) {
  const currentTime = null;
  const cw = getCompanionWindow(state, { companionWindowId, windowId });
  const { annotationid } = cw;
  playerReferences.init(state, windowId,OSDReferences, actions);
  console.log(playerReferences.getCanvases());
  // This could be removed but it's serve the useEffect in AnnotationForm for now.
  const canvases = getVisibleCanvases(state, { windowId });
  let annotation = getPresentAnnotationsOnSelectedCanvases(state, { windowId })
    .flatMap((annoPage) => annoPage.json.items || [])
    .find((annot) => annot.id === annotationid);

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
    currentTime,
    annotation,
    canvases,
    config: state.config,
    getMediaAudio: getVisibleCanvasAudioResources(state, { windowId }),
  };
}

export default {
  companionWindowKey: 'annotationCreation',
  component: annotationForm,
  mapDispatchToProps,
  mapStateToProps,
};
