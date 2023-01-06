import type { TkdrawApp } from '~state/TkdrawApp';
import type { TkdrawCommand } from '~types';

export function renamePage(
  app: TkdrawApp,
  pageId: string,
  name: string
): TkdrawCommand {
  const { page } = app;

  return {
    id: 'rename_page',
    before: {
      document: {
        pages: {
          [pageId]: { name: page.name },
        },
      },
    },
    after: {
      document: {
        pages: {
          [pageId]: { name: name },
        },
      },
    },
  };
}
