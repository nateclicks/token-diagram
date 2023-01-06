import * as React from 'react';
import { useIntl } from 'react-intl';
import { ToolButton } from '~components/Primitives/ToolButton';
import { Tooltip } from '~components/Primitives/Tooltip';
import { TrashIcon } from '~components/Primitives/icons';
import { useTkdrawApp } from '~hooks';

export function DeleteButton() {
  const app = useTkdrawApp();
  const intl = useIntl();

  const handleDelete = React.useCallback(() => {
    app.delete();
  }, [app]);

  const hasSelection = app.useStore(
    (s) =>
      s.appState.status === 'idle' &&
      s.document.pageStates[s.appState.currentPageId].selectedIds.length > 0
  );

  return (
    <Tooltip
      label={intl.formatMessage({ id: 'delete' })}
      kbd="⌫"
      id="TK-Delete"
    >
      <ToolButton
        variant="circle"
        disabled={!hasSelection}
        onSelect={handleDelete}
      >
        <TrashIcon />
      </ToolButton>
    </Tooltip>
  );
}
