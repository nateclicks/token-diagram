import {
  TLBounds,
  TLBoundsCorner,
  TLBoundsEdge,
  TLBoundsWithCenter,
  TLSnapLine,
  Utils,
} from '@tldraw/core';
import { Vec } from '@tldraw/vec';
import { SLOW_SPEED, SNAP_DISTANCE } from '~/state/constants';
import { TLDR } from '~state/TLDR';
import type { TkdrawApp } from '~state/TkdrawApp';
import { BaseSession } from '~state/sessions/BaseSession';
import {
  SessionType,
  TKShape,
  TKStatus,
  TkdrawCommand,
  TkdrawPatch,
} from '~types';

type SnapInfo =
  | {
      state: 'empty';
    }
  | {
      state: 'ready';
      bounds: TLBoundsWithCenter[];
    };

export class TransformSingleSession extends BaseSession {
  type = SessionType.TransformSingle;
  status = TKStatus.Transforming;
  performanceMode = undefined;
  transformType: TLBoundsEdge | TLBoundsCorner;
  scaleX = 1;
  scaleY = 1;
  isCreate: boolean;
  initialShape: TKShape;
  initialShapeBounds: TLBounds;
  initialCommonBounds: TLBounds;
  snapInfo: SnapInfo = { state: 'empty' };
  prevPoint = [0, 0];
  speed = 1;

  constructor(
    app: TkdrawApp,
    id: string,
    transformType: TLBoundsEdge | TLBoundsCorner,
    isCreate = false
  ) {
    super(app);
    this.isCreate = isCreate;
    this.transformType = transformType;

    const shape = this.app.getShape(id);
    this.initialShape = shape;
    this.initialShapeBounds = TLDR.getBounds(shape);
    this.initialCommonBounds = TLDR.getRotatedBounds(shape);
    this.app.rotationInfo.selectedIds = [shape.id];
  }

  start = (): TkdrawPatch | undefined => {
    this.snapInfo = {
      state: 'ready',
      bounds: this.app.shapes
        .filter((shape) => shape.id !== this.initialShape.id)
        .map((shape) =>
          Utils.getBoundsWithCenter(TLDR.getRotatedBounds(shape))
        ),
    };

    return void null;
  };

  update = (): TkdrawPatch | undefined => {
    const {
      transformType,
      initialShape,
      initialShapeBounds,
      app: {
        settings: { isSnapping, showGrid },
        currentPageId,
        pageState: { camera },
        viewport,
        currentPoint,
        previousPoint,
        originPoint,
        currentGrid,
        shiftKey,
        altKey,
        metaKey,
      },
    } = this;

    if (initialShape.isLocked) return void null;

    const shapes = {} as Record<string, Partial<TKShape>>;

    const delta = altKey
      ? Vec.mul(Vec.sub(currentPoint, originPoint), 2)
      : Vec.sub(currentPoint, originPoint);

    const shape = this.app.getShape(initialShape.id);

    const utils = TLDR.getShapeUtil(shape);

    let newBounds = Utils.getTransformedBoundingBox(
      initialShapeBounds,
      transformType,
      delta,
      shape.rotation,
      shiftKey || shape.isAspectRatioLocked || utils.isAspectRatioLocked
    );

    if (altKey) {
      newBounds = {
        ...newBounds,
        ...Utils.centerBounds(
          newBounds,
          Utils.getBoundsCenter(initialShapeBounds)
        ),
      };
    }

    if (showGrid) {
      newBounds = {
        ...newBounds,
        ...Utils.snapBoundsToGrid(newBounds, currentGrid),
      };
    }

    // Should we snap?

    const speed = Vec.dist(currentPoint, previousPoint);

    const speedChange = speed - this.speed;

    this.speed = this.speed + speedChange * (speedChange > 1 ? 0.5 : 0.15);

    let snapLines: TLSnapLine[] = [];

    if (
      ((isSnapping && !metaKey) || (!isSnapping && metaKey)) &&
      !initialShape.rotation && // not now anyway
      this.speed * camera.zoom < SLOW_SPEED &&
      this.snapInfo.state === 'ready'
    ) {
      const snapResult = Utils.getSnapPoints(
        Utils.getBoundsWithCenter(newBounds),
        this.snapInfo.bounds.filter(
          (bounds) =>
            Utils.boundsContain(viewport, bounds) ||
            Utils.boundsCollide(viewport, bounds)
        ),
        SNAP_DISTANCE / camera.zoom
      );

      if (snapResult) {
        snapLines = snapResult.snapLines;

        newBounds = Utils.getTransformedBoundingBox(
          initialShapeBounds,
          transformType,
          Vec.sub(delta, snapResult.offset),
          shape.rotation,
          shiftKey || shape.isAspectRatioLocked || utils.isAspectRatioLocked
        );
      }
    }

    const afterShape = TLDR.getShapeUtil(shape).transformSingle(
      shape,
      newBounds,
      {
        initialShape,
        type: this.transformType,
        scaleX: newBounds.scaleX,
        scaleY: newBounds.scaleY,
        transformOrigin: [0.5, 0.5],
      }
    );

    if (afterShape) {
      shapes[shape.id] = afterShape;
    }

    if (showGrid && afterShape && afterShape.point) {
      afterShape.point = Vec.snap(afterShape.point, currentGrid);
    }

    return {
      appState: {
        snapLines,
      },
      document: {
        pages: {
          [currentPageId]: {
            shapes,
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

    const shapes = {} as Record<string, TKShape | undefined>;

    if (this.isCreate) {
      shapes[initialShape.id] = undefined;
    } else {
      shapes[initialShape.id] = initialShape;
    }

    return {
      appState: {
        snapLines: [],
      },
      document: {
        pages: {
          [currentPageId]: {
            shapes,
          },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds: this.isCreate ? [] : [initialShape.id],
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

    if (initialShape.isLocked) return;

    if (
      this.isCreate &&
      Vec.dist(this.app.originPoint, this.app.currentPoint) < 2
    ) {
      return this.cancel();
    }

    const beforeShapes = {} as Record<string, Partial<TKShape> | undefined>;
    const afterShapes = {} as Record<string, Partial<TKShape>>;

    beforeShapes[initialShape.id] = this.isCreate ? undefined : initialShape;

    afterShapes[initialShape.id] = TLDR.onSessionComplete(
      this.app.getShape(initialShape.id)
    );

    return {
      id: 'transform_single',
      before: {
        appState: {
          snapLines: [],
        },
        document: {
          pages: {
            [currentPageId]: {
              shapes: beforeShapes,
            },
          },
          pageStates: {
            [currentPageId]: {
              selectedIds: this.isCreate ? [] : [initialShape.id],
              editingId: undefined,
              hoveredId: undefined,
            },
          },
        },
      },
      after: {
        appState: {
          snapLines: [],
        },
        document: {
          pages: {
            [currentPageId]: {
              shapes: afterShapes,
            },
          },
          pageStates: {
            [currentPageId]: {
              selectedIds: [initialShape.id],
              editingId: undefined,
              hoveredId: undefined,
            },
          },
        },
      },
    };
  };
}
