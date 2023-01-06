import { TkdrawApp } from '~state';
import { ArrowTool } from '.';

describe('ArrowTool', () => {
  it('creates tool', () => {
    const app = new TkdrawApp();
    new ArrowTool(app);
  });
});
