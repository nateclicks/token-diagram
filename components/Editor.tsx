import { Tldraw, TldrawApp, TldrawProps, useFileSystem } from "@tldraw/tldraw";
import * as React from "react";
// import { useUploadAssets } from '~hooks/useUploadAssets'
// import * as gtag from '~utils/gtag'

declare const window: Window & { app: TldrawApp };

interface EditorProps {
  id?: string;
}

const Editor = ({
  id = "home",
  ...rest
}: EditorProps & Partial<TldrawProps>) => {
  const handleMount = React.useCallback((app: TldrawApp) => {
    window.app = app;
  }, []);
  const fileSystemEvents = useFileSystem();

  return (
    <div className="tldraw">
      <Tldraw id={id} onMount={handleMount} {...fileSystemEvents} {...rest} />
    </div>
  );
};

export default Editor;
