import { TkdrawApp } from '~state';
import oldDoc from '~test/documents/old-doc';
import oldDoc2 from '~test/documents/old-doc-2';
import type { TokenDocument } from '~types';

describe('When migrating bindings', () => {
  it('migrates a document without a version', () => {
    new TkdrawApp().loadDocument(oldDoc as unknown as TokenDocument);
  });

  it('migrates a document with an older version', () => {
    const app = new TkdrawApp().loadDocument(
      oldDoc2 as unknown as TokenDocument
    );
    expect(
      app.getShape('d7ab0a49-3cb3-43ae-3d83-f5cf2f4a510a').style.color
    ).toBe('black');
  });
});
