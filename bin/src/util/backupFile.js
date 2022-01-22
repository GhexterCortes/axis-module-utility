const fs = require('fs');

module.exports = (file) => {
    const original = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file+'.old', original)

    if(fs.existsSync(file+'.old')) return true;

    return false;
};