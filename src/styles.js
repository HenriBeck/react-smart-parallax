// @flow

type Styles = {
  container: {},
  image: {},
  content: {},
};

const styles: Styles = {
  container: {
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

export default styles;
