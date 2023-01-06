import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  AlignBottomIcon,
  AlignCenterHorizontallyIcon,
  AlignCenterVerticallyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  AlignTopIcon,
  AngleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  AspectRatioIcon,
  BoxIcon,
  CopyIcon,
  DotsHorizontalIcon,
  GroupIcon,
  LockClosedIcon,
  LockOpen1Icon,
  PinBottomIcon,
  PinTopIcon,
  RotateCounterClockwiseIcon,
  SpaceEvenlyHorizontallyIcon,
  SpaceEvenlyVerticallyIcon,
  StretchHorizontallyIcon,
  StretchVerticallyIcon,
} from '@radix-ui/react-icons';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Divider } from '~components/Primitives/Divider';
import { DMContent } from '~components/Primitives/DropdownMenu';
import { ToolButton } from '~components/Primitives/ToolButton';
import { Tooltip } from '~components/Primitives/Tooltip/Tooltip';
import { useTkdrawApp } from '~hooks';
import { styled } from '~styles';
import { AlignType, DistributeType, StretchType, TKSnapshot } from '~types';

const dockPositionState = (s: TKSnapshot) => s.settings.dockPosition;

const selectedShapesCountSelector = (s: TKSnapshot) =>
  s.document.pageStates[s.appState.currentPageId].selectedIds.length;

const isAllLockedSelector = (s: TKSnapshot) => {
  const page = s.document.pages[s.appState.currentPageId];
  const { selectedIds } = s.document.pageStates[s.appState.currentPageId];
  return selectedIds.every((id) => page.shapes[id].isLocked);
};

const isAllAspectLockedSelector = (s: TKSnapshot) => {
  const page = s.document.pages[s.appState.currentPageId];
  const { selectedIds } = s.document.pageStates[s.appState.currentPageId];
  return selectedIds.every((id) => page.shapes[id].isAspectRatioLocked);
};

const isAllGroupedSelector = (s: TKSnapshot) => {
  const page = s.document.pages[s.appState.currentPageId];
  const selectedShapes = s.document.pageStates[
    s.appState.currentPageId
  ].selectedIds.map((id) => page.shapes[id]);

  return selectedShapes.every(
    (shape) =>
      shape.children !== undefined ||
      (shape.parentId === selectedShapes[0].parentId &&
        selectedShapes[0].parentId !== s.appState.currentPageId)
  );
};

const hasSelectionSelector = (s: TKSnapshot) => {
  const { selectedIds } = s.document.pageStates[s.appState.currentPageId];
  return selectedIds.length > 0;
};

const hasMultipleSelectionSelector = (s: TKSnapshot) => {
  const { selectedIds } = s.document.pageStates[s.appState.currentPageId];
  return selectedIds.length > 1;
};

