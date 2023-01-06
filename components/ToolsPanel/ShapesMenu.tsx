import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CircleIcon, SquareIcon, VercelLogoIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Panel } from '~components/Primitives/Panel';
import { ToolButton } from '~components/Primitives/ToolButton';
import { Tooltip } from '~components/Primitives/Tooltip';
import { LineIcon } from '~components/Primitives/icons';
import { useTkdrawApp } from '~hooks';
import { TKShapeType, TKSnapshot, TKToolType } from '~types';

interface ShapesMenuProps {
  activeTool: TKToolType;
  isToolLocked: boolean;
}

type ShapeShape =
  | TKShapeType.Rectangle
  | TKShapeType.Ellipse
  | TKShapeType.Triangle;
// | TKShapeType.Line;

const shapeShapes: ShapeShape[] = [
  TKShapeType.Rectangle,
  TKShapeType.Ellipse,
  TKShapeType.Triangle,
  // TKShapeType.Line,
];

const shapeShapeIcons = {
  [TKShapeType.Rectangle]: <SquareIcon />,
  [TKShapeType.Ellipse]: <CircleIcon />,
  [TKShapeType.Triangle]: <VercelLogoIcon />,
  // [TKShapeType.Line]: <LineIcon />,
};

const dockPositionState = (s: TKSnapshot) => s.settings.dockPosition;

export const ShapesMenu = React.memo(function ShapesMenu({
  activeTool,
  isToolLocked,
}: ShapesMenuProps) {
  const app = useTkdrawApp();
  const intl = useIntl();

  const dockPosition = app.useStore(dockPositionState);

  const [lastActiveTool, setLastActiveTool] = React.useState<ShapeShape>(
    TKShapeType.Rectangle
  );

  React.useEffect(() => {
    if (
      shapeShapes.includes(activeTool as ShapeShape) &&
      lastActiveTool !== activeTool
    ) {
      setLastActiveTool(activeTool as ShapeShape);
    }
  }, [activeTool]);

  const selectShapeTool = React.useCallback(() => {
    app.selectTool(lastActiveTool);
  }, [activeTool, app]);

  const handleDoubleClick = React.useCallback(() => {
    app.toggleToolLock();
  }, [app]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ') {
        if (app.shiftKey) {
          e.preventDefault();
        }
      }
    },
    []
  );

  const isActive = shapeShapes.includes(activeTool as ShapeShape);
  const contentSide =
    dockPosition === 'bottom' || dockPosition === 'top' ? 'top' : dockPosition;

  const panelStyle =
    dockPosition === 'bottom' || dockPosition === 'top' ? 'row' : 'column';

  return (
    <DropdownMenu.Root dir="ltr" onOpenChange={selectShapeTool}>
      <DropdownMenu.Trigger dir="ltr" asChild id="TK-PrimaryTools-Shapes">
        <ToolButton
          disabled={isActive && app.shiftKey} // otherwise this continuously opens and closes on "SpacePanning"
          variant="primary"
          onDoubleClick={handleDoubleClick}
          isToolLocked={isActive && isToolLocked}
          isActive={isActive}
          onKeyDown={handleKeyDown}
        >
          {shapeShapeIcons[lastActiveTool]}
        </ToolButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content asChild side={contentSide} sideOffset={12}>
        <Panel side="center" style={{ flexDirection: panelStyle }}>
          {shapeShapes.map((shape, i) => (
            <Tooltip
              key={shape}
              label={intl.formatMessage({ id: shape })}
              kbd={(4 + i).toString()}
              id={`TK-PrimaryTools-Shapes-${shape}`}
            >
              <DropdownMenu.Item asChild>
                <ToolButton
                  variant="primary"
                  onClick={() => {
                    app.selectTool(shape);
                    setLastActiveTool(shape);
                  }}
                >
                  {shapeShapeIcons[shape]}
                </ToolButton>
              </DropdownMenu.Item>
            </Tooltip>
          ))}
        </Panel>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
});
