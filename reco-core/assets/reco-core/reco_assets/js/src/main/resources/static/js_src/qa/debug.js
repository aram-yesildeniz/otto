/* eslint camelcase: "off" */
'use strict';

const log = (message, ...objects) => {
    if (o_global &&
        o_global.debug &&
        o_global.debug.status &&
        o_global.debug.status().activated === true) {
        // this is debugging code - console.log is the point here!
        // eslint-disable-next-line no-console
        console.log(message, objects);
    }
};

module.exports = {
    log
};