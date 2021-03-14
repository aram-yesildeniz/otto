export class Logger {
    /* eslint no-console: "off" */

    static group(title) {
        if (window.o_global.debug.status().activated) {
            if (console.group) {
                console.group(title);
            }
        }
    }

    static groupEnd() {
        if (window.o_global.debug.status().activated) {
            if (console.groupEnd) {
                console.groupEnd();
            }
        }
    }

    static log(msg, params = {}) {
        if (window.o_global.debug.status().activated) {
            console.log(`[karma-assortment]: ${msg}`, params);
        }
    }

    static warn(msg, params = {}) {
        if (console.warn && window.o_global.debug.status().activated) {
            console.warn(`[karma-assortment]: ${msg}`, params);
        }
    }

    static error(msg, params = {}) {
        if (console.error && window.o_global.debug.status().activated) {
            console.error(`[karma-assortment]: ${msg}`, params);
        }
    }

    static table(table) {
        if (window.o_global.debug.status().activated) {
            if (console.table) console.table(table);
        }
    }

    static count(label) {
        if (window.o_global.debug.status().activated) {
            if (console.count) console.count(label);
        }
    }

}