import { TldrawTestApp, mockDocument } from '~test';
import { SessionType, TKShapeType, TKStatus } from '~types';

describe('Handle session', () => {
  it('begins, updateSession', () => {
    const app = new TldrawTestApp()
      .loadDocument(mockDocument)
      .createShapes({
        id: 'arrow1',
        type: TKShapeType.Arrow,
      })
      .select('arrow1')
      .movePointer([-10, -10])
      .startSession(SessionType.Arrow, 'arrow1', 'end')
      .movePointer([10, 10])
      .completeSession();

    expect(app.status).toBe(TKStatus.Idle);

    app.undo().redo();
  });

  it('cancels session', () => {
    const app = new TldrawTestApp()
      .loadDocument(mockDocument)
      .createShapes({
        type: TKShapeType.Arrow,
        id: 'arrow1',
      })
      .select('arrow1')
      .movePointer([-10, -10])
      .startSession(SessionType.Arrow, 'arrow1', 'end')
      .movePointer([10, 10])
      .cancelSession();

    expect(app.getShape('rect1').point).toStrictEqual([0, 0]);
  });
});
