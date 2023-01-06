import * as React from 'react';
import { getShapeStyle } from '~shapes/shared';
import type { ShapeStyles } from '~types';
import {
  getRectangleIndicatorPathTKSnapshot,
  getRectanglePath,
} from '../rectangleHelpers';

interface RectangleSvgProps {
  id: string;
  style: ShapeStyles;
  isSelected: boolean;
  isDarkMode: boolean;
  size: number[];
}

export const DrawRectangle = React.memo(function DrawRectangle({
  id,
  style,
  size,
  isSelected,
  isDarkMode,
}: RectangleSvgProps) {
  const { isFilled } = style;
  const { stroke, strokeWidth, fill } = getShapeStyle(style, isDarkMode);
  const pathTKSnapshot = getRectanglePath(id, style, size);
  const innerPath = getRectangleIndicatorPathTKSnapshot(id, style, size);

  return (
    <>
      <path
        className={
          style.isFilled || isSelected ? 'tl-fill-hitarea' : 'tl-stroke-hitarea'
        }
        d={innerPath}
      />
      {isFilled && <path d={innerPath} fill={fill} pointerEvents="none" />}
      <path
        d={pathTKSnapshot}
        fill={stroke}
        stroke={stroke}
        strokeWidth={strokeWidth}
        pointerEvents="none"
      />
    </>
  );
});
