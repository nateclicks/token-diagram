import { TLPointerEventHandler, Utils } from '@tldraw/core';
import Vec from '@tldraw/vec';
import { Arrow } from '~shapes';
import { BaseTool, Status } from '~state/tools/BaseTool';
import { SessionType, TKShapeType } from '~types';

export class ArrowTool extends BaseTool {
  type = TKShapeType.Arrow as const;

  /* ----------------- Event Handlers ----------------- */

  onPointerDown: TLPointerEventHandler = () => {
    if (this.status !== Status.Idle) return;

    const {
      currentPoint,
      currentGrid,
      settings: { showGrid },
      appState: { currentPageId, currentStyle },
    } = this.app;

    const childIndex = this.getNextChildIndex();

    const id = Utils.uniqueId();

    const newShape = Arrow.create({
      id,
      parentId: currentPageId,
      childIndex,
      point: showGrid ? Vec.snap(currentPoint, currentGrid) : currentPoint,
      style: { ...currentStyle },
    });

    this.app.patchCreate([newShape]);

    this.app.startSession(SessionType.Arrow, newShape.id, 'end', true);

    this.setStatus(Status.Creating);
  };
}
