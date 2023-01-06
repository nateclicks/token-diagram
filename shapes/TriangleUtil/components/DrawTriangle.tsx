import * as React from 'react';
import { getShapeStyle } from '~shapes/shared';
import type { ShapeStyles } from '~types';
import {
  getTriangleIndicatorPathTKSnapshot,
  getTrianglePath,
} from '../triangleHelpers';

interface TriangleSvgProps {
  id: string;
  size: number[];
  style: ShapeStyles;
  isSelected: boolean;
  isDarkMode: boolean;
}

export const DrawTriangle = React.memo(function DrawTriangle({
  id,
  size,
  style,
  isSelected,
  isDarkMode,
}: TriangleSvgProps) {
  const { stroke, strokeWidth, fill } = getShapeStyle(style, isDarkMode);
  const pathTKSnapshot = getTrianglePath(id, size, style);
  const indicatorPath = getTriangleIndicatorPathTKSnapshot(id, size, style);
  return (
    <>
      <path
        className={
          style.isFilled || isSelected ? 'tl-fill-hitarea' : 'tl-stroke-hitarea'
        }
        d={indicatorPath}
      />
      {style.isFilled && (
        <path d={indicatorPath} fill={fill} pointerEvents="none" />
      )}
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
