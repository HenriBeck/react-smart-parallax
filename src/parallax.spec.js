/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import { mount } from 'enzyme';

import ParallaxWrapper, { Parallax } from './parallax';

const defaultProps = {
  classes: {
    root: Parallax.styles.root.composes,
    image: Parallax.styles.image.composes,
    content: Parallax.styles.content.composes,
  },
  img: 'img',
};

test('should render a div with an img and a div inside', (t) => {
  const wrapper = mount(<ParallaxWrapper img="image" />);

  t.deepEqual(wrapper.find('Jss(Parallax)').length, 1);
  t.deepEqual(wrapper.find('img').length, 1);
  t.deepEqual(wrapper.find('.parallax--content').length, 1);
});

test('should warn against changing the img prop', (t) => {
  const wrapper = mount(<ParallaxWrapper img="img" />);

  t.throws(() => wrapper.setProps({ img: 'img2' }));
});

test('should add two event listeners to the document when the component mounts', (t) => {
  const spy = sinon.spy(window, 'addEventListener');

  mount(<ParallaxWrapper img="img" />);

  t.deepEqual(spy.callCount, 2);
});

test('should remove two event listeners from the document when the component unmounts', (t) => {
  const wrapper = mount(<ParallaxWrapper img="img" />);
  const spy = sinon.spy(window, 'removeEventListener');

  wrapper.unmount();

  t.deepEqual(spy.callCount, 2);
});

test('should call the positionImage function when the user scrolls', (t) => {
  const wrapper = mount(<Parallax {...defaultProps} />);
  const instance = wrapper.instance();
  const spy = sinon.spy(instance, 'positionImage');

  instance.handleScroll();

  t.deepEqual(spy.callCount, 1);
});

test('should call the positionImage and computeValues function when the window resizes', (t) => {
  const wrapper = mount(<Parallax {...defaultProps} />);
  const instance = wrapper.instance();
  const positionImage = sinon.spy(instance, 'positionImage');
  const computeValues = sinon.spy(instance, 'computeValues');

  instance.handleResize();

  t.deepEqual(positionImage.callCount, 1);
  t.deepEqual(computeValues.callCount, 1);
});

test('should initially set the transform when the image loads', (t) => {
  const wrapper = mount(<Parallax {...defaultProps} />);
  const instance = wrapper.instance();

  instance.handleImageLoad();

  t.deepEqual(wrapper.find('.parallax--image').node.style.transform, 'translate3D(0, 0px, 0)');
});

test('should not change the transform when the parallax isn\'t visible', (t) => {
  window.innerHeight = -100;
  const wrapper = mount(<Parallax {...defaultProps} />);
  const instance = wrapper.instance();
  let callCount = 0;

  instance.image.style = { set transform(val) { callCount += 1; } };

  instance.handleImageLoad();

  instance.positionImage();

  t.deepEqual(callCount, 0);

  window.innerHeight = 0;
});
