import type {
  TLAsset,
  TLBinding,
  TLBoundsCorner,
  TLBoundsEdge,
  TLBoundsEventHandler,
  TLBoundsHandleEventHandler,
  TLCanvasEventHandler,
  TLHandle,
  TLKeyboardEventHandler,
  TLPage,
  TLPageState,
  TLPinchEventHandler,
  TLPointerEventHandler,
  TLShape,
  TLShapeBlurHandler,
  TLShapeCloneHandler,
  TLSnapLine,
  TLUser,
  TLWheelEventHandler,
} from '@tldraw/core';
import { TKLanguage } from '~translations';

export interface TokenFile {
  name: string;
  fileHandle: FileSystemFileHandle | null;
  document: TokenDocument;
  assets: Record<string, unknown>;
}

export type TkdrawPatch = Patch<TKSnapshot>;

export type TkdrawCommand = Command<TKSnapshot>;

export interface TokenDocument {
  id: string;
  name: string;
  version: number;
  pages: Record<string, TKPage>;
  pageStates: Record<string, TLPageState>;
  assets: TKAssets;
}

/* -------------------------------------------------- */
/*                         App                        */
/* -------------------------------------------------- */

// A base class for all classes that handle events from the Renderer,
// including TKApp and all Tools.
export class TKEventHandler {
  onPinchStart?: TLPinchEventHandler;
  onPinchEnd?: TLPinchEventHandler;
  onPinch?: TLPinchEventHandler;
  onKeyDown?: TLKeyboardEventHandler;
  onKeyUp?: TLKeyboardEventHandler;
  onPointerMove?: TLPointerEventHandler;
  onPointerUp?: TLPointerEventHandler;
  onPan?: TLWheelEventHandler;
  onZoom?: TLWheelEventHandler;
  onPointerDown?: TLPointerEventHandler;
  onPointCanvas?: TLCanvasEventHandler;
  onDoubleClickCanvas?: TLCanvasEventHandler;
  onRightPointCanvas?: TLCanvasEventHandler;
  onDragCanvas?: TLCanvasEventHandler;
  onReleaseCanvas?: TLCanvasEventHandler;
  onPointShape?: TLPointerEventHandler;
  onDoubleClickShape?: TLPointerEventHandler;
  onRightPointShape?: TLPointerEventHandler;
  onDragShape?: TLPointerEventHandler;
  onHoverShape?: TLPointerEventHandler;
  onUnhoverShape?: TLPointerEventHandler;
  onReleaseShape?: TLPointerEventHandler;
  onPointBounds?: TLBoundsEventHandler;
  onDoubleClickBounds?: TLBoundsEventHandler;
  onRightPointBounds?: TLBoundsEventHandler;
  onDragBounds?: TLBoundsEventHandler;
  onHoverBounds?: TLBoundsEventHandler;
  onUnhoverBounds?: TLBoundsEventHandler;
  onReleaseBounds?: TLBoundsEventHandler;
  onPointBoundsHandle?: TLBoundsHandleEventHandler;
  onDoubleClickBoundsHandle?: TLBoundsHandleEventHandler;
  onRightPointBoundsHandle?: TLBoundsHandleEventHandler;
  onDragBoundsHandle?: TLBoundsHandleEventHandler;
  onHoverBoundsHandle?: TLBoundsHandleEventHandler;
  onUnhoverBoundsHandle?: TLBoundsHandleEventHandler;
  onReleaseBoundsHandle?: TLBoundsHandleEventHandler;
  onPointHandle?: TLPointerEventHandler;
  onDoubleClickHandle?: TLPointerEventHandler;
  onRightPointHandle?: TLPointerEventHandler;
  onDragHandle?: TLPointerEventHandler;
  onHoverHandle?: TLPointerEventHandler;
  onUnhoverHandle?: TLPointerEventHandler;
  onReleaseHandle?: TLPointerEventHandler;
  onShapeBlur?: TLShapeBlurHandler;
  onShapeClone?: TLShapeCloneHandler;
}

// The shape of a single page in the Tldraw document
export type TKPage = TLPage<TKShape, TKBinding>;

// A partial of a TKPage, used for commands / patches
export type PagePartial = {
  shapes: Patch<TKPage['shapes']>;
  bindings: Patch<TKPage['bindings']>;
};

// The meta information passed to TKShapeUtil components
export interface TKMeta {
  isDarkMode: boolean;
}

// The type of info given to shapes when transforming
export interface TransformInfo<T extends TLShape> {
  type: TLBoundsEdge | TLBoundsCorner;
  initialShape: T;
  scaleX: number;
  scaleY: number;
  transformOrigin: number[];
}

/* -------------------------------------------------- */
/*                       Shapes                       */
/* -------------------------------------------------- */

export enum TKShapeType {
  Sticky = 'sticky',
  Ellipse = 'ellipse',
  Rectangle = 'rectangle',
  Triangle = 'triangle',
  Draw = 'draw',
  Arrow = 'arrow',
  Line = 'line',
  Text = 'text',
  Group = 'group',
  Image = 'image',
  Video = 'video',
}

