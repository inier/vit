import { readdirSync } from 'fs';
import { join } from 'path';

// runtime must build before renderer-react
const headPkgs = ['runtime', 'core'];
const tailPkgs = ['vit'];
const otherPkgs = readdirSync(join(__dirname, 'packages')).filter(
  (pkg) => pkg.charAt(0) !== '.' && !headPkgs.includes(pkg) && !tailPkgs.includes(pkg)
);

export default {
  target: 'node',
  cjs: { type: 'babel', lazy: true },
  disableTypeCheck: true,
  pkgs: [...headPkgs, ...otherPkgs, ...tailPkgs],
};
