import { TLShapeUtilsMap } from '@tldraw/core';
import type { TKShapeUtil } from './CustomShapeUtil';
import { TKShape, TKShapeType } from '~types';
// import { ArrowShape, ArrowUtil } from './arrow';
// import { ArrowShape } from './arrow';
// import { BoxShape, BoxUtil } from './box';
// import { PencilShape, PencilUtil } from './pencil';
// import { TokenShape, TokenUtil } from './token';
import { DrawUtil } from './DrawUtil';
import { EllipseUtil } from './EllipseUtil';
import { GroupUtil } from './GroupUtil';
import { ImageUtil } from './ImageUtil';
import { RectangleUtil } from './RectangleUtil';
import { StickyUtil } from './StickyUtil';
import { TextUtil } from './TextUtil';
import { TriangleUtil } from './TriangleUtil';
import { VideoUtil } from './VideoUtil';
import { ArrowUtil } from './ArrowUtil';

// export * from './arrow';
// export * from './pencil';
// export * from './box';
// export * from './token';

export const Rectangle = new RectangleUtil();
export const Triangle = new TriangleUtil();
export const Ellipse = new EllipseUtil();
export const Draw = new DrawUtil();
export const Arrow = new ArrowUtil();
export const Text = new TextUtil();
export const Group = new GroupUtil();
export const Sticky = new StickyUtil();
export const Image = new ImageUtil();
export const Video = new VideoUtil();

// export type Shape = BoxShape | ArrowShape | PencilShape | TokenShape;

// export const shapeUtils = {
//   box: new BoxUtil(),
//   arrow: new ArrowUtil(),
//   pencil: new PencilUtil(),
//   token: new TokenUtil(),
// };

export const shapeUtils = {
  [TKShapeType.Rectangle]: Rectangle,
  [TKShapeType.Triangle]: Triangle,
  [TKShapeType.Ellipse]: Ellipse,
  [TKShapeType.Draw]: Draw,
  [TKShapeType.Arrow]: Arrow,
  [TKShapeType.Text]: Text,
  [TKShapeType.Group]: Group,
  [TKShapeType.Sticky]: Sticky,
  [TKShapeType.Image]: Image,
  [TKShapeType.Video]: Video,
};

// export const getShapeUtil = <T extends Shape>(shape: T | T['type']) => {
//   if (typeof shape === 'string')
//     return shapeUtils[shape] as unknown as TKShapeUtil<T>;
//   return shapeUtils[shape.type] as unknown as TKShapeUtil<T>;
// };

export const getShapeUtil = <T extends TKShape>(shape: T | T['type']) => {
  if (typeof shape === 'string')
    return shapeUtils[shape] as unknown as TKShapeUtil<T>;
  return shapeUtils[shape.type] as unknown as TKShapeUtil<T>;
};
