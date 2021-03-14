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

    static log(msg) {
        if (window.o_global.debug.status().activated) {
            console.log(msg);
        }
    }

    static warn(msg) {
        if (console.warn && window.o_global.debug.status().activated) {
            console.warn(msg);
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