import { TkdrawTestApp, mockDocument } from '~test';
import { TKStatus } from '~types';

describe('Draw session', () => {
  it('begins, updates, completes session', () => {
    const app = new TkdrawTestApp().loadDocument(mockDocument);

    app.selectTool('erase').pointCanvas([300, 300]);

    expect(app.status).toBe('pointing');

    app.movePointer([0, 0]);

    expect(app.status).toBe('erasing');

    app.stopPointing();

    expect(app.appState.status).toBe(TKStatus.Idle);

    expect(app.shapes.length).toBe(0);
  });

  it('does, undoes and redoes', () => {
    const app = new TkdrawTestApp()
      .loadDocument(mockDocument)
      .selectTool('erase')
      .pointCanvas([300, 300])
      .movePointer([0, 0])
      .stopPointing();

    expect(app.shapes.length).toBe(0);

    app.undo();

    expect(app.shapes.length).toBe(3);

    app.redo();

    expect(app.shapes.length).toBe(0);
  });
});
