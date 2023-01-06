import { TLDR } from '~state/TLDR';
import type { TkdrawApp } from '~state/TkdrawApp';
import type { TKShape, TkdrawCommand } from '~types';

export function updateShapes(
  app: TkdrawApp,
  updates: ({ id: string } & Partial<TKShape>)[],
  pageId: string
): TkdrawCommand {
  const ids = updates.map((update) => update.id);

  const change = TLDR.mutateShapes(
    app.state,
    ids.filter((id) => !app.getShape(id, pageId).isLocked),
    (_shape, i) => updates[i],
    pageId
  );

  return {
    id: 'update',
    before: {
      document: {
        pages: {
          [pageId]: {
            shapes: change.before,
          },
        },
      },
    },
    after: {
      document: {
        pages: {
          [pageId]: {
            shapes: change.after,
          },
        },
      },
    },
  };
}
