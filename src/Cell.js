import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.oneOf(['red', 'black']),
};

class Cell extends React.Component {
  render() {
    const className = classnames('cell', {
      'cell-red': this.props.color === 'red',
      'cell-black': this.props.color === 'black',
    });

    return (
      <div
        className={ className }
        onClick={ this.props.onClick }
      />
    )
  }
}

Cell.propTypes = propTypes;

export default Cell;
