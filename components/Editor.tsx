// import {TldrawApp, TldrawProps, useFileSystem } from '@tldraw/tldraw'
import * as React from 'react';
import { useFileSystem } from '~hooks';
import { TkdrawApp } from '~state';
import { Tkdraw, TkdrawProps } from '~Tkdraw';
// import { useUploadAssets } from '~hooks/useUploadAssets'
// import * as gtag from '~utils/gtag'
// import { BetaNotification } from './BetaNotification'

declare const window: Window & { app: TkdrawApp };

interface EditorProps {
  id?: string;
}

const Editor = ({
  id = 'home',
  ...rest
}: EditorProps & Partial<TkdrawProps>) => {
  const handleMount = React.useCallback((app: TkdrawApp) => {
    window.app = app;
  }, []);

  // Send events to gtag as actions.
  // const handlePersist = React.useCallback((_app: TldrawApp, reason?: string) => {
  //   gtag.event({
  //     action: reason ?? '',
  //     category: 'editor',
  //     label: reason ?? 'persist',
  //     value: 0,
  //   })
  // }, [])

  const fileSystemEvents = useFileSystem();

  // const { onAssetUpload } = useUploadAssets()

  return (
    <div className="tkdraw">
      <Tkdraw
        id={id}
        autofocus
        onMount={handleMount}
        // onPersist={handlePersist}
        // onAssetUpload={onAssetUpload}
        {...fileSystemEvents}
        {...rest}
      />
      {/* <BetaNotification /> */}
    </div>
  );
};

export default Editor;
