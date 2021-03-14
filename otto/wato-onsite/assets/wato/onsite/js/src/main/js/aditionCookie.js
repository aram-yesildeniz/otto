const TEN_YEARS = 10 * 365;

class AditionCookie {
    fetchAndSetAndGet(currentHostname) {
        if (!o_util.cookie.exists('cb') || o_util.cookie.get('cb') === '0') {
            return Promise.resolve("")
        }

        return o_util.ajax({
            "url": "https://static.adfarm1.adition.com/cn.sjs",
            "method": "GET",
            "withCredentials": true
        }).then((responseAdition) => {
            return responseAdition.responseText || "";
        }).then((aditionUserId) => {
            return aditionUserId.trim();
        }).then((aditionUserId) => {
            var domain = currentHostname.split('.');
            domain = domain.splice(domain.length - 2).join('.');
            o_util.cookie.set('aditionUserId', aditionUserId, {domain: domain, days: '' + TEN_YEARS, samesite: 'None'});
            return aditionUserId;
        });
    }
}

export {AditionCookie};