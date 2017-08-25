import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import getNotDeclaredProps from 'react-get-not-declared-props';
import warning from 'warning';

/**
 * A component to render a parallax effect.
 *
 * @class
 * @extends PureComponent
 */
export class Parallax extends PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
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

  static styles = {
    root: {
      composes: 'parallax',
      position: 'relative',
      overflow: 'hidden',
    },

    image: {
      composes: 'parallax--image',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 'auto',
      left: 0,
      transition: 'transform 8ms linear',
      zIndex: 0,
      willChange: 'transform',
    },

    content: {
      composes: 'parallax--content',
      zIndex: 1,
    },
  };

  /**
   * Add the event listener for when the user scrolls.
   */
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);

    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (!entry.isIntersecting) {
        return;
      }

      if (entry.intersectionRatio === 1 && !this.isIntersecting) {
        window.addEventListener('scroll', this.handleScroll);

        this.isIntersecting = true;
      }

      if (this.isIntersecting && entry.intersectionRatio !== 1) {
        window.removeEventListener('scroll', this.handleScroll);

        this.isIntersecting = false;
      }

      this.positionImage();
    }, { threshold: 1 });

    this.observer.observe(this.root);
  }

  /**
   * Warn against changing the img prop.
   */
  componentWillReceiveProps(nextProps) {
    warning(
      nextProps.img === this.props.img,
      'You should not change the img prop of the Parallax',
    );
  }

  /**
   * Remove the event listener again.
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);

    this.observer.disconnect();
  }

  imageIsLoaded = false;
  isIntersecting = false;

  /**
   * Compute some static values which don't change when the user scrolls.
   *
   * @private
   */
  computeValues() {
    this.rootHeight = this.root.getBoundingClientRect().height;
    this.imageHeight = this.image.getBoundingClientRect().height;
    this.pixelsToScroll = window.innerHeight - this.rootHeight;
    this.overflowImageHeight = this.imageHeight - this.rootHeight;
  }

  /**
   * Reposition the image based on the current scroll position.
   *
   * @private
   */
  positionImage() {
    if (!this.imageIsLoaded) {
      return;
    }

    const { top } = this.root.getBoundingClientRect();
    const { innerHeight } = window;
    const scrollPos = 1 - Math.abs((innerHeight - this.rootHeight - top) / this.pixelsToScroll);
    const transform = scrollPos * this.overflowImageHeight;

    this.image.style.transform = `translate3D(0, ${-transform}px, 0)`;
  }

  /**
   * Recompute the static values and reposition the image.
   *
   * @private
   */
  handleResize = () => {
    this.computeValues();

    this.positionImage();
  };

  /**
   * Update the image position on a scroll event.
   * Only update it when the root element is completely visible.
   *
   * @private
   */
  handleScroll = () => {
    this.positionImage();
  };

  /**
   * When the image loads, compute the values and initially position the image.
   */
  handleImageLoad = () => {
    this.imageIsLoaded = true;

    this.computeValues();

    this.image.style.transform = `translate3D(0, ${-this.overflowImageHeight}px, 0)`;

    this.positionImage();
  };

  render() {
    const {
      classes,
      img,
      className,
      children,
      ...props
    } = this.props;

    return (
      <div
        role="presentation"
        className={`${classes.root} ${className}`}
        ref={(element) => { this.root = element; }}
        {...getNotDeclaredProps(props, Parallax, 'sheet')}
      >
        <img
          width="100%"
          src={img}
          className={classes.image}
          alt="parallax"
          ref={(element) => { this.image = element; }}
          onLoad={this.handleImageLoad}
        />

        <div className={classes.content}>
          {children}
        </div>
      </div>
    );
  }
}

export default injectSheet(Parallax.styles)(Parallax);
