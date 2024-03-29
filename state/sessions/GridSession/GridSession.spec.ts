import { TkdrawTestApp, mockDocument } from '~test';
import { TKStatus } from '~types';

describe('Grid session', () => {
  it('begins, updateSession', () => {
    const app = new TkdrawTestApp()
      .loadDocument(mockDocument)
      .select('rect1')
      .pointShape('rect1', [5, 5])
      .movePointer([10, 10]);

    expect(app.getShape('rect1').point).toStrictEqual([5, 5]);

    app.completeSession();

    expect(app.appState.status).toBe(TKStatus.Idle);

    expect(app.getShape('rect1').point).toStrictEqual([5, 5]);

    app.undo();

    expect(app.getShape('rect1').point).toStrictEqual([0, 0]);

    app.redo();

    expect(app.getShape('rect1').point).toStrictEqual([5, 5]);
  });

  it('cancels session', () => {
    const app = new TkdrawTestApp()
      .loadDocument(mockDocument)
      .select('rect1', 'rect2')
      .pointBounds([5, 5])
      .movePointer([10, 10])
      .cancelSession();

    expect(app.getShape('rect1').point).toStrictEqual([0, 0]);
  });
});
