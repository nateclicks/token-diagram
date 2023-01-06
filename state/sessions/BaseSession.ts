import type { TLPerformanceMode } from '@tldraw/core';
import type { TkdrawApp } from '~state/TkdrawApp';
import type { SessionType, TkdrawCommand, TkdrawPatch } from '~types';

export abstract class BaseSession {
  abstract type: SessionType;
  abstract performanceMode: TLPerformanceMode | undefined;
  constructor(public app: TkdrawApp) {}
  abstract start: () => TkdrawPatch | undefined;
  abstract update: () => TkdrawPatch | undefined;
  abstract complete: () => TkdrawPatch | TkdrawCommand | undefined;
  abstract cancel: () => TkdrawPatch | undefined;
}
