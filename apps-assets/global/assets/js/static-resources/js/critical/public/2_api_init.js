window.o_apps = window.o_apps_init({
        'document': document,
        'httpRequest': function () {
            return new XMLHttpRequest
        },
        'eventQBus': window.o_global.eventQBus,
        'appsAndroid': window.o_apps_android,
        'htmlLocation': window.location,
        'lhotseExactag': window.lhotse.exactag,
        'exactag': window.exactag,
        'userAgent': navigator.userAgent,
        'webkitMessageHandlers': window.webkit ? window.webkit.messageHandlers : null,
        'firebaseEventNameKey': 'event_name',
        'firebaseParameterKey': {
                'kFIRParameterItemID': "item_id",
                'kFIRParameterItemName': "item_name",
                'kFIRParameterItemCategory': "item_category",
                'kFIRParameterQuantity': "quantity"
        }
    }
);
