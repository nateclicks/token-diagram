import type { TLBounds } from '@tldraw/core';
import { TLDR } from '~state/TLDR';
import type { TkdrawApp } from '~state/TkdrawApp';
import { BaseSession } from '~state/sessions/BaseSession';
import {
  ArrowShape,
  EllipseShape,
  RectangleShape,
  SessionType,
  TKStatus,
  TkdrawCommand,
  TkdrawPatch,
  TriangleShape,
} from '~types';

export class TranslateLabelSession extends BaseSession {
  type = SessionType.Handle;
  performanceMode = undefined;
  status = TKStatus.TranslatingHandle;
  initialShape: RectangleShape | TriangleShape | EllipseShape | ArrowShape;
  initialShapeBounds: TLBounds;

  constructor(app: TkdrawApp, shapeId: string) {
    super(app);
    this.initialShape = this.app.getShape<
      RectangleShape | TriangleShape | EllipseShape | ArrowShape
    >(shapeId);
    this.initialShapeBounds = this.app.getShapeBounds(shapeId);
  }

  start = (): TkdrawPatch | undefined => void null;

  update = (): TkdrawPatch | undefined => {
    const {
      initialShapeBounds,
      app: { currentPageId, currentPoint },
    } = this;

    const newHandlePoint = [
      Math.max(0, Math.min(1, currentPoint[0] / initialShapeBounds.width)),
      Math.max(0, Math.min(1, currentPoint[1] / initialShapeBounds.height)),
    ];

    // First update the handle's next point
    const change = {
      handlePoint: newHandlePoint,
    } as Partial<RectangleShape | TriangleShape | EllipseShape | ArrowShape>;

    return {
      document: {
        pages: {
          [currentPageId]: {
            shapes: {
              [this.initialShape.id]: change,
            },
          },
        },
      },
    };
  };

  cancel = (): TkdrawPatch | undefined => {
    const {
      initialShape,
      app: { currentPageId },
    } = this;

    return {
      document: {
        pages: {
          [currentPageId]: {
            shapes: {
              [initialShape.id]: initialShape,
            },
          },
        },
      },
    };
  };

  complete = (): TkdrawPatch | TkdrawCommand | undefined => {
    const {
      initialShape,
      app: { currentPageId },
    } = this;

    return {
      before: {
        document: {
          pages: {
            [currentPageId]: {
              shapes: {
                [initialShape.id]: initialShape,
              },
            },
          },
        },
      },
      after: {
        document: {
          pages: {
            [currentPageId]: {
              shapes: {
                [initialShape.id]: TLDR.onSessionComplete(
                  this.app.getShape(this.initialShape.id)
                ),
              },
            },
          },
        },
      },
    };
  };
}
