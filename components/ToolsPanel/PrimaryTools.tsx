import {
  ArrowTopRightIcon,
  CursorArrowIcon,
  ImageIcon,
  Pencil1Icon,
  Pencil2Icon,
  TextIcon,
} from '@radix-ui/react-icons';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Panel } from '~components/Primitives/Panel';
import { ToolButtonWithTooltip } from '~components/Primitives/ToolButton';
import { EraserIcon } from '~components/Primitives/icons';
import { breakpoints } from '~components/breakpoints';
import { useTkdrawApp } from '~hooks';
import { styled } from '~styles/stitches.config';
import { TKShapeType, TKSnapshot } from '~types';
import { ShapesMenu } from './ShapesMenu';

const activeToolSelector = (s: TKSnapshot) => s.appState.activeTool;
const toolLockedSelector = (s: TKSnapshot) => s.appState.isToolLocked;
const dockPositionState = (s: TKSnapshot) => s.settings.dockPosition;

export const PrimaryTools = React.memo(function PrimaryTools() {
  const app = useTkdrawApp();
  const intl = useIntl();

  const activeTool = app.useStore(activeToolSelector);

  const isToolLocked = app.useStore(toolLockedSelector);
  const dockPosition = app.useStore(dockPositionState);

  const selectSelectTool = React.useCallback(() => {
    app.selectTool('select');
  }, [app]);

  const selectEraseTool = React.useCallback(() => {
    app.selectTool('erase');
  }, [app]);

  const selectDrawTool = React.useCallback(() => {
    app.selectTool(TKShapeType.Draw);
  }, [app]);

  const selectArrowTool = React.useCallback(() => {
    app.selectTool(TKShapeType.Arrow);
  }, [app]);

  const selectTextTool = React.useCallback(() => {
    app.selectTool(TKShapeType.Text);
  }, [app]);

  const selectStickyTool = React.useCallback(() => {
    app.selectTool(TKShapeType.Sticky);
  }, [app]);

  const uploadMedias = React.useCallback(async () => {
    app.openAsset();
  }, [app]);

  const panelStyle =
    dockPosition === 'bottom' || dockPosition === 'top' ? 'row' : 'column';

  return (
    <StyledPanel
      side="center"
      id="TK-PrimaryTools"
      style={{ flexDirection: panelStyle }}
      bp={breakpoints}
    >
      <ToolButtonWithTooltip
        kbd={'1'}
        label={intl.formatMessage({ id: 'select' })}
        onClick={selectSelectTool}
        isActive={activeTool === 'select'}
        id="TK-PrimaryTools-CursorArrow"
      >
        <CursorArrowIcon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'2'}
        label={intl.formatMessage({ id: 'draw' })}
        onClick={selectDrawTool}
        isActive={activeTool === TKShapeType.Draw}
        id="TK-PrimaryTools-Pencil"
      >
        <Pencil1Icon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'3'}
        label={intl.formatMessage({ id: 'eraser' })}
        onClick={selectEraseTool}
        isActive={activeTool === 'erase'}
        id="TK-PrimaryTools-Eraser"
      >
        <EraserIcon />
      </ToolButtonWithTooltip>
      <ShapesMenu activeTool={activeTool} isToolLocked={isToolLocked} />
      <ToolButtonWithTooltip
        kbd={'8'}
        label={intl.formatMessage({ id: 'arrow' })}
        onClick={selectArrowTool}
        isLocked={isToolLocked}
        isActive={activeTool === TKShapeType.Arrow}
        id="TK-PrimaryTools-ArrowTopRight"
      >
        <ArrowTopRightIcon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'9'}
        label={intl.formatMessage({ id: 'text' })}
        onClick={selectTextTool}
        isLocked={isToolLocked}
        isActive={activeTool === TKShapeType.Text}
        id="TK-PrimaryTools-Text"
      >
        <TextIcon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'0'}
        label={intl.formatMessage({ id: 'sticky' })}
        onClick={selectStickyTool}
        isActive={activeTool === TKShapeType.Sticky}
        id="TK-PrimaryTools-Pencil2"
      >
        <Pencil2Icon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        label={intl.formatMessage({ id: 'image' })}
        onClick={uploadMedias}
        id="TK-PrimaryTools-Image"
      >
        <ImageIcon />
      </ToolButtonWithTooltip>
    </StyledPanel>
  );
});

const StyledPanel = styled(Panel, {
  variants: {
    bp: {
      mobile: {
        padding: '$0',
        borderRadius: '10px',
      },
      small: {
        padding: '$2',
      },
    },
  },
});
