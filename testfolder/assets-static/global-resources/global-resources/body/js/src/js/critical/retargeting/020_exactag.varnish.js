/**
 * @license Exactag Varnish Script v0.8.9
 * | Copyright 2015 Otto (GmbH & Co KG), 22172 HAMBURG
 * | http://www.otto.com
 * | Date: 2015-02-19
 */

/* jslint browser:true, plusplus:true, todo: true, devel:true */
/* global o_util */

window.o_global = window.o_global || {};
window.lhotse = window.lhotse || {};

lhotse.exactag = lhotse.exactag || {};
lhotse.exactag.centralFinished = false;
lhotse.exactag.finished = false;
lhotse.exactag.execute = true;

// Varnish-Objekt
lhotse.exactag.varnish = {
  version: "0.8.9",
  data: []
};

// * * *
// Beispiel für die Ausgabe eines Includes:
// ```
// lhotse.exactag.varnish.data.push({"ag":"3","cs":"BK"});
// ```
// Hinweis:
// Es sollte in Hinsicht auf die Minimierung von Globalen das neue Objekt
// stets direkt in die push-Methode geschrieben werden
// * * *
// Mikro-Optimierung: window lokale Variable
(function(win) {
  "use strict";

  var host = win.location.host,
    env = win.location.protocol + "//" + host,
    varnishURL =
      lhotse.exactag.varnishURL ||
      env + "/shoppages-exactag/getPerformanceMarketingData.js",
    firstChar = varnishURL.substring(0, 1),
    hash = win.location.hash,
    variationId = "",
    EMERGENCY_PXC_TOGGLE = "EMR_PXC",
    // Regulärer Ausdruck zum Auffinden der 'variationId' in der URL
    re = new RegExp(/variationId=([a-zA-Z0-9_\-]*)/);

  // Wenn eine ```variationId``` gefunden wurde,
  // dann erstellen wir daraus einen Parameter für den Ajax-Call
  if (re.test(hash)) {
    variationId = "?variationId=" + hash.match(re)[1];
  }

  // Ajax-Call mit Übergabe des ```variationId```-Parameters (falls vorhanden)
  lhotse.exactag.getVarnishData = function(url) {
    o_util.ajax.getScript(url).then(function(xhr) {
      // Method getScript contains no error-handling, so the
      // returning xhr object has to be checked manually for valid status code.
      if (xhr.status === 200 || xhr.status === 304) {
        //! Methode bei erfolgreichem Response
        // Festlegen, dass der Ajax-Call erfolgreich beendet wurde
        lhotse.exactag.finished = true;

        // Wenn in der 'exactag.central.js' die Vorprüfung auf 'varnish'-Daten abgeschlossen ist,
        // dann rufe die eigentlich Track-Methode zur weiteren Verarbeitung des Data-Objekts auf
        if (lhotse.exactag.centralFinished) {
          lhotse.exactag.continueTrack();
        }
      } else {
        //! Methode bei fehlerhaftem Ajax-Call
        var msg =
          "Triggered ajaxError handler in '" +
          varnishURL +
          "'! Status: " +
          xhr.status;

        // Ausgabe der Fehlermeldung
        if (win.console) {
          console.log(msg);
        }
      }
    });
  };

  const execute = ()=>{
    // (Sicherheits-)Check auf relativen Pfad beim Vorhandensein der 'lhotse.exactag.varnishURL'-Variable
    if (lhotse.exactag.varnishURL) {
      if (firstChar === "." || firstChar === "/") {
        lhotse.exactag.getVarnishData(varnishURL);
      }
    } else {
      lhotse.exactag.getVarnishData(varnishURL + variationId);
    }
  }

  lhotse.exactag.onLoad = function() {
    // If main toggle is switched off, abort init
    if (
      !o_util.toggle.get(EMERGENCY_PXC_TOGGLE, true) ||
      o_util.misc.isPreview(win.location.href) ||
      !o_util.cookie.get("cb") ||
      o_util.cookie.get("cb") === "0"
    ) {
      lhotse.exactag.execute = false;
    }
    execute();
  };

  window.o_global.eventQBus.on('ft4.cookie-banner.consentAccepted',()=>{
    lhotse.exactag.execute = true;
    execute();
  });

  o_global.eventLoader.onLoad(21, function() {
    lhotse.exactag.onLoad();
  });
})(window);
