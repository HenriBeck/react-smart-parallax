import type { ComponentType } from 'react';

declare module 'react-event-listener' {
  declare type Props = { target: string };
  declare type EventListener = ComponentType<Props>;

  declare export default EventListener;
}
