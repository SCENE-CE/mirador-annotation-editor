import { compose } from 'redux';
import { connect } from 'react-redux';
import { getWindowViewType } from 'mirador/dist/es/src/state/selectors';
import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import { getCompanionWindowsForContent } from 'mirador/dist/es/src/state/selectors/companionWindows';
import MiradorAnnotation from '../plugins/miradorAnnotationPlugin';

// TODO use selector in main componenent
/**
* this function map the state to the annotationPlugin's props
 * */
function mapStateToProps(state, { targetProps: { windowId } }) {
  // Annotation edit companion window ou annotation creation companion window is the same thing
  const annotationCreationCompanionWindows = getCompanionWindowsForContent(state, { content: 'annotationCreation', windowId });
  let annotationEditCompanionWindowIsOpened = true;
  if (Object.keys(annotationCreationCompanionWindows).length !== 0) {
    annotationEditCompanionWindowIsOpened = false;
  }
  return {
    annotationEditCompanionWindowIsOpened,
    canvases: getVisibleCanvases(state, { windowId }),
    config: state.config,
    windowViewType: getWindowViewType(state, { windowId }),
  };
}

const enhance = compose(
  connect(mapStateToProps),
);

export default enhance(MiradorAnnotation);
