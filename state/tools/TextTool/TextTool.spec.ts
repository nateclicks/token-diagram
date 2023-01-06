import { TkdrawApp } from '~state';
import { TextTool } from '.';

describe('TextTool', () => {
  it('creates tool', () => {
    const app = new TkdrawApp();
    new TextTool(app);
  });
});
