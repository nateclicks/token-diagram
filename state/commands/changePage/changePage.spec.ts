import { TkdrawTestApp, mockDocument } from '~test';

describe('Change page command', () => {
  const app = new TkdrawTestApp();

  it('does, undoes and redoes command', () => {
    app.loadDocument(mockDocument);

    const initialId = app.page.id;

    app.createPage();

    const nextId = app.page.id;

    app.changePage(initialId);

    expect(app.page.id).toBe(initialId);

    app.changePage(nextId);

    expect(app.page.id).toBe(nextId);

    app.undo();

    expect(app.page.id).toBe(initialId);

    app.redo();

    expect(app.page.id).toBe(nextId);
  });
});
