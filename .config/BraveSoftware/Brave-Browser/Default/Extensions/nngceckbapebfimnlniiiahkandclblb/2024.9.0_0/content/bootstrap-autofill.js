/******/ (function() { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/autofill/enums/autofill-port.enum.ts
const AutofillPort = {
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

;// CONCATENATED MODULE: ../../libs/common/src/autofill/constants/index.ts
const TYPE_CHECK = {
    FUNCTION: "function",
    NUMBER: "number",
    STRING: "string",
};
const EVENTS = {
    CHANGE: "change",
    INPUT: "input",
    KEYDOWN: "keydown",
    KEYPRESS: "keypress",
    KEYUP: "keyup",
    BLUR: "blur",
    CLICK: "click",
    FOCUS: "focus",
    FOCUSIN: "focusin",
    FOCUSOUT: "focusout",
    SCROLL: "scroll",
    RESIZE: "resize",
    DOMCONTENTLOADED: "DOMContentLoaded",
    LOAD: "load",
    MESSAGE: "message",
    VISIBILITYCHANGE: "visibilitychange",
    MOUSEENTER: "mouseenter",
    MOUSELEAVE: "mouseleave",
};
const ClearClipboardDelay = {
    Never: null,
    TenSeconds: 10,
    TwentySeconds: 20,
    ThirtySeconds: 30,
    OneMinute: 60,
    TwoMinutes: 120,
    FiveMinutes: 300,
};
/* Context Menu item Ids */
const AUTOFILL_CARD_ID = "autofill-card";
const AUTOFILL_ID = "autofill";
const SHOW_AUTOFILL_BUTTON = "show-autofill-button";
const AUTOFILL_IDENTITY_ID = "autofill-identity";
const COPY_IDENTIFIER_ID = "copy-identifier";
const COPY_PASSWORD_ID = "copy-password";
const COPY_USERNAME_ID = "copy-username";
const COPY_VERIFICATION_CODE_ID = "copy-totp";
const CREATE_CARD_ID = "create-card";
const CREATE_IDENTITY_ID = "create-identity";
const CREATE_LOGIN_ID = "create-login";
const GENERATE_PASSWORD_ID = "generate-password";
const NOOP_COMMAND_SUFFIX = "noop";
const ROOT_ID = "root";
const SEPARATOR_ID = "separator";
const NOTIFICATION_BAR_LIFESPAN_MS = 150000; // 150 seconds
const AUTOFILL_OVERLAY_HANDLE_REPOSITION = "autofill-overlay-handle-reposition-event";
const AutofillOverlayVisibility = {
    Off: 0,
    OnButtonClick: 1,
    OnFieldFocus: 2,
};
const BrowserClientVendors = {
    Chrome: "Chrome",
    Opera: "Opera",
    Edge: "Edge",
    Vivaldi: "Vivaldi",
    Unknown: "Unknown",
};
const BrowserShortcutsUris = {
    Chrome: "chrome://extensions/shortcuts",
    Opera: "opera://extensions/shortcuts",
    Edge: "edge://extensions/shortcuts",
    Vivaldi: "vivaldi://extensions/shortcuts",
    Unknown: "https://bitwarden.com/help/keyboard-shortcuts",
};
const DisablePasswordManagerUris = {
    Chrome: "chrome://settings/autofill",
    Opera: "opera://settings/autofill",
    Edge: "edge://settings/passwords",
    Vivaldi: "vivaldi://settings/autofill",
    Unknown: "https://bitwarden.com/help/disable-browser-autofill/",
};
const ExtensionCommand = {
    AutofillCommand: "autofill_cmd",
    AutofillCard: "autofill_card",
    AutofillIdentity: "autofill_identity",
    AutofillLogin: "autofill_login",
    OpenAutofillOverlay: "open_autofill_overlay",
    GeneratePassword: "generate_password",
    OpenPopup: "open_popup",
    LockVault: "lock_vault",
    NoopCommand: "noop",
};

;// CONCATENATED MODULE: ./src/autofill/services/collect-autofill-content.service.ts
var collect_autofill_content_service_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class CollectAutofillContentService {
    constructor(domElementVisibilityService, autofillOverlayContentService) {
        this.sendExtensionMessage = sendExtensionMessage;
        this.getAttributeBoolean = getAttributeBoolean;
        this.getPropertyOrAttribute = getPropertyOrAttribute;
        this.noFieldsFound = false;
        this.domRecentlyMutated = true;
        this.autofillFormElements = new Map();
        this.autofillFieldElements = new Map();
        this.currentLocationHref = "";
        this.elementInitializingIntersectionObserver = new Set();
        this.mutationsQueue = [];
        this.updateAfterMutationTimeout = 1000;
        this.nonInputFormFieldTags = new Set(["textarea", "select"]);
        this.ignoredInputTypes = new Set([
            "hidden",
            "submit",
            "reset",
            "button",
            "image",
            "file",
        ]);
        this.useTreeWalkerStrategyFlagSet = true;
        /**
         * Builds an AutofillField object from the given form element. Will only return
         * shared field values if the element is a span element. Will not return any label
         * values if the element is a hidden input element.
         *
         * @param element - The form field element to build the AutofillField object from
         * @param index - The index of the form field element
         */
        this.buildAutofillFieldItem = (element, index) => collect_autofill_content_service_awaiter(this, void 0, void 0, function* () {
            var _a;
            if (element.closest("button[type='submit']")) {
                return null;
            }
            element.opid = `__${index}`;
            const existingAutofillField = this.autofillFieldElements.get(element);
            if (index >= 0 && existingAutofillField) {
                existingAutofillField.opid = element.opid;
                existingAutofillField.elementNumber = index;
                this.autofillFieldElements.set(element, existingAutofillField);
                return existingAutofillField;
            }
            const autofillFieldBase = {
                opid: element.opid,
                elementNumber: index,
                maxLength: this.getAutofillFieldMaxLength(element),
                viewable: yield this.domElementVisibilityService.isFormFieldViewable(element),
                htmlID: this.getPropertyOrAttribute(element, "id"),
                htmlName: this.getPropertyOrAttribute(element, "name"),
                htmlClass: this.getPropertyOrAttribute(element, "class"),
                tabindex: this.getPropertyOrAttribute(element, "tabindex"),
                title: this.getPropertyOrAttribute(element, "title"),
                tagName: this.getAttributeLowerCase(element, "tagName"),
            };
            if (!autofillFieldBase.viewable) {
                this.elementInitializingIntersectionObserver.add(element);
                (_a = this.intersectionObserver) === null || _a === void 0 ? void 0 : _a.observe(element);
            }
            if (elementIsSpanElement(element)) {
                this.cacheAutofillFieldElement(index, element, autofillFieldBase);
                return autofillFieldBase;
            }
            let autofillFieldLabels = {};
            const elementType = this.getAttributeLowerCase(element, "type");
            if (elementType !== "hidden") {
                autofillFieldLabels = {
                    "label-tag": this.createAutofillFieldLabelTag(element),
                    "label-data": this.getPropertyOrAttribute(element, "data-label"),
                    "label-aria": this.getPropertyOrAttribute(element, "aria-label"),
                    "label-top": this.createAutofillFieldTopLabel(element),
                    "label-right": this.createAutofillFieldRightLabel(element),
                    "label-left": this.createAutofillFieldLeftLabel(element),
                    placeholder: this.getPropertyOrAttribute(element, "placeholder"),
                };
            }
            const fieldFormElement = element.form;
            const autofillField = Object.assign(Object.assign(Object.assign({}, autofillFieldBase), autofillFieldLabels), { rel: this.getPropertyOrAttribute(element, "rel"), type: elementType, value: this.getElementValue(element), checked: this.getAttributeBoolean(element, "checked"), autoCompleteType: this.getAutoCompleteAttribute(element), disabled: this.getAttributeBoolean(element, "disabled"), readonly: this.getAttributeBoolean(element, "readonly"), selectInfo: elementIsSelectElement(element)
                    ? this.getSelectElementOptions(element)
                    : null, form: fieldFormElement ? this.getPropertyOrAttribute(fieldFormElement, "opid") : null, "aria-hidden": this.getAttributeBoolean(element, "aria-hidden", true), "aria-disabled": this.getAttributeBoolean(element, "aria-disabled", true), "aria-haspopup": this.getAttributeBoolean(element, "aria-haspopup", true), "data-stripe": this.getPropertyOrAttribute(element, "data-stripe") });
            this.cacheAutofillFieldElement(index, element, autofillField);
            return autofillField;
        });
        /**
         * Map over all the label elements and creates a
         * string of the text content of each label element.
         * @param {Set<HTMLElement>} labelElementsSet
         * @returns {string}
         * @private
         */
        this.createLabelElementsTag = (labelElementsSet) => {
            return Array.from(labelElementsSet)
                .map((labelElement) => {
                const textContent = labelElement
                    ? labelElement.textContent || labelElement.innerText
                    : null;
                return this.trimAndRemoveNonPrintableText(textContent || "");
            })
                .join("");
        };
        /**
         * Handles observed DOM mutations and identifies if a mutation is related to
         * an autofill element. If so, it will update the autofill element data.
         * @param {MutationRecord[]} mutations
         * @private
         */
        this.handleMutationObserverMutation = (mutations) => {
            if (this.currentLocationHref !== globalThis.location.href) {
                this.handleWindowLocationMutation();
                return;
            }
            if (!this.mutationsQueue.length) {
                requestIdleCallbackPolyfill(this.processMutations, { timeout: 500 });
            }
            this.mutationsQueue.push(mutations);
        };
        /**
         * Handles the processing of all mutations in the mutations queue. Will trigger
         * within an idle callback to help with performance and prevent excessive updates.
         */
        this.processMutations = () => {
            for (let queueIndex = 0; queueIndex < this.mutationsQueue.length; queueIndex++) {
                this.processMutationRecord(this.mutationsQueue[queueIndex]);
            }
            if (this.domRecentlyMutated) {
                this.updateAutofillElementsAfterMutation();
            }
            this.mutationsQueue = [];
        };
        /**
         * Handles observed form field elements that are not viewable in the viewport.
         * Will re-evaluate the visibility of the element and set up the autofill
         * overlay listeners on the field if it is viewable.
         *
         * @param entries - The entries observed by the IntersectionObserver
         */
        this.handleFormElementIntersection = (entries) => collect_autofill_content_service_awaiter(this, void 0, void 0, function* () {
            var _b;
            for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
                const entry = entries[entryIndex];
                const formFieldElement = entry.target;
                if (this.elementInitializingIntersectionObserver.has(formFieldElement)) {
                    this.elementInitializingIntersectionObserver.delete(formFieldElement);
                    continue;
                }
                const cachedAutofillFieldElement = this.autofillFieldElements.get(formFieldElement);
                if (!cachedAutofillFieldElement) {
                    this.intersectionObserver.unobserve(entry.target);
                    continue;
                }
                const isViewable = yield this.domElementVisibilityService.isFormFieldViewable(formFieldElement);
                if (!isViewable) {
                    continue;
                }
                cachedAutofillFieldElement.viewable = true;
                this.setupInlineMenu(formFieldElement, cachedAutofillFieldElement);
                (_b = this.intersectionObserver) === null || _b === void 0 ? void 0 : _b.unobserve(entry.target);
            }
        });
        this.domElementVisibilityService = domElementVisibilityService;
        this.autofillOverlayContentService = autofillOverlayContentService;
        let inputQuery = "input:not([data-bwignore])";
        for (const type of this.ignoredInputTypes) {
            inputQuery += `:not([type="${type}"])`;
        }
        this.formFieldQueryString = `${inputQuery}, textarea:not([data-bwignore]), select:not([data-bwignore]), span[data-bwautofill]`;
        // void sendExtensionMessage("getUseTreeWalkerApiForPageDetailsCollectionFeatureFlag").then(
        //   (useTreeWalkerStrategyFlag) =>
        //     (this.useTreeWalkerStrategyFlagSet = !!useTreeWalkerStrategyFlag?.result),
        // );
    }
    /**
     * Builds the data for all forms and fields found within the page DOM.
     * Sets up a mutation observer to verify DOM changes and returns early
     * with cached data if no changes are detected.
     * @returns {Promise<AutofillPageDetails>}
     * @public
     */
    getPageDetails() {
        return collect_autofill_content_service_awaiter(this, void 0, void 0, function* () {
            if (!this.mutationObserver) {
                this.setupMutationObserver();
            }
            if (!this.intersectionObserver) {
                this.setupIntersectionObserver();
            }
            if (!this.domRecentlyMutated && this.noFieldsFound) {
                return this.getFormattedPageDetails({}, []);
            }
            if (!this.domRecentlyMutated && this.autofillFieldElements.size) {
                this.updateCachedAutofillFieldVisibility();
                return this.getFormattedPageDetails(this.getFormattedAutofillFormsData(), this.getFormattedAutofillFieldsData());
            }
            const { formElements, formFieldElements } = this.queryAutofillFormAndFieldElements();
            const autofillFormsData = this.buildAutofillFormsData(formElements);
            const autofillFieldsData = (yield this.buildAutofillFieldsData(formFieldElements)).filter((field) => !!field);
            this.sortAutofillFieldElementsMap();
            if (!autofillFieldsData.length) {
                this.noFieldsFound = true;
            }
            this.domRecentlyMutated = false;
            const pageDetails = this.getFormattedPageDetails(autofillFormsData, autofillFieldsData);
            this.setupInlineMenuListeners(pageDetails);
            return pageDetails;
        });
    }
    /**
     * Find an AutofillField element by its opid, will only return the first
     * element if there are multiple elements with the same opid. If no
     * element is found, null will be returned.
     * @param {string} opid
     * @returns {FormFieldElement | null}
     */
    getAutofillFieldElementByOpid(opid) {
        const cachedFormFieldElements = Array.from(this.autofillFieldElements.keys());
        const formFieldElements = (cachedFormFieldElements === null || cachedFormFieldElements === void 0 ? void 0 : cachedFormFieldElements.length)
            ? cachedFormFieldElements
            : this.getAutofillFieldElements();
        const fieldElementsWithOpid = formFieldElements.filter((fieldElement) => fieldElement.opid === opid);
        if (!fieldElementsWithOpid.length) {
            const elementIndex = parseInt(opid.split("__")[1], 10);
            return formFieldElements[elementIndex] || null;
        }
        if (fieldElementsWithOpid.length > 1) {
            // eslint-disable-next-line no-console
            console.warn(`More than one element found with opid ${opid}`);
        }
        return fieldElementsWithOpid[0];
    }
    /**
     * Queries all elements in the DOM that match the given query string.
     * Also, recursively queries all shadow roots for the element.
     *
     * @param root - The root element to start the query from
     * @param queryString - The query string to match elements against
     * @param isObservingShadowRoot - Determines whether to observe shadow roots
     */
    deepQueryElements(root, queryString, isObservingShadowRoot = false) {
        let elements = this.queryElements(root, queryString);
        const shadowRoots = this.recursivelyQueryShadowRoots(root, isObservingShadowRoot);
        for (let index = 0; index < shadowRoots.length; index++) {
            const shadowRoot = shadowRoots[index];
            elements = elements.concat(this.queryElements(shadowRoot, queryString));
        }
        return elements;
    }
    /**
     * Queries the DOM for elements based on the given query string.
     *
     * @param root - The root element to start the query from
     * @param queryString - The query string to match elements against
     */
    queryElements(root, queryString) {
        if (!root.querySelector(queryString)) {
            return [];
        }
        return Array.from(root.querySelectorAll(queryString));
    }
    /**
     * Recursively queries all shadow roots found within the given root element.
     * Will also set up a mutation observer on the shadow root if the
     * `isObservingShadowRoot` parameter is set to true.
     *
     * @param root - The root element to start the query from
     * @param isObservingShadowRoot - Determines whether to observe shadow roots
     */
    recursivelyQueryShadowRoots(root, isObservingShadowRoot = false) {
        let shadowRoots = this.queryShadowRoots(root);
        for (let index = 0; index < shadowRoots.length; index++) {
            const shadowRoot = shadowRoots[index];
            shadowRoots = shadowRoots.concat(this.recursivelyQueryShadowRoots(shadowRoot));
            if (isObservingShadowRoot) {
                this.mutationObserver.observe(shadowRoot, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                });
            }
        }
        return shadowRoots;
    }
    /**
     * Queries any immediate shadow roots found within the given root element.
     *
     * @param root - The root element to start the query from
     */
    queryShadowRoots(root) {
        const shadowRoots = [];
        const potentialShadowRoots = root.querySelectorAll(":defined");
        for (let index = 0; index < potentialShadowRoots.length; index++) {
            const shadowRoot = this.getShadowRoot(potentialShadowRoots[index]);
            if (shadowRoot) {
                shadowRoots.push(shadowRoot);
            }
        }
        return shadowRoots;
    }
    /**
     * Sorts the AutofillFieldElements map by the elementNumber property.
     * @private
     */
    sortAutofillFieldElementsMap() {
        if (!this.autofillFieldElements.size) {
            return;
        }
        this.autofillFieldElements = new Map([...this.autofillFieldElements].sort((a, b) => a[1].elementNumber - b[1].elementNumber));
    }
    /**
     * Formats and returns the AutofillPageDetails object
     *
     * @param autofillFormsData - The data for all the forms found in the page
     * @param autofillFieldsData - The data for all the fields found in the page
     */
    getFormattedPageDetails(autofillFormsData, autofillFieldsData) {
        return {
            title: document.title,
            url: (document.defaultView || globalThis).location.href,
            documentUrl: document.location.href,
            forms: autofillFormsData,
            fields: autofillFieldsData,
            collectedTimestamp: Date.now(),
        };
    }
    /**
     * Re-checks the visibility for all form fields and updates the
     * cached data to reflect the most recent visibility state.
     *
     * @private
     */
    updateCachedAutofillFieldVisibility() {
        this.autofillFieldElements.forEach((autofillField, element) => collect_autofill_content_service_awaiter(this, void 0, void 0, function* () {
            const previouslyViewable = autofillField.viewable;
            autofillField.viewable = yield this.domElementVisibilityService.isFormFieldViewable(element);
            if (!previouslyViewable && autofillField.viewable) {
                this.setupInlineMenu(element, autofillField);
            }
        }));
    }
    /**
     * Queries the DOM for all the forms elements and
     * returns a collection of AutofillForm objects.
     * @returns {Record<string, AutofillForm>}
     * @private
     */
    buildAutofillFormsData(formElements) {
        for (let index = 0; index < formElements.length; index++) {
            const formElement = formElements[index];
            formElement.opid = `__form__${index}`;
            const existingAutofillForm = this.autofillFormElements.get(formElement);
            if (existingAutofillForm) {
                existingAutofillForm.opid = formElement.opid;
                this.autofillFormElements.set(formElement, existingAutofillForm);
                continue;
            }
            this.autofillFormElements.set(formElement, {
                opid: formElement.opid,
                htmlAction: this.getFormActionAttribute(formElement),
                htmlName: this.getPropertyOrAttribute(formElement, "name"),
                htmlID: this.getPropertyOrAttribute(formElement, "id"),
                htmlMethod: this.getPropertyOrAttribute(formElement, "method"),
            });
        }
        return this.getFormattedAutofillFormsData();
    }
    /**
     * Returns the action attribute of the form element. If the action attribute
     * is a relative path, it will be converted to an absolute path.
     * @param {ElementWithOpId<HTMLFormElement>} element
     * @returns {string}
     * @private
     */
    getFormActionAttribute(element) {
        return new URL(this.getPropertyOrAttribute(element, "action"), globalThis.location.href).href;
    }
    /**
     * Iterates over all known form elements and returns an AutofillForm object
     * containing a key value pair of the form element's opid and the form data.
     * @returns {Record<string, AutofillForm>}
     * @private
     */
    getFormattedAutofillFormsData() {
        const autofillForms = {};
        const autofillFormElements = Array.from(this.autofillFormElements);
        for (let index = 0; index < autofillFormElements.length; index++) {
            const [formElement, autofillForm] = autofillFormElements[index];
            autofillForms[formElement.opid] = autofillForm;
        }
        return autofillForms;
    }
    /**
     * Queries the DOM for all the field elements and
     * returns a list of AutofillField objects.
     * @returns {Promise<AutofillField[]>}
     * @private
     */
    buildAutofillFieldsData(formFieldElements) {
        return collect_autofill_content_service_awaiter(this, void 0, void 0, function* () {
            const autofillFieldElements = this.getAutofillFieldElements(100, formFieldElements);
            const autofillFieldDataPromises = autofillFieldElements.map(this.buildAutofillFieldItem);
            return Promise.all(autofillFieldDataPromises);
        });
    }
    /**
     * Queries the DOM for all the field elements that can be autofilled,
     * and returns a list limited to the given `fieldsLimit` number that
     * is ordered by priority.
     * @param {number} fieldsLimit - The maximum number of fields to return
     * @param {FormFieldElement[]} previouslyFoundFormFieldElements - The list of all the field elements
     * @returns {FormFieldElement[]}
     * @private
     */
    getAutofillFieldElements(fieldsLimit, previouslyFoundFormFieldElements) {
        var _a;
        let formFieldElements = previouslyFoundFormFieldElements;
        if (!formFieldElements) {
            formFieldElements = this.useTreeWalkerStrategyFlagSet
                ? this.queryTreeWalkerForAutofillFormFieldElements()
                : this.deepQueryElements(document, this.formFieldQueryString, true);
        }
        if (!fieldsLimit || formFieldElements.length <= fieldsLimit) {
            return formFieldElements;
        }
        const priorityFormFields = [];
        const unimportantFormFields = [];
        const unimportantFieldTypesSet = new Set(["checkbox", "radio"]);
        for (const element of formFieldElements) {
            if (priorityFormFields.length >= fieldsLimit) {
                return priorityFormFields;
            }
            const fieldType = (_a = this.getPropertyOrAttribute(element, "type")) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (unimportantFieldTypesSet.has(fieldType)) {
                unimportantFormFields.push(element);
                continue;
            }
            priorityFormFields.push(element);
        }
        const numberUnimportantFieldsToInclude = fieldsLimit - priorityFormFields.length;
        for (let index = 0; index < numberUnimportantFieldsToInclude; index++) {
            priorityFormFields.push(unimportantFormFields[index]);
        }
        return priorityFormFields;
    }
    /**
     * Caches the autofill field element and its data.
     * Will not cache the element if the index is less than 0.
     *
     * @param index - The index of the autofill field element
     * @param element - The autofill field element to cache
     * @param autofillFieldData - The autofill field data to cache
     */
    cacheAutofillFieldElement(index, element, autofillFieldData) {
        if (index < 0) {
            return;
        }
        this.autofillFieldElements.set(element, autofillFieldData);
    }
    /**
     * Identifies the autocomplete attribute associated with an element and returns
     * the value of the attribute if it is not set to "off".
     * @param {ElementWithOpId<FormFieldElement>} element
     * @returns {string}
     * @private
     */
    getAutoCompleteAttribute(element) {
        return (this.getPropertyOrAttribute(element, "x-autocompletetype") ||
            this.getPropertyOrAttribute(element, "autocompletetype") ||
            this.getPropertyOrAttribute(element, "autocomplete"));
    }
    /**
     * Returns the attribute of an element as a lowercase value.
     * @param {ElementWithOpId<FormFieldElement>} element
     * @param {string} attributeName
     * @returns {string}
     * @private
     */
    getAttributeLowerCase(element, attributeName) {
        var _a;
        return (_a = this.getPropertyOrAttribute(element, attributeName)) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    }
    /**
     * Returns the value of an element's property or attribute.
     * @returns {AutofillField[]}
     * @private
     */
    getFormattedAutofillFieldsData() {
        return Array.from(this.autofillFieldElements.values());
    }
    /**
     * Creates a label tag used to autofill the element pulled from a label
     * associated with the element's id, name, parent element or from an
     * associated description term element if no other labels can be found.
     * Returns a string containing all the `textContent` or `innerText`
     * values of the label elements.
     * @param {FillableFormFieldElement} element
     * @returns {string}
     * @private
     */
    createAutofillFieldLabelTag(element) {
        var _a;
        const labelElementsSet = new Set(element.labels);
        if (labelElementsSet.size) {
            return this.createLabelElementsTag(labelElementsSet);
        }
        const labelElements = this.queryElementLabels(element);
        for (let labelIndex = 0; labelIndex < (labelElements === null || labelElements === void 0 ? void 0 : labelElements.length); labelIndex++) {
            labelElementsSet.add(labelElements[labelIndex]);
        }
        let currentElement = element;
        while (currentElement && currentElement !== document.documentElement) {
            if (elementIsLabelElement(currentElement)) {
                labelElementsSet.add(currentElement);
            }
            currentElement = (_a = currentElement.parentElement) === null || _a === void 0 ? void 0 : _a.closest("label");
        }
        if (!labelElementsSet.size &&
            elementIsDescriptionDetailsElement(element.parentElement) &&
            elementIsDescriptionTermElement(element.parentElement.previousElementSibling)) {
            labelElementsSet.add(element.parentElement.previousElementSibling);
        }
        return this.createLabelElementsTag(labelElementsSet);
    }
    /**
     * Queries the DOM for label elements associated with the given element
     * by id or name. Returns a NodeList of label elements or null if none
     * are found.
     * @param {FillableFormFieldElement} element
     * @returns {NodeListOf<HTMLLabelElement> | null}
     * @private
     */
    queryElementLabels(element) {
        let labelQuerySelectors = element.id ? `label[for="${element.id}"]` : "";
        if (element.name) {
            const forElementNameSelector = `label[for="${element.name}"]`;
            labelQuerySelectors = labelQuerySelectors
                ? `${labelQuerySelectors}, ${forElementNameSelector}`
                : forElementNameSelector;
        }
        if (!labelQuerySelectors) {
            return null;
        }
        return element.getRootNode().querySelectorAll(labelQuerySelectors.replace(/\n/g, ""));
    }
    /**
     * Gets the maxLength property of the passed FormFieldElement and
     * returns the value or null if the element does not have a
     * maxLength property. If the element has a maxLength property
     * greater than 999, it will return 999.
     * @param {FormFieldElement} element
     * @returns {number | null}
     * @private
     */
    getAutofillFieldMaxLength(element) {
        const elementHasMaxLengthProperty = elementIsInputElement(element) || elementIsTextAreaElement(element);
        const elementMaxLength = elementHasMaxLengthProperty && element.maxLength > -1 ? element.maxLength : 999;
        return elementHasMaxLengthProperty ? Math.min(elementMaxLength, 999) : null;
    }
    /**
     * Iterates over the next siblings of the passed element and
     * returns a string of the text content of each element. Will
     * stop iterating if it encounters a new section element.
     * @param {FormFieldElement} element
     * @returns {string}
     * @private
     */
    createAutofillFieldRightLabel(element) {
        const labelTextContent = [];
        let currentElement = element;
        while (currentElement && currentElement.nextSibling) {
            currentElement = currentElement.nextSibling;
            if (this.isNewSectionElement(currentElement)) {
                break;
            }
            const textContent = this.getTextContentFromElement(currentElement);
            if (textContent) {
                labelTextContent.push(textContent);
            }
        }
        return labelTextContent.join("");
    }
    /**
     * Recursively gets the text content from an element's previous siblings
     * and returns a string of the text content of each element.
     * @param {FormFieldElement} element
     * @returns {string}
     * @private
     */
    createAutofillFieldLeftLabel(element) {
        const labelTextContent = this.recursivelyGetTextFromPreviousSiblings(element);
        return labelTextContent.reverse().join("");
    }
    /**
     * Assumes that the input elements that are to be autofilled are within a
     * table structure. Queries the previous sibling of the parent row that
     * the input element is in and returns the text content of the cell that
     * is in the same column as the input element.
     * @param {FormFieldElement} element
     * @returns {string | null}
     * @private
     */
    createAutofillFieldTopLabel(element) {
        var _a, _b;
        const tableDataElement = element.closest("td");
        if (!tableDataElement) {
            return null;
        }
        const tableDataElementIndex = tableDataElement.cellIndex;
        const parentSiblingTableRowElement = (_a = tableDataElement.closest("tr")) === null || _a === void 0 ? void 0 : _a.previousElementSibling;
        return ((_b = parentSiblingTableRowElement === null || parentSiblingTableRowElement === void 0 ? void 0 : parentSiblingTableRowElement.cells) === null || _b === void 0 ? void 0 : _b.length) > tableDataElementIndex
            ? this.getTextContentFromElement(parentSiblingTableRowElement.cells[tableDataElementIndex])
            : null;
    }
    /**
     * Check if the element's tag indicates that a transition to a new section of the
     * page is occurring. If so, we should not use the element or its children in order
     * to get autofill context for the previous element.
     * @param {HTMLElement} currentElement
     * @returns {boolean}
     * @private
     */
    isNewSectionElement(currentElement) {
        if (!currentElement) {
            return true;
        }
        const transitionalElementTagsSet = new Set([
            "html",
            "body",
            "button",
            "form",
            "head",
            "iframe",
            "input",
            "option",
            "script",
            "select",
            "table",
            "textarea",
        ]);
        return ("tagName" in currentElement &&
            transitionalElementTagsSet.has(currentElement.tagName.toLowerCase()));
    }
    /**
     * Gets the text content from a passed element, regardless of whether it is a
     * text node, an element node or an HTMLElement.
     * @param {Node | HTMLElement} element
     * @returns {string}
     * @private
     */
    getTextContentFromElement(element) {
        if (element.nodeType === Node.TEXT_NODE) {
            return this.trimAndRemoveNonPrintableText(element.nodeValue);
        }
        return this.trimAndRemoveNonPrintableText(element.textContent || element.innerText);
    }
    /**
     * Removes non-printable characters from the passed text
     * content and trims leading and trailing whitespace.
     * @param {string} textContent
     * @returns {string}
     * @private
     */
    trimAndRemoveNonPrintableText(textContent) {
        return (textContent || "")
            .replace(/[^\x20-\x7E]+|\s+/g, " ") // Strip out non-primitive characters and replace multiple spaces with a single space
            .trim(); // Trim leading and trailing whitespace
    }
    /**
     * Get the text content from the previous siblings of the element. If
     * no text content is found, recursively get the text content from the
     * previous siblings of the parent element.
     * @param {FormFieldElement} element
     * @returns {string[]}
     * @private
     */
    recursivelyGetTextFromPreviousSiblings(element) {
        const textContentItems = [];
        let currentElement = element;
        while (currentElement && currentElement.previousSibling) {
            // Ensure we are capturing text content from nodes and elements.
            currentElement = currentElement.previousSibling;
            if (this.isNewSectionElement(currentElement)) {
                return textContentItems;
            }
            const textContent = this.getTextContentFromElement(currentElement);
            if (textContent) {
                textContentItems.push(textContent);
            }
        }
        if (!currentElement || textContentItems.length) {
            return textContentItems;
        }
        // Prioritize capturing text content from elements rather than nodes.
        currentElement = currentElement.parentElement || currentElement.parentNode;
        if (!currentElement) {
            return textContentItems;
        }
        let siblingElement = nodeIsElement(currentElement)
            ? currentElement.previousElementSibling
            : currentElement.previousSibling;
        while ((siblingElement === null || siblingElement === void 0 ? void 0 : siblingElement.lastChild) && !this.isNewSectionElement(siblingElement)) {
            siblingElement = siblingElement.lastChild;
        }
        if (this.isNewSectionElement(siblingElement)) {
            return textContentItems;
        }
        const textContent = this.getTextContentFromElement(siblingElement);
        if (textContent) {
            textContentItems.push(textContent);
            return textContentItems;
        }
        return this.recursivelyGetTextFromPreviousSiblings(siblingElement);
    }
    /**
     * Gets the value of the element. If the element is a checkbox, returns a checkmark if the
     * checkbox is checked, or an empty string if it is not checked. If the element is a hidden
     * input, returns the value of the input if it is less than 254 characters, or a truncated
     * value if it is longer than 254 characters.
     * @param {FormFieldElement} element
     * @returns {string}
     * @private
     */
    getElementValue(element) {
        if (!elementIsFillableFormField(element)) {
            const spanTextContent = element.textContent || element.innerText;
            return spanTextContent || "";
        }
        const elementValue = element.value || "";
        const elementType = String(element.type).toLowerCase();
        if ("checked" in element && elementType === "checkbox") {
            return element.checked ? "✓" : "";
        }
        if (elementType === "hidden") {
            const inputValueMaxLength = 254;
            return elementValue.length > inputValueMaxLength
                ? `${elementValue.substring(0, inputValueMaxLength)}...SNIPPED`
                : elementValue;
        }
        return elementValue;
    }
    /**
     * Get the options from a select element and return them as an array
     * of arrays indicating the select element option text and value.
     * @param {HTMLSelectElement} element
     * @returns {{options: (string | null)[][]}}
     * @private
     */
    getSelectElementOptions(element) {
        const options = Array.from(element.options).map((option) => {
            const optionText = option.text
                ? String(option.text)
                    .toLowerCase()
                    .replace(/[\s~`!@$%^&#*()\-_+=:;'"[\]|\\,<.>?]/gm, "") // Remove whitespace and punctuation
                : null;
            return [optionText, option.value];
        });
        return { options };
    }
    /**
     * Queries all potential form and field elements from the DOM and returns
     * a collection of form and field elements. Leverages the TreeWalker API
     * to deep query Shadow DOM elements.
     */
    queryAutofillFormAndFieldElements() {
        if (this.useTreeWalkerStrategyFlagSet) {
            return this.queryTreeWalkerForAutofillFormAndFieldElements();
        }
        const queriedElements = this.deepQueryElements(document, `form, ${this.formFieldQueryString}`, true);
        const formElements = [];
        const formFieldElements = [];
        for (let index = 0; index < queriedElements.length; index++) {
            const element = queriedElements[index];
            if (elementIsFormElement(element)) {
                formElements.push(element);
                continue;
            }
            if (this.isNodeFormFieldElement(element)) {
                formFieldElements.push(element);
            }
        }
        return { formElements, formFieldElements };
    }
    /**
     * Checks if the passed node is a form field element.
     * @param {Node} node
     * @returns {boolean}
     * @private
     */
    isNodeFormFieldElement(node) {
        if (!nodeIsElement(node)) {
            return false;
        }
        const nodeTagName = node.tagName.toLowerCase();
        const nodeIsSpanElementWithAutofillAttribute = nodeTagName === "span" && node.hasAttribute("data-bwautofill");
        if (nodeIsSpanElementWithAutofillAttribute) {
            return true;
        }
        const nodeHasBwIgnoreAttribute = node.hasAttribute("data-bwignore");
        const nodeIsValidInputElement = nodeTagName === "input" && !this.ignoredInputTypes.has(node.type);
        if (nodeIsValidInputElement && !nodeHasBwIgnoreAttribute) {
            return true;
        }
        return this.nonInputFormFieldTags.has(nodeTagName) && !nodeHasBwIgnoreAttribute;
    }
    /**
     * Attempts to get the ShadowRoot of the passed node. If support for the
     * extension based openOrClosedShadowRoot API is available, it will be used.
     * Will return null if the node is not an HTMLElement or if the node has
     * child nodes.
     *
     * @param {Node} node
     */
    getShadowRoot(node) {
        var _a;
        if (!nodeIsElement(node)) {
            return null;
        }
        if (node.shadowRoot) {
            return node.shadowRoot;
        }
        if ((_a = chrome.dom) === null || _a === void 0 ? void 0 : _a.openOrClosedShadowRoot) {
            try {
                return chrome.dom.openOrClosedShadowRoot(node);
            }
            catch (error) {
                return null;
            }
        }
        return node.openOrClosedShadowRoot;
    }
    /**
     * Sets up a mutation observer on the body of the document. Observes changes to
     * DOM elements to ensure we have an updated set of autofill field data.
     * @private
     */
    setupMutationObserver() {
        this.currentLocationHref = globalThis.location.href;
        this.mutationObserver = new MutationObserver(this.handleMutationObserverMutation);
        this.mutationObserver.observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }
    /**
     * Handles a mutation to the window location. Clears the autofill elements
     * and updates the autofill elements after a timeout.
     * @private
     */
    handleWindowLocationMutation() {
        this.currentLocationHref = globalThis.location.href;
        this.domRecentlyMutated = true;
        if (this.autofillOverlayContentService) {
            this.autofillOverlayContentService.pageDetailsUpdateRequired = true;
            void this.sendExtensionMessage("closeAutofillInlineMenu", { forceCloseInlineMenu: true });
        }
        this.noFieldsFound = false;
        this.autofillFormElements.clear();
        this.autofillFieldElements.clear();
        this.updateAutofillElementsAfterMutation();
    }
    /**
     * Processes a mutation record and updates the autofill elements if necessary.
     *
     * @param mutations - The mutation record to process
     */
    processMutationRecord(mutations) {
        for (let mutationIndex = 0; mutationIndex < mutations.length; mutationIndex++) {
            const mutation = mutations[mutationIndex];
            if (mutation.type === "childList" &&
                (this.isAutofillElementNodeMutated(mutation.removedNodes, true) ||
                    this.isAutofillElementNodeMutated(mutation.addedNodes))) {
                this.domRecentlyMutated = true;
                if (this.autofillOverlayContentService) {
                    this.autofillOverlayContentService.pageDetailsUpdateRequired = true;
                }
                this.noFieldsFound = false;
                continue;
            }
            if (mutation.type === "attributes") {
                this.handleAutofillElementAttributeMutation(mutation);
            }
        }
    }
    /**
     * Checks if the passed nodes either contain or are autofill elements.
     *
     * @param nodes - The nodes to check
     * @param isRemovingNodes - Whether the nodes are being removed
     */
    isAutofillElementNodeMutated(nodes, isRemovingNodes = false) {
        if (!nodes.length) {
            return false;
        }
        let isElementMutated = false;
        let mutatedElements = [];
        for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];
            if (!nodeIsElement(node)) {
                continue;
            }
            if (!this.useTreeWalkerStrategyFlagSet &&
                (nodeIsFormElement(node) || this.isNodeFormFieldElement(node))) {
                mutatedElements.push(node);
            }
            const autofillElements = this.useTreeWalkerStrategyFlagSet
                ? this.queryTreeWalkerForMutatedElements(node)
                : this.deepQueryElements(node, `form, ${this.formFieldQueryString}`, true);
            if (autofillElements.length) {
                mutatedElements = mutatedElements.concat(autofillElements);
            }
            if (mutatedElements.length) {
                isElementMutated = true;
            }
        }
        if (isRemovingNodes) {
            for (let elementIndex = 0; elementIndex < mutatedElements.length; elementIndex++) {
                const element = mutatedElements[elementIndex];
                this.deleteCachedAutofillElement(element);
            }
        }
        else if (this.autofillOverlayContentService) {
            this.setupOverlayListenersOnMutatedElements(mutatedElements);
        }
        return isElementMutated;
    }
    /**
     * Sets up the overlay listeners on the passed mutated elements. This ensures
     * that the overlay can appear on elements that are injected into the DOM after
     * the initial page load.
     *
     * @param mutatedElements - HTML elements that have been mutated
     */
    setupOverlayListenersOnMutatedElements(mutatedElements) {
        for (let elementIndex = 0; elementIndex < mutatedElements.length; elementIndex++) {
            const node = mutatedElements[elementIndex];
            if (!this.isNodeFormFieldElement(node) ||
                this.autofillFieldElements.get(node)) {
                continue;
            }
            requestIdleCallbackPolyfill(
            // We are setting this item to a -1 index because we do not know its position in the DOM.
            // This value should be updated with the next call to collect page details.
            () => void this.buildAutofillFieldItem(node, -1), { timeout: 1000 });
        }
    }
    /**
     * Deletes any cached autofill elements that have been
     * removed from the DOM.
     * @param {ElementWithOpId<HTMLFormElement> | ElementWithOpId<FormFieldElement>} element
     * @private
     */
    deleteCachedAutofillElement(element) {
        if (elementIsFormElement(element) && this.autofillFormElements.has(element)) {
            this.autofillFormElements.delete(element);
            return;
        }
        if (this.autofillFieldElements.has(element)) {
            this.autofillFieldElements.delete(element);
        }
    }
    /**
     * Updates the autofill elements after a DOM mutation has occurred.
     * Is debounced to prevent excessive updates.
     * @private
     */
    updateAutofillElementsAfterMutation() {
        if (this.updateAfterMutationIdleCallback) {
            cancelIdleCallbackPolyfill(this.updateAfterMutationIdleCallback);
        }
        this.updateAfterMutationIdleCallback = requestIdleCallbackPolyfill(this.getPageDetails.bind(this), { timeout: this.updateAfterMutationTimeout });
    }
    /**
     * Handles observed DOM mutations related to an autofill element attribute.
     * @param {MutationRecord} mutation
     * @private
     */
    handleAutofillElementAttributeMutation(mutation) {
        var _a;
        const targetElement = mutation.target;
        if (!nodeIsElement(targetElement)) {
            return;
        }
        const attributeName = (_a = mutation.attributeName) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const autofillForm = this.autofillFormElements.get(targetElement);
        if (autofillForm) {
            this.updateAutofillFormElementData(attributeName, targetElement, autofillForm);
            return;
        }
        const autofillField = this.autofillFieldElements.get(targetElement);
        if (!autofillField) {
            return;
        }
        this.updateAutofillFieldElementData(attributeName, targetElement, autofillField);
    }
    /**
     * Updates the autofill form element data based on the passed attribute name.
     * @param {string} attributeName
     * @param {ElementWithOpId<HTMLFormElement>} element
     * @param {AutofillForm} dataTarget
     * @private
     */
    updateAutofillFormElementData(attributeName, element, dataTarget) {
        const updateAttribute = (dataTargetKey) => {
            this.updateAutofillDataAttribute({ element, attributeName, dataTarget, dataTargetKey });
        };
        const updateActions = {
            action: () => (dataTarget.htmlAction = this.getFormActionAttribute(element)),
            name: () => updateAttribute("htmlName"),
            id: () => updateAttribute("htmlID"),
            method: () => updateAttribute("htmlMethod"),
        };
        if (!updateActions[attributeName]) {
            return;
        }
        updateActions[attributeName]();
        if (this.autofillFormElements.has(element)) {
            this.autofillFormElements.set(element, dataTarget);
        }
    }
    /**
     * Updates the autofill field element data based on the passed attribute name.
     *
     * @param {string} attributeName
     * @param {ElementWithOpId<FormFieldElement>} element
     * @param {AutofillField} dataTarget
     */
    updateAutofillFieldElementData(attributeName, element, dataTarget) {
        const updateAttribute = (dataTargetKey) => {
            this.updateAutofillDataAttribute({ element, attributeName, dataTarget, dataTargetKey });
        };
        const updateActions = {
            maxlength: () => (dataTarget.maxLength = this.getAutofillFieldMaxLength(element)),
            id: () => updateAttribute("htmlID"),
            name: () => updateAttribute("htmlName"),
            class: () => updateAttribute("htmlClass"),
            tabindex: () => updateAttribute("tabindex"),
            title: () => updateAttribute("tabindex"),
            rel: () => updateAttribute("rel"),
            tagname: () => (dataTarget.tagName = this.getAttributeLowerCase(element, "tagName")),
            type: () => (dataTarget.type = this.getAttributeLowerCase(element, "type")),
            value: () => (dataTarget.value = this.getElementValue(element)),
            checked: () => (dataTarget.checked = this.getAttributeBoolean(element, "checked")),
            disabled: () => (dataTarget.disabled = this.getAttributeBoolean(element, "disabled")),
            readonly: () => (dataTarget.readonly = this.getAttributeBoolean(element, "readonly")),
            autocomplete: () => (dataTarget.autoCompleteType = this.getAutoCompleteAttribute(element)),
            "data-label": () => updateAttribute("label-data"),
            "aria-label": () => updateAttribute("label-aria"),
            "aria-hidden": () => (dataTarget["aria-hidden"] = this.getAttributeBoolean(element, "aria-hidden", true)),
            "aria-disabled": () => (dataTarget["aria-disabled"] = this.getAttributeBoolean(element, "aria-disabled", true)),
            "aria-haspopup": () => (dataTarget["aria-haspopup"] = this.getAttributeBoolean(element, "aria-haspopup", true)),
            "data-stripe": () => updateAttribute("data-stripe"),
        };
        if (!updateActions[attributeName]) {
            return;
        }
        updateActions[attributeName]();
        if (this.autofillFieldElements.has(element)) {
            this.autofillFieldElements.set(element, dataTarget);
        }
    }
    /**
     * Gets the attribute value for the passed element, and returns it. If the dataTarget
     * and dataTargetKey are passed, it will set the value of the dataTarget[dataTargetKey].
     * @param UpdateAutofillDataAttributeParams
     * @returns {string}
     * @private
     */
    updateAutofillDataAttribute({ element, attributeName, dataTarget, dataTargetKey, }) {
        const attributeValue = this.getPropertyOrAttribute(element, attributeName);
        if (dataTarget && dataTargetKey) {
            dataTarget[dataTargetKey] = attributeValue;
        }
        return attributeValue;
    }
    /**
     * Sets up an IntersectionObserver to observe found form
     * field elements that are not viewable in the viewport.
     */
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(this.handleFormElementIntersection, {
            root: null,
            rootMargin: "0px",
            threshold: 1.0,
        });
    }
    /**
     * Iterates over all cached field elements and sets up the inline menu listeners on each field.
     *
     * @param pageDetails - The page details to use for the inline menu listeners
     */
    setupInlineMenuListeners(pageDetails) {
        if (!this.autofillOverlayContentService) {
            return;
        }
        this.autofillFieldElements.forEach((autofillField, formFieldElement) => {
            this.setupInlineMenu(formFieldElement, autofillField, pageDetails);
        });
    }
    /**
     * Sets up the inline menu listener on the passed field element.
     *
     * @param formFieldElement - The form field element to set up the inline menu listener on
     * @param autofillField - The metadata for the form field
     * @param pageDetails - The page details to use for the inline menu listeners
     */
    setupInlineMenu(formFieldElement, autofillField, pageDetails) {
        if (!this.autofillOverlayContentService) {
            return;
        }
        const autofillPageDetails = pageDetails ||
            this.getFormattedPageDetails(this.getFormattedAutofillFormsData(), this.getFormattedAutofillFieldsData());
        void this.autofillOverlayContentService.setupInlineMenu(formFieldElement, autofillField, autofillPageDetails);
    }
    /**
     * Destroys the CollectAutofillContentService. Clears all
     * timeouts and disconnects the mutation observer.
     */
    destroy() {
        var _a, _b;
        if (this.updateAfterMutationIdleCallback) {
            cancelIdleCallbackPolyfill(this.updateAfterMutationIdleCallback);
        }
        (_a = this.mutationObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        (_b = this.intersectionObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
    }
    /**
     * Queries the DOM for all the nodes that match the given filter callback
     * and returns a collection of nodes.
     * @param rootNode
     * @param filterCallback
     * @param isObservingShadowRoot
     *
     * @deprecated - This method remains as a fallback in the case that the deepQuery implementation fails.
     */
    queryAllTreeWalkerNodes(rootNode, filterCallback, isObservingShadowRoot = true) {
        const treeWalkerQueryResults = [];
        this.buildTreeWalkerNodesQueryResults(rootNode, treeWalkerQueryResults, filterCallback, isObservingShadowRoot);
        return treeWalkerQueryResults;
    }
    /**
     * Recursively builds a collection of nodes that match the given filter callback.
     * If a node has a ShadowRoot, it will be observed for mutations.
     *
     * @param rootNode
     * @param treeWalkerQueryResults
     * @param filterCallback
     *
     * @deprecated - This method remains as a fallback in the case that the deepQuery implementation fails.
     */
    buildTreeWalkerNodesQueryResults(rootNode, treeWalkerQueryResults, filterCallback, isObservingShadowRoot) {
        const treeWalker = document === null || document === void 0 ? void 0 : document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT);
        let currentNode = treeWalker === null || treeWalker === void 0 ? void 0 : treeWalker.currentNode;
        while (currentNode) {
            if (filterCallback(currentNode)) {
                treeWalkerQueryResults.push(currentNode);
            }
            const nodeShadowRoot = this.getShadowRoot(currentNode);
            if (nodeShadowRoot) {
                if (isObservingShadowRoot) {
                    this.mutationObserver.observe(nodeShadowRoot, {
                        attributes: true,
                        childList: true,
                        subtree: true,
                    });
                }
                this.buildTreeWalkerNodesQueryResults(nodeShadowRoot, treeWalkerQueryResults, filterCallback, isObservingShadowRoot);
            }
            currentNode = treeWalker === null || treeWalker === void 0 ? void 0 : treeWalker.nextNode();
        }
    }
    /**
     * @deprecated - This method remains as a fallback in the case that the deepQuery implementation fails.
     */
    queryTreeWalkerForAutofillFormAndFieldElements() {
        const formElements = [];
        const formFieldElements = [];
        this.queryAllTreeWalkerNodes(document.documentElement, (node) => {
            if (nodeIsFormElement(node)) {
                formElements.push(node);
                return true;
            }
            if (this.isNodeFormFieldElement(node)) {
                formFieldElements.push(node);
                return true;
            }
            return false;
        });
        return { formElements, formFieldElements };
    }
    /**
     * @deprecated - This method remains as a fallback in the case that the deepQuery implementation fails.
     */
    queryTreeWalkerForAutofillFormFieldElements() {
        return this.queryAllTreeWalkerNodes(document.documentElement, (node) => this.isNodeFormFieldElement(node));
    }
    /**
     * @deprecated - This method remains as a fallback in the case that the deepQuery implementation fails.
     *
     * @param node - The node to query
     */
    queryTreeWalkerForMutatedElements(node) {
        return this.queryAllTreeWalkerNodes(node, (walkerNode) => nodeIsFormElement(walkerNode) || this.isNodeFormFieldElement(walkerNode));
    }
    /**
     * @deprecated - This method remains as a fallback in the case that the deepQuery implementation fails.
     */
    queryTreeWalkerForPasswordElements() {
        return this.queryAllTreeWalkerNodes(document.documentElement, (node) => nodeIsInputElement(node) && node.type === "password", false);
    }
    /**
     * This is a temporary method to maintain a fallback strategy for the tree walker API
     *
     * @deprecated - This method remains as a fallback in the case that the deepQuery implementation fails.
     */
    isPasswordFieldWithinDocument() {
        var _a, _b;
        if (this.useTreeWalkerStrategyFlagSet) {
            return Boolean((_a = this.queryTreeWalkerForPasswordElements()) === null || _a === void 0 ? void 0 : _a.length);
        }
        return Boolean((_b = this.deepQueryElements(document, `input[type="password"]`)) === null || _b === void 0 ? void 0 : _b.length);
    }
}
/* harmony default export */ var collect_autofill_content_service = (CollectAutofillContentService);

;// CONCATENATED MODULE: ./src/autofill/services/dom-element-visibility.service.ts
var dom_element_visibility_service_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class DomElementVisibilityService {
    constructor(inlineMenuElements) {
        this.inlineMenuElements = inlineMenuElements;
        this.cachedComputedStyle = null;
    }
    /**
     * Checks if a form field is viewable. This is done by checking if the element is within the
     * viewport bounds, not hidden by CSS, and not hidden behind another element.
     * @param {FormFieldElement} element
     * @returns {Promise<boolean>}
     */
    isFormFieldViewable(element) {
        return dom_element_visibility_service_awaiter(this, void 0, void 0, function* () {
            const elementBoundingClientRect = element.getBoundingClientRect();
            if (this.isElementOutsideViewportBounds(element, elementBoundingClientRect) ||
                this.isElementHiddenByCss(element)) {
                return false;
            }
            return this.formFieldIsNotHiddenBehindAnotherElement(element, elementBoundingClientRect);
        });
    }
    /**
     * Check if the target element is hidden using CSS. This is done by checking the opacity, display,
     * visibility, and clip-path CSS properties of the element. We also check the opacity of all
     * parent elements to ensure that the target element is not hidden by a parent element.
     * @param {HTMLElement} element
     * @returns {boolean}
     * @public
     */
    isElementHiddenByCss(element) {
        this.cachedComputedStyle = null;
        if (this.isElementInvisible(element) ||
            this.isElementNotDisplayed(element) ||
            this.isElementNotVisible(element) ||
            this.isElementClipped(element)) {
            return true;
        }
        let parentElement = element.parentElement;
        while (parentElement && parentElement !== element.ownerDocument.documentElement) {
            this.cachedComputedStyle = null;
            if (this.isElementInvisible(parentElement)) {
                return true;
            }
            parentElement = parentElement.parentElement;
        }
        return false;
    }
    /**
     * Gets the computed style of a given element, will only calculate the computed
     * style if the element's style has not been previously cached.
     * @param {HTMLElement} element
     * @param {string} styleProperty
     * @returns {string}
     * @private
     */
    getElementStyle(element, styleProperty) {
        if (!this.cachedComputedStyle) {
            this.cachedComputedStyle = (element.ownerDocument.defaultView || globalThis).getComputedStyle(element);
        }
        return this.cachedComputedStyle.getPropertyValue(styleProperty);
    }
    /**
     * Checks if the opacity of the target element is less than 0.1.
     * @param {HTMLElement} element
     * @returns {boolean}
     * @private
     */
    isElementInvisible(element) {
        return parseFloat(this.getElementStyle(element, "opacity")) < 0.1;
    }
    /**
     * Checks if the target element has a display property of none.
     * @param {HTMLElement} element
     * @returns {boolean}
     * @private
     */
    isElementNotDisplayed(element) {
        return this.getElementStyle(element, "display") === "none";
    }
    /**
     * Checks if the target element has a visibility property of hidden or collapse.
     * @param {HTMLElement} element
     * @returns {boolean}
     * @private
     */
    isElementNotVisible(element) {
        return new Set(["hidden", "collapse"]).has(this.getElementStyle(element, "visibility"));
    }
    /**
     * Checks if the target element has a clip-path property that hides the element.
     * @param {HTMLElement} element
     * @returns {boolean}
     * @private
     */
    isElementClipped(element) {
        return new Set([
            "inset(50%)",
            "inset(100%)",
            "circle(0)",
            "circle(0px)",
            "circle(0px at 50% 50%)",
            "polygon(0 0, 0 0, 0 0, 0 0)",
            "polygon(0px 0px, 0px 0px, 0px 0px, 0px 0px)",
        ]).has(this.getElementStyle(element, "clipPath"));
    }
    /**
     * Checks if the target element is outside the viewport bounds. This is done by checking if the
     * element is too small or is overflowing the viewport bounds.
     * @param {HTMLElement} targetElement
     * @param {DOMRectReadOnly | null} targetElementBoundingClientRect
     * @returns {boolean}
     * @private
     */
    isElementOutsideViewportBounds(targetElement, targetElementBoundingClientRect = null) {
        const documentElement = targetElement.ownerDocument.documentElement;
        const documentElementWidth = documentElement.scrollWidth;
        const documentElementHeight = documentElement.scrollHeight;
        const elementBoundingClientRect = targetElementBoundingClientRect || targetElement.getBoundingClientRect();
        const elementTopOffset = elementBoundingClientRect.top - documentElement.clientTop;
        const elementLeftOffset = elementBoundingClientRect.left - documentElement.clientLeft;
        const isElementSizeInsufficient = elementBoundingClientRect.width < 10 || elementBoundingClientRect.height < 10;
        const isElementOverflowingLeftViewport = elementLeftOffset < 0;
        const isElementOverflowingRightViewport = elementLeftOffset + elementBoundingClientRect.width > documentElementWidth;
        const isElementOverflowingTopViewport = elementTopOffset < 0;
        const isElementOverflowingBottomViewport = elementTopOffset + elementBoundingClientRect.height > documentElementHeight;
        return (isElementSizeInsufficient ||
            isElementOverflowingLeftViewport ||
            isElementOverflowingRightViewport ||
            isElementOverflowingTopViewport ||
            isElementOverflowingBottomViewport);
    }
    /**
     * Checks if a passed FormField is not hidden behind another element. This is done by
     * checking if the element at the center point of the FormField is the FormField itself
     * or one of its labels.
     * @param {FormFieldElement} targetElement
     * @param {DOMRectReadOnly | null} targetElementBoundingClientRect
     * @returns {boolean}
     * @private
     */
    formFieldIsNotHiddenBehindAnotherElement(targetElement, targetElementBoundingClientRect = null) {
        var _a, _b;
        const elementBoundingClientRect = targetElementBoundingClientRect || targetElement.getBoundingClientRect();
        const elementRootNode = targetElement.getRootNode();
        const rootElement = elementRootNode instanceof ShadowRoot ? elementRootNode : targetElement.ownerDocument;
        const elementAtCenterPoint = rootElement.elementFromPoint(elementBoundingClientRect.left + elementBoundingClientRect.width / 2, elementBoundingClientRect.top + elementBoundingClientRect.height / 2);
        if (elementAtCenterPoint === targetElement) {
            return true;
        }
        if ((_a = this.inlineMenuElements) === null || _a === void 0 ? void 0 : _a.isElementInlineMenu(elementAtCenterPoint)) {
            return true;
        }
        const targetElementLabelsSet = new Set(targetElement.labels);
        if (targetElementLabelsSet.has(elementAtCenterPoint)) {
            return true;
        }
        const closestParentLabel = (_b = elementAtCenterPoint === null || elementAtCenterPoint === void 0 ? void 0 : elementAtCenterPoint.parentElement) === null || _b === void 0 ? void 0 : _b.closest("label");
        return targetElementLabelsSet.has(closestParentLabel);
    }
}
/* harmony default export */ var dom_element_visibility_service = (DomElementVisibilityService);

;// CONCATENATED MODULE: ./src/autofill/services/insert-autofill-content.service.ts
var insert_autofill_content_service_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class InsertAutofillContentService {
    /**
     * InsertAutofillContentService constructor. Instantiates the
     * DomElementVisibilityService and CollectAutofillContentService classes.
     */
    constructor(domElementVisibilityService, collectAutofillContentService) {
        this.autofillInsertActions = {
            fill_by_opid: ({ opid, value }) => this.handleFillFieldByOpidAction(opid, value),
            click_on_opid: ({ opid }) => this.handleClickOnFieldByOpidAction(opid),
            focus_by_opid: ({ opid }) => this.handleFocusOnFieldByOpidAction(opid),
        };
        /**
         * Runs the autofill action based on the action type and the opid.
         * Each action is subsequently delayed by 20 milliseconds.
         * @param {"click_on_opid" | "focus_by_opid" | "fill_by_opid"} action
         * @param {string} opid
         * @param {string} value
         * @param {number} actionIndex
         * @returns {Promise<void>}
         * @private
         */
        this.runFillScriptAction = ([action, opid, value], actionIndex) => {
            if (!opid || !this.autofillInsertActions[action]) {
                return;
            }
            const delayActionsInMilliseconds = 20;
            return new Promise((resolve) => setTimeout(() => {
                this.autofillInsertActions[action]({ opid, value });
                resolve();
            }, delayActionsInMilliseconds * actionIndex));
        };
        this.domElementVisibilityService = domElementVisibilityService;
        this.collectAutofillContentService = collectAutofillContentService;
    }
    /**
     * Handles autofill of the forms on the current page based on the
     * data within the passed fill script object.
     * @param {AutofillScript} fillScript
     * @returns {Promise<void>}
     * @public
     */
    fillForm(fillScript) {
        var _a;
        return insert_autofill_content_service_awaiter(this, void 0, void 0, function* () {
            if (!((_a = fillScript.script) === null || _a === void 0 ? void 0 : _a.length) ||
                this.fillingWithinSandboxedIframe() ||
                this.userCancelledInsecureUrlAutofill(fillScript.savedUrls) ||
                this.userCancelledUntrustedIframeAutofill(fillScript)) {
                return;
            }
            const fillActionPromises = fillScript.script.map(this.runFillScriptAction);
            yield Promise.all(fillActionPromises);
        });
    }
    /**
     * Identifies if the execution of this script is happening
     * within a sandboxed iframe.
     * @returns {boolean}
     * @private
     */
    fillingWithinSandboxedIframe() {
        var _a;
        return (String(self.origin).toLowerCase() === "null" ||
            ((_a = globalThis.frameElement) === null || _a === void 0 ? void 0 : _a.hasAttribute("sandbox")) ||
            globalThis.location.hostname === "");
    }
    /**
     * Checks if the autofill is occurring on a page that can be considered secure. If the page is not secure,
     * the user is prompted to confirm that they want to autofill on the page.
     * @param {string[] | null} savedUrls
     * @returns {boolean}
     * @private
     */
    userCancelledInsecureUrlAutofill(savedUrls) {
        if (!(savedUrls === null || savedUrls === void 0 ? void 0 : savedUrls.some((url) => url.startsWith(`https://${globalThis.location.hostname}`))) ||
            globalThis.location.protocol !== "http:" ||
            !this.isPasswordFieldWithinDocument()) {
            return false;
        }
        const confirmationWarning = [
            chrome.i18n.getMessage("insecurePageWarning"),
            chrome.i18n.getMessage("insecurePageWarningFillPrompt", [globalThis.location.hostname]),
        ].join("\n\n");
        return !globalThis.confirm(confirmationWarning);
    }
    /**
     * Checks if there is a password field within the current document. Includes
     * password fields that are present within the shadow DOM.
     * @returns {boolean}
     * @private
     */
    isPasswordFieldWithinDocument() {
        return this.collectAutofillContentService.isPasswordFieldWithinDocument();
    }
    /**
     * Checking if the autofill is occurring within an untrusted iframe. If the page is within an untrusted iframe,
     * the user is prompted to confirm that they want to autofill on the page. If the user cancels the autofill,
     * the script will not continue.
     *
     * Note: confirm() is blocked by sandboxed iframes, but we don't want to fill sandboxed iframes anyway.
     * If this occurs, confirm() returns false without displaying the dialog box, and autofill will be aborted.
     * The browser may print a message to the console, but this is not a standard error that we can handle.
     * @param {AutofillScript} fillScript
     * @returns {boolean}
     * @private
     */
    userCancelledUntrustedIframeAutofill(fillScript) {
        if (!fillScript.untrustedIframe) {
            return false;
        }
        const confirmationWarning = [
            chrome.i18n.getMessage("autofillIframeWarning"),
            chrome.i18n.getMessage("autofillIframeWarningTip", [globalThis.location.hostname]),
        ].join("\n\n");
        return !globalThis.confirm(confirmationWarning);
    }
    /**
     * Queries the DOM for an element by opid and inserts the passed value into the element.
     * @param {string} opid
     * @param {string} value
     * @private
     */
    handleFillFieldByOpidAction(opid, value) {
        const element = this.collectAutofillContentService.getAutofillFieldElementByOpid(opid);
        this.insertValueIntoField(element, value);
    }
    /**
     * Handles finding an element by opid and triggering a click event on the element.
     * @param {string} opid
     * @private
     */
    handleClickOnFieldByOpidAction(opid) {
        const element = this.collectAutofillContentService.getAutofillFieldElementByOpid(opid);
        this.triggerClickOnElement(element);
    }
    /**
     * Handles finding an element by opid and triggering click and focus events on the element.
     * To ensure that we trigger a blur event correctly on a filled field, we first check if the
     * element is already focused. If it is, we blur the element before focusing on it again.
     *
     * @param {string} opid - The opid of the element to focus on.
     */
    handleFocusOnFieldByOpidAction(opid) {
        const element = this.collectAutofillContentService.getAutofillFieldElementByOpid(opid);
        if (document.activeElement === element) {
            element.blur();
        }
        this.simulateUserMouseClickAndFocusEventInteractions(element, true);
    }
    /**
     * Identifies the type of element passed and inserts the value into the element.
     * Will trigger simulated events on the element to ensure that the element is
     * properly updated.
     * @param {FormFieldElement | null} element
     * @param {string} value
     * @private
     */
    insertValueIntoField(element, value) {
        const elementCanBeReadonly = elementIsInputElement(element) || elementIsTextAreaElement(element);
        const elementCanBeFilled = elementCanBeReadonly || elementIsSelectElement(element);
        if (!element ||
            !value ||
            (elementCanBeReadonly && element.readOnly) ||
            (elementCanBeFilled && element.disabled)) {
            return;
        }
        if (!elementIsFillableFormField(element)) {
            this.handleInsertValueAndTriggerSimulatedEvents(element, () => (element.innerText = value));
            return;
        }
        const isFillableCheckboxOrRadioElement = elementIsInputElement(element) &&
            new Set(["checkbox", "radio"]).has(element.type) &&
            new Set(["true", "y", "1", "yes", "✓"]).has(String(value).toLowerCase());
        if (isFillableCheckboxOrRadioElement) {
            this.handleInsertValueAndTriggerSimulatedEvents(element, () => (element.checked = true));
            return;
        }
        this.handleInsertValueAndTriggerSimulatedEvents(element, () => (element.value = value));
    }
    /**
     * Simulates pre- and post-insert events on the element meant to mimic user interactions
     * while inserting the autofill value into the element.
     * @param {FormFieldElement} element
     * @param {Function} valueChangeCallback
     * @private
     */
    handleInsertValueAndTriggerSimulatedEvents(element, valueChangeCallback) {
        this.triggerPreInsertEventsOnElement(element);
        valueChangeCallback();
        this.triggerPostInsertEventsOnElement(element);
        this.triggerFillAnimationOnElement(element);
    }
    /**
     * Simulates a mouse click event on the element, including focusing the event, and
     * the triggers a simulated keyboard event on the element. Will attempt to ensure
     * that the initial element value is not arbitrarily changed by the simulated events.
     * @param {FormFieldElement} element
     * @private
     */
    triggerPreInsertEventsOnElement(element) {
        const initialElementValue = "value" in element ? element.value : "";
        this.simulateUserMouseClickAndFocusEventInteractions(element);
        this.simulateUserKeyboardEventInteractions(element);
        if ("value" in element && initialElementValue !== element.value) {
            element.value = initialElementValue;
        }
    }
    /**
     * Simulates a keyboard event on the element before assigning the autofilled value to the element, and then
     * simulates an input change event on the element to trigger expected events after autofill occurs.
     * @param {FormFieldElement} element
     * @private
     */
    triggerPostInsertEventsOnElement(element) {
        const autofilledValue = "value" in element ? element.value : "";
        this.simulateUserKeyboardEventInteractions(element);
        if ("value" in element && autofilledValue !== element.value) {
            element.value = autofilledValue;
        }
        this.simulateInputElementChangedEvent(element);
    }
    /**
     * Identifies if a passed element can be animated and sets a class on the element
     * to trigger a CSS animation. The animation is removed after a short delay.
     * @param {FormFieldElement} element
     * @private
     */
    triggerFillAnimationOnElement(element) {
        const skipAnimatingElement = elementIsFillableFormField(element) &&
            !new Set(["email", "text", "password", "number", "tel", "url"]).has(element === null || element === void 0 ? void 0 : element.type);
        if (this.domElementVisibilityService.isElementHiddenByCss(element) || skipAnimatingElement) {
            return;
        }
        element.classList.add("com-bitwarden-browser-animated-fill");
        setTimeout(() => element.classList.remove("com-bitwarden-browser-animated-fill"), 200);
    }
    /**
     * Simulates a click  event on the element.
     * @param {HTMLElement} element
     * @private
     */
    triggerClickOnElement(element) {
        if (typeof (element === null || element === void 0 ? void 0 : element.click) !== TYPE_CHECK.FUNCTION) {
            return;
        }
        element.click();
    }
    /**
     * Simulates a focus event on the element. Will optionally reset the value of the element
     * if the element has a value property.
     * @param {HTMLElement | undefined} element
     * @param {boolean} shouldResetValue
     * @private
     */
    triggerFocusOnElement(element, shouldResetValue = false) {
        if (typeof (element === null || element === void 0 ? void 0 : element.focus) !== TYPE_CHECK.FUNCTION) {
            return;
        }
        let initialValue = "";
        if (shouldResetValue && "value" in element) {
            initialValue = String(element.value);
        }
        element.focus();
        if (initialValue && "value" in element) {
            element.value = initialValue;
        }
    }
    /**
     * Simulates a mouse click and focus event on the element.
     * @param {FormFieldElement} element
     * @param {boolean} shouldResetValue
     * @private
     */
    simulateUserMouseClickAndFocusEventInteractions(element, shouldResetValue = false) {
        this.triggerClickOnElement(element);
        this.triggerFocusOnElement(element, shouldResetValue);
    }
    /**
     * Simulates several keyboard events on the element, mocking a user interaction with the element.
     * @param {FormFieldElement} element
     * @private
     */
    simulateUserKeyboardEventInteractions(element) {
        const simulatedKeyboardEvents = [EVENTS.KEYDOWN, EVENTS.KEYPRESS, EVENTS.KEYUP];
        for (let index = 0; index < simulatedKeyboardEvents.length; index++) {
            element.dispatchEvent(new KeyboardEvent(simulatedKeyboardEvents[index], { bubbles: true }));
        }
    }
    /**
     * Simulates an input change event on the element, mocking behavior that would occur if a user
     * manually changed a value for the element.
     * @param {FormFieldElement} element
     * @private
     */
    simulateInputElementChangedEvent(element) {
        const simulatedInputEvents = [EVENTS.INPUT, EVENTS.CHANGE];
        for (let index = 0; index < simulatedInputEvents.length; index++) {
            element.dispatchEvent(new Event(simulatedInputEvents[index], { bubbles: true }));
        }
    }
}
/* harmony default export */ var insert_autofill_content_service = (InsertAutofillContentService);

;// CONCATENATED MODULE: ./src/autofill/content/autofill-init.ts
var autofill_init_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





class AutofillInit {
    /**
     * AutofillInit constructor. Initializes the DomElementVisibilityService,
     * CollectAutofillContentService and InsertAutofillContentService classes.
     *
     * @param autofillOverlayContentService - The autofill overlay content service, potentially undefined.
     * @param inlineMenuElements - The inline menu elements, potentially undefined.
     */
    constructor(autofillOverlayContentService, inlineMenuElements) {
        this.sendExtensionMessage = sendExtensionMessage;
        this.extensionMessageHandlers = {
            collectPageDetails: ({ message }) => this.collectPageDetails(message),
            collectPageDetailsImmediately: ({ message }) => this.collectPageDetails(message, true),
            fillForm: ({ message }) => this.fillForm(message),
        };
        /**
         * Handles the extension messages sent to the content script.
         *
         * @param message - The extension message.
         * @param sender - The message sender.
         * @param sendResponse - The send response callback.
         */
        this.handleExtensionMessage = (message, sender, sendResponse) => {
            const command = message.command;
            const handler = this.getExtensionMessageHandler(command);
            if (!handler) {
                return null;
            }
            const messageResponse = handler({ message, sender });
            if (typeof messageResponse === "undefined") {
                return null;
            }
            void Promise.resolve(messageResponse).then((response) => sendResponse(response));
            return true;
        };
        this.autofillOverlayContentService = autofillOverlayContentService;
        this.autofillInlineMenuContentService = inlineMenuElements;
        this.domElementVisibilityService = new dom_element_visibility_service(this.autofillInlineMenuContentService);
        this.collectAutofillContentService = new collect_autofill_content_service(this.domElementVisibilityService, this.autofillOverlayContentService);
        this.insertAutofillContentService = new insert_autofill_content_service(this.domElementVisibilityService, this.collectAutofillContentService);
    }
    /**
     * Initializes the autofill content script, setting up
     * the extension message listeners. This method should
     * be called once when the content script is loaded.
     */
    init() {
        var _a;
        this.setupExtensionMessageListeners();
        (_a = this.autofillOverlayContentService) === null || _a === void 0 ? void 0 : _a.init();
        this.collectPageDetailsOnLoad();
    }
    /**
     * Triggers a collection of the page details from the
     * background script, ensuring that autofill is ready
     * to act on the page.
     */
    collectPageDetailsOnLoad() {
        const sendCollectDetailsMessage = () => {
            this.clearCollectPageDetailsOnLoadTimeout();
            this.collectPageDetailsOnLoadTimeout = setTimeout(() => this.sendExtensionMessage("bgCollectPageDetails", { sender: "autofillInit" }), 250);
        };
        if (globalThis.document.readyState === "complete") {
            sendCollectDetailsMessage();
        }
        globalThis.addEventListener(EVENTS.LOAD, sendCollectDetailsMessage);
    }
    /**
     * Collects the page details and sends them to the
     * extension background script. If the `sendDetailsInResponse`
     * parameter is set to true, the page details will be
     * returned to facilitate sending the details in the
     * response to the extension message.
     *
     * @param message - The extension message.
     * @param sendDetailsInResponse - Determines whether to send the details in the response.
     */
    collectPageDetails(message, sendDetailsInResponse = false) {
        return autofill_init_awaiter(this, void 0, void 0, function* () {
            const pageDetails = yield this.collectAutofillContentService.getPageDetails();
            if (sendDetailsInResponse) {
                return pageDetails;
            }
            void this.sendExtensionMessage("collectPageDetailsResponse", {
                tab: message.tab,
                details: pageDetails,
                sender: message.sender,
            });
        });
    }
    /**
     * Fills the form with the given fill script.
     *
     * @param {AutofillExtensionMessage} message
     */
    fillForm({ fillScript, pageDetailsUrl }) {
        return autofill_init_awaiter(this, void 0, void 0, function* () {
            if ((document.defaultView || window).location.href !== pageDetailsUrl) {
                return;
            }
            this.blurFocusedFieldAndCloseInlineMenu();
            yield this.sendExtensionMessage("updateIsFieldCurrentlyFilling", {
                isFieldCurrentlyFilling: true,
            });
            yield this.insertAutofillContentService.fillForm(fillScript);
            setTimeout(() => this.sendExtensionMessage("updateIsFieldCurrentlyFilling", {
                isFieldCurrentlyFilling: false,
            }), 250);
        });
    }
    /**
     * Blurs the most recently focused field and removes the inline menu. Used
     * in cases where the background unlock or vault item reprompt popout
     * is opened.
     */
    blurFocusedFieldAndCloseInlineMenu() {
        var _a;
        (_a = this.autofillOverlayContentService) === null || _a === void 0 ? void 0 : _a.blurMostRecentlyFocusedField(true);
    }
    /**
     * Clears the send collect details message timeout.
     */
    clearCollectPageDetailsOnLoadTimeout() {
        if (this.collectPageDetailsOnLoadTimeout) {
            clearTimeout(this.collectPageDetailsOnLoadTimeout);
        }
    }
    /**
     * Sets up the extension message listeners for the content script.
     */
    setupExtensionMessageListeners() {
        chrome.runtime.onMessage.addListener(this.handleExtensionMessage);
    }
    /**
     * Gets the extension message handler for the given command.
     *
     * @param command - The extension message command.
     */
    getExtensionMessageHandler(command) {
        var _a, _b, _c, _d;
        if ((_b = (_a = this.autofillOverlayContentService) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b[command]) {
            return this.autofillOverlayContentService.messageHandlers[command];
        }
        if ((_d = (_c = this.autofillInlineMenuContentService) === null || _c === void 0 ? void 0 : _c.messageHandlers) === null || _d === void 0 ? void 0 : _d[command]) {
            return this.autofillInlineMenuContentService.messageHandlers[command];
        }
        return this.extensionMessageHandlers[command];
    }
    /**
     * Handles destroying the autofill init content script. Removes all
     * listeners, timeouts, and object instances to prevent memory leaks.
     */
    destroy() {
        var _a, _b;
        this.clearCollectPageDetailsOnLoadTimeout();
        chrome.runtime.onMessage.removeListener(this.handleExtensionMessage);
        this.collectAutofillContentService.destroy();
        (_a = this.autofillOverlayContentService) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = this.autofillInlineMenuContentService) === null || _b === void 0 ? void 0 : _b.destroy();
    }
}
/* harmony default export */ var autofill_init = (AutofillInit);

;// CONCATENATED MODULE: ./src/autofill/content/bootstrap-autofill.ts


(function (windowContext) {
    if (!windowContext.bitwardenAutofillInit) {
        windowContext.bitwardenAutofillInit = new autofill_init();
        setupAutofillInitDisconnectAction(windowContext);
        windowContext.bitwardenAutofillInit.init();
    }
})(window);

/******/ })()
;