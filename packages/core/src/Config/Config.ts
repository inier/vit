import { existsSync } from 'fs';
import { extname, join } from 'path';
import {
  compatESModuleRequire,
  deepmerge,
  cleanRequireCache,
  lodash,
  parseRequireDeps,
  winPath,
} from '@umijs/utils';

interface IOpts {
  cwd: string;
  configFiles?: string[];
}

const DEFAULT_CONFIG_FILES = ['.vitrc.ts', '.vitrc.js', 'config/config.ts', 'config/config.js'];

// TODO:
// 1. custom config file
export default class Config {
  cwd: string;
  config?: object;
  configFile?: string | null;
  configFiles = DEFAULT_CONFIG_FILES;

  constructor(opts: IOpts) {
    this.cwd = opts.cwd || process.cwd();

    if (Array.isArray(opts.configFiles)) {
      // 配置的优先读取
      this.configFiles = lodash.uniq(opts.configFiles.concat(this.configFiles));
    }
  }

  getConfig({ defaultConfig }: { defaultConfig: object }) {
    const userConfig = this.getUserConfig();
    // 用于提示用户哪些 key 是未定义的
    // TODO: 考虑不排除 false 的 key
    const userConfigKeys = Object.keys(userConfig).filter((key) => {
      return userConfig[key] !== false;
    });

    if (userConfigKeys.length) {
      const keys = userConfigKeys.length > 1 ? 'keys' : 'key';
      throw new Error(`Invalid config ${keys}: ${userConfigKeys.join(', ')}`);
    }

    return userConfig;
  }

  getUserConfig() {
    const configFile = this.getConfigFile();
    this.configFile = configFile;
    if (configFile) {
      let envConfigFile;
      const files = [configFile, envConfigFile]
        .filter((f): f is string => !!f)
        .map((f) => join(this.cwd, f))
        .filter((f) => existsSync(f));

      // clear require cache and set babel register
      const requireDeps = files.reduce((memo: string[], file) => {
        memo = memo.concat(parseRequireDeps(file));
        return memo;
      }, []);
      requireDeps.forEach(cleanRequireCache);

      // require config and merge
      return this.mergeConfig(...this.requireConfigs(files));
    } else {
      return {};
    }
  }

  addAffix(file: string, affix: string) {
    const ext = extname(file);
    return file.replace(new RegExp(`${ext}$`), `.${affix}${ext}`);
  }

  requireConfigs(configFiles: string[]) {
    return configFiles.map((f) => compatESModuleRequire(require(f)));
  }

  mergeConfig(...configs: object[]) {
    let ret = {};
    for (const config of configs) {
      // TODO: 精细化处理，比如处理 dotted config key
      ret = deepmerge(ret, config);
    }
    return ret;
  }

  getConfigFile(): string | null {
    // TODO: support custom config file
    const configFile = this.configFiles.find((f) => existsSync(join(this.cwd, f)));
    return configFile ? winPath(configFile) : null;
  }
}
