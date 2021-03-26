import { IRoute } from '..';

type WithFalse<T> = {
  [P in keyof T]?: T[P] | false;
};

export interface BaseConfig {
  singular?: boolean;
  title?: string;
  routes?: IRoute[];
  exportStatic?: boolean;
}

export type IConfig = WithFalse<BaseConfig>;
