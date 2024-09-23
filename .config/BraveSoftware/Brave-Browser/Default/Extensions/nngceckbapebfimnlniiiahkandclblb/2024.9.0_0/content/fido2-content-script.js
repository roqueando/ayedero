/******/ (function() { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/autofill/enums/autofill-port.enum.ts
const autofill_port_enum_AutofillPort = {
    InjectedScript: "autofill-injected-script-port",
};


;// CONCATENATED MODULE: ./src/autofill/utils/index.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/**
 * Generates a random string of characters.
 *
 * @param length - The length of the random string to generate.
 */
function generateRandomChars(length) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const randomChars = [];
    const randomBytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(randomBytes);
    for (let byteIndex = 0; byteIndex < randomBytes.length; byteIndex++) {
        const byte = randomBytes[byteIndex];
        randomChars.push(chars[byte % chars.length]);
    }
    return randomChars.join("");
}
/**
 * Polyfills the requestIdleCallback API with a setTimeout fallback.
 *
 * @param callback - The callback function to run when the browser is idle.
 * @param options - The options to pass to the requestIdleCallback function.
 */
function requestIdleCallbackPolyfill(callback, options) {
    if ("requestIdleCallback" in globalThis) {
        return globalThis.requestIdleCallback(() => callback(), options);
    }
    return globalThis.setTimeout(() => callback(), 1);
}
/**
 * Polyfills the cancelIdleCallback API with a clearTimeout fallback.
 *
 * @param id - The ID of the idle callback to cancel.
 */
function cancelIdleCallbackPolyfill(id) {
    if ("cancelIdleCallback" in globalThis) {
        return globalThis.cancelIdleCallback(id);
    }
    return globalThis.clearTimeout(id);
}
/**
 * Generates a random string of characters that formatted as a custom element name.
 */
function generateRandomCustomElementName() {
    const length = Math.floor(Math.random() * 5) + 8; // Between 8 and 12 characters
    const numHyphens = Math.min(Math.max(Math.floor(Math.random() * 4), 1), length - 1); // At least 1, maximum of 3 hyphens
    const hyphenIndices = [];
    while (hyphenIndices.length < numHyphens) {
        const index = Math.floor(Math.random() * (length - 1)) + 1;
        if (!hyphenIndices.includes(index)) {
            hyphenIndices.push(index);
        }
    }
    hyphenIndices.sort((a, b) => a - b);
    let randomString = "";
    let prevIndex = 0;
    for (let index = 0; index < hyphenIndices.length; index++) {
        const hyphenIndex = hyphenIndices[index];
        randomString = randomString + generateRandomChars(hyphenIndex - prevIndex) + "-";
        prevIndex = hyphenIndex;
    }
    randomString += generateRandomChars(length - prevIndex);
    return randomString;
}
/**
 * Builds a DOM element from an SVG string.
 *
 * @param svgString - The SVG string to build the DOM element from.
 * @param ariaHidden - Determines whether the SVG should be hidden from screen readers.
 */
function buildSvgDomElement(svgString, ariaHidden = true) {
    const domParser = new DOMParser();
    const svgDom = domParser.parseFromString(svgString, "image/svg+xml");
    const domElement = svgDom.documentElement;
    domElement.setAttribute("aria-hidden", `${ariaHidden}`);
    return domElement;
}
/**
 * Sends a message to the extension.
 *
 * @param command - The command to send.
 * @param options - The options to send with the command.
 */
function sendExtensionMessage(command, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof browser !== "undefined") {
            return browser.runtime.sendMessage(Object.assign({ command }, options));
        }
        return new Promise((resolve) => chrome.runtime.sendMessage(Object.assign({ command }, options), (response) => {
            if (chrome.runtime.lastError) {
                resolve(null);
            }
            resolve(response);
        }));
    });
}
/**
 * Sets CSS styles on an element.
 *
 * @param element - The element to set the styles on.
 * @param styles - The styles to set on the element.
 * @param priority - Determines whether the styles should be set as important.
 */
