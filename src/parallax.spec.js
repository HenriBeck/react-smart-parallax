/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import {
  mount,
  shallow,
} from 'enzyme';

import ParallaxWrapper, { Parallax } from './parallax';

const defaultProps = {
  classes: {
    root: Parallax.styles.root.composes,
    image: Parallax.styles.image.composes,
    content: Parallax.styles.content.composes,
  },
  img: 'img',
};

class IntersectionObserver {
  constructor(callback) {
    this.callbacks.push(callback);
  }

  callbacks = [];

  observe() {
    return this;
  }

  disconnect() {
    return this;
  }
}

global.IntersectionObserver = IntersectionObserver;

test('should render a div with an img and a div inside', (t) => {
  const wrapper = mount(<ParallaxWrapper img="image" />);

  t.deepEqual(wrapper.find('Jss(Parallax)').length, 1);
  t.deepEqual(wrapper.find('img').length, 1);
  t.deepEqual(wrapper.find('.parallax--content').length, 1);
});

test('should add a resize event listener to the window on mount', (t) => {
  const spy = sinon.spy(window, 'addEventListener');

  shallow(<Parallax {...defaultProps} />);

  t.deepEqual(spy.callCount, 1);

  window.addEventListener.restore();
});

test('should remove the resize and scroll event listener when the component unmounts', (t) => {
  const spy = sinon.spy(window, 'removeEventListener');
  const wrapper = shallow(<Parallax {...defaultProps} />);

  wrapper.unmount();

  t.deepEqual(spy.callCount, 2);

  window.removeEventListener.restore();
});

test('should warn against changing the img prop', (t) => {
  const wrapper = shallow(<Parallax {...defaultProps} />);

  t.throws(() => wrapper.setProps({ img: 'img2' }));
});

test('should compute the static values when the image loads and position the image', (t) => {
  const wrapper = mount(<Parallax {...defaultProps} />);
  const instance = wrapper.instance();
  const computeValues = sinon.spy(instance, 'computeValues');
  const positionImage = sinon.spy(instance, 'positionImage');

  instance.handleImageLoad();

  t.deepEqual(computeValues.callCount, 1);
  t.deepEqual(positionImage.callCount, 1);
});

test('should recalculate the static values and position the image on resize', (t) => {
  const wrapper = mount(<Parallax {...defaultProps} />);
  const instance = wrapper.instance();
  const computeValues = sinon.spy(instance, 'computeValues');
  const positionImage = sinon.spy(instance, 'positionImage');

  instance.handleResize();

  t.deepEqual(computeValues.callCount, 1);
  t.deepEqual(positionImage.callCount, 1);
});

test('should reposition position the image when the user scrolls', (t) => {
  const wrapper = mount(<Parallax {...defaultProps} />);
  const instance = wrapper.instance();
  const positionImage = sinon.spy(instance, 'positionImage');

  instance.handleScroll();

  t.deepEqual(positionImage.callCount, 1);
});

test('should add a onScroll event listener when the image is fully visible', (t) => {
  const wrapper = mount(<Parallax {...defaultProps} />);
  const instance = wrapper.instance();
  const spy = sinon.spy(window, 'addEventListener');

  instance.handleIntersection([{
    isIntersecting: true,
    intersectionRatio: 1,
  }]);

  t.deepEqual(spy.callCount, 1);
  t.deepEqual(instance.isIntersecting, true);

  window.addEventListener.restore();
});

test('should remove the onScroll event listener when the image is not visible anymore', (t) => {
  const wrapper = mount(<Parallax {...defaultProps} />);
  const instance = wrapper.instance();
  const spy = sinon.spy(window, 'removeEventListener');

  instance.handleIntersection([{
    isIntersecting: true,
    intersectionRatio: 1,
  }]);

  instance.handleIntersection([{
    isIntersecting: true,
    intersectionRatio: 0.5,
  }]);

  t.deepEqual(spy.callCount, 1);
  t.deepEqual(instance.isIntersecting, false);

  window.removeEventListener.restore();
});

test('should not do anything if the intersection is called but the image is not intersecting', (t) => {
  const wrapper = mount(<Parallax {...defaultProps} />);
  const instance = wrapper.instance();
  const prevIsIntersecting = instance.isIntersecting;

  instance.handleIntersection([{
    isIntersecting: false,
    intersectionRatio: 1,
  }]);

  t.deepEqual(instance.isIntersecting, prevIsIntersecting);
});
