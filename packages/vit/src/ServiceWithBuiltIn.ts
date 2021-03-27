import { dirname } from 'path';
import { IServiceOptions, Service as CoreService } from '@vitjs/core';

class Service extends CoreService {
  constructor(options: IServiceOptions) {
    process.env.UMI_VERSION = require('../package').version;
    process.env.UMI_DIR = dirname(require.resolve('../package'));

    super({
      ...options,
      presets: [require.resolve('@vitjs/preset-built-in'), ...(options.presets || [])],
    });
  }
}

export { Service };