function setElementStyles(element, styles, priority) {
    if (!element || !styles || !Object.keys(styles).length) {
        return;
    }
    for (const styleProperty in styles) {
        element.style.setProperty(styleProperty.replace(/([a-z])([A-Z])/g, "$1-$2"), // Convert camelCase to kebab-case
        styles[styleProperty], priority ? "important" : undefined);
    }
}
/**
 * Sets up a long-lived connection with the extension background
 * and triggers an onDisconnect event if the extension context
 * is invalidated.
 *
 * @param callback - Callback export function to run when the extension disconnects
 */
function setupExtensionDisconnectAction(callback) {
    const port = chrome.runtime.connect({ name: AutofillPort.InjectedScript });
    const onDisconnectCallback = (disconnectedPort) => {
        callback(disconnectedPort);
        port.onDisconnect.removeListener(onDisconnectCallback);
    };
    port.onDisconnect.addListener(onDisconnectCallback);
}
/**
 * Handles setup of the extension disconnect action for the autofill init class
 * in both instances where the overlay might or might not be initialized.
 *
 * @param windowContext - The global window context
 */
function setupAutofillInitDisconnectAction(windowContext) {
    if (!windowContext.bitwardenAutofillInit) {
        return;
    }
    const onDisconnectCallback = () => {
        windowContext.bitwardenAutofillInit.destroy();
        delete windowContext.bitwardenAutofillInit;
    };
    setupExtensionDisconnectAction(onDisconnectCallback);
}
/**
 * Identifies whether an element is a fillable form field.
 * This is determined by whether the element is a form field and not a span.
 *
 * @param formFieldElement - The form field element to check.
 */
function elementIsFillableFormField(formFieldElement) {
    return !elementIsSpanElement(formFieldElement);
}
/**
 * Identifies whether an element is an instance of a specific tag name.
 *
 * @param element - The element to check.
 * @param tagName -  The tag name to check against.
 */
function elementIsInstanceOf(element, tagName) {
    return nodeIsElement(element) && element.tagName.toLowerCase() === tagName;
}
/**
 * Identifies whether an element is a span element.
 *
 * @param element - The element to check.
 */
function elementIsSpanElement(element) {
    return elementIsInstanceOf(element, "span");
}
/**
 * Identifies whether an element is an input field.
 *
 * @param element - The element to check.
 */
function elementIsInputElement(element) {
    return elementIsInstanceOf(element, "input");
}
/**
 * Identifies whether an element is a select field.
 *
 * @param element - The element to check.
 */
function elementIsSelectElement(element) {
    return elementIsInstanceOf(element, "select");
}
/**
 * Identifies whether an element is a textarea field.
 *
 * @param element - The element to check.
 */
function elementIsTextAreaElement(element) {
    return elementIsInstanceOf(element, "textarea");
}
/**
 * Identifies whether an element is a form element.
 *
 * @param element - The element to check.
 */
function elementIsFormElement(element) {
    return elementIsInstanceOf(element, "form");
}
/**
 * Identifies whether an element is a label element.
 *
 * @param element - The element to check.
 */
function elementIsLabelElement(element) {
    return elementIsInstanceOf(element, "label");
}
/**
 * Identifies whether an element is a description details `dd` element.
 *
 * @param element - The element to check.
 */
function elementIsDescriptionDetailsElement(element) {
    return elementIsInstanceOf(element, "dd");
}
/**
 * Identifies whether an element is a description term `dt` element.
 *
 * @param element - The element to check.
 */
function elementIsDescriptionTermElement(element) {
    return elementIsInstanceOf(element, "dt");
}
/**
 * Identifies whether a node is an HTML element.
 *
 * @param node - The node to check.
 */
function nodeIsElement(node) {
    if (!node) {
        return false;
    }
    return (node === null || node === void 0 ? void 0 : node.nodeType) === Node.ELEMENT_NODE;
}
/**
 * Identifies whether a node is an input element.
 *
 * @param node - The node to check.
 */
