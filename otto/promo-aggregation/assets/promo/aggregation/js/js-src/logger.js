export class Logger {
    /* eslint no-console: "off" */

    static group(title) {
        if (window.o_global.debug.status().activated) {
            console.group(title)
        }
    }

    static groupEnd() {
        if (window.o_global.debug.status().activated) {
            console.groupEnd()
        }
    }

    static log(msg) {
        if (window.o_global.debug.status().activated) {
            console.log(msg);
        }
    }

    static info(msg, ...optionalParams) {
        if (window.o_global.debug.status().activated) {
            console.info(msg, optionalParams);
        }
    }

    static warn(msg, ...optionalParams) {
        if (window.o_global.debug.status().activated) {
            console.warn(msg, optionalParams);
        }
    }

    static table(table) {
        if (window.o_global.debug.status().activated) {
            console.table(table);
        }
    }

    static count(label) {
        if (window.o_global.debug.status().activated) {
            console.count(label);
        }
    }

}