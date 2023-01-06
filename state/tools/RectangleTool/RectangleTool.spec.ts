import { TkdrawApp } from '~state';
import { RectangleTool } from '.';

describe('RectangleTool', () => {
  it('creates tool', () => {
    const app = new TkdrawApp();
    new RectangleTool(app);
  });
});
