import { existsSync, readFileSync } from "fs";
import * as supportedVersions from '../supported-versions.json';

export function isAxisDir(dir: string = './'): boolean {
    let pkgJson: any = existsSync(dir + '/package.json');
    if (!pkgJson) return false;

    pkgJson = JSON.parse(readFileSync(dir + '/package.json', 'utf8'));
    if (!pkgJson.name || pkgJson.name.toLowerCase() !== 'axis') return false;

    return true;
}

export function isSupportedVersion(dir: string = './'): boolean {
    const axisDir = isAxisDir(dir);
    if (!axisDir) return false;

    const pkgJson = JSON.parse(readFileSync(dir + '/package.json', 'utf8'));
    if (!pkgJson.version) return false;

    return supportedVersions.some(elm => elm.versions.some(v => v === pkgJson.version));
}