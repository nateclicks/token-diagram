import { TLBoundsCorner, Utils } from '@tldraw/core';
import { TLDR } from '~state/TLDR';
import type { TkdrawApp } from '~state/TkdrawApp';
import { StretchType, TKShapeType } from '~types';
import type { TkdrawCommand } from '~types';

export function stretchShapes(
  app: TkdrawApp,
  ids: string[],
  type: StretchType
): TkdrawCommand {
  const { currentPageId, selectedIds } = app;

  const initialShapes = ids.map((id) => app.getShape(id));

  const boundsForShapes = initialShapes.map((shape) => TLDR.getBounds(shape));

  const commonBounds = Utils.getCommonBounds(boundsForShapes);

  const idsToMutate = ids
    .flatMap((id) => {
      const shape = app.getShape(id);
      return shape.children ? shape.children : shape.id;
    })
    .filter((id) => !app.getShape(id).isLocked);

  const { before, after } = TLDR.mutateShapes(
    app.state,
    idsToMutate,
    (shape) => {
      const bounds = TLDR.getBounds(shape);

      switch (type) {
        case StretchType.Horizontal: {
          const newBounds = {
            ...bounds,
            minX: commonBounds.minX,
            maxX: commonBounds.maxX,
            width: commonBounds.width,
          };

          return TLDR.getShapeUtil(shape).transformSingle(shape, newBounds, {
            type: TLBoundsCorner.TopLeft,
            scaleX: newBounds.width / bounds.width,
            scaleY: 1,
            initialShape: shape,
            transformOrigin: [0.5, 0.5],
          });
        }
        case StretchType.Vertical: {
          const newBounds = {
            ...bounds,
            minY: commonBounds.minY,
            maxY: commonBounds.maxY,
            height: commonBounds.height,
          };

          return TLDR.getShapeUtil(shape).transformSingle(shape, newBounds, {
            type: TLBoundsCorner.TopLeft,
            scaleX: 1,
            scaleY: newBounds.height / bounds.height,
            initialShape: shape,
            transformOrigin: [0.5, 0.5],
          });
        }
      }
    },
    currentPageId
  );

  initialShapes.forEach((shape) => {
    if (shape.type === TKShapeType.Group) {
      delete before[shape.id];
      delete after[shape.id];
    }
  });

  return {
    id: 'stretch',
    before: {
      document: {
        pages: {
          [currentPageId]: { shapes: before },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds,
          },
        },
      },
    },
    after: {
      document: {
        pages: {
          [currentPageId]: { shapes: after },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds: ids,
          },
        },
      },
    },
  };
}
