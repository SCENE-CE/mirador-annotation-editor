import { compose } from 'redux';
import { connect } from 'react-redux';
import TargetFormSection from '../annotationForm/TargetFormSection';



// eslint-disable-next-line require-jsdoc
function mapStateToProps() {
  const helloWorld = 'helloWorld';
  return {
    helloWorld,
  };
}

const enhance = compose(
  connect(mapStateToProps),
);

export default enhance(TargetFormSection);
