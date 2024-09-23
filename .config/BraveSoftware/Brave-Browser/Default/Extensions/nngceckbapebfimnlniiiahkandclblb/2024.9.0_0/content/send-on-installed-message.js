/******/ (function() { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ../../libs/common/src/vault/enums/vault-onboarding.enum.ts
const VaultOnboardingMessages = {
    HasBwInstalled: "hasBwInstalled",
    checkBwInstalled: "checkIfBWExtensionInstalled",
};


;// CONCATENATED MODULE: ./src/vault/content/send-on-installed-message.ts

(function (globalContext) {
    globalContext.postMessage({ command: VaultOnboardingMessages.HasBwInstalled });
})(window);

/******/ })()
;