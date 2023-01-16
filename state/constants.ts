import type { S } from '@state-designer/react';
import { Easing, TKShape, TKShapeType } from '~types';
import type {
  TLBinding,
  TLPage,
  TLPageState,
  TLPerformanceMode,
  TLSnapLine,
} from '@tldraw/core';

export const LETTER_SPACING = '-0.03em';
export const LINE_HEIGHT = 1;
export const GRID_SIZE = 8;
export const SVG_EXPORT_PADDING = 16;
export const BINDING_DISTANCE = 16;
export const CLONING_DISTANCE = 32;
export const FIT_TO_SCREEN_PADDING = 128;
export const SNAP_DISTANCE = 5;
export const EMPTY_ARRAY = [] as any[];
export const SLOW_SPEED = 10;
export const VERY_SLOW_SPEED = 2.5;
export const GHOSTED_OPACITY = 0.3;
export const DEAD_ZONE = 3;
export const LABEL_POINT = [0.5, 0.5];

export const FILE_EXTENSION = '.tokens.json';

export const VERSION = 1;
// export const PERSIST_DATA = true;
export const PERSIST_DATA = false;
export const BINDING_PADDING = 12;

export interface CustomBinding extends TLBinding {
  handleId: 'start' | 'end';
}

export const INITIAL_PAGE: TLPage<TKShape, CustomBinding> = {
  id: 'page1',
  shapes: {
  //   box1: {
  //     id: 'box1',
  //     type: TKShapeType.Rectangle,
  //     parentId: 'page1',
  //     name: 'Box',
  //     childIndex: 1,
  //     point: [100, 100],
  //     size: [100, 100],
  //   },
  //   box2: {
  //     id: 'box2',
  //     type: TKShapeType.Rectangle,
  //     parentId: 'page1',
  //     name: 'Box',
  //     childIndex: 2,
  //     point: [250, 200],
  //     size: [100, 100],
  //   },
  //   box3: {
  //     id: 'box3',
  //     type: 'box',
  //     parentId: 'page1',
  //     name: 'Box',
  //     childIndex: 3,
  //     point: [150, 400],
  //     size: [100, 100],
  //   },
  //   arrow1: {
  //     id: 'arrow1',
  //     type: 'arrow',
  //     parentId: 'page1',
  //     name: 'Arrow',
  //     childIndex: 3,
  //     point: [231, 312],
  //     handles: {
  //       start: {
  //         id: 'start',
  //         index: 1,
  //         point: [38, 0],
  //       },
  //       end: {
  //         id: 'end',
  //         index: 2,
  //         point: [0, 76],
  //       },
  //     },
  //   },
  },
  bindings: {
    // binding1: {
    //   id: 'binding1',
    //   fromId: 'arrow1',
    //   toId: 'box2',
    //   handleId: 'start',
    // },
    // binding2: {
    //   id: 'binding2',
    //   fromId: 'arrow1',
    //   toId: 'box3',
    //   handleId: 'end',
    // },
  },
};

export const INITIAL_PAGE_STATE: TLPageState = {
  id: 'page1',
  selectedIds: [],
  camera: {
    point: [0, 0],
    zoom: 1,
  },
  brush: null,
  pointedId: null,
  hoveredId: null,
  editingId: null,
  bindingId: null,
};

export const INITIAL_DATA = {
  id: 'myDocument',
  version: VERSION,
  page: INITIAL_PAGE,
  pageState: INITIAL_PAGE_STATE,
  overlays: {
    snapLines: [] as TLSnapLine[],
  },
  meta: {
    isDarkMode: false,
  },
  performanceMode: undefined as TLPerformanceMode | undefined,
};

export type AppDocument = {
  id: string;
  page: TLPage<TKShape>;
};

export type AppData = typeof INITIAL_DATA;

export type Action = S.Action<AppData>;

export type Condition = S.Condition<AppData>;

export const EASINGS: Record<Easing, (t: number) => number> = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInQuint: (t) => t * t * t * t * t,
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeInExpo: (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) =>
    t <= 0
      ? 0
      : t >= 1
      ? 1
      : t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2,
};

export const EASING_STRINGS: Record<Easing, string> = {
  linear: `(t) => t`,
  easeInQuad: `(t) => t * t`,
  easeOutQuad: `(t) => t * (2 - t)`,
  easeInOutQuad: `(t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)`,
  easeInCubic: `(t) => t * t * t`,
  easeOutCubic: `(t) => --t * t * t + 1`,
  easeInOutCubic: `(t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1`,
  easeInQuart: `(t) => t * t * t * t`,
  easeOutQuart: `(t) => 1 - --t * t * t * t`,
  easeInOutQuart: `(t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t`,
  easeInQuint: `(t) => t * t * t * t * t`,
  easeOutQuint: `(t) => 1 + --t * t * t * t * t`,
  easeInOutQuint: `(t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t`,
  easeInSine: `(t) => 1 - Math.cos((t * Math.PI) / 2)`,
  easeOutSine: `(t) => Math.sin((t * Math.PI) / 2)`,
  easeInOutSine: `(t) => -(Math.cos(Math.PI * t) - 1) / 2`,
  easeInExpo: `(t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10))`,
  easeOutExpo: `(t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))`,
  easeInOutExpo: `(t) => t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2`,
};

export const USER_COLORS = [
  '#EC5E41',
  '#F2555A',
  '#F04F88',
  '#E34BA9',
  '#BD54C6',
  '#9D5BD2',
  '#7B66DC',
  '#02B1CC',
  '#11B3A3',
  '#39B178',
  '#55B467',
  '#FF802B',
];

export const isSafari =
  typeof Window === 'undefined'
    ? false
    : /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const isLinux =
  typeof Window === 'undefined' ? false : /linux/i.test(navigator.userAgent);

export const IMAGE_EXTENSIONS = ['.png', '.svg', '.jpg', '.jpeg', '.gif'];

export const VIDEO_EXTENSIONS = isSafari ? [] : ['.mp4', '.webm'];
