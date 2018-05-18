// @flow strict-local

export default {
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
