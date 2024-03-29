import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { MenuContent } from '~components/Primitives/MenuContent';
import { RowButton } from '~components/Primitives/RowButton';
import { useTkdrawApp } from '~hooks';
import { styled } from '~styles';
import type { TKSnapshot } from '~types';

const isEmptyCanvasSelector = (s: TKSnapshot) => {
  return (
    s.appState.isEmptyCanvas &&
    Object.keys(s.document.pages[s.appState.currentPageId].shapes).length > 0
  );
};

const isDebugModeSelector = (s: TKSnapshot) => s.settings.isDebugMode;
const dockPositionState = (s: TKSnapshot) => s.settings.dockPosition;

export const BackToContent = React.memo(function BackToContent() {
  const app = useTkdrawApp();

  const isEmptyCanvas = app.useStore(isEmptyCanvasSelector);
  const dockPosition = app.useStore(dockPositionState);
  const isDebugMode = app.useStore(isDebugModeSelector);

  const style = {
    bottom:
      dockPosition === 'bottom' && isDebugMode
        ? 120
        : dockPosition === 'bottom'
        ? 80
        : isDebugMode
        ? 60
        : 20,
    left: '50%',
    transform: 'translate(-50%,0)',
  };

  if (!isEmptyCanvas) return null;

  return (
    <BackToContentContainer id="TK-Tools-Back_to_content" style={{ ...style }}>
      <RowButton onClick={app.zoomToContent}>
        <FormattedMessage id="zoom.to.content" />
      </RowButton>
    </BackToContentContainer>
  );
});

const BackToContentContainer = styled(MenuContent, {
  pointerEvents: 'all',
  width: 'fit-content',
  minWidth: 0,
  position: 'fixed',
  bottom: 0,
});
