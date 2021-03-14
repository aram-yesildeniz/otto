const KEY = "inShoppingProcess";
const DURATION_IN_MINUTES = 30;

class ShoppingProcess {
    constructor(utils) {
        this.utils = utils;
    }

    enterShoppingProcess() {
        const visitorId = o_util.cookie.get("visitorId");
        if (visitorId) {
            const entry = JSON.stringify({"visitorId": visitorId, "timeStamp": this.utils.getCurrentTimeStamp()});
            try {
                localStorage.setItem(KEY, entry);
            } catch (err) {
                this.utils.warn("enterShoppingProcess:", err);
            }
        }
    }

    leaveShoppingProcess() {
        try {
            localStorage.removeItem(KEY);
        } catch (err) {
            this.utils.warn("leaveShoppingProcess:", err);
        }
    }

    isInShoppingProcess() {
        try {
            const visitorId = o_util.cookie.get("visitorId");
            const statusEntry = localStorage.getItem(KEY);
            if (visitorId && statusEntry) {
                const status = JSON.parse(statusEntry);
                const expiration = new Date(status.timeStamp);
                expiration.setMinutes(expiration.getMinutes() + DURATION_IN_MINUTES);
                if (visitorId === status.visitorId && expiration.getTime() > this.utils.getCurrentTimeStamp()) {
                    return true;
                }
            }
        } catch (err) {
            this.utils.warn("isInShoppingProcess:", err);
        }
        return false;
    }
}

export {ShoppingProcess};
