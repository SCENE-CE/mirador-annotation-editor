import * as actions from 'mirador/dist/es/src/state/actions';
import { getCompanionWindow } from 'mirador/dist/es/src/state/selectors/companionWindows';
import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import { getPresentAnnotationsOnSelectedCanvases } from 'mirador/dist/es/src/state/selectors/annotations';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { withTranslation } from 'react-i18next';
import annotationForm from '../annotationForm/AnnotationForm';
import { playerReferences } from '../playerReferences';
import translations from '../locales';

/** */
const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  closeCompanionWindow: () => dispatch(
    actions.removeCompanionWindow(windowId, id),
  ),
  receiveAnnotation: (targetId, annoId, annotation) => dispatch(
    actions.receiveAnnotation(targetId, annoId, annotation),
  ),
});

/** */
function mapStateToProps(state, { id: companionWindowId, windowId }) {
  const currentTime = null;
  const cw = getCompanionWindow(state, { companionWindowId, windowId });
  const { annotationid } = cw;
  playerReferences.init(state, windowId, OSDReferences, actions);

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
    annotation,
    canvases,
    config: { ...state.config, translations },
    currentTime,
  };
}

// Enhance annotationForm with i18n support
const AnnotationFormWithTranslation = withTranslation()(annotationForm);

export default {
  companionWindowKey: 'annotationCreation',
  component: AnnotationFormWithTranslation,
  mapDispatchToProps,
  mapStateToProps,
};
