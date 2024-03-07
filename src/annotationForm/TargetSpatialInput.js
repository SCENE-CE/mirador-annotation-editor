import React from 'react';
import PropTypes from 'prop-types';

export function TargetSpatialInput({xywh, setXywh}) {



  return (
    <>
      <p>TargetSpatialInput</p>
      ;
      <p>{xywh}</p>
    </>
  );
}

TargetSpatialInput.propTypes = {
  setXywh: PropTypes.func.isRequired,
  xywh: PropTypes.string.isRequired,
};
