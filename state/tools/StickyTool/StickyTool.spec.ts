import { TkdrawApp } from '~state';
import { StickyTool } from '.';

describe('StickyTool', () => {
  it('creates tool', () => {
    const app = new TkdrawApp();
    new StickyTool(app);
  });
});