export enum Decoration {
  Arrow = 'arrow',
}
export interface TKBaseShape extends TLShape {
  style: ShapeStyles;
  type: TKShapeType;
  label?: string;
  handles?: Record<string, TKHandle>;
}

export interface DrawShape extends TKBaseShape {
  type: TKShapeType.Draw;
  points: number[][];
  isComplete: boolean;
}

// The extended handle (used for arrows)
export interface TKHandle extends TLHandle {
  canBind?: boolean;
  bindingId?: string;
}

export interface RectangleShape extends TKBaseShape {
  type: TKShapeType.Rectangle;
  size: number[];
  label?: string;
  labelPoint?: number[];
}

export interface EllipseShape extends TKBaseShape {
  type: TKShapeType.Ellipse;
  radius: number[];
  label?: string;
  labelPoint?: number[];
}

export interface TriangleShape extends TKBaseShape {
  type: TKShapeType.Triangle;
  size: number[];
  label?: string;
  labelPoint?: number[];
}

// The shape created with the arrow tool
export interface ArrowShape extends TKBaseShape {
  type: TKShapeType.Arrow;
  bend: number;
  handles: {
    start: TKHandle;
    bend: TKHandle;
    end: TKHandle;
  };
  decorations?: {
    start?: Decoration;
    end?: Decoration;
    middle?: Decoration;
  };
  label?: string;
  labelPoint?: number[];
}

export interface ArrowBinding extends TLBinding {
  handleId: keyof ArrowShape['handles'];
  distance: number;
  point: number[];
}

export type TKBinding = ArrowBinding;

export interface ImageShape extends TKBaseShape {
  type: TKShapeType.Image;
  size: number[];
  assetId: string;
}

export interface VideoShape extends TKBaseShape {
  type: TKShapeType.Video;
  size: number[];
  assetId: string;
  isPlaying: boolean;
  currentTime: number;
}

// The shape created by the text tool
export interface TextShape extends TKBaseShape {
  type: TKShapeType.Text;
  text: string;
}

// The shape created by the sticky tool
export interface StickyShape extends TKBaseShape {
  type: TKShapeType.Sticky;
  size: number[];
  text: string;
}

// The shape created when multiple shapes are grouped
export interface GroupShape extends TKBaseShape {
  type: TKShapeType.Group;
  size: number[];
  children: string[];
}

// A union of all shapes
export type TKShape =
  | RectangleShape
  | EllipseShape
  | TriangleShape
  | DrawShape
  | ArrowShape
  | TextShape
  | GroupShape
  | StickyShape
  | ImageShape
  | VideoShape;

export type TKDockPosition = 'bottom' | 'left' | 'right' | 'top';

// The shape of the TkdrawApp's React (zustand) store
export interface TKSnapshot {
  settings: {
    isCadSelectMode: boolean;
    isDarkMode: boolean;
    isDebugMode: boolean;
    isPenMode: boolean;
    isReadonlyMode: boolean;
    isZoomSnap: boolean;
    keepStyleMenuOpen: boolean;
    nudgeDistanceSmall: number;
    nudgeDistanceLarge: number;
    isFocusMode: boolean;
    isSnapping: boolean;
    showRotateHandles: boolean;
    showBindingHandles: boolean;
    showCloneHandles: boolean;
    showGrid: boolean;
    dockPosition: TKDockPosition;
    language: TKLanguage;
    exportBackground: TKExportBackground;
  };
  appState: {
    currentStyle: ShapeStyles;
    currentPageId: string;
    hoveredId?: string;
    activeTool: TKToolType;
    isToolLocked: boolean;
    isEmptyCanvas: boolean;
    isMenuOpen: boolean;
    status: string;
    snapLines: TLSnapLine[];
    eraseLine: number[][];
    isLoading: boolean;
    disableAssets: boolean;
    selectByContain?: boolean;
  };
  document: TokenDocument;
  room?: {
    id: string;
    userId: string;
    users: Record<string, TKUser>;
  };
}

// The status of a TDUser
export enum TKUserStatus {
  Idle = 'idle',
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected',
}

// A TDUser, for multiplayer rooms
export interface TKUser extends TLUser {
  activeShapes: TKShape[];
  status: TKUserStatus;
  session?: boolean;
}

export enum SessionType {
  Transform = 'transform',
  Translate = 'translate',
  TransformSingle = 'transformSingle',
  Brush = 'brush',
  Arrow = 'arrow',
  Draw = 'draw',
  Erase = 'erase',
  Rotate = 'rotate',
  Handle = 'handle',
  Grid = 'grid',
  Edit = 'edit',
}

