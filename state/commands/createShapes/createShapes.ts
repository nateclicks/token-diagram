import type { TkdrawApp } from '~state/TkdrawApp';
import type { Patch, TKBinding, TKShape, TkdrawCommand } from '~types';

export function createShapes(
  app: TkdrawApp,
  shapes: TKShape[],
  bindings: TKBinding[] = []
): TkdrawCommand {
  const { currentPageId } = app;

  const beforeShapes: Record<string, Patch<TKShape> | undefined> = {};
  const afterShapes: Record<string, Patch<TKShape> | undefined> = {};

  shapes.forEach((shape) => {
    beforeShapes[shape.id] = undefined;
    afterShapes[shape.id] = shape;
  });

  const beforeBindings: Record<string, Patch<TKBinding> | undefined> = {};
  const afterBindings: Record<string, Patch<TKBinding> | undefined> = {};

  bindings.forEach((binding) => {
    beforeBindings[binding.id] = undefined;
    afterBindings[binding.id] = binding;
  });

  return {
    id: 'create',
    before: {
      document: {
        pages: {
          [currentPageId]: {
            shapes: beforeShapes,
            bindings: beforeBindings,
          },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds: [...app.selectedIds],
          },
        },
      },
    },
    after: {
      document: {
        pages: {
          [currentPageId]: {
            shapes: afterShapes,
            bindings: afterBindings,
          },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds: shapes.map((shape) => shape.id),
          },
        },
      },
    },
  };
}
