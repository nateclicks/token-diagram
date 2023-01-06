import { TkdrawApp } from '~state';
import { LineTool } from '.';

describe('LineTool', () => {
  it('creates tool', () => {
    const app = new TkdrawApp();
    new LineTool(app);
  });
});
