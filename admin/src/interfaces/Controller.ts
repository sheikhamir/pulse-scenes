export interface Controller {
  id: number;
  label: string;
  handle: string | number;
  type: string;
  pageId: number;
  active: boolean;
  current_value: string | number;
  source: Source[];
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
}

export interface Source {
  label: string;
  value: number | string;
  active: boolean;
}

export interface LiveControllers {
  [key: string]: string | number;
}
