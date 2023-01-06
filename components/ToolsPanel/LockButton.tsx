import { LockClosedIcon, LockOpen1Icon } from '@radix-ui/react-icons';
import * as React from 'react';
import { ToolButton } from '~components/Primitives/ToolButton';
import { Tooltip } from '~components/Primitives/Tooltip';
import { useTkdrawApp } from '~hooks';
import type { TKSnapshot } from '~types';

const isToolLockedSelector = (s: TKSnapshot) => s.appState.isToolLocked;

export function LockButton() {
  const app = useTkdrawApp();

  const isToolLocked = app.useStore(isToolLockedSelector);

  return (
    <Tooltip label="Lock Tool" kbd="7" id="TK-Lock">
      <ToolButton
        variant="circle"
        isActive={isToolLocked}
        onSelect={app.toggleToolLock}
      >
        {isToolLocked ? <LockClosedIcon /> : <LockOpen1Icon />}
      </ToolButton>
    </Tooltip>
  );
}
