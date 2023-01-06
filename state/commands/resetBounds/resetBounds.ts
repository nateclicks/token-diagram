import { TLDR } from '~state/TLDR';
import type { TkdrawApp } from '~state/TkdrawApp';
import type { TkdrawCommand } from '~types';

export function resetBounds(
  app: TkdrawApp,
  ids: string[],
  pageId: string
): TkdrawCommand {
  const { currentPageId } = app;

  const { before, after } = TLDR.mutateShapes(
    app.state,
    ids,
    (shape) => app.getShapeUtil(shape).onDoubleClickBoundsHandle?.(shape),
    pageId
  );

  return {
    id: 'reset_bounds',
    before: {
      document: {
        pages: {
          [currentPageId]: { shapes: before },
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
