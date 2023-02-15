import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

/** URL input with an <img> preview */
class ImageFormField extends Component {
  /** */
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  /** Render input field and a preview if the input is valid */
  render() {
    const { value: image, classes, onChange } = this.props;
    const imgIsValid = this.inputRef.current
      ? (image.id && this.inputRef.current.checkValidity()) : image.id;
    const imgUrl = image.id === null ? '' : image.id;
    return (
      <div className={classes.root}>
        <TextField
          value={imgUrl}
          onChange={(ev) => onChange(ev.target.value)}
          error={imgUrl !== '' && !imgIsValid}
          margin="dense"
          label="Image URL"
          type="url"
          fullWidth
          inputRef={this.inputRef}
        />
        { imgIsValid
          && <img src={image.id} width="100%" height="auto" alt="loading failed" /> }
      </div>
    );
  }
}

/** custom css */
const styles = (theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

ImageFormField.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

ImageFormField.defaultProps = {
};

export default withStyles(styles)(ImageFormField);