function nodeIsInputElement(node) {
    return nodeIsElement(node) && elementIsInputElement(node);
}
/**
 * Identifies whether a node is a form element.
 *
 * @param node - The node to check.
 */
function nodeIsFormElement(node) {
    return nodeIsElement(node) && elementIsFormElement(node);
}
/**
 * Returns a boolean representing the attribute value of an element.
 *
 * @param element
 * @param attributeName
 * @param checkString
 */
function getAttributeBoolean(element, attributeName, checkString = false) {
    if (checkString) {
        return getPropertyOrAttribute(element, attributeName) === "true";
    }
    return Boolean(getPropertyOrAttribute(element, attributeName));
}
/**
 * Get the value of a property or attribute from a FormFieldElement.
 *
 * @param element
 * @param attributeName
 */
function getPropertyOrAttribute(element, attributeName) {
    if (attributeName in element) {
        return element[attributeName];
    }
    return element.getAttribute(attributeName);
}
/**
 * Throttles a callback function to run at most once every `limit` milliseconds.
 *
 * @param callback - The callback function to throttle.
 * @param limit - The time in milliseconds to throttle the callback.
 */
function throttle(callback, limit) {
    let waitingDelay = false;
    return function (...args) {
        if (!waitingDelay) {
            callback.apply(this, args);
            waitingDelay = true;
            globalThis.setTimeout(() => (waitingDelay = false), limit);
        }
    };
}

;// CONCATENATED MODULE: ./src/autofill/fido2/enums/fido2-port-name.enum.ts
const Fido2PortName = {
    InjectedScript: "fido2-injected-content-script-port",
};

;// CONCATENATED MODULE: ./src/autofill/fido2/content/messaging/message.ts
var MessageType;
(function (MessageType) {
    MessageType[MessageType["CredentialCreationRequest"] = 0] = "CredentialCreationRequest";
    MessageType[MessageType["CredentialCreationResponse"] = 1] = "CredentialCreationResponse";
    MessageType[MessageType["CredentialGetRequest"] = 2] = "CredentialGetRequest";
    MessageType[MessageType["CredentialGetResponse"] = 3] = "CredentialGetResponse";
    MessageType[MessageType["AbortRequest"] = 4] = "AbortRequest";
    MessageType[MessageType["DisconnectRequest"] = 5] = "DisconnectRequest";
    MessageType[MessageType["ReconnectRequest"] = 6] = "ReconnectRequest";
    MessageType[MessageType["AbortResponse"] = 7] = "AbortResponse";
    MessageType[MessageType["ErrorResponse"] = 8] = "ErrorResponse";
})(MessageType || (MessageType = {}));

;// CONCATENATED MODULE: ../../libs/common/src/platform/abstractions/fido2/fido2-client.service.abstraction.ts
const UserRequestedFallbackAbortReason = "UserRequestedFallback";
/**
 * This class represents an abstraction of the WebAuthn Client as described by W3C:
 * https://www.w3.org/TR/webauthn-3/#webauthn-client
 *
 * The WebAuthn Client is an intermediary entity typically implemented in the user agent
 * (in whole, or in part). Conceptually, it underlies the Web Authentication API and embodies
 * the implementation of the Web Authentication API's operations.
 *
 * It is responsible for both marshalling the inputs for the underlying authenticator operations,
 * and for returning the results of the latter operations to the Web Authentication API's callers.
 */
class Fido2ClientService {
}
/**
 * Error thrown when the user requests a fallback to the browser's built-in WebAuthn implementation.
 */
class FallbackRequestedError extends Error {
    constructor() {
        super("FallbackRequested");
        this.fallbackRequested = true;
    }
}

;// CONCATENATED MODULE: ./src/autofill/fido2/content/messaging/messenger.ts
var messenger_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const SENDER = "bitwarden-webauthn";
/**
 * A class that handles communication between the page and content script. It converts
 * the browser's broadcasting API into a request/response API with support for seamlessly
 * handling aborts and exceptions across separate execution contexts.
 */
