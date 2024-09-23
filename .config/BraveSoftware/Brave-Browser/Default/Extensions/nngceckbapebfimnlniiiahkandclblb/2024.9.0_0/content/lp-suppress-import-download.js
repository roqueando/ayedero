/******/ (function() { // webpackBootstrap
/**
 * Handles intercepting the injection of the CSV download link, and ensures the
 * download of the script is suppressed until the user opts to download the file.
 * The download is triggered by a window message sent from the LpFilelessImporter
 * content script.
 */
(function (globalContext) {
    let csvDownload = "";
    let csvHref = "";
    let isCsvDownloadTriggered = false;
    const defaultAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function (newChild) {
        if (isAnchorElement(newChild) && newChild.download) {
            csvDownload = newChild.download;
            csvHref = newChild.href;
            newChild.setAttribute("href", "javascript:void(0)");
            newChild.setAttribute("download", "");
            Element.prototype.appendChild = defaultAppendChild;
        }
        return defaultAppendChild.call(this, newChild);
    };
    function isAnchorElement(node) {
        return node.nodeName.toLowerCase() === "a";
    }
    const handleWindowMessage = (event) => {
        var _a;
        const command = (_a = event.data) === null || _a === void 0 ? void 0 : _a.command;
        if (event.source !== globalContext ||
            command !== "triggerCsvDownload" ||
            isCsvDownloadTriggered) {
            return;
        }
        isCsvDownloadTriggered = true;
        globalContext.removeEventListener("message", handleWindowMessage);
        const anchor = globalContext.document.createElement("a");
        anchor.setAttribute("href", csvHref);
        anchor.setAttribute("download", csvDownload);
        globalContext.document.body.appendChild(anchor);
        anchor.click();
        globalContext.document.body.removeChild(anchor);
    };
    globalContext.addEventListener("message", handleWindowMessage);
})(window);

/******/ })()
;