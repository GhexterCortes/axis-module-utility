const supportedVersions = require('./supportedVersions.json');

module.exports = function(version) {
    const find = supportedVersions.find(v => v.versions.includes(version));
    if(!find) return false;

    return find;
}