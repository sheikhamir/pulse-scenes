export interface LegacyController {
  id?: number|string;
  label?: string;
  handle?: string | number;
  type?: string;
  pageId?: number;
  active?: boolean;
  current_value?: string | number;
  source?: Source[];
  areaId?: number;
  regionId?: number;
  floorId?: number;
  min?: number;
  max?: number;
  vertical?: boolean;
  width?: string;
  height?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  labelPosition?: string;
  labelJustify?: string;
  childLeft?: string;
  more?: number;
  setValue?: string | number;
  toggleValue?: string | number;
  showPercentage?: boolean;
  labelTag?: string;
  toggle?: boolean;
  noMeter?: boolean;
  selected?: boolean;
  class?: string;
  icon?: string;
  css?: string;
  targetPage?: string | number;
  _draft?: boolean;
}

export interface Source {
  label: string;
  value: number | string;
  active: boolean;
}

export interface LiveControllers {
  [key: string]: string | number;
}

// This is for anything relate to flex boxes
interface FlexBoxWrapper {
  flexDirection: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap: 'nowrap' | 'wrap';
  alignContent: 'center' | 'flex-start' | 'flex-end' | 'space-around' | 'space-between' | 'stretch';
  justifyContent: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
}
// This is for dimensions
interface Dimensions {
  width: number | string;
  height: number | string;
}
// This is for item position
interface Position {
  top: number | string;
  left: number | string;
}
// This is for admin app only
interface Selected {
  selected?: boolean;
}
// This is the base controller
interface BaseController extends Dimensions, Position, Selected {
  id: number | string;
  type: string;
  pageId: number;
  css: string;
  cssClass: string;
  active: boolean;
}
// Below interfaces are for all specific controllers
export interface Image extends BaseController {
  type: 'image';
  srcType: 'local' | 'external';
  value: string;
  objectFit: string;
}
export interface Page extends BaseController {
  type: 'page';
  targetPage: string;
  title: string;
}
export interface Label extends BaseController, FlexBoxWrapper {
  type: 'label';
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
  textAlign?: string;
  value: string;
}
export interface Icon extends BaseController {
  type: 'icon';
  value: string;
}
/**
 * Syncable components
 * These components can be connected to the device with a web-socket connection.
 * All of these components have a "handle" property used to point to the
 * resource of the DSP.
**/
export interface Fader extends BaseController {
  type: 'fader';
  handle: number | string;
  min: number;
  max: number;
  vertical: boolean;
  current_value: number;
}
export interface Meter extends BaseController {
  type: 'meter';
  handle: number | string;
  min: number;
  max: number;
  vertical: boolean;
  current_value: number;
}
export interface Button extends BaseController {
  type: 'button';
  label: string;
  handle: number | string;
  toggle: boolean; // Checks if button is toggle button
  toggleValue?: number | string; // The toggle value if toggle is true
  setValue: number | string; // The main set value
  current_value: number | string; // The current value of the handle
}
export interface Text extends BaseController {
  type: 'text';
  handle: number | string;
  operation: number | string;
  label: string;
  labelPosition: 'left' | 'top' | 'right' | 'bottom';
}
export interface CSS {
  css: string;
  pageId: number;
}
// For simple usage
// export type Controller = Image | Page | Label | Icon | Fader | Meter | Button | Text;
export interface Controller {
  id: number;
  type: string;
  pageId: number;
  css: string;
  cssClass: string;
  active: boolean;
  width: number | string;
  height: number | string;
  top: number | string;
  left: number | string;

  // Image properties
  srcType?: string; // Options: local | external
  value?: string;
  objectFit?: string;

  // Page properties
  targetPage?: string;
  title?: string;

  // Label and flex properties
  // Flex properties
  flexDirection?: string;
  flexWrap?: string;
  alignContent?: string;
  justifyContent?: string;
  alignItems?: string;
  // Label properties
  tag?: string;
  textAlign?: string;
  // value: 'Label', // Matches with page value

  // Icon properties
  // value: '', // Matches with page and label value

  // Fader properties
  handle?: number;
  min?: number;
  max?: number;
  vertical?: boolean;
  current_value?: number;

  // Meter properties
  // Same as fader

  // Button properties
  // handle
  toggle?: boolean;
  toggleValue?: number;
  setValue?: number | string;
  // current_value: 0
  label?: string;

  // Text properties
  operation?: string;
  // label: 'Text'
  labelPosition?: string;
  selected?: boolean;
}