export function ActionButton() {
  const app = useTkdrawApp();
  const intl = useIntl();

  const isAllLocked = app.useStore(isAllLockedSelector);

  const isAllAspectLocked = app.useStore(isAllAspectLockedSelector);

  const isAllGrouped = app.useStore(isAllGroupedSelector);

  const hasSelection = app.useStore(hasSelectionSelector);

  const hasMultipleSelection = app.useStore(hasMultipleSelectionSelector);

  const selectedShapesCount = app.useStore(selectedShapesCountSelector);

  const dockPosition = app.useStore(dockPositionState);

  const hasTwoOrMore = selectedShapesCount > 1;

  const hasThreeOrMore = selectedShapesCount > 2;

  const handleRotate = React.useCallback(() => {
    app.rotate();
  }, [app]);

  const handleDuplicate = React.useCallback(() => {
    app.duplicate();
  }, [app]);

  const handleToggleLocked = React.useCallback(() => {
    app.toggleLocked();
  }, [app]);

  const handleToggleAspectRatio = React.useCallback(() => {
    app.toggleAspectRatioLocked();
  }, [app]);

  const handleGroup = React.useCallback(() => {
    app.group();
  }, [app]);

  const handleMoveToBack = React.useCallback(() => {
    app.moveToBack();
  }, [app]);

  const handleMoveBackward = React.useCallback(() => {
    app.moveBackward();
  }, [app]);

  const handleMoveForward = React.useCallback(() => {
    app.moveForward();
  }, [app]);

  const handleMoveToFront = React.useCallback(() => {
    app.moveToFront();
  }, [app]);

  const handleResetAngle = React.useCallback(() => {
    app.setShapeProps({ rotation: 0 });
  }, [app]);

  const alignTop = React.useCallback(() => {
    app.align(AlignType.Top);
  }, [app]);

  const alignCenterVertical = React.useCallback(() => {
    app.align(AlignType.CenterVertical);
  }, [app]);

  const alignBottom = React.useCallback(() => {
    app.align(AlignType.Bottom);
  }, [app]);

  const stretchVertically = React.useCallback(() => {
    app.stretch(StretchType.Vertical);
  }, [app]);

  const distributeVertically = React.useCallback(() => {
    app.distribute(DistributeType.Vertical);
  }, [app]);

  const alignLeft = React.useCallback(() => {
    app.align(AlignType.Left);
  }, [app]);

  const alignCenterHorizontal = React.useCallback(() => {
    app.align(AlignType.CenterHorizontal);
  }, [app]);

  const alignRight = React.useCallback(() => {
    app.align(AlignType.Right);
  }, [app]);

  const stretchHorizontally = React.useCallback(() => {
    app.stretch(StretchType.Horizontal);
  }, [app]);

  const distributeHorizontally = React.useCallback(() => {
    app.distribute(DistributeType.Horizontal);
  }, [app]);

  const handleMenuOpenChange = React.useCallback(
    (open: boolean) => {
      app.setMenuOpen(open);
    },
    [app]
  );

  const contentSide =
    dockPosition === 'bottom' || dockPosition === 'top' ? 'top' : dockPosition;

  return (
    <DropdownMenu.Root dir="ltr" onOpenChange={handleMenuOpenChange}>
      <DropdownMenu.Trigger dir="ltr" asChild id="TK-Tools-Dots">
        <ToolButton variant="circle">
          <DotsHorizontalIcon />
        </ToolButton>
      </DropdownMenu.Trigger>
      <DMContent sideOffset={16} side={contentSide}>
        <>
          <ButtonsRow>
            <Tooltip
              label={intl.formatMessage({ id: 'duplicate' })}
              kbd={`#D`}
              id="TK-Tools-Copy"
            >
              <ToolButton disabled={!hasSelection} onClick={handleDuplicate}>
                <CopyIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'rotate' })}
              id="TK-Tools-Rotate"
            >
              <ToolButton disabled={!hasSelection} onClick={handleRotate}>
                <RotateCounterClockwiseIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({
                id: isAllLocked ? 'unlock' : 'lock',
              })}
              kbd={`#L`}
              id="TK-Tools-Lock"
            >
              <ToolButton disabled={!hasSelection} onClick={handleToggleLocked}>
                {isAllLocked ? <LockClosedIcon /> : <LockOpen1Icon />}
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({
                id: isAllAspectLocked
                  ? 'unlock.aspect.ratio'
                  : 'lock.aspect.ratio',
              })}
              id="TK-Tools-AspectRatio"
            >
              <ToolButton
                disabled={!hasSelection}
                onClick={handleToggleAspectRatio}
              >
                {isAllAspectLocked ? <AspectRatioIcon /> : <BoxIcon />}
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'group' })}
              kbd={`#G`}
              id="TK-Tools-Group"
            >
              <ToolButton
                disabled={
                  !hasSelection || (!isAllGrouped && !hasMultipleSelection)
                }
                onClick={handleGroup}
              >
                <GroupIcon />
              </ToolButton>
            </Tooltip>
          </ButtonsRow>
          <ButtonsRow>
            <Tooltip
              label={intl.formatMessage({ id: 'move.to.back' })}
              kbd={`#⇧[`}
              id="TK-Tools-PinBottom"
            >
              <ToolButton disabled={!hasSelection} onClick={handleMoveToBack}>
                <PinBottomIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'move.backward' })}
              kbd={`#[`}
              id="TK-Tools-ArrowDown"
            >
              <ToolButton disabled={!hasSelection} onClick={handleMoveBackward}>
                <ArrowDownIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'move.forward' })}
              kbd={`#]`}
              id="TK-Tools-ArrowUp"
            >
              <ToolButton disabled={!hasSelection} onClick={handleMoveForward}>
                <ArrowUpIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'move.to.front' })}
              kbd={`#⇧]`}
              id="TK-Tools-PinTop"
            >
              <ToolButton disabled={!hasSelection} onClick={handleMoveToFront}>
                <PinTopIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'reset.angle' })}
              id="TK-Tools-ResetAngle"
            >
              <ToolButton disabled={!hasSelection} onClick={handleResetAngle}>
                <AngleIcon />
              </ToolButton>
            </Tooltip>
          </ButtonsRow>
          <Divider />
          <ButtonsRow>
            <Tooltip
              label={intl.formatMessage({ id: 'align.left' })}
              id="TK-Tools-AlignLeft"
            >
              <ToolButton disabled={!hasTwoOrMore} onClick={alignLeft}>
                <AlignLeftIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'align.center.x' })}
              id="TK-Tools-AlignCenterHorizontal"
            >
              <ToolButton
                disabled={!hasTwoOrMore}
                onClick={alignCenterHorizontal}
              >
                <AlignCenterHorizontallyIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'align.right' })}
              id="TK-Tools-AlignRight"
            >
              <ToolButton disabled={!hasTwoOrMore} onClick={alignRight}>
                <AlignRightIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'stretch.x' })}
              id="TK-Tools-StretchHorizontal"
            >
              <ToolButton
                disabled={!hasTwoOrMore}
                onClick={stretchHorizontally}
              >
                <StretchHorizontallyIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'distribute.x' })}
              id="TK-Tools-SpaceEvenlyHorizontal"
            >
              <ToolButton
                disabled={!hasThreeOrMore}
                onClick={distributeHorizontally}
              >
                <SpaceEvenlyHorizontallyIcon />
              </ToolButton>
            </Tooltip>
          </ButtonsRow>
          <ButtonsRow>
            <Tooltip
              label={intl.formatMessage({ id: 'align.top' })}
              id="TK-Tools-AlignTop"
            >
              <ToolButton disabled={!hasTwoOrMore} onClick={alignTop}>
                <AlignTopIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'align.center.y' })}
              id="TK-Tools-AlignCenterVertical"
            >
              <ToolButton
                disabled={!hasTwoOrMore}
                onClick={alignCenterVertical}
              >
                <AlignCenterVerticallyIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'align.bottom' })}
              id="TK-Tools-AlignBottom"
            >
              <ToolButton disabled={!hasTwoOrMore} onClick={alignBottom}>
                <AlignBottomIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'stretch.y' })}
              id="TK-Tools-StretchVertical"
            >
              <ToolButton disabled={!hasTwoOrMore} onClick={stretchVertically}>
                <StretchVerticallyIcon />
              </ToolButton>
            </Tooltip>
            <Tooltip
              label={intl.formatMessage({ id: 'distribute.y' })}
              id="TK-Tools-SpaceEvenlyVertical"
            >
              <ToolButton
                disabled={!hasThreeOrMore}
                onClick={distributeVertically}
              >
                <SpaceEvenlyVerticallyIcon />
              </ToolButton>
            </Tooltip>
          </ButtonsRow>
        </>
      </DMContent>
    </DropdownMenu.Root>
  );
}

export const ButtonsRow = styled('div', {
  position: 'relative',
  display: 'flex',
  width: '100%',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  outline: 'none',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: 0,
});
