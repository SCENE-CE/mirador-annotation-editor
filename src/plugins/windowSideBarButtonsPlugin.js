import React from 'react';
import PropTypes from 'prop-types';

/**
 * A wrapper plugin that sets hasAnyAnnotations to true so that the annotation
 * companion window button is present
 */
const WindowSideBarButtonWrapper = ({ PluginComponents, TargetComponent, targetProps }) => {
  // eslint-disable-next-line no-param-reassign
  targetProps.hasAnyAnnotations = true;

  return (
    <TargetComponent
      {...targetProps} // eslint-disable-line react/jsx-props-no-spreading
      PluginComponents={PluginComponents}
    />
  );
};

WindowSideBarButtonWrapper.propTypes = {
  PluginComponents: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  TargetComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  targetProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

WindowSideBarButtonWrapper.defaultProps = {
  PluginComponents: [],
};

export default {
  component: WindowSideBarButtonWrapper,
  mode: 'wrap',
  target: 'WindowSideBarButtons',
};
