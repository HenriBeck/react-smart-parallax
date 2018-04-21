import type { ComponentType } from 'react';

declare module 'react-jss' {
  declare type Props = {};
  declare type StaticStyles = {};
  declare type Styles = StaticStyles | (theme: {}) => StaticStyles;
  declare type Options = { inject: Array<string> };
  declare function HoC(comp: ComponentType<Props>): ComponentType<Props>
  declare function injectSheet(styles: Styles, options?: Options): HoC;

  declare export default typeof injectSheet;
}
