// @flow

import React from 'react';
import test from 'ava';
import { mount } from 'enzyme';

import Parallax from '.';

test('should render a Jss HoC and the actual Parallax component', (t) => {
  const wrapper = mount(
    <Parallax img="img">Children</Parallax>
  );

  t.deepEqual(wrapper.find('Jss(Parallax)').length, 1);
  t.deepEqual(wrapper.find('Parallax').length, 1);
});

test('should render correct dom elements', (t) => {
  const wrapper = mount(
    <Parallax img="img">Children</Parallax>
  );

  t.deepEqual(wrapper.find('div.parallax').length, 1);
  t.deepEqual(wrapper.find('img.parallax--image').length, 1);
  t.deepEqual(wrapper.find('div.parallax--content').length, 1);
  t.deepEqual(wrapper.find('div.parallax--content').text(), 'Children');
});

test('should not compute the values and position the image when it\'s not loaded yet', (t) => {
  const wrapper = mount(
    <Parallax img="img">Children</Parallax>
  );

  wrapper
    .find('EventListener')
    .prop('onResize')();

  t.pass();
});

test('should compute the values and the position when the image is loaded', (t) => {
  const wrapper = mount(
    <Parallax img="img">Children</Parallax>
  );

  wrapper
    .find('img')
    .simulate('load');

  t.pass();
});
