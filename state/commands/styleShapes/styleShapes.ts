import { Vec } from '@tldraw/vec';
import { TLDR } from '~state/TLDR';
import type { TkdrawApp } from '~state/TkdrawApp';
import {
  Patch,
  ShapeStyles,
  TKShape,
  TKShapeType,
  TextShape,
  TkdrawCommand,
} from '~types';

export function styleShapes(
  app: TkdrawApp,
  ids: string[],
  changes: Partial<ShapeStyles>
): TkdrawCommand {
  const { currentPageId, selectedIds } = app;

  const shapeIdsToMutate = ids
    .flatMap((id) => TLDR.getDocumentBranch(app.state, id, currentPageId))
    .filter((id) => !app.getShape(id).isLocked);

  const beforeShapes: Record<string, Patch<TKShape>> = {};
  const afterShapes: Record<string, Patch<TKShape>> = {};

  shapeIdsToMutate
    .map((id) => app.getShape(id))
    .filter((shape) => !shape.isLocked)
    .forEach((shape) => {
      beforeShapes[shape.id] = {
        style: {
          ...Object.fromEntries(
            Object.keys(changes).map((key) => [
              key,
              shape.style[key as keyof typeof shape.style],
            ])
          ),
        },
      };

      afterShapes[shape.id] = {
        style: changes,
      };

      if (shape.type === TKShapeType.Text) {
        beforeShapes[shape.id].point = shape.point;
        afterShapes[shape.id].point = Vec.toFixed(
          Vec.add(
            shape.point,
            Vec.sub(
              app.getShapeUtil(shape).getCenter(shape),
              app.getShapeUtil(shape).getCenter({
                ...shape,
                style: { ...shape.style, ...changes },
              } as TextShape)
            )
          )
        );
      }
    });

  return {
    id: 'style',
    before: {
      document: {
        pages: {
          [currentPageId]: {
            shapes: beforeShapes,
          },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds: selectedIds,
          },
        },
      },
      appState: {
        currentStyle: { ...app.appState.currentStyle },
      },
    },
    after: {
      document: {
        pages: {
          [currentPageId]: {
            shapes: afterShapes,
          },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds: ids,
          },
        },
      },
      appState: {
        currentStyle: changes,
      },
    },
  };
}
