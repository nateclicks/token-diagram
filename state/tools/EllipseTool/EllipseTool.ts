import { TLBoundsCorner, TLPointerEventHandler, Utils } from '@tldraw/core';
import Vec from '@tldraw/vec';
import { Ellipse } from '~shapes';
import { BaseTool, Status } from '~state/tools/BaseTool';
import { SessionType, TKShapeType } from '~types';

export class EllipseTool extends BaseTool {
  type = TKShapeType.Ellipse as const;

  /* ----------------- Event Handlers ----------------- */

  onPointerDown: TLPointerEventHandler = () => {
    if (this.app.readOnly) return;
    if (this.status !== Status.Idle) return;

    const {
      currentPoint,
      currentGrid,
      settings: { showGrid },
      appState: { currentPageId, currentStyle },
    } = this.app;

    const childIndex = this.getNextChildIndex();

    const id = Utils.uniqueId();

    const newShape = Ellipse.create({
      id,
      parentId: currentPageId,
      childIndex,
      point: showGrid ? Vec.snap(currentPoint, currentGrid) : currentPoint,
      style: { ...currentStyle },
    });

    this.app.patchCreate([newShape]);

    this.app.startSession(
      SessionType.TransformSingle,
      newShape.id,
      TLBoundsCorner.BottomRight,
      true
    );

    this.setStatus(Status.Creating);
  };
}
