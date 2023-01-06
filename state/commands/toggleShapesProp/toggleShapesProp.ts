import type { TkdrawApp } from '~state';
import type { TKShape, TkdrawCommand } from '~types';

export function toggleShapeProp(
  app: TkdrawApp,
  ids: string[],
  prop: keyof TKShape
): TkdrawCommand {
  const { currentPageId } = app;

  const initialShapes = ids
    .map((id) => app.getShape(id))
    .filter((shape) => (prop === 'isLocked' ? true : !shape.isLocked));

  const isAllToggled = initialShapes.every((shape) => shape[prop]);

  const before: Record<string, Partial<TKShape>> = {};
  const after: Record<string, Partial<TKShape>> = {};

  initialShapes.forEach((shape) => {
    before[shape.id] = { [prop]: shape[prop] };
    after[shape.id] = { [prop]: !isAllToggled };
  });

  return {
    id: 'toggle',
    before: {
      document: {
        pages: {
          [currentPageId]: {
            shapes: before,
          },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds: ids,
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
            selectedIds: ids,
          },
        },
      },
    },
  };
}
