/**
 * Script inline exécuté au parse du <body> (avant l'hydratation React).
 * Ne pas placer dans <head> : Bitdefender y injecte ses propres <script>.
 */
export const STRIP_EXTENSION_ATTRS_SCRIPT = `(function () {
  var ATTRS = ["bis_skin_checked", "bis_use"];
  function strip() {
    for (var i = 0; i < ATTRS.length; i++) {
      var attr = ATTRS[i];
      var nodes = document.querySelectorAll("[" + attr + "]");
      for (var j = 0; j < nodes.length; j++) {
        nodes[j].removeAttribute(attr);
      }
    }
  }
  strip();
  document.addEventListener("DOMContentLoaded", strip, { once: true });
  document.addEventListener("readystatechange", function () {
    if (document.readyState !== "loading") strip();
  });
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver(strip).observe(document.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
  }
})();`
