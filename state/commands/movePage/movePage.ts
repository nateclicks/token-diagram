import type { TkdrawApp } from '~state/TkdrawApp';
import type { TKPage, TkdrawCommand } from '~types';

export function movePage(
  app: TkdrawApp,
  pageId: string,
  index: number
): TkdrawCommand {
  const { pages } = app.document;

  const movingPage = pages[pageId];

  const beforePages = Object.values(pages).sort(
    (a, b) => (a.childIndex ?? 0) - (b.childIndex ?? 0)
  );

  const fromIndex = beforePages.indexOf(movingPage);

  const afterPages = [...beforePages];
  afterPages.splice(fromIndex, 1);
  afterPages.splice(index > fromIndex ? index - 1 : index, 0, movingPage);

  return {
    id: 'move_page',
    before: {
      document: {
        pages: Object.fromEntries(
          beforePages.map((p: TKPage) => [p.id, { childIndex: p.childIndex }])
        ),
      },
    },
    after: {
      document: {
        pages: Object.fromEntries(
          afterPages.map((p: TKPage, childIndex) => [p.id, { childIndex }])
        ),
      },
    },
  };
}
