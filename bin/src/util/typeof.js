module.exports = (data) => {
    switch(typeof data) {
        case 'string':
            return data;
        case 'number':
            return data;
        case 'bigint':
            return 'number';
        case 'boolean':
            return data;
        case 'object':
            return false;
        case 'function':
            return false;
        case 'undefined':
            return false;
        default:
            return false;
    }
}