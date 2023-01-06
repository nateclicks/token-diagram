import { Vec } from '@tldraw/vec';
import { TLDR } from '~state/TLDR';
import type { TkdrawApp } from '~state/TkdrawApp';
import { BaseSession } from '~state/sessions/BaseSession';
import {
  SessionType,
  ShapesWithProp,
  TKStatus,
  TkdrawCommand,
  TkdrawPatch,
} from '~types';

export class HandleSession extends BaseSession {
  type = SessionType.Handle;
  performanceMode = undefined;
  status = TKStatus.TranslatingHandle;
  commandId: string;
  topLeft: number[];
  shiftKey = false;
  initialShape: ShapesWithProp<'handles'>;
  handleId: string;

  constructor(
    app: TkdrawApp,
    shapeId: string,
    handleId: string,
    commandId = 'move_handle'
  ) {
    super(app);
    const { originPoint } = app;
    this.topLeft = [...originPoint];
    this.handleId = handleId;
    this.initialShape = this.app.getShape(shapeId);
    this.commandId = commandId;
  }

  start = (): TkdrawPatch | undefined => void null;

  update = (): TkdrawPatch | undefined => {
    const {
      initialShape,
      app: { currentPageId, currentPoint },
    } = this;

    const shape = this.app.getShape<ShapesWithProp<'handles'>>(initialShape.id);

    if (shape.isLocked) return void null;

    const handles = shape.handles;

    const handleId = this.handleId as keyof typeof handles;

    const delta = Vec.sub(currentPoint, handles[handleId].point);

    const handleChanges = {
      [handleId]: {
        ...handles[handleId],
        point: Vec.sub(Vec.add(handles[handleId].point, delta), shape.point),
      },
    };

    // First update the handle's next point
    const change = TLDR.getShapeUtil(shape).onHandleChange?.(
      shape,
      handleChanges
    );

    if (!change) return;

    return {
      document: {
        pages: {
          [currentPageId]: {
            shapes: {
              [shape.id]: change,
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
      id: this.commandId,
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
