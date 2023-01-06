import type { TkdrawApp } from '~state/TkdrawApp';
import { removeShapesFromPage } from '~state/commands/shared';
import type { TKAsset, TKAssets, TkdrawCommand } from '~types';

const removeAssetsFromDocument = (assets: TKAssets, idsToRemove: string[]) => {
  const afterAssets: Record<string, TKAsset | undefined> = { ...assets };
  idsToRemove.forEach((id) => (afterAssets[id] = undefined));
  return afterAssets;
};

export function deleteShapes(
  app: TkdrawApp,
  ids: string[],
  pageId = app.currentPageId
): TkdrawCommand {
  const {
    pageState,
    selectedIds,
    document: { assets: beforeAssets },
  } = app;
  const { before, after, assetsToRemove } = removeShapesFromPage(
    app.state,
    ids,
    pageId
  );
  const afterAssets = removeAssetsFromDocument(beforeAssets, assetsToRemove);

  return {
    id: 'delete',
    before: {
      document: {
        assets: beforeAssets,
        pages: {
          [pageId]: before,
        },
        pageStates: {
          [pageId]: { selectedIds: [...app.selectedIds] },
        },
      },
    },
    after: {
      document: {
        assets: afterAssets,
        pages: {
          [pageId]: after,
        },
        pageStates: {
          [pageId]: {
            selectedIds: selectedIds.filter((id) => !ids.includes(id)),
            hoveredId:
              pageState.hoveredId && ids.includes(pageState.hoveredId)
                ? undefined
                : pageState.hoveredId,
          },
        },
      },
    },
  };
}