class Messenger {
    /**
     * Creates a messenger that uses the browser's `window.postMessage` API to initiate
     * requests in the content script. Every request will then create it's own
     * `MessageChannel` through which all subsequent communication will be sent through.
     *
     * @param window the window object to use for communication
     * @returns a `Messenger` instance
     */
    static forDOMCommunication(window) {
        const windowOrigin = window.location.origin;
        return new Messenger({
            postMessage: (message, port) => window.postMessage(message, windowOrigin, [port]),
            addEventListener: (listener) => window.addEventListener("message", listener),
            removeEventListener: (listener) => window.removeEventListener("message", listener),
        });
    }
    constructor(broadcastChannel) {
        this.broadcastChannel = broadcastChannel;
        this.messageEventListener = null;
        this.onDestroy = new EventTarget();
        this.messengerId = this.generateUniqueId();
        this.messageEventListener = this.createMessageEventListener();
        this.broadcastChannel.addEventListener(this.messageEventListener);
    }
    /**
     * Sends a request to the content script and returns the response.
     * AbortController signals will be forwarded to the content script.
     *
     * @param request data to send to the content script
     * @param abortSignal the abort controller that might be used to abort the request
     * @returns the response from the content script
     */
    request(request, abortSignal) {
        return messenger_awaiter(this, void 0, void 0, function* () {
            const requestChannel = new MessageChannel();
            const { port1: localPort, port2: remotePort } = requestChannel;
            try {
                const promise = new Promise((resolve) => {
                    localPort.onmessage = (event) => resolve(event.data);
                });
                const abortListener = () => localPort.postMessage({
                    metadata: { SENDER },
                    type: MessageType.AbortRequest,
                });
                abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.addEventListener("abort", abortListener);
                this.broadcastChannel.postMessage(Object.assign(Object.assign({}, request), { SENDER, senderId: this.messengerId }), remotePort);
                const response = yield promise;
                abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.removeEventListener("abort", abortListener);
                if (response.type === MessageType.ErrorResponse) {
                    const error = new Error();
                    Object.assign(error, JSON.parse(response.error));
                    throw error;
                }
                return response;
            }
            finally {
                localPort.close();
            }
        });
    }
    createMessageEventListener() {
        return (event) => messenger_awaiter(this, void 0, void 0, function* () {
            var _a;
            const windowOrigin = window.location.origin;
            if (event.origin !== windowOrigin || !this.handler) {
                return;
            }
            const message = event.data;
            const port = (_a = event.ports) === null || _a === void 0 ? void 0 : _a[0];
            if ((message === null || message === void 0 ? void 0 : message.SENDER) !== SENDER || message.senderId == this.messengerId || port == null) {
                return;
            }
            const abortController = new AbortController();
            port.onmessage = (event) => {
                if (event.data.type === MessageType.AbortRequest) {
                    abortController.abort();
                }
            };
            let onDestroyListener;
            const destroyPromise = new Promise((_, reject) => {
                onDestroyListener = () => reject(new FallbackRequestedError());
                this.onDestroy.addEventListener("destroy", onDestroyListener);
            });
            try {
                const handlerResponse = yield Promise.race([
                    this.handler(message, abortController),
                    destroyPromise,
                ]);
                port.postMessage(Object.assign(Object.assign({}, handlerResponse), { SENDER }));
            }
            catch (error) {
                port.postMessage({
                    SENDER,
                    type: MessageType.ErrorResponse,
                    error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
                });
            }
            finally {
                this.onDestroy.removeEventListener("destroy", onDestroyListener);
                port.close();
            }
        });
    }
    /**
     * Cleans up the messenger by removing the message event listener
     */
    destroy() {
        return messenger_awaiter(this, void 0, void 0, function* () {
            this.onDestroy.dispatchEvent(new Event("destroy"));
            if (this.messageEventListener) {
                yield this.sendDisconnectCommand();
                this.broadcastChannel.removeEventListener(this.messageEventListener);
                this.messageEventListener = null;
            }
        });
    }
    sendDisconnectCommand() {
        return messenger_awaiter(this, void 0, void 0, function* () {
            yield this.request({ type: MessageType.DisconnectRequest });
        });
    }
    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}

