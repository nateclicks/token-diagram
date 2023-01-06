import { render } from '@testing-library/react';
import * as React from 'react';
import { TkdrawContext, useKeyboardShortcuts } from '~hooks';
import { TkdrawApp } from '~state';
import { mockDocument } from './mockDocument';

export const Wrapper = ({ children }: { children: any }) => {
  const [app] = React.useState(() => new TkdrawApp());
  const [context] = React.useState(() => {
    return app;
  });

  const rWrapper = React.useRef<HTMLDivElement>(null);

  useKeyboardShortcuts(rWrapper);

  React.useEffect(() => {
    if (!document) return;
    app.loadDocument(mockDocument);
  }, [document, app]);

  return (
    <TkdrawContext.Provider value={context}>
      <div ref={rWrapper}>{children}</div>
    </TkdrawContext.Provider>
  );
};

export const renderWithContext = (children: React.ReactNode) => {
  return render(<Wrapper>{children}</Wrapper>);
};
