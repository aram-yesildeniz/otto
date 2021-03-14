export class ExternalContentLoader {

    loadAllContent() {
        let allExternalContentWidgets = document.getElementsByClassName("promo_staticcontent-widget--diu-room-url");

        [].forEach.call(allExternalContentWidgets, item => {
            if (item.getAttribute("data-tracked") !== "true") {
                item.setAttribute("data-tracked", "true");
                const container = item.parentElement;

                let url = item.getAttribute("data-url");
                o_util.ajax({
                    "url": url,
                    "method": "GET",
                    "headers": {
                        "accept": "text/html"
                    }
                })
                    .then(response => {
                        if (response.status === 200) {
                            const docFragment = o_util.dom.stringToDocumentFragment(response.responseText);
                            if (docFragment !== undefined) {
                                item.appendChild(docFragment);
                                window.o_util.hardcore.executeInlineScripts(item);
                                window.o_promo_staticcontent.trackView(container);
                            }
                        }
                    });
            }
        })

    }

}
