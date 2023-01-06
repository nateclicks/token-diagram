import type { TkdrawApp } from '~state/TkdrawApp';
import type { TkdrawCommand } from '~types';

export function changePage(app: TkdrawApp, pageId: string): TkdrawCommand {
  return {
    id: 'change_page',
    before: {
      appState: {
        currentPageId: app.currentPageId,
      },
    },
    after: {
      appState: {
        currentPageId: pageId,
      },
    },
  };
}
