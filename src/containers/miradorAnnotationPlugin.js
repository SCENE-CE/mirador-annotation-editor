import { compose } from 'redux';
import { connect } from 'react-redux';
import { getWindowViewType } from 'mirador/dist/es/src/state/selectors';
import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import MiradorAnnotation from '../plugins/miradorAnnotationPlugin';
import { getCompanionWindowsForContent } from 'mirador/dist/es/src/state/selectors/companionWindows';


function mapStateToProps(state, { targetProps: { windowId } }) {
    const annotationCreationCompanionWindows = getCompanionWindowsForContent(state, { content: 'annotationCreation', windowId });
    let annotationEdit = true;
    if (Object.keys(annotationCreationCompanionWindows).length !== 0) {
        annotationEdit = false;
    }
    return {
        canvases: getVisibleCanvases(state, { windowId }),
        config: state.config,
        annotationEdit: annotationEdit,
        windowViewType: getWindowViewType(state, { windowId }),
    }
};

const enhance = compose(
    connect(mapStateToProps),
);

export default enhance(MiradorAnnotation);
