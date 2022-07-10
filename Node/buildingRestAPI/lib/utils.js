const utils = {};

utils.typeString = function( data ) {
    return typeof data === 'string';
}

utils.lengthGreaterThan = function( data, len ) {
    return data.length > len;
}

module.exports = utils;
