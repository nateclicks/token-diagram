import { TkdrawApp } from '~state';
import { TriangleTool } from '.';

describe('TriangleTool', () => {
  it('creates tool', () => {
    const app = new TkdrawApp();
    new TriangleTool(app);
  });
});
