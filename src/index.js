// @flow strict-local

import React, { type Node } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import EventListener from 'react-event-listener';

import styles from './styles';

type Props = {
  classes: { [keys: $Keys<typeof styles>]: string },
  img: string,
  children: Node, // eslint-disable-line react/require-default-props
  className: string, // eslint-disable-line react/require-default-props
};
type State = { transform: number };

/**
 * A component to render a parallax effect.
 *
 * @class
 * @extends React.PureComponent
 */
class Parallax extends React.PureComponent<Props, State> {
  static propTypes = {
    classes: PropTypes.shape({
      container: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    }).isRequired,
    img: PropTypes.string.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
  };

  static defaultProps = {
    children: '',
    className: '',
  };

  state = { transform: 0 };

  container = React.createRef();

  image = React.createRef();

  imageIsLoaded: boolean = false;

  overflowImageHeight: number;

  containerMiddle: number;

  pixelsToScroll: number;

  /**
   * Compute some static values which don't change when the user scrolls.
   *
   * @private
   */
  computeValues() {
    if (!this.imageIsLoaded) {
      return;
    }

    const imageHeight = this.image.current ? this.image.current.getBoundingClientRect().height : 0;
    const containerHeight = this.container.current
      ? this.container.current.getBoundingClientRect().height
      : 0;

    this.overflowImageHeight = imageHeight - containerHeight;
    this.containerMiddle = containerHeight / 2;
    this.pixelsToScroll = window.innerHeight - containerHeight;
  }

  /**
   * Get the current transform for the position.
   *
   * @param {Object} containerRect - The rectangle of the container for
   * calculating the position.
   * @returns {String} - Returns the transform for the current position.
   */
  computeTransform(containerRect: ClientRect) {
    if (containerRect.top < 0) {
      return 0;
    } else if (containerRect.bottom > window.innerHeight) {
      return -this.overflowImageHeight;
    }

    return (containerRect.top / this.pixelsToScroll) * -this.overflowImageHeight;
  }

  /**
   * Reposition the image based on the current scroll position.
   *
   * @private
   */
  positionImage() {
    if (!this.imageIsLoaded || !this.container.current) {
      return;
    }

    const containerRect = this.container.current.getBoundingClientRect();

    this.setState((state) => {
      const transform = this.computeTransform(containerRect);

      return transform === state.transform ? null : { transform };
    });
  }

  handleScroll = {
    handler: () => this.positionImage(),
    options: {
      passive: true,
      capture: false,
    },
  };

  /**
   * Recompute the static values and reposition the image when the browser resizes.
   *
   * @private
   */
  handleResize = () => {
    this.computeValues();

    this.positionImage();
  };

  /**
   * When the image loads, compute the values and initially position the image.
   */
  handleImageLoad = () => {
    this.imageIsLoaded = true;

    this.computeValues();

    this.positionImage();
  };

  render() {
    return (
      <EventListener
        target="window"
        onResize={this.handleResize}
        onScroll={this.handleScroll}
      >
        <div
          role="presentation"
          className={`${this.props.classes.container} ${this.props.className}`}
          ref={this.container}
        >
          <img
            width="100%"
            src={this.props.img}
            className={this.props.classes.image}
            alt="parallax"
            ref={this.image}
            style={{ transform: `translate3D(0, ${this.state.transform}px, 0)` }}
            onLoad={this.handleImageLoad}
          />

          <div className={this.props.classes.content}>
            {this.props.children}
          </div>
        </div>
      </EventListener>
    );
  }
}

export default injectSheet(styles, { inject: ['classes'] })(Parallax);