export enum TKStatus {
  Idle = 'idle',
  PointingHandle = 'pointingHandle',
  PointingBounds = 'pointingBounds',
  PointingBoundsHandle = 'pointingBoundsHandle',
  TranslatingLabel = 'translatingLabel',
  TranslatingHandle = 'translatingHandle',
  Translating = 'translating',
  Transforming = 'transforming',
  Rotating = 'rotating',
  Pinching = 'pinching',
  Brushing = 'brushing',
  Creating = 'creating',
  EditingText = 'editing-text',
}

export type TKToolType =
  | 'select'
  | 'erase'
  | TKShapeType.Text
  | TKShapeType.Draw
  | TKShapeType.Ellipse
  | TKShapeType.Rectangle
  | TKShapeType.Triangle
  | TKShapeType.Line
  | TKShapeType.Arrow
  | TKShapeType.Sticky;

export type Easing =
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInOutSine'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo';

export enum MoveType {
  Backward = 'backward',
  Forward = 'forward',
  ToFront = 'toFront',
  ToBack = 'toBack',
}

export enum AlignType {
  Top = 'top',
  CenterVertical = 'centerVertical',
  Bottom = 'bottom',
  Left = 'left',
  CenterHorizontal = 'centerHorizontal',
  Right = 'right',
}

export enum StretchType {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export enum DistributeType {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export enum FlipType {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

/* ------------------ Shape Styles ------------------ */
export type Theme = 'dark' | 'light';

export enum ColorStyle {
  White = 'white',
  LightGray = 'lightGray',
  Gray = 'gray',
  Black = 'black',
  Green = 'green',
  Cyan = 'cyan',
  Blue = 'blue',
  Indigo = 'indigo',
  Violet = 'violet',
  Red = 'red',
  Orange = 'orange',
  Yellow = 'yellow',
}

export enum SizeStyle {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum DashStyle {
  Draw = 'draw',
  Solid = 'solid',
  Dashed = 'dashed',
  Dotted = 'dotted',
}

export enum FontSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  ExtraLarge = 'extraLarge',
}

export enum AlignStyle {
  Start = 'start',
  Middle = 'middle',
  End = 'end',
  Justify = 'justify',
}

export enum FontStyle {
  Script = 'script',
  Sans = 'sans',
  Serif = 'serif',
  Mono = 'mono',
}

export type ShapeStyles = {
  color: ColorStyle;
  size: SizeStyle;
  dash: DashStyle;
  font?: FontStyle;
  textAlign?: AlignStyle;
  isFilled?: boolean;
  scale?: number;
};

export enum TKAssetType {
  Image = 'image',
  Video = 'video',
}

export interface TKImageAsset extends TLAsset {
  type: TKAssetType.Image;
  fileName: string;
  src: string;
  size: number[];
}

export interface TKVideoAsset extends TLAsset {
  type: TKAssetType.Video;
  fileName: string;
  src: string;
  size: number[];
}

export type TKAsset = TKImageAsset | TKVideoAsset;

export type TKAssets = Record<string, TKAsset>;
/* -------------------------------------------------- */
/*                    Export                          */
/* -------------------------------------------------- */

export enum TKExportType {
  PNG = 'png',
  JPG = 'jpeg',
  WEBP = 'webp',
  SVG = 'svg',
  JSON = 'json',
}

export interface TKExport {
  name: string;
  type: string;
  blob: Blob;
}

export enum TKExportBackground {
  Transparent = 'transparent',
  Auto = 'auto',
  Light = 'light',
  Dark = 'dark',
}

/* -------------------------------------------------- */
/*                    Type Helpers                    */
/* -------------------------------------------------- */

export type ParametersExceptFirst<F> = F extends (
  arg0: any,
  ...rest: infer R
) => any
  ? R
  : never;

export type ExceptFirst<T extends unknown[]> = T extends [any, ...infer U]
  ? U
  : never;

export type ExceptFirstTwo<T extends unknown[]> = T extends [
  any,
  any,
  ...infer U
]
  ? U
  : never;

export type PropsOfType<U> = {
  [K in keyof TKShape]: TKShape[K] extends any
    ? TKShape[K] extends U
      ? K
      : never
    : never;
}[keyof TKShape];

export type Difference<A, B, C = A> = A extends B ? never : C;

export type Intersection<A, B, C = A> = A extends B ? C : never;

export type FilteredKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

export type RequiredKeys<T> = {
  [K in keyof T]-?: Difference<Record<string, unknown>, Pick<T, K>, K>;
}[keyof T];

export type MembersWithRequiredKey<T, U> = {
  [P in keyof T]: Intersection<U, RequiredKeys<T[P]>, T[P]>;
}[keyof T];

export type MappedByType<U extends string, T extends { type: U }> = {
  [P in T['type']]: T extends any ? (P extends T['type'] ? T : never) : never;
};

export type ShapesWithProp<U> = MembersWithRequiredKey<
  MappedByType<TKShapeType, TKShape>,
  U
>;

export type Patch<T> = Partial<{ [P in keyof T]: Patch<T[P]> }>;

export interface Command<T extends { [key: string]: any }> {
  id?: string;
  before: Patch<T>;
  after: Patch<T>;
}
