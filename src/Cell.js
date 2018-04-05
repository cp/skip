import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.oneOf(['red', 'black']),
  style: PropTypes.object,
};

const defaultProps = {
  style: {},
};

class Cell extends React.Component {
  render() {
    const style = Object.assign(this.props.style, {
      background: this.props.color,
    });

    return (
      <div
        style={ style }
        className="cell"
        onClick={ this.props.onClick }
      />
    )
  }
}

Cell.propTypes = propTypes;
Cell.defaultProps = defaultProps;

export default Cell;
