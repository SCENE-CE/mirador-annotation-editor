import * as actions from "../../mirador/src/state/actions";
import { getCompanionWindow } from '../../mirador/src/state/selectors/companionWindows';
import { getWindowCurrentTime, getWindowPausedStatus } from '../../mirador/src/state/selectors/window'
import { getVisibleCanvases } from '../../mirador/src/state/selectors/canvases';
import { getPresentAnnotationsOnSelectedCanvases } from '../../mirador/src/state/selectors/annotations'
import AnnotationCreation from '../AnnotationCreation';

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
  const canvases = getVisibleCanvases(state, { windowId });

  const annotation = getPresentAnnotationsOnSelectedCanvases(state, { windowId })
    .flatMap((annoPage) => annoPage.json.items || [])
    .find((annot) => annot.id === annotationid);

  return {
    annotation,
    canvases,
    config: state.config,
    currentTime,
    paused: getWindowPausedStatus(state, { windowId }),
  };
}

export default {
  companionWindowKey: 'annotationCreation',
  component: AnnotationCreation,
  mapDispatchToProps,
  mapStateToProps,
};
