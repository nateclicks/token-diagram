import * as React from 'react';
import type { TkdrawApp } from '~state';
import { DialogState } from './useDialog';

export function useFileSystem() {
  const onNewProject = React.useCallback(
    async (
      app: TkdrawApp,
      openDialog: (
        dialogState: DialogState,
        onYes: () => Promise<void>,
        onNo: () => Promise<void>,
        onCancel: () => Promise<void>
      ) => void
    ) => {
      openDialog(
        app.fileSystemHandle ? 'saveFirstTime' : 'saveAgain',
        async () => {
          // user pressed yes
          try {
            await app.saveProject();
            app.newProject();
          } catch (e) {
            // noop
          }
        },
        async () => {
          // user pressed no
          app.newProject();
        },
        async () => {
          // user pressed cancel
        }
      );
    },
    []
  );

  const onOpenProject = React.useCallback(
    async (
      app: TkdrawApp,
      openDialog: (
        dialogState: DialogState,
        onYes: () => Promise<void>,
        onNo: () => Promise<void>,
        onCancel: () => Promise<void>
      ) => void
    ) => {
      openDialog(
        app.fileSystemHandle ? 'saveFirstTime' : 'saveAgain',
        async () => {
          // user pressed yes
          try {
            await app.saveProject();
            await app.openProject();
          } catch (e) {
            // noop
          }
        },
        async () => {
          // user pressed no
          app.openProject();
        },
        async () => {
          // user pressed cancel
        }
      );
    },
    []
  );

  const onSaveProject = React.useCallback((app: TkdrawApp) => {
    app.saveProject();
  }, []);

  const onSaveProjectAs = React.useCallback((app: TkdrawApp) => {
    app.saveProjectAs();
  }, []);

  // const onOpenMedia = React.useCallback(async (app: TkdrawApp) => {
  //   app.openAsset?.();
  // }, []);

  return {
    onNewProject,
    onSaveProject,
    onSaveProjectAs,
    onOpenProject,
    // onOpenMedia,
  };
}
