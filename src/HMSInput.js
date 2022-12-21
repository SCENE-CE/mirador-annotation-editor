import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { IconButton, Input } from '@material-ui/core';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import { secondsToHMSarray } from './utils';

/** hh:mm:ss input which behave like a single input for parent */
class HMSInput extends Component {
  /** Initialize state structure & bindings */
  constructor(props) {
    super(props);

    // eslint-disable-next-line react/destructuring-assignment
    const [h, m, s] = secondsToHMSarray(this.props.seconds);
    this.state = {
      hours: h,
      minutes: m,
      seconds: s,
    };

    this.someChange = this.someChange.bind(this);
    this.addOneSec = this.addOneSec.bind(this);
    this.subOneSec = this.subOneSec.bind(this);
  }

  /** update */
  componentDidUpdate(prevProps) {
    const { seconds } = this.props;
    if (prevProps.seconds === seconds) return;
    const [h, m, s] = secondsToHMSarray(seconds);
    this.setState({
      hours: h,
      minutes: m,
      seconds: s,
    });
  }

  /** If one value is updated, tell the parent component the total seconds counts */
  someChange(ev) {
    const { onChange } = this.props;
    const { state } = this;
    state[ev.target.name] = Number(ev.target.value);
    onChange(state.hours * 3600 + state.minutes * 60 + state.seconds);
  }

  /** Add one second by simulating an input change */
  addOneSec() {
    const { seconds } = this.state;
    this.someChange({ target: { name: 'seconds', value: seconds + 1 } });
  }

  /** Substract one second by simulating an input change */
  subOneSec() {
    const { seconds } = this.state;
    this.someChange({ target: { name: 'seconds', value: seconds - 1 } });
  }

  /** Render */
  render() {
    const { hours, minutes, seconds } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.root}>
          <Input className={classes.input} name="hours" value={hours} onChange={this.someChange} />
          <Input className={classes.input} name="minutes" value={minutes} onChange={this.someChange} />
          <Input className={classes.input} name="seconds" value={seconds} onChange={this.someChange} />
        </div>
        <div className={classes.flexcol}>
          <IconButton size="small" onClick={this.addOneSec}>
            <ArrowUpward />
          </IconButton>
          <IconButton size="small" onClick={this.subOneSec}>
            <ArrowDownward />
          </IconButton>
        </div>
      </div>
    );
  }
}

/** */
const styles = (theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'end',
  },
  // eslint-disable-next-line sort-keys
  flexcol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  // eslint-disable-next-line sort-keys
  input: {
    height: 'fit-content',
    margin: '2px',
    textAlign: 'center',
    width: '4ch',
  },
});

HMSInput.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  seconds: PropTypes.number.isRequired,
};

HMSInput.defaultProps = {
};

export default withStyles(styles)(HMSInput);
