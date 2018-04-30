# react-smart-parallax

A smart parallax which will measure the overflow and calculate the correct scroll speed for the image.

[![npm](https://img.shields.io/npm/v/react-smart-parallax.svg)](https://www.npmjs.com/package/react-smart-parallax) ![Maintenance](https://img.shields.io/maintenance/yes/2018.svg) ![npm](https://img.shields.io/npm/l/react-smart-parallax.svg) ![David](https://img.shields.io/david/HenriBeck/react-smart-parallax.svg) [![CircleCI](https://circleci.com/gh/HenriBeck/react-smart-parallax.svg?style=svg)](https://circleci.com/gh/HenriBeck/react-smart-parallax)
### Installation

> yarn add react-smart-parallax

Install peer dependencies:

> yarn add react react-dom prop-types react-jss

### Usage

```es6
import Parallax from 'react-smart-parallax';
import React from 'react';

function Component() {
  return (
    <Parallax img="https://website.com/image.png">
      The content in front of the image. This can be empty aswell.
    </Parallax>
  );
}
```

### Props

##### img (required)

The url to the image.

##### children

The content to render in front of the image.

##### className

An additional className to be applied to the root element.

### License

MIT
