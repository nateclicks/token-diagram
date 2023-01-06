import type { TkdrawApp } from '~state';
import type { TKShape, TkdrawCommand } from '~types';

export function setShapesProps<T extends TKShape>(
  app: TkdrawApp,
  ids: string[],
  partial: Partial<T>
): TkdrawCommand {
  const { currentPageId, selectedIds } = app;

  const initialShapes = ids
    .map((id) => app.getShape<T>(id))
    .filter((shape) => (partial['isLocked'] ? true : !shape.isLocked));

  const before: Record<string, Partial<TKShape>> = {};
  const after: Record<string, Partial<TKShape>> = {};

  const keys = Object.keys(partial) as (keyof T)[];

  initialShapes.forEach((shape) => {
    before[shape.id] = Object.fromEntries(keys.map((key) => [key, shape[key]]));
    after[shape.id] = partial;
  });

  return {
    id: 'set_props',
    before: {
      document: {
        pages: {
          [currentPageId]: {
            shapes: before,
          },
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
          [currentPageId]: {
            shapes: after,
          },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds,
          },
        },
      },
    },
  };
}
