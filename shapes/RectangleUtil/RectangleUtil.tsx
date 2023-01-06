import { SVGContainer, Utils } from '@tldraw/core';
import * as React from 'react';
import { GHOSTED_OPACITY, LABEL_POINT } from '~/state/constants';
import { TKShapeUtil } from '~shapes/CustomShapeUtil';
import {
  TextLabel,
  defaultStyle,
  getBoundsRectangle,
  getFontStyle,
  getShapeStyle,
  transformRectangle,
  transformSingleRectangle,
} from '~shapes/shared';
import { styled } from '~styles';
import { DashStyle, RectangleShape, TKMeta, TKShapeType } from '~types';
import { BindingIndicator } from './components/BindingIndicator';
import { DashedRectangle } from './components/DashedRectangle';
import { DrawRectangle } from './components/DrawRectangle';
import { getRectangleIndicatorPathTKSnapshot } from './rectangleHelpers';

type T = RectangleShape;
type E = HTMLDivElement;

export class RectangleUtil extends TKShapeUtil<T, E> {
  type = TKShapeType.Rectangle as const;

  canBind = true;

  canClone = true;

  canEdit = true;

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'id',
        type: TKShapeType.Rectangle,
        name: 'Rectangle',
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        size: [1, 1],
        rotation: 0,
        style: defaultStyle,
        label: '',
        labelPoint: [0.5, 0.5],
      },
      props
    );
  };

  Component = TKShapeUtil.Component<T, E, TKMeta>(
    (
      {
        shape,
        isEditing,
        isBinding,
        isSelected,
        isGhost,
        meta,
        bounds,
        events,
        onShapeBlur,
        onShapeChange,
      },
      ref
    ) => {
      const { id, size, style, label = '', labelPoint = LABEL_POINT } = shape;
      const font = getFontStyle(style);
      const styles = getShapeStyle(style, meta.isDarkMode);
      const Component =
        style.dash === DashStyle.Draw ? DrawRectangle : DashedRectangle;
      const handleLabelChange = React.useCallback(
        (label: string) => onShapeChange?.({ id, label }),
        [onShapeChange]
      );
      return (
        <FullWrapper ref={ref} {...events}>
          <TextLabel
            isEditing={isEditing}
            onChange={handleLabelChange}
            onBlur={onShapeBlur}
            font={font}
            text={label}
            color={styles.stroke}
            offsetX={(labelPoint[0] - 0.5) * bounds.width}
            offsetY={(labelPoint[1] - 0.5) * bounds.height}
          />
          <SVGContainer
            id={shape.id + '_svg'}
            opacity={isGhost ? GHOSTED_OPACITY : 1}
          >
            {isBinding && (
              <BindingIndicator strokeWidth={styles.strokeWidth} size={size} />
            )}
            <Component
              id={id}
              style={style}
              size={size}
              isSelected={isSelected}
              isDarkMode={meta.isDarkMode}
            />
          </SVGContainer>
        </FullWrapper>
      );
    }
  );

  Indicator = TKShapeUtil.Indicator<T>(({ shape }) => {
    const { id, style, size } = shape;

    const styles = getShapeStyle(style, false);
    const sw = styles.strokeWidth;

    if (style.dash === DashStyle.Draw) {
      return <path d={getRectangleIndicatorPathTKSnapshot(id, style, size)} />;
    }

    return (
      <rect
        x={sw}
        y={sw}
        rx={1}
        ry={1}
        width={Math.max(1, size[0] - sw * 2)}
        height={Math.max(1, size[1] - sw * 2)}
      />
    );
  });

  getBounds = (shape: T) => {
    return getBoundsRectangle(shape, this.boundsCache);
  };

  shouldRender = (prev: T, next: T) => {
    return (
      next.size !== prev.size ||
      next.style !== prev.style ||
      next.label !== prev.label
    );
  };

  transform = transformRectangle;

  transformSingle = transformSingleRectangle;
}

const FullWrapper = styled('div', { width: '100%', height: '100%' });
