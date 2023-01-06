import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DMContent, DMItem } from '~components/Primitives/DropdownMenu';
import { ToolButton } from '~components/Primitives/ToolButton';
import { preventEvent } from '~components/preventEvent';
import { useTkdrawApp } from '~hooks';
import { styled } from '~styles';
import type { TKSnapshot } from '~types';

const zoomSelector = (s: TKSnapshot) =>
  s.document.pageStates[s.appState.currentPageId].camera.zoom;

export const ZoomMenu = function ZoomMenu() {
  const app = useTkdrawApp();

  const zoom = app.useStore(zoomSelector);

  return (
    <DropdownMenu.Root dir="ltr">
      <DropdownMenu.Trigger dir="ltr" asChild id="TK-Zoom">
        <FixedWidthToolButton onDoubleClick={app.resetZoom} variant="text">
          {Math.round(zoom * 100)}%
        </FixedWidthToolButton>
      </DropdownMenu.Trigger>
      <DMContent align="end">
        <DMItem
          onSelect={preventEvent}
          onClick={app.zoomIn}
          kbd="#+"
          id="TK-Zoom-Zoom_In"
        >
          <FormattedMessage id="zoom.in" />
        </DMItem>
        <DMItem
          onSelect={preventEvent}
          onClick={app.zoomOut}
          kbd="#−"
          id="TK-Zoom-Zoom_Out"
        >
          <FormattedMessage id="zoom.out" />
        </DMItem>
        <DMItem
          onSelect={preventEvent}
          onClick={app.resetZoom}
          kbd="⇧0"
          id="TK-Zoom-Zoom_To_100%"
        >
          <FormattedMessage id="zoom.to" /> 100%
        </DMItem>
        <DMItem
          onSelect={preventEvent}
          onClick={app.zoomToFit}
          kbd="⇧1"
          id="TK-Zoom-To_Fit"
        >
          <FormattedMessage id="zoom.to.fit" />
        </DMItem>
        <DMItem
          onSelect={preventEvent}
          onClick={app.zoomToSelection}
          kbd="⇧2"
          id="TK-Zoom-To_Selection"
        >
          <FormattedMessage id="zoom.to.selection" />
        </DMItem>
      </DMContent>
    </DropdownMenu.Root>
  );
};

const FixedWidthToolButton = styled(ToolButton, {
  minWidth: 56,
});
