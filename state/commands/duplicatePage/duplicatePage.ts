import { Utils } from '@tldraw/core';
import type { TkdrawApp } from '~state/TkdrawApp';
import type { TkdrawCommand } from '~types';

export function duplicatePage(app: TkdrawApp, pageId: string): TkdrawCommand {
  const {
    currentPageId,
    pageState: { camera },
  } = app;

  const page = app.document.pages[pageId];

  const newId = Utils.uniqueId();

  const nextPage = {
    ...page,
    id: newId,
    name: page.name + ' Copy',
    shapes: Object.fromEntries(
      Object.entries(page.shapes).map(([id, shape]) => {
        return [
          id,
          {
            ...shape,
            parentId: shape.parentId === page.id ? newId : shape.parentId,
          },
        ];
      })
    ),
  };

  return {
    id: 'duplicate_page',
    before: {
      appState: {
        currentPageId,
      },
      document: {
        pages: {
          [newId]: undefined,
        },
        pageStates: {
          [newId]: undefined,
        },
      },
    },
    after: {
      appState: {
        currentPageId: newId,
      },
      document: {
        pages: {
          [newId]: nextPage,
        },
        pageStates: {
          [newId]: {
            ...page,
            id: newId,
            selectedIds: [],
            camera: { ...camera },
            editingId: undefined,
            bindingId: undefined,
            hoveredId: undefined,
            pointedId: undefined,
          },
        },
      },
    },
  };
}
