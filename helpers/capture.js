const scrs = require('screenshot-desktop');

function capture() {
    return scrs({format: 'png'});
}

module.exports = { capture }