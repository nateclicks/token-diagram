import { TkdrawApp } from '~state';
import { EllipseTool } from '.';

describe('EllipseTool', () => {
  it('creates tool', () => {
    const app = new TkdrawApp();
    new EllipseTool(app);
  });
});
