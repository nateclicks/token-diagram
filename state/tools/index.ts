import { TKShapeType, TKToolType } from '~types';
import { ArrowTool } from './ArrowTool';
import { DrawTool } from './DrawTool';
import { EllipseTool } from './EllipseTool';
import { EraseTool } from './EraseTool';
import { LineTool } from './LineTool';
import { RectangleTool } from './RectangleTool';
import { SelectTool } from './SelectTool';
import { StickyTool } from './StickyTool';
import { TextTool } from './TextTool';
import { TriangleTool } from './TriangleTool';

export interface ToolsMap {
  select: typeof SelectTool;
  erase: typeof EraseTool;
  [TKShapeType.Text]: typeof TextTool;
  [TKShapeType.Draw]: typeof DrawTool;
  [TKShapeType.Ellipse]: typeof EllipseTool;
  [TKShapeType.Rectangle]: typeof RectangleTool;
  [TKShapeType.Triangle]: typeof TriangleTool;
  [TKShapeType.Line]: typeof LineTool;
  [TKShapeType.Arrow]: typeof ArrowTool;
  [TKShapeType.Sticky]: typeof StickyTool;
}

export type ToolOfType<K extends TKToolType> = ToolsMap[K];

export type ArgsOfType<K extends TKToolType> = ConstructorParameters<
  ToolOfType<K>
>;

export const tools: { [K in TKToolType]: ToolsMap[K] } = {
  select: SelectTool,
  erase: EraseTool,
  [TKShapeType.Text]: TextTool,
  [TKShapeType.Draw]: DrawTool,
  [TKShapeType.Ellipse]: EllipseTool,
  [TKShapeType.Rectangle]: RectangleTool,
  [TKShapeType.Triangle]: TriangleTool,
  [TKShapeType.Line]: LineTool,
  [TKShapeType.Arrow]: ArrowTool,
  [TKShapeType.Sticky]: StickyTool,
};
