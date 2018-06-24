// @flow strict-local

import React from 'react';
import test from 'ava';
import { interleaved } from 'react-unit';

import Parallax from '.';

test('should render a Jss HoC and the actual Parallax component', (t) => {
  const component = interleaved(
    <Parallax img="img">Children</Parallax>
  );

  t.deepEqual(component.findByQuery('Parallax').length, 1);
});

test('should render correct dom elements', (t) => {
  const component = interleaved(
    <Parallax img="img">Children</Parallax>
  );

  t.deepEqual(component.findByQuery('div.parallax').length, 1);
  t.deepEqual(component.findByQuery('img.parallax--image').length, 1);
  t.deepEqual(component.findByQuery('div.parallax--content').length, 1);
  t.deepEqual(component.findByQuery('div.parallax--content')[0].text, 'Children');
});

test('should not compute the values and position the image when it\'s not loaded yet', (t) => {
  const component = interleaved(
    <Parallax img="img">Children</Parallax>
  );

  component
    .findByQuery('EventListener')[0]
    .props
    .onResize();

  t.pass();
});

test('should compute the values and the position when the image is loaded', (t) => {
  const component = interleaved(
    <Parallax img="img">Children</Parallax>
  );

  component
    .findByQuery('img')[0]
    .props
    .onLoad();

  t.pass();
});
