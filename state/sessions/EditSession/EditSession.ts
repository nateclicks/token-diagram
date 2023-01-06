import type { TkdrawApp } from '~state/TkdrawApp';
import { BaseSession } from '~state/sessions/BaseSession';
import { SessionType, TKShape, TkdrawCommand, TkdrawPatch } from '~types';

export class EditSession extends BaseSession {
  type = SessionType.Edit;
  performanceMode = undefined;

  initialShape: TKShape;
  initialSelectedIds: string[];
  currentPageId: string;
  isCreating: boolean;

  constructor(app: TkdrawApp, id: string, isCreating: boolean) {
    super(app);
    this.initialShape = app.getShape(id, app.currentPageId);
    this.currentPageId = app.currentPageId;
    this.isCreating = isCreating;
    this.initialSelectedIds = [...app.selectedIds];
  }

  start = (): TkdrawPatch | undefined => void null;

  update = (): TkdrawPatch | undefined => void null;

  cancel = (): TkdrawPatch | undefined => {
    return {
      document: {
        pages: {
          [this.currentPageId]: {
            shapes: {
              [this.initialShape.id]: this.isCreating
                ? undefined
                : this.initialShape,
            },
          },
        },
        pageStates: {
          [this.currentPageId]: {
            selectedIds: this.isCreating ? [] : this.initialSelectedIds,
            editingId: undefined,
          },
        },
      },
    };
  };

  complete = (): TkdrawPatch | TkdrawCommand | undefined => {
    const shape = this.app.getShape(this.initialShape.id);

    return {
      id: 'edit',
      before: {
        document: {
          pages: {
            [this.currentPageId]: {
              shapes: {
                [this.initialShape.id]: this.isCreating
                  ? undefined
                  : this.initialShape,
              },
            },
          },
          pageStates: {
            [this.currentPageId]: {
              selectedIds: this.isCreating ? [] : this.initialSelectedIds,
              editingId: undefined,
            },
          },
        },
      },
      after: {
        document: {
          pages: {
            [this.currentPageId]: {
              shapes: {
                [this.initialShape.id]: shape,
              },
            },
          },
          pageStates: {
            [this.currentPageId]: {
              selectedIds: [shape.id],
              editingId: undefined,
            },
          },
        },
      },
    };
  };
}
