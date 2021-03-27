import { UserConfig } from 'vite';

import { IRoute } from '..';

type WithFalse<T> = {
  [P in keyof T]?: T[P] | false;
};

export interface BaseConfig extends UserConfig {
  routes?: IRoute[];
  exportStatic?: boolean;
}

export type IConfig = WithFalse<BaseConfig>;
