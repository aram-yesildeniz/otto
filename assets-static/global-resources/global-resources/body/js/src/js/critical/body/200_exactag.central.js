/**
 * @license Exactag Central Script v0.8.8
 * | Copyright 2015 Otto (GmbH & Co KG), 22172 HAMBURG
 * | http://www.otto.com
 * | Date: 2015-01-26
 */

/*jslint browser:true, plusplus:true, todo: true, devel:true*/
/*global exactag:true, lhotse */

// * * *
// Mikro-Optimierung: window als lokale Variable
window.o_global = window.o_global || {};
window.o_util = window.o_util || {};

(function (win) {
  "use strict";

  try {
    // Überprüfung erforderlicher Objekte
    win.exactag = win.exactag || {};
    win.lhotse = win.lhotse || {};
    win.lhotse.exactag = win.lhotse.exactag || {};

    // Shortcuts
    var loc = win.location;
    var consentPartnerMap = {
      39: "xad", // Adition
      40: "xaa", // Active Agent
      44: "xta",  // The Adex
      755: "xgr", // Google Remarketing
      759: "xrj" // Revjet
    }

    // Erweiterung des 'lhotse.exactag'-Objekts
    o_util.core.extend(win.lhotse.exactag, {
      version: "0.8.7",
      // In Debug-Modus schalten, wenn Hash oder Cookie gefunden wird
      debug:
        loc.href.indexOf("#debug") > -1 ||
        o_util.cookie.get("debug") === "true",
      // In Benchmark-Modus schalten, wenn Hash oder Cookie gefunden wird
      benchmark:
        loc.href.indexOf("#benchmark") > -1 ||
        o_util.cookie.get("PartnerPixelBenchmark") === "PixelBenchmark=true",
      // Opt-Out-Modus (Flag für exactag-Objekt)
      OptOutMode: false,
      // Tracking-Opt-Out-Modus (Flag für exactag-Objekt)
      trackingOptOutMode: false,
      // QA-Modus (Flag für exactag-Objekt)
      testMode: false,
      // QA-Modus (Flag für exactag-Objekt)
      QAMode: false,
      // Kampagnen Id, damit Exactag Zuordnung zum Kunden herstellen kann
      campaignId: "ffaacb82c52393300a9d3b3376091c43",
      // Werte, die immer an exactag geschickt werden sollen (falls gesetzt)
      baseParams: [
        "campaign",
        "pt",
        "uu",
        "ls",
        "hc",
        "cs",
        "ag",
        "pz",
        "ka",
        "bp",
        "sf",
        "cb",
        "xo",
        ...Object.entries(consentPartnerMap).map(([, v]) => v)
      ],
      consentPartnerMap,
      data: {},
      fns: {},
      first: true,

      //! Methode zur Registrierung von Trigger-Funktionen
      // ```
      // lhotse.exactag.register('myID', function(){}
      //   lhotse.exactag.data.pt = "Produktliste";
      // });
      // // Alternativ: Rückgabe des neuen Objekts
      // lhotse.exactag.register('myID', function(){}
      //   return {
      //     pt: "Produktliste"
      //   };
      // });
      // ```
      register: function (triggerID, fn) {
        win.lhotse.exactag.fns[triggerID] = fn;
      },

      //! Methode zum Auslesen und Setzen der allgemeinen Daten
      addCampaignId: function () {
        win.lhotse.exactag.data.campaign = win.lhotse.exactag.campaignId;

        return win.lhotse.exactag.data;
      },

      getCookieParameter: function() {
        // Setzt und normalisiert die Info, ob 3rd-Party Cookies zugestimmt, oder widersprochen wurde
        var cbCookie = o_util.cookie.get("cb");
        return cbCookie === "1" || cbCookie === "2" ? "1" : "0";
      },

      //! Methode zum Auslesen und Setzen der allgemeinen Daten
      addGenericData: function () {
        // Unique User ID (Verwendung der Methode aus '210_jquery.cookie.js')
        win.lhotse.exactag.data.uu = o_util.cookie.get("BrowserId") || "";

        // Shoppfad (URL ohne Protokoll und Domäne)
        win.lhotse.exactag.data.sp = loc.pathname.split(/\?|#/)[0].substring(1);

        // Default pagetype setzen. Wird auf den meisten Seiten überschrieben
        win.lhotse.exactag.data.pt = "Default";

        // Setzt den Breakpoint der geladenen Seite
        if (
          !!o_global.device &&
          !!o_global.device.breakpoint &&
          typeof o_global.device.breakpoint.getCurrentBreakpoint === "function"
        ) {
          win.lhotse.exactag.data.bp = o_global.device.breakpoint.getCurrentBreakpoint();
        }

        // Setzt die Info, ob der Aufruf über eine App erfolgte oder nicht
        win.lhotse.exactag.data.sf = o_util.cookie.exists("app")
          ? "app"
          : "wwwottode";



        return win.lhotse.exactag.data;
      },

      //! Methode zum Auslesen und Setzen der Daten aus Elch-Cookie
      addElchCookieData: function () {
        var pmInfo,
          pm,
          mo = {},
          pmInfoCookie,
          log = win.lhotse.exactag.debugInfo;

        try {
          pmInfoCookie = o_util.cookie.get("pmInfo") || undefined;

          if (pmInfoCookie !== undefined) {
            // Crockford's JSON2 erforderlich für alte Browser, die JSON nicht nativ unterstützen
            pmInfo = JSON.parse(pmInfoCookie);

            if (pmInfo.pi_send === "true") {
              log("Marketing object has already been sent.");
              return mo;
            }

            for (pm in pmInfo) {
              // Nur Keys mit 2 Buchstaben übertragen
              if (pmInfo.hasOwnProperty(pm) && pm.length === 2) {
                mo[pm] = pmInfo[pm];
              }
            }

            pmInfoCookie = pmInfoCookie.replace(/"}/g, '", "pi_send":"true" }');
            o_util.cookie.set("pmInfo", pmInfoCookie, {
              path: "/",
              domain: ".otto.de"
            });

            // Marketing-Objekt nur dann hinzufügen, wenn Daten vorhanden
            if (!o_util.core.isEmptyObject(mo)) {
              log("Adding marketing object.");
              win.lhotse.exactag.data.mo = mo;
              return mo;
            }
          }
        } catch (err) {
          // Cookie löschen, wenn Cookie-Inhalt nicht verarbeitet werden konnte (siehe LHAS-321)
          o_util.cookie.remove("pmInfo", {
            path: "/",
            domain: ".otto.de"
          });
        }
      },

      //! Methode zum Auslesen und Setzen der Daten aus den Vertikalen
      addVerticalsData: function () {
        // Durchlaufen aller Elemente mit der Klasse 'exactag'
        [].forEach.call(document.querySelectorAll(".exactag"), function (
          element
        ) {
          // Abfrage des Data-Attributes 'trigger'
          var triggerID = element.getAttribute("data-trigger"),
            // Abfrage nach registrierter Funktion
            fn = win.lhotse.exactag.fns[triggerID],
            log = win.lhotse.exactag.debugInfo,
            data = win.lhotse.exactag.data,
            result;

          // Nur wenn Data-Attribut 'trigger' gefunden und
          // für angegebene ID auch eine Funktion registriert wurde,
          // wird die Funktion aufgerufen
          if (triggerID !== undefined && typeof fn === "function") {
            result = fn();
            if (result && typeof result === "object") {
              if (result === data) {
                // Debug Hinweis, falls Rückgabe-Objekt == Data-Objekt
                // d.h. Objekt wurde in Funktion erweitert UND zurückgegeben
                log(
                  'Unnecessary return in trigger function "' + triggerID + '"!'
                );
              } else {
                // Sonst Mergen des rückgegebenen Objekts mit dem Data-Objekt
                o_util.core.extend(data, result);
              }
            }
          } else {
            log('Unknown trigger function "' + triggerID + '"!');
          }
        });

        return win.lhotse.exactag.data;
      },

      addPartnerConsents: function () {
        try {
          win.lhotse.exactag.data.xo = window.cmp.getIabConsentString();
        } catch (e) {
          // no-op
        }

        if (window.cmp && window.cmp.readVendorsConsents) {
          window.cmp.readVendorsConsents().then((result) => {
            result.forEach((value, key) => {
              if (consentPartnerMap.hasOwnProperty(key)) {
                win.lhotse.exactag.data[consentPartnerMap[key]] = value | 0;
              }
            });
            document.dispatchEvent(new CustomEvent("vendorConsentsRead"));

            return win.lhotse.exactag.data;
          })
            .catch(err => {
              document.dispatchEvent(new CustomEvent("vendorConsentsRead"));
            });
        } else {
          document.dispatchEvent(new CustomEvent("vendorConsentsRead"));
        }

        return win.lhotse.exactag.data;
      },

      //! Methode zum Zwischenspeichern der Daten für das naechste Tracking (z.B. ```addToBasket``` )
      cacheUserData: function () {
        var data = win.lhotse.exactag.data,
          cache = {},
          i,
          param;

        for (i = 0; i < win.lhotse.exactag.baseParams.length; i++) {
          param = win.lhotse.exactag.baseParams[i];
          if (data[param]) {
            cache[param] = data[param];
          }
        }

        win.lhotse.exactag.data = cache;

        return win.lhotse.exactag.data;
      },

      //! Methode zum Entfernen leerer Felder
      removeEmptyItems: function (obj) {
        var item;

        // Falls kein Objekt übergeben wurde, wird das Data-Objekt verwendet
        if (!obj) {
          obj = win.lhotse.exactag.data;
        }

        for (item in obj) {
          if (obj.hasOwnProperty(item)) {
            if (typeof obj[item] === "object") {
              win.lhotse.exactag.removeEmptyItems(obj[item]);
            } else {
              if (obj[item] === "") {
                delete obj[item];
              }
            }
          }
        }

        win.lhotse.exactag.data = obj;

        return win.lhotse.exactag.data;
      },

      //! Methode zum Ausgeben des Objektes und/oder von Debugging-Meldungen
      debugInfo: function (msg) {
        // Ausgabe nur, wenn in Debug-Modus und console-Variable vorhanden
        if (win.lhotse.exactag.debug && win.console) {
          if (msg !== undefined) {
            // Meldung ausgeben
            console.info("INFO (lhotse.exactag.js): " + msg);
          } else {
            // Objekt ausgeben
            console.log(win.lhotse.exactag.data);
          }
        }
      },

      //! Methode zum Hinzufügen/Entfernen der 'isTest'- bzw. 'isQA'-Flags
      toggleMode: function () {
        var isTestCookie = o_util.cookie.get("PartnerPixelTest"),
          isQACookie = o_util.cookie.get("PartnerPixelPreview"),
          optOutCookie = o_util.cookie.get("DS");

        /**
         * Sets the isTest flag
         */
        function setTestFlag() {
          win.lhotse.exactag.debugInfo(
            'Sending data with "isTest" flag to exactag!'
          );
          win.lhotse.exactag.data.isTest = "true";
        }

        /**
         * Sets the isQA flag
         */
        function setQAFlag() {
          win.lhotse.exactag.debugInfo(
            'Sending data with "isQA" flag to exactag!'
          );
          win.lhotse.exactag.data.isQA = "true";
        }

        /**
         * Sets the ro/optOut flag
         */
        function setOptOutFlag() {
          win.lhotse.exactag.debugInfo(
            'Sending data with "ro/optOut" flag to exactag!'
          );
          win.lhotse.exactag.data.ro = "1";
        }

        /**
         * Sets the 'to/optOut flag
         */
        function setTrackingOptOutFlag() {
          win.lhotse.exactag.debugInfo(
            "Sending data with 'to/optOut' flag to exactag!"
          );
          win.lhotse.exactag.data.to = "1";
        }

        if (win.lhotse.exactag.testMode) {
          setTestFlag();
        } else if (isTestCookie !== undefined) {
          if (isTestCookie === "PixelTest=true") {
            setTestFlag();
          }
        } else {
          delete win.lhotse.exactag.data.isTest;
        }

        if (win.lhotse.exactag.QAMode) {
          setQAFlag();
        } else if (isQACookie !== undefined) {
          if (isQACookie === "PixelPreview=true") {
            setQAFlag();
          }
        } else {
          delete win.lhotse.exactag.data.isQA;
        }

        if (win.lhotse.exactag.OptOutMode) {
          setOptOutFlag();
        } else if (optOutCookie !== undefined) {
          if (optOutCookie === "retOptOut=1") {
            setOptOutFlag();
          }
        } else {
          delete win.lhotse.exactag.data.ro;
        }

        if (win.lhotse.exactag.trackingOptOutMode) {
          setTrackingOptOutFlag();
        } else if (
          !o_tracking ||
          !o_tracking.optOut ||
          !(typeof o_tracking.optOut.isUserOptOut === "function") ||
          o_tracking.optOut.isUserOptOut()
        ) {
          setTrackingOptOutFlag();
        } else {
          delete win.lhotse.exactag.data.to;
        }
      },

      //! Methode zur (Vor-)Prüfung, ob 'varnish'-Daten angefragt wurden und schon verfügbar sind
      track: function () {

        if (window.lhotse.exactag.finished) {
          win.lhotse.exactag.continueTrack();
        } else {
          window.lhotse.exactag.centralFinished = true;
        }
      },

      //! Methode zum Vorbereiten und Abschicken des Exactag-Objekts
      continueTrack: function () {
        var endTime, timeSinceDomeReady, i, varnish;

        win.lhotse.exactag.data.cb = win.lhotse.exactag.getCookieParameter();

        // Falls 'varnish'-Daten angefragt wurden
        // und noch kein Tracking erfolgte
        if (win.lhotse.exactag.varnish && win.lhotse.exactag.first) {
          varnish = win.lhotse.exactag.varnish.data;
          // .. werden die 'varnish'-Daten dem Exactag-Objekt hinzugefügt
          for (i = 0; i < varnish.length; i++) {
            o_util.core.extend(win.lhotse.exactag.data, varnish[i]);
          }

          win.lhotse.exactag.first = false;
        }

        // Leere Felder entfernen
        win.lhotse.exactag.removeEmptyItems();

        // Modus/Modi einstellen (Normal oder Test und/oder OA)
        win.lhotse.exactag.toggleMode();

        // Aufrufen der track-Funktion
        // if clause because Selenium stop working (#LHAS-112)
        if (
          (o_util.cookie.exists("seleniumBypassAdvertising") &&
            o_util.cookie.get("seleniumBypassAdvertising") !== "true") ||
          (!o_util.cookie.exists("seleniumBypassAdvertising") &&
            lhotse.exactag.execute)
        ) {
          exactag.track(win.lhotse.exactag.data);
        } /* Old revision: else {
                    //exactag.track(win.lhotse.exactag.data);
                }*/
        // Falls Benchmark-Cookie oder -Hash gesetzt, wird die Zeit seit dem DOM-Ready-Event berechnet und ausgegeben
        if (win.lhotse.exactag.benchmark) {
          endTime = new Date().getTime();
          timeSinceDomeReady = (endTime - win.lhotse.exactag.startTime) / 1000;
          win.lhotse.exactag.debugInfo(
            "Sending data " + timeSinceDomeReady + " seconds after DOMReady."
          );
        }

        // Debugging-Ausgabe (wenn im Debug-Modus)
        win.lhotse.exactag.debugInfo();

        // Cachen der User Daten für erneuten Aufruf nach dem DOM-Ready Event
        win.lhotse.exactag.cacheUserData();
      },

      //! Initiierung zum Load-Event
      init: (function () {
        o_global.eventLoader.onReady(10, function () {
          // Falls Benchmark-Cookie oder -Hash gesetzt, wird die zum DOM-Ready-Event ein Timestamp gesetzt
          if (win.lhotse.exactag.benchmark) {
            win.lhotse.exactag.startTime = new Date().getTime();
          }
        });

        o_global.eventLoader.onAllScriptsExecuted(11, function () {
          win.lhotse.exactag.addCampaignId();
          win.lhotse.exactag.addGenericData();
          win.lhotse.exactag.addElchCookieData();
          win.lhotse.exactag.addVerticalsData();
          win.lhotse.exactag.addPartnerConsents();
        });

        document.addEventListener("vendorConsentsRead", () => {
          win.lhotse.exactag.track();
        });
      })()
    });
  } catch (err) {
    //ERROR
  }
})(window);
