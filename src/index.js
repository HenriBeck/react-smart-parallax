// @flow

import React, { type Node } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import getNotDeclaredProps from 'react-get-not-declared-props';
import EventListener from 'react-event-listener';

import styles from './styles';

type Props = {
  classes: {
    container: string,
    image: string,
    content: string,
  },
  img: string,
  children: Node,
  className: string,
};
type State = { transform: string | null };

/**
 * A component to render a parallax effect.
 *
 * @class
 * @extends React.PureComponent
 */
export class Parallax extends React.PureComponent<Props, State> {
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

  state = { transform: null };

  container = React.createRef();

  image = React.createRef();

  imageIsLoaded: boolean = false;

  overflowImageHeight: number;

  containerMiddle: number;

  pixelsToScroll: number;

  handleScroll = {
    handler: () => this.positionImage(),
    options: {
      passive: true,
      capture: false,
    },
  };

  /**
   * Compute some static values which don't change when the user scrolls.
   *
   * @private
   */
  computeValues() {
    if (!this.imageIsLoaded || !this.container.current || !this.image.current) {
      return;
    }

    const containerRect = this.container.current.getBoundingClientRect();
    const imageRect = this.image.current.getBoundingClientRect();

    this.overflowImageHeight = imageRect.height - containerRect.height;
    this.containerMiddle = containerRect.height / 2;
    this.pixelsToScroll = window.innerHeight - containerRect.height;
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
      return 'translate3D(0, 0px, 0)';
    } else if (containerRect.bottom > window.innerHeight) {
      return `translate3D(0, ${-this.overflowImageHeight}px, 0)`;
    }

    const transform = (containerRect.top / this.pixelsToScroll) * -this.overflowImageHeight;

    return `translate3D(0, ${transform}px, 0)`;
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
        onResize={this.handleResize}
        onScroll={this.handleScroll}
      >
        <div
          role="presentation"
          className={`${this.props.classes.container} ${this.props.className}`}
          ref={this.container}
          {...getNotDeclaredProps(this.props, Parallax)}
        >
          <img
            width="100%"
            src={this.props.img}
            className={this.props.classes.image}
            alt="parallax"
            ref={this.image}
            style={{ transform: this.state.transform }}
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