;// CONCATENATED MODULE: ./src/autofill/fido2/content/fido2-content-script.ts
var fido2_content_script_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




(function (globalContext) {
    const shouldExecuteContentScript = globalContext.document.contentType === "text/html" &&
        (globalContext.document.location.protocol === "https:" ||
            (globalContext.document.location.protocol === "http:" &&
                globalContext.document.location.hostname === "localhost"));
    if (!shouldExecuteContentScript) {
        return;
    }
    // Initialization logic, set up the messenger and connect a port to the background script.
    const messenger = Messenger.forDOMCommunication(globalContext.window);
    messenger.handler = handleFido2Message;
    const port = chrome.runtime.connect({ name: Fido2PortName.InjectedScript });
    port.onDisconnect.addListener(handlePortOnDisconnect);
    /**
     * Handles FIDO2 credential requests and returns the result.
     *
     * @param message - The message to handle.
     * @param abortController - The abort controller used to handle exit conditions from the FIDO2 request.
     */
    function handleFido2Message(message, abortController) {
        return fido2_content_script_awaiter(this, void 0, void 0, function* () {
            const requestId = Date.now().toString();
            const abortHandler = () => sendExtensionMessage("fido2AbortRequest", { abortedRequestId: requestId });
            abortController.signal.addEventListener("abort", abortHandler);
            try {
                if (message.type === MessageType.CredentialCreationRequest) {
                    return handleCredentialCreationRequestMessage(requestId, message.data);
                }
                if (message.type === MessageType.CredentialGetRequest) {
                    return handleCredentialGetRequestMessage(requestId, message.data);
                }
            }
            finally {
                abortController.signal.removeEventListener("abort", abortHandler);
            }
        });
    }
    /**
     * Handles the credential creation request message and returns the result.
     *
     * @param requestId - The request ID of the message.
     * @param data - Data associated with the credential request.
     */
    function handleCredentialCreationRequestMessage(requestId, data) {
        return fido2_content_script_awaiter(this, void 0, void 0, function* () {
            return respondToCredentialRequest("fido2RegisterCredentialRequest", MessageType.CredentialCreationResponse, requestId, data);
        });
    }
    /**
     * Handles the credential get request message and returns the result.
     *
     * @param requestId - The request ID of the message.
     * @param data - Data associated with the credential request.
     */
    function handleCredentialGetRequestMessage(requestId, data) {
        return fido2_content_script_awaiter(this, void 0, void 0, function* () {
            return respondToCredentialRequest("fido2GetCredentialRequest", MessageType.CredentialGetResponse, requestId, data);
        });
    }
    /**
     * Sends a message to the extension to handle the
     * credential request and returns the result.
     *
     * @param command - The command to send to the extension.
     * @param type - The type of message, either CredentialCreationResponse or CredentialGetResponse.
     * @param requestId - The request ID of the message.
     * @param messageData - Data associated with the credential request.
     */
    function respondToCredentialRequest(command, type, requestId, messageData) {
        return fido2_content_script_awaiter(this, void 0, void 0, function* () {
            const data = Object.assign(Object.assign({}, messageData), { origin: globalContext.location.origin, sameOriginWithAncestors: globalContext.self === globalContext.top });
            const result = yield sendExtensionMessage(command, { data, requestId });
            if (result && result.error !== undefined) {
                return Promise.reject(result.error);
            }
            return Promise.resolve({ type, result });
        });
    }
    /**
     * Handles the disconnect event of the port. Calls
     * to the messenger to destroy and tear down the
     * implemented page-script.js logic.
     */
    function handlePortOnDisconnect() {
        void messenger.destroy();
    }
})(globalThis);

/******/ })()
;