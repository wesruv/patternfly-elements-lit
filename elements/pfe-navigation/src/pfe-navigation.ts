import { PFElement } from "../../pfelement";
import {stringStartsWith, debounce, _isCrustyBrowser} from "./helpers";
import {template} from "./template";
// @ts-ignore: esbuild-powered scss import is not understood by typescript
import styles from "pfe-navigation.scss";

interface observerObject {
  observer: MutationObserver,
  config: MutationObserverInit,
  element?: HTMLElement ,
};

interface translationSet {
  menu: string,
  search: string,
  login: string,
};

export class PfeNavigation extends PFElement {
  static styles = styles;

  // Setting up element references
  private _shadowDomOuterWrapper: HTMLElement  | null = null;
  private _logoWrapper: HTMLElement  | null = null;
  private _shadowMenuWrapper: HTMLElement  | null = null;
  private _mobileToggle: HTMLElement  | null = null;
  private _mobileToggleText: HTMLElement  | null = null;
  private _mobileButton: HTMLElement  | null = null;
  private _menuDropdownXs: HTMLElement  | null = null;
  private _menuDropdownMd: HTMLElement  | null = null;
  private _secondaryLinksWrapper: HTMLElement  | null = null;
  private _searchToggle: HTMLElement  | null = null;
  private _searchToggleText: HTMLElement  | null = null;
  private _searchSlot: HTMLElement  | null = null;
  private _searchSpotXs: HTMLElement  | null = null;
  private _searchSpotMd: HTMLElement  | null = null;
  private _customLinksSlot: HTMLElement  | null = null;
  private _mobileNavSearchSlot: HTMLElement  | null = null;
  private _overlay: HTMLElement  | null = null;
  private _shadowNavWrapper: HTMLElement  | null = null;
  private _accountOuterWrapper: HTMLElement  | null = null;
  private _accountSlot: HTMLElement  | null = null;
  private _accountDropdownWrapper: HTMLElement  | null = null;
  private _searchButtonText: HTMLElement  | null = null;
  private _mainMenu: HTMLElement  | null = null;
  private _siteSwitcherToggle: HTMLElement  | null = null;
  private _siteSwitcherBackButton: HTMLElement  | null = null;
  private _accountComponent: HTMLElement  | null = null;
  private _accountToggle: HTMLElement  | null = null;
  private _accountLogInLink: HTMLElement  | null = null;
  private _currentMobileDropdown: HTMLElement  | null = null;

  // @todo Make this selector list a PFE-wide resource?
  private _focusableElements: string = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  // Set default collapse breakpoints to null (falls back to CSS)
  private _menuBreakpoints: {
    secondaryLinks: number | null,
    mainMenu: number | null,
  } = {
    secondaryLinks: null,
    mainMenu: null,
  };

  // Used to calculate when menu should collapse,
  // parts that have changed can be set to null and breakpoints recalculated
  private _menuBounds: {
    logoRight: number | null,
    mainMenuRight: number | null,
    secondaryLinksLeft: number | null,
  } = {
    logoRight: null,
    mainMenuRight: null,
    secondaryLinksLeft: null,
  };

  // Stores a reference to the breakpoint queries so they can be modified and removed when necessary
  private _menuBreakpointQueries: {
    secondaryLinks:  MediaQueryList | null,
    mainMenu: MediaQueryList | null,
  } = {
    secondaryLinks: null,
    mainMenu: null,
  };

  private _mainMenuItems: object = {};

  // To track observers and events and remove them when necessary
  private _customDropdownAlertsObservers: object = {};
  private _mobileSliderMutationObservers: object = {};
  private _mobileSliderFocusTrapEvents: object = {};
  private _mobileSliderFocusTrapElements: object = {};
  private _debouncedPreResizeAdjustments: EventListener | null = null;
  private _debouncedPostResizeAdjustments: EventListener | null = null;

  // Tracking if window width gets updated
  private windowInnerWidth: number = null;

  // Position of element from top of the screen
  private _top: number = 0;

  private _observers: {
    hostAttributes: observerObject,
    hostChildren: observerObject,
    logo: observerObject,
    mainMenu: observerObject,
    account: observerObject,
  } = {
    // Used to copy some host attributes into the shadowDom wrapper
    hostAttributes: {
      observer: new MutationObserver(this._processHostAttributes),
      config: {
        attributes: true,
        attributeFilter: ['class'],
      },
    },
    // Observer used to kick off light DOM processing of logo, mainMenu, account, search, and secondaryLinks
    hostChildren: {
      observer: new MutationObserver(this._processHostChildren),
      config: {
        childList: true,
      },
    },
    // Watches logo for updates and copies it into the shadow DOM
    logo: {
      observer: new MutationObserver(this._processLogo),
      config: {
        characterData: true,
        attributes: true,
        subtree: true,
        childList: true,
      },
      element: null,
    },
    // Watches mainMenu for updates and copies it into the shadow DOM
    mainMenu: {
      observer: new MutationObserver(this._processMainMenu),
      config: {
        characterData: true,
        attributes: true,
        subtree: true,
        childList: true,
      },
      element: null,
    },
    // Watches account dropdown component for updates
    // to manage creation of login link or dropdown toggle
    account: {
      observer: new MutationObserver(this._processAccountDropdownChange),
      config: {
        attributes: true,
        attributeFilter: [
          'login-link',
          'full-name',
        ],
      },
      element: null,
    },
  };

  public _prefersReducedMotion: boolean = false;

  // Cache element visibility for performance
  public mainMenuButtonVisible: boolean | null = null;
  public secondaryLinksSectionCollapsed: boolean | null = null;
  public logoHeights: {
    default: number,
    small: number,
  } = {
    default: 40,
    small: 32,
  };

  // Is public so test scripts can set it
  public _resizeDebounce: number = 150;


  public get _navTranslations() {
    return this._data;
  }

  public set _navTranslations(data: Record<string, translationSet>) {
    if (!data) {
      return;
    }
  }

  public static get tag() {
    return "pfe-navigation";
  }

  public static get events() {
    return {
      expandedItem: `${PfeNavigation.tag}:expanded-item`,
      collapsedItem: `${PfeNavigation.tag}:collapsed-item`,
      shadowDomInteraction: `pfe-shadow-dom-event`,

      // @note v1.x support:
      pfeNavigationItemOpen: `pfe-navigation-item:open`,
      pfeNavigationItemClose: `pfe-navigation-item:close`,
    };
  }

  static get properties() {
    return {
      _lang: {
        type: String,
        attribute: "lang",
        reflect: true,
      },
      mobileButtonTranslation: {
        type: String,
        attribute: 'mobile-menu-translation',
        reflect: true,
        // @todo observer: "_updateMobileMenuText",
      },
      searchButtonTranslation: {
        type: String,
        attribute: "search-button-translation",
        reflect: true,
        // @todo observer: "_updateSearchButtonText",
      },

      ///
      // State indicators
      ///
      breakpoint: {
        // 'mobile' means secondary links && main menu are collapsed, search goes to top of mobile dropdown
        // 'tablet' means main menu is collapsed, search has it's own dropdown
        // 'desktop' means nothing is collapsed, search has it's own dropdown
        type: String,
        reflect: true,
      },
      // Currently opened toggle
      openToggle: {
        type: String,
        attribute: "open-toggle",
        reflect: true,
      },
      // Indicates an open child element that slides the menu over when open
      mobileSlide: {
        type: Boolean,
        attribute: "mobile-slide",
        reflect: true,
      },
      // @note If role isn't set, code will check if it has a parent with role="banner",
      // If not role=banner will be added to pfe-navigation
      role: {
        type: String,
        reflect: true,
      },
      // When page touches top of navigation stick it to the top of the screen
      sticky: {
        type: Boolean,
        reflect: true,
      },
    }
  };

  private _data: Record<string, translationSet>;

  // Declare property types for TS and set any default values
  public _lang: string = 'en';
  mobileButtonTranslate: string;
  searchButtonTranslation: string;
  breakpoint: string;
  openToggle: string;
  mobileSlide: string;
  role: string;
  sticky: boolean;

  static get slots() {
    return {
      search: {
        title: "Search",
        description: "For site's search form",
        namedSlot: true,
      },
      secondaryLinks: {
        title: "Secondary Links",
        description: "For site's custom links/dropdowns that appear in the top right at desktop",
        slotName: "secondary-links",
        namedSlot: true,
      },
      account: {
        title: "Account",
        description: "For rh-account-dropdown component or custom auth content",
        namedSlot: true,
      },
    };
  }

  constructor() {
    super();

    // Ensure 'this' is tied to the component object in these member functions
    const functionsToBind = [
      "isOpen",
      "getToggleElement",
      "getDropdownElement",
      "isMobileMenuButtonVisible",
      "isSecondaryLinksSectionCollapsed",
      "_focusOutOfNav",
      "_isDevelopment",
      "_getParentToggleAndDropdown",
      "_changeNavigationState",
      "_calculateBreakpointAttribute",
      "_createCustomDropdownToggle",
      "_processCustomDropdowns",
      "_shadowDomInteraction",
      "_processLightDom",
      "_toggleMobileMenu",
      "_toggleSearch",
      "_siteSwitcherBackClickHandler",
      "_dropdownItemToggle",
      "_calculateMenuBreakpoints",
      "_collapseMainMenu",
      "_collapseSecondaryLinks",
      "_moveSearchSlot",
      "_postResizeAdjustments",
      "_generalKeyboardListener",
      "_overlayClickHandler",
      "_stickyHandler",
      "_hideMobileMainMenu",
      "_showMobileMainMenu",
      "_createLogInLink",
      "_accountToggleClick",
      "_processAccountDropdownChange",
      "_getLastFocusableItemInMobileSlider",
      "_updateAlerts",
      "_processHostChildren",
      "_processHostAttributes",
      "_processLogo",
      "_postProcessLogo",
      "_processMainMenu",
    ];

    for (let index = 0; index < functionsToBind.length; index++) {
      const functionName = functionsToBind[index];
      if (this[functionName]) {
        this[functionName] = this[functionName].bind(this);
      } else {
        this.error("Tried to bind a function that doesn't exist", functionName);
      }
    }
  } // ends constructor()

  connectedCallback() {
    super.connectedCallback();

    // Assess if user prefers reduced motion, which means we can eliminate some timeouts
    const prefersReducedMotionQuery = window.matchMedia("(prefers-reduced-motion)");
    this._prefersReducedMotion = prefersReducedMotionQuery.matches || false;

    // Change a few preferences for automated testing so scripts can run faster
    if (this.hasAttribute("automated-testing")) {
      this._resizeDebounce = 10;
      this._prefersReducedMotion = true;
    }

    // Add class to scope styles for old browsers like IE11
    if (_isCrustyBrowser()) {
      this.classList.add("pfe-navigation--in-crusty-browser");
    }

    this._resizeDebounce = 150;
    // Change a few preferences for automated testing so scripts can run faster
    if (this.hasAttribute("automated-testing")) {
      this._resizeDebounce = 10;
      this._prefersReducedMotion = true;
    }

    this._processHostChildren(null, true);
    this._observers.hostChildren.observer.observe(this, this._observers.hostChildren.config);
    this._processHostAttributes();
    this._observers.hostAttributes.observer.observe(this, this._observers.hostAttributes.config);

    // Setup pre-post resize listeners
    // Pre hides layout changes while resizing
    // Post evaluates if content fits in new width and may force collapse elements, see breakpoint attribute
    const preResizeAdjustments = () => {
      if (!this.classList.contains("pfe-navigation--is-resizing")) {
        this.classList.add("pfe-navigation--is-resizing");
      }
    };
    this._debouncedPreResizeAdjustments = debounce(preResizeAdjustments, this._resizeDebounce, true);
    window.addEventListener("resize", this._debouncedPreResizeAdjustments);
    this._debouncedPostResizeAdjustments = debounce(this._postResizeAdjustments, this._resizeDebounce);
    window.addEventListener("resize", this._debouncedPostResizeAdjustments, { passive: true });
    this._calculateBreakpointAttribute();
  } // end connectedCallback()

  firstUpdated() {
    // Set pointers to commonly used elements
    this._shadowDomOuterWrapper = this.shadowRoot.getElementById("pfe-navigation__wrapper");
    this._logoWrapper = this.shadowRoot.getElementById("pfe-navigation__logo-wrapper");
    this._shadowMenuWrapper = this.shadowRoot.getElementById("pfe-navigation__menu-wrapper");
    this._mobileToggle = this.shadowRoot.getElementById("mobile__button");
    this._mobileToggleText = this.shadowRoot.getElementById("mobile__button-text");
    this._mobileButton = this.shadowRoot.querySelector("#mobile__button-text");
    this._menuDropdownXs = this.shadowRoot.getElementById("mobile__dropdown");
    this._menuDropdownMd = this.shadowRoot.getElementById(`${PfeNavigation.tag}__menu-wrapper`);
    this._secondaryLinksWrapper = this.shadowRoot.getElementById(`${PfeNavigation.tag}__secondary-links-wrapper`);
    this._searchToggle = this.shadowRoot.getElementById("secondary-links__button--search");
    this._searchToggleText = this.shadowRoot.getElementById("secondary-links__button--search-text");
    this._searchSlot = this.shadowRoot.getElementById("search-slot");
    this._searchSpotXs = this.shadowRoot.getElementById(`${PfeNavigation.tag}__search-wrapper--xs`);
    this._searchSpotMd = this.shadowRoot.getElementById(`${PfeNavigation.tag}__search-wrapper--md`);
    this._customLinksSlot = this.shadowRoot.getElementById("secondary-links");
    this._mobileNavSearchSlot = this.shadowRoot.querySelector('slot[name="search"]');
    this._overlay = this.shadowRoot.querySelector(`.${PfeNavigation.tag}__overlay`);
    this._shadowNavWrapper = this.shadowRoot.querySelector(`.${PfeNavigation.tag}__wrapper`);
    this._accountOuterWrapper = this.shadowRoot.getElementById("pfe-navigation__account-wrapper");
    this._accountSlot = this.shadowRoot.getElementById("pfe-navigation__account-slot");
    this._accountDropdownWrapper = this.shadowRoot.getElementById("pfe-navigation__account-dropdown-wrapper");
    this._searchButtonText = this.shadowRoot.querySelector("#secondary-links__button--search-text");

    // Ensure we close the whole menu and hide the overlay when the overlay is clicked
    this._overlay?.addEventListener("click", this._overlayClickHandler);

    // Add menu burger behavior
    this._mobileToggle.addEventListener("click", this._toggleMobileMenu);

    // Add search toggle behavior
    this._searchToggle.addEventListener("click", this._toggleSearch);

    // General keyboard listener attached to the entire component
    document.addEventListener("keydown", this._generalKeyboardListener);

    // Set initial on page load aria settings on all original buttons and their dropdowns
    if (this._currentMobileDropdown) {
      this._addCloseDropdownAttributes(this._mobileToggle, this._currentMobileDropdown);
    }

    // Add close attributes to built in dropdowns
    this._addCloseDropdownAttributes(this._searchToggle, this._searchSpotMd);
    this._addCloseDropdownAttributes(null, this._accountDropdownWrapper);

    // Initial position of this element from the top of the screen
    this._top = this.getBoundingClientRect().top || 0;

    // If the nav is set to sticky, run the sticky handler and attach scroll event to window
    if (this.sticky) {
      // Run the sticky check on first page load
      this._stickyHandler();

      // Attach the scroll event to the window
      window.addEventListener("scroll", () => {
        window.requestAnimationFrame(() => {
          this._stickyHandler();
        });
      });
    }

    // Make sure pfe-navigation or a parent is a header/role=banner element
    if (this.role !== "banner") {
      const closestHeader = this.closest('header, [role="banner"]');
      if (!closestHeader) {
        this.role = "banner";
        this.log(`Added role=banner to ${PfeNavigation.tag}`);
      }
    }

    this.classList.add("pfe-navigation--processed");
    this.addEventListener("focusout", this._focusOutOfNav);
  }

  /**
   * Updated Lit lifecycle method
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, property) => {
      console.log(`${property} is ${this[property]}, was ${oldValue}`);

      // Keep the component attributes up to date with the property values
      if (PfeNavigation.properties[property].attribute) {
        const attributeName =
          typeof PfeNavigation.properties[property].attribute === 'string'
            ? PfeNavigation.properties[property].attribute
            : property;
        if (this.getAttribute(attributeName) !== this[property]) {
          this.setAttribute(attributeName, this[property]);
        }
      }
    });
  }

  disconnectedCallback() {
    // this._observer.disconnect();

    const oberverKeys = Object.keys(this._observers);
    for (let index = 0; index < oberverKeys.length; index++) {
      const observerKey = oberverKeys[index];
      this._observers[observerKey].observer.disconnect();
    }

    window.removeEventListener("resize", this._debouncedPreResizeAdjustments);
    window.removeEventListener("resize", this._debouncedPostResizeAdjustments);
    this._overlay.removeEventListener("click", this._overlayClickHandler);
    this._mobileToggle.removeEventListener("click", this._toggleMobileMenu);
    this._searchToggle.removeEventListener("click", this._toggleSearch);
    document.removeEventListener("keydown", this._generalKeyboardListener);

    if (this._siteSwitcherBackButton) {
      this._siteSwitcherBackButton.removeEventListener("click", this._siteSwitcherBackClickHandler);
    }

    const mobileSliderObserverKeys = Object.keys(this._mobileSliderMutationObservers);
    for (let index = 0; index < mobileSliderObserverKeys.length; index++) {
      this._mobileSliderMutationObservers[mobileSliderObserverKeys[index]].disconnect();
    }

    const customDropdownAlertsObserversKeys = Object.keys(this._customDropdownAlertsObservers);
    for (let index = 0; index < customDropdownAlertsObserversKeys.length; index++) {
      const currentId = customDropdownAlertsObserversKeys[index];
      this._customDropdownAlertsObservers[currentId].disconnect();
    }

    const mobileSliderFocusTrapKeys = Object.keys(this._mobileSliderFocusTrapEvents);
    for (let index = 0; index < mobileSliderFocusTrapKeys.length; index++) {
      const currentId = mobileSliderFocusTrapKeys[index];
      this._mobileSliderFocusTrapElements[currentId].removeEventListener(
        "keydown",
        this._mobileSliderFocusTrapEvents[currentId]
      );
    }

    const menuBreakpointQueriesKeys = Object.keys(this._menuBreakpointQueries);
    for (let index = 0; index < menuBreakpointQueriesKeys.length; index++) {
      const menuBreakpointQueryKey = menuBreakpointQueriesKeys[index];
      if (this._menuBreakpointQueries[menuBreakpointQueryKey]) {
        this._removeMediaQueryListener(
          this._menuBreakpointQueries[menuBreakpointQueryKey],
          menuBreakpointQueryKey === "mainMenu" ?
            this._collapseMainMenu as EventListener :
            this._collapseSecondaryLinks as EventListener
        );
      }
    }

    if (this.sticky) {
      window.removeEventListener("scroll", () => {
        window.requestAnimationFrame(() => {
          this._stickyHandler();
        });
      });
    }

    if (this._accountToggle) {
      this._accountToggle.removeEventListener("click", this._accountToggleClick);
    }

    // Remove main menu dropdown listeners
    const dropdownButtons = this.shadowRoot.querySelectorAll(".pfe-navigation__menu-link--has-dropdown");
    for (let index = 0; index < dropdownButtons.length; index++) {
      const dropdownButton = dropdownButtons[index];
      dropdownButton.removeEventListener("click", this._dropdownItemToggle);
    }
  } // end disconnectedCallback()

  // @ts-ignore: // @todo ts, this shouldn't be underlined red?
  render() {
    return template;
  }

  /**
   * Utility function to polyfill media query listeners
   */
  _addMediaQueryListener(mediaQueryObject: MediaQueryList, eventHandler: EventListener) {
    if (mediaQueryObject && typeof mediaQueryObject.addEventListener !== "undefined") {
      mediaQueryObject.addEventListener("change", eventHandler);
    }
  }

  /**
   * Utility function to polyfill media query listeners
   */
  _removeMediaQueryListener(mediaQueryObject: MediaQueryList, eventHandler: EventListener) {
    if (mediaQueryObject && typeof mediaQueryObject.removeEventListener !== "undefined") {
      mediaQueryObject.removeEventListener("change", eventHandler);
    }
  }

  /**
   * Utility function that is used to display more console logging in non-prod env
   */
  _isDevelopment() {
    return this.hasAttribute("debug");
  }

  /**
   * Utility function to return DOM Object for a toggle, since it may be in the parent or shadow DOM
   * @param {string} toggleId Id of toggle to retrieve
   * @return {HTMLElement} DOM Object of desired toggle
   */
  getToggleElement(toggleId: string) {
    if (stringStartsWith(toggleId, "pfe-navigation__secondary-link--")) {
      return this.querySelector(`#${toggleId}`) as HTMLElement;
    } else {
      return this.shadowRoot.getElementById(toggleId) as HTMLElement;
    }
  }

  /**
   * Utility function to return DOM Object for a dropdown, since it may be in the parent or shadow DOM
   * @param {string} dropdownId Id of dropdown to retrieve
   * @return {HTMLElement} DOM Object of desired dropdown
   */
  getDropdownElement(dropdownId: string) {
    if (stringStartsWith(dropdownId, "pfe-navigation__custom-dropdown--")) {
      return this.querySelector(`#${dropdownId}`) as HTMLElement;
    } else {
      return this.shadowRoot.getElementById(dropdownId) as HTMLElement;
    }
  }

  /**
   * Checks to see if anything in the menu, or if a specific part of it is open
   * @param {string} toggleId Optional. Check if specific part of menu is open, if blank will check if anything is open
   * @return {boolean}
   */
  isOpen(toggleId?: string) {
    const openToggleId = this.openToggle;
    if (openToggleId) {
      if (typeof toggleId === "undefined") {
        // Something is open, and a toggleId wasn't set
        return true;
      }
      if (stringStartsWith(openToggleId, "main-menu") && toggleId === "mobile__button") {
        return true;
      }
      if (toggleId === "mobile__button" && this.isSecondaryLinksSectionCollapsed()) {
        return true;
      }

      // Only checks for prefix so if main-menu is queried and main-menu__dropdown--Link-Name is open it still evaluates as true
      // This prevents the main-menu toggle shutting at mobile when a sub-section is opened
      return toggleId === openToggleId;
    }

    return false;
  }

  /**
   * Use for elements that stop being dropdowns
   *
   * @param {object} toggleElement Toggle Button DOM Element
   * @param {object} dropdownWrapper Dropdown wrapper DOM element
   */
  _removeDropdownAttributes(toggleElement: HTMLElement, dropdownWrapper: HTMLElement ) {
    let toggleId = null;

    if (toggleElement) {
      toggleId = toggleElement.id;
      toggleElement.removeAttribute("aria-expanded");
      toggleElement.parentElement.classList.remove("pfe-navigation__menu-item--open");
    }

    // this.log(
    //   "_removeDropdownAttributes",
    //   toggleId,
    //   dropdownWrapper ? dropdownWrapper.id : 'undefined'
    // );

    if (dropdownWrapper) {
      dropdownWrapper.removeAttribute("aria-hidden");
      dropdownWrapper.classList.remove("pfe-navigation__dropdown-wrapper--invisible");
      dropdownWrapper.style.removeProperty("height");
    }
  }

  /**
   * Utility function to set height of a dropdown
   * Depends on a dropdown having 2 wrappers and the parameter should be the outer wrapper
   * @param {object} dropdownWrapper DOM Object of dropdown wrapper
   */
  _setDropdownHeight(dropdownWrapper) {
    const dropdownHeight = dropdownWrapper.children[0].offsetHeight;
    // @NOTE not sure this is needed since offsetHeight will always return a number
    if (typeof dropdownHeight === "number") {
      dropdownWrapper.style.setProperty("height", `${dropdownHeight}px`);
    } else {
      dropdownWrapper.style.setProperty("height", "auto");
    }
  }

  /**
   * Sets attributes for an open element, but DOES NOT update navigation state
   * Only use to update DOM State to reflect nav state
   * Almost all open/close actions should go through this._changeNavigationState, not this function
   *
   * @param {object} toggleElement Toggle Button DOM Element
   * @param {object} dropdownWrapper Dropdown wrapper DOM element
   */
  _addOpenDropdownAttributes(toggleElement: HTMLElement, dropdownWrapper: HTMLElement) {
    // Toggle Button DOM Element ID attribute
    let toggleId = null;
    // Dropdown wrapper DOM element ID attribute
    let dropdownWrapperId = null;
    const isMobileSlider = this.breakpoint === "mobile" && toggleElement.parentElement.hasAttribute("mobile-slider");
    let isMainMenuToggle = false;
    let isCustomLink = false;

    if (toggleElement) {
      toggleId = toggleElement.id;
      isMainMenuToggle = stringStartsWith(toggleId, "main-menu__button--");
      if (!isMainMenuToggle) {
        isCustomLink = stringStartsWith(toggleId, "pfe-navigation__secondary-link--");
      }
    }

    if (dropdownWrapper) {
      dropdownWrapperId = dropdownWrapper.id;
    } else {
      dropdownWrapperId = toggleElement.getAttribute("aria-controls");
      dropdownWrapper = this.querySelector(`#${dropdownWrapperId}`);
    }

    // this.log(
    //   "_addOpenDropdownAttributes",
    //   toggleId,
    //   dropdownWrapper ? dropdownWrapper.id : 'undefined'
    // );

    if (toggleElement) {
      toggleElement.setAttribute("aria-expanded", "true");
      if (!toggleElement.hasAttribute("aria-controls")) {
        toggleElement.setAttribute("aria-controls", dropdownWrapperId);
      }

      // Main menu specific actions
      if (stringStartsWith(toggleId, "main-menu__")) {
        toggleElement.parentElement.classList.add("pfe-navigation__menu-item--open");
      }
    }

    if (dropdownWrapper) {
      dropdownWrapper.setAttribute("aria-hidden", "false");
      dropdownWrapper.removeAttribute("tabindex");
      dropdownWrapper.classList.remove("pfe-navigation__dropdown-wrapper--invisible");

      // Setting up CSS transforms by setting height with JS
      let setHeight = false;

      // Handle animation state and attributes
      if (toggleId) {
        if (this.breakpoint === "mobile" && isMobileSlider) {
          // @ts-ignore // @todo Feel like Lit Properties shouldn't throw TS errors
          this.mobileSlide = true;
        }
        // No animations at desktop, and for expanding elements in mobile menu dropdown
        // (mobile slides over instead of expanding)
        else if (this.breakpoint === "mobile" && (isMainMenuToggle || isCustomLink)) {
          setHeight = true;
        } else if (this.breakpoint === "tablet" && isMainMenuToggle) {
          setHeight = true;
        }
      }

      if (setHeight) {
        this._setDropdownHeight(dropdownWrapper);
      }
    }
  }

  /**
   * Sets attributes for a closed element, but DOES NOT update navigation state
   * Only use to update DOM State to reflect nav state
   * Almost all open/close actions should go through this._changeNavigationState, not this function
   *
   * @param {object} toggleElement Toggle Button DOM Element
   * @param {object} dropdownWrapper Dropdown wrapper DOM element
   * @param {number} invisibleDelay Delay on visibility hidden style, in case we need to wait for an animation
   */
  _addCloseDropdownAttributes(toggleElement, dropdownWrapper, invisibleDelay = 0) {
    // Toggle Button DOM Element ID attribute
    let toggleId = null;
    // Dropdown wrapper DOM element ID attribute
    let dropdownWrapperId = null;

    if (toggleElement) {
      toggleId = toggleElement.id;
    }
    if (dropdownWrapper) {
      dropdownWrapperId = dropdownWrapper.id;
    }

    if (toggleElement) {
      toggleElement.setAttribute("aria-expanded", "false");
      if (!toggleElement.hasAttribute("aria-controls") && dropdownWrapperId) {
        toggleElement.setAttribute("aria-controls", dropdownWrapperId);
      }
      // Main menu specific code
      if (stringStartsWith(toggleId, "main-menu")) {
        toggleElement.parentElement.classList.remove("pfe-navigation__menu-item--open");
      }
    }

    // Handle dropdown wrapper
    if (dropdownWrapper) {
      dropdownWrapper.style.removeProperty("height");
      dropdownWrapper.setAttribute("aria-hidden", "true");
      // Set tabindex in conjuction with aria-hidden true
      dropdownWrapper.setAttribute("tabindex", "-1");

      if (!this._prefersReducedMotion && invisibleDelay) {
        // Sometimes need a delay visibility: hidden so animation can finish
        window.setTimeout(
          () => dropdownWrapper.classList.add("pfe-navigation__dropdown-wrapper--invisible"),
          invisibleDelay // Should be slightly longer than the animation time
        );
      } else {
        dropdownWrapper.classList.add("pfe-navigation__dropdown-wrapper--invisible");
      }
    }

    // @ts-ignore // @todo Feel like Lit Properties shouldn't throw TS errors
    this.mobileSlide = false;
  }

  /**
   * Create dash delimited string with no special chars for use in HTML attributes
   * @param {string}
   * @return {string} String that can be used as a class or ID (no spaces or special chars)
   */
  _createMachineName(text) {
    if (typeof text !== "string") return;
    return (
      text
        // Get rid of special characters
        .replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, "")
        // Get rid of extra space
        .trim()
        // Replace remaining single spaces between words with -
        .replace(/[\s\-]+/g, "-")
    );
  }

  /**
   * Figures out if secondary links are collapsed
   * @param {boolean} forceRecalculation
   * @returns {boolean}
   */
  isSecondaryLinksSectionCollapsed(forceRecalculation?: boolean) {
    // Trying to avoid running getComputedStyle too much by caching it on the web component object
    if (
      forceRecalculation ||
      this.secondaryLinksSectionCollapsed === null ||
      window.innerWidth !== this.windowInnerWidth
    ) {
      const secondaryLinksWrapperFlexDirection = window.getComputedStyle(
        this._secondaryLinksWrapper,
        null
      ).flexDirection;
      this.secondaryLinksSectionCollapsed = secondaryLinksWrapperFlexDirection === "column";

      // Update the stored windowInnerWidth variable so we don't recalculate for no reason
      if (window.innerWidth !== this.windowInnerWidth) {
        this.windowInnerWidth = window.innerWidth;
        // Update the other layout state function, but avoid infinite loop :P
        this.isMobileMenuButtonVisible(true);
      }
      this.log(
        "isSecondaryLinksSectionCollapsed recalculated",
        `Secondary Links Wrapper Flex Direction is ${secondaryLinksWrapperFlexDirection}`,
        `isSecondaryLinksSectionCollapsed is ${this.secondaryLinksSectionCollapsed}`
      );
    }
    return this.secondaryLinksSectionCollapsed;
  }

  /**
   * Figures out if the mobile menu toggle (aka hamburger icon) is visible
   * @param {boolean} forceRecalculation
   * @returns {boolean}
   */
  isMobileMenuButtonVisible(forceRecalculation?: boolean) {
    // Trying to avoid running getComputedStyle too much by caching iton the web component object
    if (forceRecalculation || this.mainMenuButtonVisible === null || window.innerWidth !== this.windowInnerWidth) {
      const mobileToggleDisplay = window.getComputedStyle(this._mobileToggle, null).display;
      this.mainMenuButtonVisible = mobileToggleDisplay !== "none";

      // Update the stored windowInnerWidth variable so we don't recalculate for no reason
      if (window.innerWidth !== this.windowInnerWidth) {
        this.windowInnerWidth = window.innerWidth;
        this.isSecondaryLinksSectionCollapsed(true);
      }
      this.log(
        "isMobileMenuButtonVisible recalculated",
        `mobileToggle's display is ${mobileToggleDisplay}`,
        `isMobileMenuButtonVisible is ${this.mainMenuButtonVisible}`
      );
    }
    return this.mainMenuButtonVisible;
  }

  /**
   * Sets the current breakpoint as an attribute on the component
   */
  _calculateBreakpointAttribute() {
    if (_isCrustyBrowser()) {
      if (!this.breakpoint) {
        this.breakpoint = "desktop";
      }
      return;
    }
    let currentBreakpoint = null;
    if (this.isMobileMenuButtonVisible()) {
      if (this.isSecondaryLinksSectionCollapsed()) {
        currentBreakpoint = "mobile";
      } else {
        currentBreakpoint = "tablet";
      }
    } else {
      currentBreakpoint = "desktop";
    }
    this.breakpoint = currentBreakpoint;
    return currentBreakpoint;
  }

  /**
   * Sets this._currentMobileDropdown depending on breakpoint
   */
  _setCurrentMobileDropdown() {
    if (this.isMobileMenuButtonVisible()) {
      if (this.isSecondaryLinksSectionCollapsed()) {
        this._currentMobileDropdown = this._menuDropdownXs;
        this._currentMobileDropdown.classList.add("pfe-navigation__mobile-dropdown");

        if (this._menuDropdownMd) {
          this._menuDropdownMd.classList.remove("pfe-navigation__mobile-dropdown");
        }
      } else {
        if (this._menuDropdownMd) {
          this._currentMobileDropdown = this._menuDropdownMd;
          this._currentMobileDropdown.classList.add("pfe-navigation__mobile-dropdown");
        }
        this._menuDropdownXs.classList.remove("pfe-navigation__mobile-dropdown");
      }
    } else {
      this._currentMobileDropdown = null;
      this._menuDropdownXs.classList.remove("pfe-navigation__mobile-dropdown");
      if (this._menuDropdownMd) {
        this._menuDropdownMd.classList.remove("pfe-navigation__mobile-dropdown");
      }

      // Ran into a circumstance where these elements didn't exist... ? Don't know how that's possible.
      if (this._menuDropdownXs) {
        this._menuDropdownXs.classList.remove("pfe-navigation__mobile-dropdown");
      }
      if (this._menuDropdownMd) {
        this._menuDropdownMd.classList.remove("pfe-navigation__mobile-dropdown");
      }
    }
  }

  /**
   * Get the dropdownId based on the toggleId
   * @param {string} toggleId ID of a toggle button
   * @return {string} ID of the corresponding dropdown
   */
  _getDropdownId(toggleId: string) {
    if (toggleId === "mobile__button") {
      if (this._currentMobileDropdown) {
        return this._currentMobileDropdown.id;
      }
    }
    if (stringStartsWith(toggleId, "main-menu")) {
      return this.shadowRoot.getElementById(toggleId).parentElement.dataset.dropdownId;
    }
    if (stringStartsWith(toggleId, "secondary-links")) {
      switch (toggleId) {
        case "secondary-links__button--search":
          return "pfe-navigation__search-wrapper--md";
      }
    }

    const toggleElement = this.getToggleElement(toggleId);
    if (toggleElement && toggleElement.hasAttribute("aria-controls")) {
      return toggleElement.getAttribute("aria-controls");
    }
    this.error(`Could not find corresponding dropdown for #${toggleId}`);
  }

  /**
   * Figure out if a toggle is a child of a dropdown, returns DOM Objects for the parent
   * @param {string} toggleId Id attribute of toggle
   * @return {array|false} An array with the DOM object of the toggle and the dropdown, in that order, false if it's not a child
   */
  _getParentToggleAndDropdown(toggleId: string) {
    // At mobile and tablet main menu items are in the mobile dropdown
    if ((this.breakpoint === "tablet" || this.breakpoint === "mobile") && stringStartsWith(toggleId, "main-menu")) {
      return [this._mobileToggle, this._currentMobileDropdown];
    }

    // At mobile secondary links are in the mobile dropdown
    if (this.breakpoint === "mobile" && stringStartsWith(toggleId, "pfe-navigation__secondary-link--")) {
      return [this._mobileToggle, this._currentMobileDropdown];
    }
    return false;
  }

  /**
   * Manages all dropdowns and ensures only one is open at a time
   * @param {string} toggleId Id to use in open-toggle param
   * @param {string} toState Optional, use to set the end state as 'open' or 'close', instead of toggling the current state
   * @return {boolean} True if the final state is open, false if closed
   */
  _changeNavigationState(toggleId:string, toState?:string) {
    // Preventing issues in IE11 & Edge
    if (_isCrustyBrowser()) {
      // this._observer.disconnect();
    }
    const isOpen = this.isOpen(toggleId);
    // Set toState param to go to opposite of current state if toState isn't set
    if (typeof toState === "undefined") {
      toState = isOpen ? "close" : "open";
    }
    const dropdownId = this._getDropdownId(toggleId);
    const currentlyOpenToggleId = this.openToggle;
    const toggleElementToToggle = this.getToggleElement(toggleId);

    /**
     * Local utility function to open a dropdown (shouldn't be used outside of parent function)
     * @param {object} toggleElement Toggle Button DOM Element
     * @param {object} dropdownWrapper Dropdown wrapper DOM element
     */
    const _openDropdown = (
      toggleElement: HTMLElement,
      dropdownWrapper: HTMLElement
    ) => {
      const toggleIdToOpen = toggleElement.id;

      this._addOpenDropdownAttributes(toggleElement, dropdownWrapper);

      this.openToggle = toggleIdToOpen;

      this.emitEvent(PfeNavigation.events.expandedItem, {
        detail: {
          toggle: toggleElement,
          pane: dropdownWrapper,
          parent: this,
        },
      });

      this.emitEvent(PfeNavigation.events.pfeNavigationItemOpen, {
        detail: {
          toggle: toggleElement,
          pane: dropdownWrapper,
          parent: this,
        },
      });

      // Show overlay
      this._overlay.hidden = false;
    };

    /**
     * Local utility function to close a dropdown (shouldn't be used outside of parent function)
     * @param {object} toggleElement Toggle Button DOM Element
     * @param {object} dropdownWrapper Dropdown wrapper DOM element
     * @param {boolean} backOut If we're in a subdropdown, should we keep the parent one open, false will close all dropdowns
     */
    const _closeDropdown = (
      toggleElement: HTMLElement,
      dropdownWrapper: HTMLElement,
      backOut: boolean = true
    ) => {
      const toggleIdToClose = toggleElement.id;

      let invisibleDelay: number = 0;
      // Dropdowns with a parent dropdown animate open and need a delay
      if (this._getParentToggleAndDropdown(toggleIdToClose)) {
        invisibleDelay = 300;
      }

      this._addCloseDropdownAttributes(toggleElement, dropdownWrapper, invisibleDelay);

      // If we're backing out close child dropdown, but not parent
      let closed = false;
      const parentToggleAndDropdown = this._getParentToggleAndDropdown(toggleIdToClose);
      if (backOut) {
        if (parentToggleAndDropdown) {
          _openDropdown(parentToggleAndDropdown[0], parentToggleAndDropdown[1]);
          closed = true;
        }
      } else {
        this._addCloseDropdownAttributes(parentToggleAndDropdown[0], parentToggleAndDropdown[1]);
      }

      // If we weren't able to back out, close everything by removing the open-toggle attribute
      if (!closed) {
        this.removeAttribute("open-toggle");
        this._overlay.hidden = true;
      }

      this.emitEvent(PfeNavigation.events.collapsedItem, {
        detail: {
          toggle: toggleElement,
          pane: dropdownWrapper,
          parent: this,
        },
      });

      this.emitEvent(PfeNavigation.events.pfeNavigationItemClose, {
        detail: {
          toggle: toggleElement,
          pane: dropdownWrapper,
          parent: this,
        },
      });
    };

    // Shut any open dropdowns before we open any other
    if (currentlyOpenToggleId) {
      const parentToggleAndDropdown = this._getParentToggleAndDropdown(toggleId);
      const currentlyOpenParentToggleAndDropdown = this._getParentToggleAndDropdown(currentlyOpenToggleId);
      // Don't close a parent dropdown if we're opening the child
      if (!parentToggleAndDropdown || parentToggleAndDropdown[0].id !== currentlyOpenToggleId) {
        const openToggle = this.getToggleElement(currentlyOpenToggleId);
        const openDropdownId = this._getDropdownId(currentlyOpenToggleId);
        const keepParentOpen =
          currentlyOpenParentToggleAndDropdown &&
          parentToggleAndDropdown &&
          currentlyOpenParentToggleAndDropdown[0].id === parentToggleAndDropdown[0].id;
        _closeDropdown(openToggle, this.getDropdownElement(openDropdownId), keepParentOpen);
      }
    }

    if (toState !== "close" && toState !== "open") {
      this.error(`toState param was set to ${toState}, can only be 'close' or 'open'`);
    }

    // Update the element we came to update
    if (toState === "close") {
      _closeDropdown(toggleElementToToggle, this.getDropdownElement(dropdownId));
    } else if (toState === "open") {
      _openDropdown(toggleElementToToggle, this.getDropdownElement(dropdownId));
    }

    // Clone state attribute inside of Shadow DOM to avoid compound :host() selectors
    this._shadowDomOuterWrapper.setAttribute("open-toggle", this.openToggle);

    // Reconnecting mutationObserver for IE11 & Edge
    if (_isCrustyBrowser()) {
      // this._observer.observe(this, lightDomObserverConfig);
    }

    return toState === "open";
  } // end _changeNavigationState

  /**
   * Close expanded elements if the focus leaves the nav
   */
  _focusOutOfNav(event: FocusEvent) {
    if (this.isOpen()) {
      // @ts-ignore TS thinks event.relatedTarget is Element, not HTMLElement
      if (event.relatedTarget && !event.relatedTarget.closest("pfe-navigation")) {
        const openToggleId = this.openToggle;
        this._changeNavigationState(openToggleId, "close");
      }
    }
  }

  /**
   * Creates HTML for icon in a secondary link
   * @param {string} icon Name of icon from pfe-icon
   * @return {HTMLElement} DOM Object for pfe-icon
   */
  _createPfeIcon(icon: string) {
    const iconElement = document.createElement("pfe-icon");
    iconElement.setAttribute("icon", icon);
    iconElement.setAttribute("size", "sm");
    iconElement.setAttribute("aria-hidden", "true");
    return iconElement as HTMLElement;
  }

  /**
   * Update alert count on a custom dropdown
   * @param {HTMLElement} pfeNavigationDropdown DOM Object for the dropdown we need to update
   */
  _updateAlerts(pfeNavigationDropdown: HTMLElement) {
    // No alerts for IE11
    if (_isCrustyBrowser()) {
      return;
    }
    const toggle = pfeNavigationDropdown.parentElement.parentElement.querySelector(".pfe-navigation__secondary-link");
    let alertsContainer: HTMLElement = toggle.querySelector(".secondary-link__alert-count");
    // @ts-ignore // @todo TS Doesn't like lit properties
    if (pfeNavigationDropdown.alerts) {
      if (!alertsContainer) {
        alertsContainer = document.createElement("div");
        alertsContainer.classList.add("secondary-link__alert-count");
        // @ts-ignore // @todo TS Doesn't like lit properties
        alertsContainer.innerText = pfeNavigationDropdown.alerts;
        toggle.querySelector(".secondary-link__icon-wrapper").appendChild(alertsContainer);
      } else {
        // @ts-ignore // @todo TS Doesn't like lit properties
        alertsContainer.innerText = pfeNavigationDropdown.alerts;
      }
    } else if (alertsContainer) {
      alertsContainer.innerText = "";
    }
  }

  /**
   * Translate strings based on passed in object
   */
  _translateStrings() {
    if (this._navTranslations) {
      //translate mobile menu button
      //will not update if mobile-menu-text attr is used
      // @ts-ignore // @todo TS Doesn't like properties
      if (!this.mobileButtonTranslation) {
        this._mobileButton.textContent = this._navTranslations[this._lang].menu;
      }

      //translate search string if used
      //will not update if search-button-text is used
      if (this._searchToggle && !this.searchButtonTranslation) {
        this._searchButtonText.textContent = this._navTranslations[this._lang].search;
      }
    }
  }

  /**
   * Translate mobile menu button string
   */
  _updateMobileMenuText() {
    // @ts-ignore // @todo TS doesn't like properites
    this._mobileButton.textContent = this.mobileButtonTranslation;
  }

  /**
   * Translate search button string
   */
  _updateSearchButtonText() {
    this._searchButtonText.textContent = this.searchButtonTranslation;
  }

  /**
   * Translate login string
   */
  _updateLoginText() {
    // @ts-ignore // @todo TS doesn't like properites
    this.shadowRoot.querySelector("#pfe-navigation__log-in-link").textContent = this.loginTranslation;
  }

  /**
   * Create a custom dropdown toggle
   * @param {HTMLElement} pfeNavigationDropdown DOM object for a pfe-navigation-dropdown tag in the secondary-links slot
   * @param {string} buttonText The text for the button
   * @param {string} icon The name of the icon for pfe-icon
   * @returns {HTMLElement} Button with necessary HTML
   */
  _createCustomDropdownToggle(pfeNavigationDropdown: HTMLElement, buttonText: string, icon: string) {
    const toggleMachineName = pfeNavigationDropdown.dataset.idSuffix
      ? pfeNavigationDropdown.dataset.idSuffix
      : this._createMachineName(buttonText);
    const toggle = document.createElement("button");
    const iconWrapper = document.createElement("div");

    // Set the id suffix in case it's needed later
    if (!pfeNavigationDropdown.dataset.idSuffix) {
      pfeNavigationDropdown.dataset.idSuffix = toggleMachineName;
    }

    toggle.innerText = buttonText;
    toggle.classList.add("pfe-navigation__secondary-link");

    iconWrapper.classList.add("secondary-link__icon-wrapper");
    iconWrapper.prepend(this._createPfeIcon(icon));
    toggle.prepend(iconWrapper);

    return toggle as HTMLElement;
  }

  /**
   * Process secondary dropdown, a toggle button, behaviors, and necessary attributes
   * @param {array|NodeList} pfeNavigationDropdowns List of DOM object for a pfe-navigation-dropdown tag in the secondary-links slot
   */
  _processCustomDropdowns(pfeNavigationDropdowns: Array<HTMLElement> | NodeList) {
    // Preventing issues in IE11 & Edge
    this.log("Processing Custom Dropdowns");
    if (_isCrustyBrowser()) {
      // this._observer.disconnect();
    }
    for (let index = 0; index < pfeNavigationDropdowns.length; index++) {
      const pfeNavigationDropdown = pfeNavigationDropdowns[index] as HTMLElement;
      /**
       * Validate the custom dropdowns
       */
      if (
        pfeNavigationDropdown.parentElement.getAttribute("slot") === "secondary-links" &&
        !pfeNavigationDropdown.classList.contains("pfe-navigation__dropdown")
      ) {
        const toggleAndDropdownWrapper = pfeNavigationDropdown.parentElement;
        let buttonText = "";
        // Check for provided toggle element
        let toggle:HTMLElement | null = toggleAndDropdownWrapper.querySelector(".pfe-navigation__secondary-link");
        const attributeValues = {};
        let toggleMachineName = pfeNavigationDropdown.dataset.idSuffix;

        // Validate the toggle if we have one
        if (toggle) {
          if (!toggle.querySelector("pfe-icon")) {
            this.error("A pfe-navigation-dropdown in the secondary-links slot is missing an icon");
            break;
          }

          if (!toggleMachineName) {
            toggleMachineName = this._createMachineName(toggle.innerText);
          }
        }
        // Validate we have the necessary properties to create the toggle
        else {
          const requiredAttributes = ["name", "icon"];
          for (let index = 0; index < requiredAttributes.length; index++) {
            const attribute = requiredAttributes[index];
            if (!pfeNavigationDropdown.getAttribute(attribute)) {
              this.error(
                `A pfe-navigation-dropdown in the secondary-links slot doesn't seem to have a toggle and is missing the attribute ${attribute}, which is required to make a toggle`
              );
              break;
            } else {
              attributeValues[attribute] = pfeNavigationDropdown.getAttribute(attribute);
            }
          }

          if (!toggleMachineName && attributeValues["name"]) {
            toggleMachineName = this._createMachineName(attributeValues["name"]);
          }
        }

        /**
         * Process the custom dropdown markup
         */
        const dropdownWrapper = document.createElement("div");
        const dropdownId = `pfe-navigation__custom-dropdown--${toggleMachineName}`;

        // Set the id suffix in case it's needed later
        if (!pfeNavigationDropdown.dataset.idSuffix) {
          pfeNavigationDropdown.dataset.idSuffix = toggleMachineName;
        }

        // Create a toggle if there isn't one
        let createdNewToggle = false;
        if (!toggle) {
          if (attributeValues["name"]) {
            toggle = this._createCustomDropdownToggle(
              pfeNavigationDropdown,
              attributeValues["name"],
              attributeValues["icon"]
            );
            createdNewToggle = true;
          } else {
            this.error(
              "Could not find or create a toggle. Please add a button.pfe-navigation__secondary-link or add the attributes name & icon to pfe-navigation dropdown"
            );
            break;
          }
        }

        toggle.id = `pfe-navigation__secondary-link--${toggleMachineName}`;
        toggle.addEventListener("click", this._dropdownItemToggle);

        // Add Dropdown attributes
        dropdownWrapper.setAttribute("id", dropdownId);
        dropdownWrapper.classList.add("pfe-navigation__dropdown-wrapper");
        dropdownWrapper.appendChild(pfeNavigationDropdown);
        pfeNavigationDropdown.classList.add("pfe-navigation__dropdown");

        switch (pfeNavigationDropdown.getAttribute("dropdown-width")) {
          case "single":
            dropdownWrapper.classList.add("pfe-navigation__custom-dropdown--single-column");
            toggleAndDropdownWrapper.classList.add("pfe-navigation__custom-dropdown__wrapper--single-column");
            break;

          case "full":
          default:
            dropdownWrapper.classList.add("pfe-navigation__custom-dropdown--full");
            toggleAndDropdownWrapper.classList.add("pfe-navigation__custom-dropdown__wrapper--full");
            break;
        }

        if (pfeNavigationDropdown.classList.contains("pfe-navigation__dropdown--default-styles")) {
          dropdownWrapper.classList.add("pfe-navigation__dropdown-wrapper--default-styles");
        }

        // For some reason setting this earlier causes the value to be null in the DOM
        toggle.setAttribute("aria-controls", dropdownId);

        // Adding closed dropdown attributes
        this._addCloseDropdownAttributes(toggle, dropdownWrapper);

        // Add everything to the DOM that needs to be added
        if (createdNewToggle) {
          toggleAndDropdownWrapper.prepend(toggle);
        }
        toggleAndDropdownWrapper.classList.add("pfe-navigation__custom-dropdown__wrapper");
        toggleAndDropdownWrapper.appendChild(dropdownWrapper);

        // Deal with alerts on dropdown
        this._updateAlerts(pfeNavigationDropdown);

        // No alerts for IE11
        if (_isCrustyBrowser()) {
          // Set up observer to catch any updates to the alerts attribute
          const observerCallback = (mutationList) => {
            // Call updateAlerts for update targets (should only be 1 per update)
            for (let index = 0; index < mutationList.length; index++) {
              this._updateAlerts(mutationList[index].target);
            }
          };

          this._customDropdownAlertsObservers[toggle.id] = new MutationObserver(observerCallback);
          this._customDropdownAlertsObservers[toggle.id].observe(pfeNavigationDropdown, {
            attributeFilter: ["alerts", "pfe-alerts"],
          });
        }

        // Process Site Switcher Dropdown
        if (toggleAndDropdownWrapper.classList.contains("pfe-navigation__site-switcher")) {
          this._siteSwitcherToggle = toggle;
          const siteSwitcherBackButtonWrapper = document.createElement("div");
          const siteSwitcherBackButton = document.createElement("button");

          toggleAndDropdownWrapper.setAttribute("mobile-slider", "");

          siteSwitcherBackButtonWrapper.classList.add("pfe-navigation__site-switcher__back-wrapper");

          siteSwitcherBackButton.classList.add("pfe-navigation__site-switcher__back-button");
          // @todo Translate via attribute
          siteSwitcherBackButton.setAttribute("aria-label", `Close ${attributeValues["name"]} and return to menu`);
          siteSwitcherBackButton.innerText = "Back to menu";

          siteSwitcherBackButton.addEventListener("click", this._siteSwitcherBackClickHandler);

          this._siteSwitcherBackButton = siteSwitcherBackButton;
          siteSwitcherBackButtonWrapper.appendChild(siteSwitcherBackButton);
          pfeNavigationDropdown.prepend(siteSwitcherBackButtonWrapper);
        }
      }
    }

    // Reconnecting mutationObserver for IE11 & Edge
    if (_isCrustyBrowser()) {
      // this._observer.observe(this, lightDomObserverConfig);
    }
  }

  /**
   * Event handler to capture interactions that occur in the shadow DOM
   * @param {object} event
   */
  _shadowDomInteraction(event) {
    if (_isCrustyBrowser()) {
      this.emitEvent(PfeNavigation.events.shadowDomInteraction, {
        detail: {
          target: event.target,
          parent: this,
        },
      });
    }
  }

  /**
   * Adds max-width to logo so logo can squish at mobile sizes
   * If the logo doesn't squish it may push other menu controls off the side of the screen
   */
  _postProcessLogo() {
    // How many times we'll poll for image dimensions
    let timesToCheckForImageDimensions = 8;
    const logoCheckInterval = 500;
    const logoSelector = ".pfe-navigation__logo-image--screen, .pfe-navigation__logo-image, img, svg";

    /**
     * Sets a max width for the logo the logo can be squished at mobile sizes
     * @param {Object} logoDimensions Object with width and height key
     * @param {Integer} maxHeight The maximum height the logo should be
     */
    const setLogoMaxWidth = (logoDimensions, maxHeight) => {
      // Use the proportions of the image and the desired height to calculate the max-width
      const maxWidth = Math.ceil((logoDimensions.width * maxHeight) / logoDimensions.height);
      // Need to apply the max-width to the image because the wrappers have padding
      const shadowLogo: HTMLElement = this._logoWrapper.querySelector(logoSelector);
      if (shadowLogo) {
        shadowLogo.style.maxWidth = `${maxWidth}px`;
      } else {
        this.error("Couldn't find logo image for ");
      }
    };

    /**
     * Gets the dimensions of the logo
     * @param {Element} logoElement Logo element, should be an img or svg
     * @returns {Object} Logo dimensions as an object with width and height keys
     */
    const getLogoDimensions = (logoElement) => {
      const logoDimensions = { width: 0, height: 0 };
      const logoTag = logoElement.tagName.toLowerCase();
      if (logoTag === "svg") {
        const svgBounds = logoElement.getBBox();
        logoDimensions.width = svgBounds.width;
        logoDimensions.height = svgBounds.height;
      } else if (logoTag === "img") {
        logoDimensions.width = logoElement.naturalWidth;
        logoDimensions.height = logoElement.naturalHeight;
      } else {
        // Don't poll since we don't know how to handle the logoElement tag
        timesToCheckForImageDimensions = 0;
        this.error(`Logo image wasn\'t a HTML tag that was expected. Expected img or svg, was ${logoTag}`);
      }

      return logoDimensions;
    };

    /**
     * Polls to see when the logo dimensions are available so we can set max width
     * @param {Element} logoElement Logo element, should be an img or svg
     */
    const pollForLogoDimensions = (logoElement) => {
      this.log("Polling for logo dimensions");
      let logoDimensions = getLogoDimensions(logoElement);
      if (logoDimensions.width > 0 && logoDimensions.height > 0) {
        // Figure out desired height per design spec by checking for small class
        let logoHeight = this.logoHeights.default;
        if (logoElement.classList.contains("pfe-navigation__logo-image--small")) {
          logoHeight = this.logoHeights.small;
        }
        this.log("Got logo dimensions", logoDimensions.width, logoDimensions.height);
        setLogoMaxWidth(logoDimensions, logoHeight);
      }
      // If we didn't get logo dimensions wait a bit and try again
      else if (timesToCheckForImageDimensions) {
        window.setTimeout(() => {
          timesToCheckForImageDimensions--;
          pollForLogoDimensions(logoElement);
        }, logoCheckInterval);
      }
    };

    // Kicks everything off
    if (this._logoWrapper) {
      const logoElement = this._logoWrapper.querySelector(logoSelector);
      if (logoElement) {
        pollForLogoDimensions(logoElement);
      } else {
        this.error("Was not able to identify a logo image, this may cause issues with mobile logo display.");
      }
    }
  }

  /**
   * Main observer used to kick off light DOM processing of logo, mainMenu, account, search, and secondaryLinks
   * @param {object} mutationList Mutation list from mutation observer
   * @param {boolean} init Set when this function is called manually to initialize the component
   */
  _processHostChildren(mutationList, init) {
    console.log('_processHostChildren', mutationList, init);
    let childrenToProcess = null;
    let recalculateMenuBreakpoints = false;
    if (!init) {

    }
    else {
      childrenToProcess = this.children;

      // Process Custom Dropdowns in secondary links area
      // @note Running into issue where custom button text returns "" without the timeout
      window.setTimeout(() => {
        const pfeNavigationDropdowns = this.querySelectorAll("pfe-navigation-dropdown");
        this._processCustomDropdowns(pfeNavigationDropdowns);
      }, 0);
    }

    ///
    // @note v1.x markup:
    // Storing transformed markup in a document fragment to minimize DOM writes
    ///
    const transformedSecondaryLinks = document.createDocumentFragment();
    const customDropdownsToProcess = [];

    // Process new children
    if (childrenToProcess) {
      for (let index = 0; index < childrenToProcess.length; index++) {
        const child = childrenToProcess[index];

        if (child.getAttribute('slot') === 'account') {
          const accountDropdown = child.querySelector('pfe-navigation-account, rh-account-dropdown');
          if (accountDropdown) {
            const oldAccountDropdown = this._observers.account.element;
            if (accountDropdown !== oldAccountDropdown) {
              if (this._observers.account.observer) {
                this._observers.account.observer.disconnect();
              }
              this._observers.account.element = accountDropdown;
              this._accountComponent = accountDropdown;
              this._processAccountDropdownChange(null);
              this._observers.account.observer.observe(
                this._observers.account.element,
                this._observers.account.config
              );
              recalculateMenuBreakpoints = true;
            }
          }
        }

        ///
        // Process search slot
        ///
        else if (child.getAttribute('slot') === 'search') {
          this.classList.add('pfe-navigation--has-search');
          this._searchToggle.hidden = false;
        }

        ///
        // @note v1.x markup:
        // Address skip links, put them at the beginning of the document
        ///
        else if (child.getAttribute('slot') === 'skip') {
          const skipLinks = child;
          const htmlBody = document.querySelector("body");
          // Wrapper used to make sure we don't duplicate skip links
          const skipLinksWrapper = document.createElement("div");
          skipLinksWrapper.id = "pfe-navigation__1x-skip-links";
          for (let index = 0; index < skipLinks.length; index++) {
            skipLinks[index].removeAttribute("slot");

            // Add visually-hidden to the link tags so we can show them when focused on with CSS
            if (skipLinks[index].tagName === "A") {
              skipLinks[index].classList.add("visually-hidden", "skip-link");
            } else {
              const theRealSkipLinks = skipLinks[index].querySelectorAll("a");
              for (let j = 0; j < theRealSkipLinks.length; j++) {
                theRealSkipLinks[j].classList.add("visually-hidden", "skip-link");
              }
            }
            skipLinksWrapper.appendChild(skipLinks[index]);
          }

          // If we already have an oldSkipLinks, replace it
          const oldSkipLinksWrapper = document.getElementById("pfe-navigation__1x-skip-links");
          if (oldSkipLinksWrapper) {
            oldSkipLinksWrapper.parentElement.replaceChild(skipLinksWrapper, oldSkipLinksWrapper);
          } else {
            // Put skip links as the first thing after the body tag
            htmlBody.prepend(skipLinksWrapper);
          }
        }

        ///
        // @note v1.x markup:
        // Address secondary links from nav 1.x, need to modify markup and add wrappers to make it work in nav 2.x
        ///
        else if (child.tagName.toLowerCase() === 'pfe-navigation-item') {
          // Accomodating different markup for trigger/toggle
          const trigger = child.querySelector('[slot="trigger"]');
          const triggerLink = trigger ? trigger.querySelector("a") : null;
          // Tray is optional
          const tray = child.querySelector('[slot="tray"]');

          // These have to be set depending on the markup
          let shadowTrigger = null;
          let toggleName = null;
          if (triggerLink) {
            shadowTrigger = triggerLink.cloneNode(true);
            toggleName = triggerLink.innerText;
          }
          else if (trigger) {
            toggleName = trigger.innerText;
            shadowTrigger = trigger.cloneNode(true);
            shadowTrigger.removeAttribute("slot");
          }
          else {
            const unslottedChildLink = child.querySelector("a");
            if (unslottedChildLink) {
              toggleName = unslottedChildLink.innerText;
              shadowTrigger = unslottedChildLink;
            }
            // If we can't find any of that markup we can't transform the markup
            else {
              this.error(
                "Attempted to transform 1.x secondary link and couldn't find what we needed.",
                child
              );
              break;
            }
          }

          // Div Wrapper for secondary links
          const divWrapper = document.createElement("div");
          divWrapper.setAttribute("slot", "secondary-links");
          // If there's a tray, it's a dropdown, setup a pfe-navigation-dropdown
          if (tray) {
            // If it's a dropdown, wrap it in pfe-navigation-dropdown
            const dropdown = document.createElement("pfe-navigation-dropdown");
            dropdown.dataset.idSuffix = this._createMachineName(toggleName);
            const toggle = this._createCustomDropdownToggle(
              dropdown,
              toggleName,
              child.getAttribute("pfe-icon")
            );

            // Copy over any data attributes to the toggle
            if (triggerLink) {
              const datasetKeys = Object.keys(triggerLink.dataset);
              for (let j = 0; j < datasetKeys.length; j++) {
                const dataKey = datasetKeys[j];
                toggle.dataset[dataKey] = triggerLink.dataset[dataKey];
              }
            }

            dropdown.setAttribute("dropdown-width","full");
            dropdown.classList.add("pfe-navigation__dropdown--default-styles", "pfe-navigation__dropdown--1-x");
            dropdown.appendChild(child);

            divWrapper.appendChild(toggle);
            divWrapper.appendChild(dropdown);
            transformedSecondaryLinks.appendChild(divWrapper);
            customDropdownsToProcess.push(dropdown);
          }
          // Otherwise this is just a link with an icon
          else {
            shadowTrigger.classList.add("pfe-navigation__secondary-link");
            shadowTrigger.innerHTML = toggleName;
            shadowTrigger.prepend(this._createPfeIcon(child.icon));
            divWrapper.appendChild(shadowTrigger);
            transformedSecondaryLinks.appendChild(divWrapper);
          }

          recalculateMenuBreakpoints = true;
        }

        ///
        // Process Nav Wrapper
        // Have to check class and tagName because ShadyCSS adds pfe-navigation class to everything >:(
        ///
        else if (child.classList && child.classList.contains('pfe-navigation') && child.tagName.toLowerCase() === 'nav') {

          // Process Logo
          const newLogo = child.querySelector('#pfe-navigation__logo-wrapper, [slot="logo"]');
          const oldLogo = this._observers.logo.element;
          if (oldLogo !== newLogo) {
            // Redo the observer
            this._observers.logo.observer.disconnect();
            this._observers.logo.element = newLogo;
            this._processLogo(null, true);
            this._observers.logo.observer.observe(
              this._observers.logo.element,
              this._observers.logo.config
            );
            recalculateMenuBreakpoints = true;
          }

          // Find Main menu
          const oldMainMenu = this._observers.mainMenu.element;
          let newMainMenu = child.querySelector('#pfe-navigation__menu');
          if (!newMainMenu) {
            newMainMenu = this.querySelector("pfe-navigation-main > ul");
          }

          // Process Main Menu
          if (newMainMenu && oldMainMenu !== newMainMenu) {
            // Redo the observer
            this._observers.mainMenu.observer.disconnect();
            this._observers.mainMenu.element = newMainMenu;
            this._processMainMenu(null);
            this._observers.mainMenu.observer.observe(
              this._observers.mainMenu.element,
              this._observers.mainMenu.config
            );
            recalculateMenuBreakpoints = true;
          }
        }
      }
    }

    // Process any custom dropdowns
    if (customDropdownsToProcess.length) {
      this._processCustomDropdowns(customDropdownsToProcess);
    }

    // Write our transformed 1.x markup to the DOM
    if (transformedSecondaryLinks.children.length) {
      this.appendChild(transformedSecondaryLinks);
    }

    // Throw errors for required elements that are missing
    if (!this._observers.logo.element) {
      this.warn("Cannot find a logo in the component tag.");
    }

    // Recalculate main menu breakpoint
    this._menuBounds.mainMenuRight = null;
    recalculateMenuBreakpoints = true;

    // Re-set pointers to commonly used elements that just got paved over
    this._menuDropdownXs = this.shadowRoot.getElementById("mobile__dropdown");
    this._menuDropdownMd = this.shadowRoot.getElementById("pfe-navigation__menu-wrapper");
    if (!this._menuDropdownMd) {
      this.classList.add("pfe-navigation--no-main-menu");
    }

    // Recalculate JS breakpoint and related layout state
    // Using setTimeout to put this off until there's a spare cycle
    if (recalculateMenuBreakpoints) {
      window.setTimeout(() => {
        this._calculateMenuBreakpoints();
        this._calculateBreakpointAttribute();
        this._setCurrentMobileDropdown();
        // If we have a mobile dropdown make sure it has dropdown attributes
        if (this._currentMobileDropdown) {
          this._addCloseDropdownAttributes(this._mobileToggle, this._currentMobileDropdown);
        }
        this._moveSearchSlot();
      }, 0);
    }

    // Some cleanup and state management for after render
    const postProcessHostChildren = () => {
      // Preventing issues in IE11 & Edge
      if (_isCrustyBrowser()) {
        // this._observer.disconnect();
      }

      if (this.isMobileMenuButtonVisible() && !this.isOpen("mobile__button")) {
        this._addCloseDropdownAttributes(this._mobileToggle, this._currentMobileDropdown);
      }

      // Mobile slider elements have a tab trap that will need to be updated if content has been updated
      const mobileSliderElements = this.querySelectorAll("[mobile-slider]");
      for (let index = 0; index < mobileSliderElements.length; index++) {
        const currentMobileSliderElement = mobileSliderElements[index];
        this._getLastFocusableItemInMobileSlider(currentMobileSliderElement);
        const toggle = currentMobileSliderElement.querySelector(".pfe-navigation__secondary-link");
        const dropdown = currentMobileSliderElement.querySelector(".pfe-navigation__dropdown");

        // Add mutation observer if we don't have one already
        if (toggle && toggle.id && dropdown && !this._mobileSliderMutationObservers[toggle.id]) {
          this._mobileSliderMutationObservers[toggle.id] = new MutationObserver(() =>
            this._getLastFocusableItemInMobileSlider(currentMobileSliderElement)
          );
          this._mobileSliderMutationObservers[toggle.id].observe(dropdown, { subtree: true, childList: true });
        }
      }

      // Reconnecting mutationObserver for IE11 & Edge
      if (_isCrustyBrowser()) {
        // this._observer.observe(this, lightDomObserverConfig);
      }
    };

    window.setTimeout(postProcessHostChildren, 0);
  }

  /**
   * When classes on host change this copies them to wrapper in shadow DOM
   */
  _processHostAttributes() {
    this.log('_processHostAttributes');
    this._shadowDomOuterWrapper.setAttribute("class", `pfe-navigation__wrapper ${this.getAttribute("class")}`);
  }

  /**
   * Watches logo for updates and copies it into the shadow DOM
   * @param {object} mutationList Mutation list from mutation observer
   * @param {boolean} init Set when this function is called manually to initialize the component
   */
  _processLogo(mutationList, init) {
    console.log('_processLogo', mutationList, init);
    const lightLogo = this._observers.logo.element;
    if (init) {
      // Making sure this is nav 2.0 markup
      if (lightLogo.id === 'pfe-navigation__logo-wrapper' && !lightLogo.hasAttribute('slot')) {
        const newShadowLogoWrapper = lightLogo.cloneNode(true) as HTMLElement;
        if (this._logoWrapper) {
          this._shadowDomOuterWrapper.replaceChild(newShadowLogoWrapper, this._logoWrapper);
        } else {
          this._shadowDomOuterWrapper.prepend(newShadowLogoWrapper);
        }
        // Re-set pointer since old element doesn't exist
        this._logoWrapper = newShadowLogoWrapper;
      }
      // @note v1.x markup:
      else {
        const logoLinkCopy = lightLogo.cloneNode(true) as HTMLElement;
        const logoLinkWrapper = document.createElement("div");
        logoLinkWrapper.classList.add("pfe-navigation__logo-wrapper");
        logoLinkWrapper.setAttribute("id", "pfe-navigation__logo-wrapper");

        logoLinkCopy.removeAttribute("slot");
        logoLinkCopy.classList.add("pfe-navigation__logo-link");
        logoLinkWrapper.prepend(logoLinkCopy);

        // Add it to the shadow DOM
        if (this._logoWrapper) {
          this._logoWrapper.parentElement.replaceChild(logoLinkWrapper, this._logoWrapper);
        } else {
          this._shadowDomOuterWrapper.prepend(logoLinkWrapper);
        }
        // Re-set pointer since old element doesn't exist
        this._logoWrapper = logoLinkWrapper;
      }
    }

    this._postProcessLogo();
  }

  /**
   * Watches mainMenu for updates and copies it into the shadow DOMu
   * @param {object} mutationList Mutation list from mutation observer
   * @param {boolean} init Set when this function is called manually to initialize the component
   */
  _processMainMenu(mutationList: Array<MutationRecord>) {
    console.log('_processMainMenu', mutationList);
    const init: boolean = mutationList === null;
    const mainMenu = this._observers.mainMenu.element;
    let menuItemsToProcess = null;
    if (!init) {

    }
    else {
      menuItemsToProcess = mainMenu.children;
    }


    // @note v1.x markup:
    // Add selectors needed for the menu to behave well in 2.x
    const hasOneXMenuMarkup = mainMenu.parentElement.tagName.toLowerCase() === 'pfe-navigation-main';
    if (init && hasOneXMenuMarkup) {
      if (mainMenu && mainMenu.id !== "pfe-navigation__menu") {
        mainMenu.id = "pfe-navigation__menu";
        mainMenu.classList.add("pfe-navigation__menu");
      }
    }

    const processMenuItem = (menuItem: HTMLElement) => {
      // Create a content ID for storing pointers to shadow DOM versions
      // and keeping order of menu items in light DOM the same as the shadowDOM
      let menuItemDataId = menuItem.dataset.menuItemId;
      if (!menuItemDataId) {
        menuItemDataId = `${Math.random().toString(36).substr(2, 9)}`
        menuItem.dataset.menuItemId = menuItemDataId;
      }

      const menuItemClone = menuItem.cloneNode(true) as HTMLElement;

      let menuLink: HTMLElement = menuItemClone.querySelector(".pfe-navigation__menu-link");
      let dropdown: HTMLElement = menuItemClone.querySelector(".pfe-navigation__dropdown");

      if (dropdown) {
        // Convert dropdown links into buttons
        const toggle = document.createElement("button");

        // Move over or add important attributes and content
        toggle.setAttribute("class", menuLink.getAttribute("class"));
        toggle.classList.add("pfe-navigation__menu-link--has-dropdown");

        toggle.innerHTML = menuLink.innerHTML;
        // Keep data attributes from link with the button
        // Intended to maintain analytics data attributes
        const menuLinkAttributes = menuLink.getAttributeNames();
        for (let index = 0; index < menuLinkAttributes.length; index++) {
          const currentAttribute = menuLinkAttributes[index];
          if (currentAttribute.startsWith("data-")) {
            toggle.setAttribute(currentAttribute, menuLink.getAttribute(currentAttribute));
          }
        }
        toggle.dataset.machineName = this._createMachineName(menuLink.innerText);

        // Add dropdown behavior
        toggle.addEventListener("click", this._dropdownItemToggle);
        menuItemClone.replaceChild(toggle, menuLink);

        // Set Id's for the button and dropdown and add their ID's to the parent li for easy access
        const toggleId = `main-menu__button--${toggle.dataset.machineName}`;
        const dropdownId = `main-menu__dropdown--${toggle.dataset.machineName}`;
        toggle.setAttribute("id", toggleId);

        // Create wrapper for dropdown and give it appropriate classes and attributes
        // If there isn't one already
        let dropdownWrapper =
          dropdown.parentElement.classList.contains('pfe-navigation__dropdown-wrapper') ?
            dropdown.parentElement :
            null;
        if (!dropdownWrapper) {
          dropdownWrapper = document.createElement("div");

          dropdownWrapper.classList.add("pfe-navigation__dropdown-wrapper");
          if (dropdown.classList.contains("pfe-navigation__dropdown--single-column")) {
            dropdownWrapper.classList.add("pfe-navigation__dropdown-wrapper--single-column");
          }

          dropdownWrapper.setAttribute("id", dropdownId);

          dropdownWrapper.appendChild(dropdown);
          menuItemClone.appendChild(dropdownWrapper);
          menuItemClone.dataset.dropdownId = dropdownId;
          toggle.setAttribute("aria-controls", dropdownId);
        }

        // Add custom event for interactive elements in shadowDom so anayltics can capture them acccurately
        // We'll omit elements that have custom events already to avoid double reporting
        const focusableElements = dropdownWrapper.querySelectorAll(this._focusableElements);
        for (let index = 0; index < focusableElements.length; index++) {
          const currentElement = focusableElements[index];
          currentElement.addEventListener("click", this._shadowDomInteraction);
        }
        // Set everything to closed by default
        this._addCloseDropdownAttributes(toggle, dropdownWrapper);
      }

      if (this._mainMenuItems[menuItemDataId]) {
        this._mainMenuItems[menuItemDataId].remove();
      }
      this._mainMenuItems[menuItemDataId] = menuItemClone;
    }; // End processMenuItem

    if (menuItemsToProcess) {
      if (!this._mainMenu) {
        this._mainMenu = document.createElement('ul');
        this._mainMenu.classList.add('pfe-navigation__menu');
        this._mainMenu.id = 'pfe-navigation__menu';
        this._shadowMenuWrapper.append(this._mainMenu);
      }

      const menuItemOrder = [];
      for (let index = 0; index < menuItemsToProcess.length; index++) {
        const menuItem = menuItemsToProcess[index];
        processMenuItem(menuItem);
        menuItemOrder.push(menuItem.dataset.menuItemId);
      }

      for (let index = 0; index < menuItemOrder.length; index++) {
        const menuItemId = menuItemOrder[index];
        this._mainMenu.append(this._mainMenuItems[menuItemId]);
      }
    }
  }

  /**
   * Handle initialization or changes in light DOM
   * Clone them into the shadowRoot
   * @param {array} mutationList Provided by mutation observer
   */
  _processLightDom(mutationList) {
    // If we're mutating because an attribute on the web component starting with pfe- changed, don't reprocess dom
    let cancelLightDomProcessing = true;
    let recalculateMenuBreakpoints = false;
    const ignoredTags = ["PFE-NAVIGATION", "PFE-ICON", "PFE-NAVIGATION-DROPDOWN", "PFE-CTA"];
    const ie11IgnoredClasses = ["pfe-navigation__dropdown-wrapper", "pfe-navigation__dropdown", "pfe-cta"];

    // On initialization
    if (!mutationList) {
      cancelLightDomProcessing = false;
    }
    // On Mutation we get a mutationList, check to see if there are important changes to react to
    // If not hop out of this function early
    else {
      for (let index = 0; index < mutationList.length; index++) {
        const mutationItem = mutationList[index];
        const oneXSlotsNotIn2x = ["skip", "logo", "trigger", "tray"];

        // Ignore common mutations that we don't care about
        let ignoreThisMutation = false;

        if (mutationItem.type === "childList") {
          // @note Prevent preprocess thrashing in IE11 from pfe-cta
          if (_isCrustyBrowser()) {
            for (let j = 0; j < ie11IgnoredClasses.length; j++) {
              const className = ie11IgnoredClasses[j];
              if (mutationItem.target.classList.contains(className)) {
                ignoreThisMutation = true;
              }
            }
          }

          if (!ignoreThisMutation) {
            const customDropdownsToProcess = [];
            if (mutationItem.addedNodes) {
              for (let j = 0; j < mutationItem.addedNodes.length; j++) {
                const addedNode = mutationItem.addedNodes[j];
                if (
                  addedNode.nodeType === 1 &&
                  addedNode.hasAttribute("slot") &&
                  addedNode.parentElement.tagName === "PFE-NAVIGATION"
                ) {
                  switch (addedNode.getAttribute("slot")) {
                    case "secondary-links":
                      const customDropdown = addedNode.querySelector("pfe-navigation-dropdown");
                      if (customDropdown) {
                        customDropdownsToProcess.push(customDropdown);
                      }
                      break;
                  }
                }

                // Recalculate both breakpoints
                this._menuBounds.mainMenuRight = null;
                this._menuBounds.secondaryLinksLeft = null;
                recalculateMenuBreakpoints = true;
              }
            }
            // @todo Handle removed nodes
            // for (let index = 0; index < mutationItem.removedNodes.length; index++) {
            //   const removedNode = mutationItem.removedNodes[index];
            // }
            if (customDropdownsToProcess.length) {
              this._processCustomDropdowns(customDropdownsToProcess);
            }
          }
          // for (let index = 0; index < mutationItem.removedNodes.length; index++) {
          //   const removedNode = mutationItem.removedNodes[index];
          // }
        }

        if (!ignoreThisMutation && !mutationItem.target && mutationItem.type === "attributes") {
          // Updates to PFE elements should be ignored
          if (mutationItem.target.tagName.startsWith("PFE")) {
            if (
              mutationItem.attributeName === "pfelement" ||
              mutationItem.attributeName === "class" ||
              mutationItem.attributeName === "type"
            ) {
              ignoreThisMutation = true;
            }
          }
        }

        if (!ignoreThisMutation) {
          if (mutationItem.type === "characterData") {
            // Process text changes
            cancelLightDomProcessing = false;
          }
          // Slotted tags shouldn't cause lightDomProcessing
          // Unless it's a slot from 1.x that we're not using anymore
          else if (
            !mutationItem.target.hasAttribute("slot") ||
            oneXSlotsNotIn2x.includes(mutationItem.target.getAttribute("slot"))
          ) {
            // Elements with slotted parents should also be ignored
            const slottedParent = mutationItem.target.closest("[slot]");
            if (!slottedParent || oneXSlotsNotIn2x.includes(slottedParent.getAttribute("slot"))) {
              // Make sure it's not an ignored tag
              if (!ignoredTags.includes(mutationItem.target.tagName)) {
                if (mutationItem.attributeName) {
                  // We need to update attribute changes
                  cancelLightDomProcessing = false;
                }
                if (mutationItem.type === "childList") {
                  for (let j = 0; index < mutationList.addedNodes.length; j++) {
                    const addedNode = mutationList.addedNodes[j];
                    // We need to update on tree changes if they aren't in a slot
                    if (!addedNode.hasAttribute("slot") || !addedNode.closest("[slot]")) {
                      cancelLightDomProcessing = false;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Preventing issues in IE11 & Edge
    if (_isCrustyBrowser()) {
      // this._observer.disconnect();
    }


    if (cancelLightDomProcessing) {
      // Reconnecting mutationObserver for IE11 & Edge
      if (_isCrustyBrowser()) {
        // this._observer.observe(this, lightDomObserverConfig);
      }

      this.log("Cancelled light DOM processing", mutationList);

      return;
    }

    // Begins the wholesale replacement of most of the shadowDOM -------------------------------
    this.log("_processLightDom: replacing shadow DOM", mutationList);

    // Ensure we're still disconnected after _processCustomDropdowns
    // Preventing issues in IE11 & Edge
    if (_isCrustyBrowser()) {
      // this._observer.disconnect();
    }

    ///
    // Process Main Menu
    ///
    // if (mainMenu) {
    //   //--------------------------------------------------
    //   // Begin best time to manipulate DOM in nav
    //   // Modify elements when they're in the shadow vars before they get appended to the shadow DOM
    //   //--------------------------------------------------

    //   // Add attributres we need on the shadow DOM menu wrapper
    //   newShadowMenuWrapper.setAttribute("id", "pfe-navigation__menu-wrapper");
    //   newShadowMenuWrapper.classList.add("pfe-navigation__menu-wrapper");

    //   // Copy light DOM menu into new wrapper, to be put in shadow DOM after manipulations
    //   newShadowMenuWrapper.appendChild(mainMenu.cloneNode(true));
    // }
    //--------------------------------------------------
    // End best time to manipulate DOM in nav
    //--------------------------------------------------

    // Replace the menu in the shadow DOM
    // this._shadowMenuWrapper.parentElement.replaceChild(newShadowMenuWrapper, this._shadowMenuWrapper);
    // this._shadowMenuWrapper = newShadowMenuWrapper;

    if (this.isOpen()) {
      this._changeNavigationState(this.openToggle, "open");
    }

  } // end _processLightDom()

  /**
   * Behavior for main menu breakpoint
   * @param {MediaQueryListEvent} event Event from MediaQueryList
   */
  _collapseMainMenu(event: MediaQueryListEvent) {
    if (event.matches) {
      this.classList.add("pfe-navigation--collapse-main-menu");
    } else {
      this.classList.remove("pfe-navigation--collapse-main-menu");
    }
  }

  /**
   * Behavior for secondary links breakpoint
   * @param {MediaQueryListEvent} event Event from MediaQueryList
   */
  _collapseSecondaryLinks(event: MediaQueryListEvent) {
    if (event.matches) {
      this.classList.add("pfe-navigation--collapse-secondary-links");
    } else {
      this.classList.remove("pfe-navigation--collapse-secondary-links");
    }
  }

  /**
   * Calculate the points where the main menu and secondary links should be collapsed and adds them
   * To recalculate a breakpoint set this.menuBreakpoint[name] to null and run this function.
   */
  _calculateMenuBreakpoints() {
    if (_isCrustyBrowser()) {
      return;
    }

    // Only recreate media queries if something changed
    let recreateMediaQueries = false;
    // How much white space to add to some of these calculations
    // @todo future - 20 should probably be based on a CSS value or DOM measurement
    const someExtraWhiteSpace = 20;

    // Calculate space needed for logo
    if (this._menuBounds.logoRight === null) {
      if (this._logoWrapper) {
        const logoBoundingRect = this._logoWrapper.getBoundingClientRect();
        // Getting the right boundary, which will include menu padding and the image's width
        const logoRight = Math.ceil(logoBoundingRect.right);
        // Compare new value with old value to see if there was any change
        if (logoRight && logoRight !== this._menuBounds.logoRight) {
          this._menuBounds.logoRight = logoRight;
          recreateMediaQueries = true;
        }
      }
    }

    // Calculate space needed for logo and main menu
    if (!this._menuBounds.mainMenuRight && !this.isMobileMenuButtonVisible()) {
      const navigation = this.shadowRoot.getElementById("pfe-navigation__menu");
      if (navigation) {
        const navigationBoundingRect = navigation.getBoundingClientRect();

        // Gets the length from the left edge of the screen to the right side of the navigation
        const mainMenuRight = Math.ceil(navigationBoundingRect.right);
        // Compare new value with old value to see if there was any change
        if (mainMenuRight && mainMenuRight !== this._menuBounds.mainMenuRight) {
          this._menuBounds.mainMenuRight = mainMenuRight;
          recreateMediaQueries = true;
        }
      }
    }

    // Calculate space needed for right padding and secondary links
    if (!this._menuBounds.secondaryLinksLeft && !this.isSecondaryLinksSectionCollapsed()) {
      let leftMostSecondaryLink = null;
      let secondaryLinksLeft = null;
      let leftMostSecondaryLinkBoundingRect = null;

      if (this.hasSlot("search")) {
        leftMostSecondaryLink = this._searchToggle;
      } else if (this.hasSlot("secondary-links")) {
        leftMostSecondaryLink = this.getSlot("secondary-links")[0];
      } else if (this._accountToggle) {
        leftMostSecondaryLink = this._accountToggle;
      } else if (this._accountLogInLink) {
        leftMostSecondaryLink = this._accountLogInLink;
      } else {
        // We don't have a left most secondary link, use padding on the nav
        secondaryLinksLeft = parseInt(window.getComputedStyle(this._shadowDomOuterWrapper, null).paddingRight);
      }
      if (leftMostSecondaryLink) {
        leftMostSecondaryLinkBoundingRect = leftMostSecondaryLink.getBoundingClientRect();

        // Gets the length from the right edge of the screen to the left side of the left most secondary link
        secondaryLinksLeft = window.innerWidth - Math.ceil(leftMostSecondaryLinkBoundingRect.left);
      }
      // Compare new value with old value to see if there was any change
      if (
        leftMostSecondaryLinkBoundingRect &&
        secondaryLinksLeft &&
        secondaryLinksLeft !== this._menuBounds.secondaryLinksLeft
      ) {
        this._menuBounds.secondaryLinksLeft = window.innerWidth - Math.ceil(leftMostSecondaryLinkBoundingRect.left);
        recreateMediaQueries = true;
      }
    }

    // Only true if a length has changed
    if (recreateMediaQueries) {
      if (this._menuBounds.secondaryLinksLeft) {
        if (this._menuBounds.mainMenuRight) {
          this._menuBreakpoints.mainMenu = this._menuBounds.mainMenuRight + this._menuBounds.secondaryLinksLeft;
        } else if (this._menuBounds.logoRight) {
          this._menuBreakpoints.mainMenu =
            this._menuBounds.logoRight + this._menuBounds.secondaryLinksLeft + someExtraWhiteSpace;
        }

        // Remove old listener
        if (this._menuBreakpointQueries.mainMenu) {
          this._removeMediaQueryListener(this._menuBreakpointQueries.mainMenu, this._collapseMainMenu as EventListener);
        }
        // Create new one
        this._menuBreakpointQueries.mainMenu = window.matchMedia(`(max-width: ${this._menuBreakpoints.mainMenu}px)`);
        this._addMediaQueryListener(this._menuBreakpointQueries.mainMenu, this._collapseMainMenu as EventListener);
      }

      if (this._menuBounds.logoRight && this._menuBounds.secondaryLinksLeft) {
        this._menuBreakpoints.secondaryLinks =
          this._menuBounds.logoRight +
          this._menuBounds.secondaryLinksLeft +
          this._mobileToggle.offsetWidth +
          someExtraWhiteSpace;

        // Remove old listener
        if (this._menuBreakpointQueries.secondaryLinks) {
          this._removeMediaQueryListener(this._menuBreakpointQueries.secondaryLinks, this._collapseSecondaryLinks as EventListener);
        }
        // Create new listener
        this._menuBreakpointQueries.secondaryLinks = window.matchMedia(
          `(max-width: ${this._menuBreakpoints.secondaryLinks}px)`
        );
        this._addMediaQueryListener(this._menuBreakpointQueries.secondaryLinks, this._collapseSecondaryLinks as EventListener);
      }

      this.log("Menu Bounds updated, updating mediaQueries", {
        // Flattening object so what it was at the time of logging doesn't get updated
        menuBounds: `logoRight: ${this._menuBounds.logoRight}, mainMenuRight: ${this._menuBounds.mainMenuRight}, secondaryLinksLeft: ${this._menuBounds.secondaryLinksLeft}`,
        menuBreakpoints: `secondaryLinks: ${this._menuBreakpoints.secondaryLinks}, mainMenu: ${this._menuBreakpoints.mainMenu}`,
      });
    }
  }

  /**
   * Depending on breakpoint we need to move the search slot to one of two places to make a logical tab order
   */
  _moveSearchSlot() {
    // Preventing issues in IE11 & Edge
    if (_isCrustyBrowser()) {
      // this._observer.disconnect();
    }

    if (this.isSecondaryLinksSectionCollapsed()) {
      this._removeDropdownAttributes(null, this._searchSpotMd);
      if (this._searchSlot.parentElement !== this._searchSpotXs) {
        this._searchSpotXs.appendChild(this._searchSlot);
      }
    } else {
      if (this._searchSlot.parentElement !== this._searchSpotMd) {
        this._searchSpotMd.appendChild(this._searchSlot);
      }
      if (this.isOpen("secondary-links__button--search")) {
        this._addOpenDropdownAttributes(null, this._searchSpotMd);
      } else {
        this._addCloseDropdownAttributes(null, this._searchSpotMd);
      }
    }

    // Reconnecting mutationObserver for IE11 & Edge
    if (_isCrustyBrowser()) {
      // this._observer.observe(this, lightDomObserverConfig);
    }
  }

  /**
   * Adjustments to behaviors and DOM that need to be made after a resize event
   */
  _postResizeAdjustments() {
    if (this._menuBreakpoints.mainMenu === null || this._menuBreakpoints.secondaryLinks === null) {
      this._calculateMenuBreakpoints();
    }

    // Track current navigation state
    const openToggle = this.openToggle ? this.getToggleElement(this.openToggle) : null;
    const openDropdownId = this.openToggle ? this._getDropdownId(this.openToggle) : null;
    const openDropdown = openDropdownId ? this.getDropdownElement(openDropdownId) : null;

    // Track previous state and new state
    const oldMobileDropdown = this._currentMobileDropdown;

    this._setCurrentMobileDropdown();
    const breakpointWas = this.breakpoint;
    const breakpointIs = this._calculateBreakpointAttribute();

    // Things that need to be checked if b
    if (breakpointIs !== breakpointWas) {
      // Make sure search slot is in the right spot, based on breakpoint
      this._moveSearchSlot();

      ///
      // Manage mobile toggle & dropdown state
      ///
      if (breakpointIs === "desktop") {
        // Mobile button doesn't exist on desktop, so we need to clear the state if that's the only thing that's open
        if (this.openToggle === "mobile__button") {
          this._changeNavigationState("mobile__button", "close");
          this._overlay.hidden = true;
        }

        // At desktop the mobile dropdown is just a wrapper
        this._removeDropdownAttributes(this._mobileToggle, this._currentMobileDropdown);
      } else {
        // Make sure old dropdown doesn't have dropdown aria and state attributes
        if (this._currentMobileDropdown !== oldMobileDropdown && oldMobileDropdown !== null) {
          this._removeDropdownAttributes(null, oldMobileDropdown);
        }

        // Make sure the current mobile dropdown has the correct attributes
        if (this.isOpen("mobile__button")) {
          this._addOpenDropdownAttributes(this._mobileToggle, this._currentMobileDropdown);
        } else {
          this._addCloseDropdownAttributes(this._mobileToggle, this._currentMobileDropdown);
        }
      }

      ///
      // Manage overlay state
      ///
      if (this.isOpen() && (breakpointIs === "desktop" || breakpointIs === "tablet")) {
        this._overlay.hidden = false;
      } else {
        this._overlay.hidden = true;
      }

      if (breakpointIs === "mobile") {
        if (openToggle) {
          const mobileSlideParent = openToggle.closest("[mobile-slider]");
          if (mobileSlideParent) {
            // @ts-ignore // @todo TS Doesn't like Lit properties
            this.mobileSlide = true;
          }
        }
      }
    }

    ///
    // Manage Dropdown Heights
    ///
    if (openToggle && openDropdown) {
      // Main menu needs a height set at mobile/tablet
      if (stringStartsWith(openToggle.id, "main-menu__button--")) {
        if (breakpointIs !== "desktop") {
          this._setDropdownHeight(openDropdown);
        } else {
          openDropdown.style.removeProperty("height");
        }
      }
      // Secondary menu dropdowns get set at mobile only
      else if (stringStartsWith(openToggle.id, "pfe-navigation__secondary-link--")) {
        if (this.breakpoint === "mobile") {
          this._setDropdownHeight(openDropdown);
        } else {
          openDropdown.style.removeProperty("height");
        }
      }
    }

    ///
    // ! Begin lines need to be at the end of this function
    ///
    // Remove class that hides nav while it's resizing
    this.classList.remove("pfe-navigation--is-resizing");

    this.breakpoint = breakpointIs;
    ///
    // ! End lines that need to be at the end of this function
    ///
  } // end _postResizeAdjustments()

  /**
   * Event listeners for toggles
   */
  _toggleMobileMenu() {
    if (!this.isOpen("mobile__button")) {
      this._changeNavigationState("mobile__button", "open");
      // Show main menu when mobile All Red Hat menu is closed
      this._showMobileMainMenu();
    } else {
      this._changeNavigationState("mobile__button", "close");
      // @todo: (KS) decide if I need this (i do not think so rn)
      // Hide main menu when mobile All Red Hat menu is open
      // this._hideMobileMainMenu();
    }
  }

  _toggleSearch() {
    this._changeNavigationState("secondary-links__button--search");
    // Move focus to search field when Desktop search button is activated
    this._searchFieldFocusHandler();
  }

  _dropdownItemToggle(event) {
    event.preventDefault();
    const dropdownItem = event.target;
    const toggleId = dropdownItem.id;
    this._changeNavigationState(toggleId);
  }

  /**
   * Default Keydown Keyboard event handler
   * @param {object} event
   */
  _generalKeyboardListener(event) {
    const key = event.key;
    // If Escape wasn't pressed, or the nav is closed, SMOKE BOMB
    if (key !== "Escape" || !this.isOpen()) {
      return;
    }

    // event.which is deprecated
    // see @resource: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which
    event.preventDefault();
    event.stopPropagation();

    const currentlyOpenToggleId = this.openToggle;
    const openToggle = this.getDropdownElement(currentlyOpenToggleId);
    const currentBreakpoint = this.breakpoint;

    switch (currentBreakpoint) {
      case "mobile":
        // close mobile menu
        this._changeNavigationState("mobile__button", "close");
        // Set the focus back onto the mobile menu trigger toggle only when escape is pressed
        this._mobileToggle.focus();
        break;

      case "tablet":
        // if it's a child of main menu (e.g. currentlyOpenToggleId.startsWith("main-menu") -- accordion dropdown) close mobile__button
        // Else close currentlyOpenToggleId -- desktop menu
        if (stringStartsWith(currentlyOpenToggleId, "main-menu")) {
          this._changeNavigationState("mobile__button", "close");
          // Set the focus back onto the mobile menu trigger toggle only when escape is pressed
          this._mobileToggle.focus();
        } else {
          this._changeNavigationState(currentlyOpenToggleId, "close");
          // Set the focus back onto the trigger toggle only when escape is pressed
          openToggle.focus();
        }
        break;

      case "desktop":
        this._changeNavigationState(currentlyOpenToggleId, "close");
        // Set the focus back onto the trigger toggle only when escape is pressed
        openToggle.focus();
        break;
    }
  }

  /**
   * Back to Menu Event Handler
   * close All Red Hat Menu and go back to Main Mobile Menu and set focus back to All Red Hat Toggle
   * Show main menu
   */
  _siteSwitcherBackClickHandler() {
    this._changeNavigationState("mobile__button", "open");
    // Show main menu when All Red Hat menu is closed
    this._showMobileMainMenu();
    if (this._siteSwitcherToggle) {
      this._siteSwitcherToggle.focus();
    }
  }

  /**
   * Overlay Event Handler
   * close menu when overlay is clicked
   */
  _overlayClickHandler() {
    if (this.openToggle) {
      this._changeNavigationState(this.openToggle, "close");
    }
    // @todo Check a11y expectations
    switch (this.breakpoint) {
      case "mobile":
        this._changeNavigationState("mobile__button", "close");
        break;
      case "tablet":
        // if it's a child of main menu (e.g. openToggleId.startsWith("main-menu") -- accordion dropdown) close mobile__button
        // Else close openToggleId -- desktop menu
        if (this.openToggle && stringStartsWith(this.openToggle, "main-menu")) {
          this._changeNavigationState("mobile__button", "close");
        }
        break;
    }
  }

  /**
   * Sticky Handler
   * turn nav into sticky nav
   */
  _stickyHandler() {
    const stuckClass = "pfe-navigation--stuck";
    if (window.pageYOffset >= this._top) {
      if (!this.classList.contains(stuckClass)) this.classList.add(stuckClass);
    } else {
      if (this.classList.contains(stuckClass)) this.classList.remove(stuckClass);
    }
  }

  /**
   * Hide main menu from screen readers and keyboard when mobile All Red Hat menu is open
   */
  _hideMobileMainMenu() {
    // Search
    this._searchSpotXs.setAttribute("hidden", "");

    // Main menu
    if (this._menuDropdownMd) {
      this._menuDropdownMd.setAttribute("hidden", "");
    }
  }

  /**
   * Show main menu to screen readers and keyboard users when Back to main menu button is pressed
   */
  _showMobileMainMenu() {
    // Search
    this._searchSpotXs.removeAttribute("hidden");

    // Main menu
    if (this._menuDropdownMd) {
      this._menuDropdownMd.removeAttribute("hidden");
    }
  }

  /**
   * Set focus to search field when search button is pressed on Desktop
   * if search input exists set to the light dom search input field (either type=text or type=search) so focus is in the correct place for screen readers and keyboards
   */
  _searchFieldFocusHandler() {
    const searchBox: HTMLElement = this.querySelector("[slot='search']  input[type='text'], [slot='search']  input[type='search']");

    if (searchBox) {
      searchBox.focus();
    }
  }

  /**
   * Utility function to create log in link
   * @param {string} logInUrl URL for login
   * @return {object} DOM Object for link
   */
  _createLogInLink(logInUrl) {
    if (this._accountLogInLink === null) {
      const logInLink = document.createElement("a");
      logInLink.setAttribute("href", logInUrl);
      logInLink.innerText = `${
        this._lang !== "en" && this._navTranslations ? this._navTranslations[this._lang].login : "Log in"
      }`;
      logInLink.classList.add("pfe-navigation__log-in-link");
      logInLink.prepend(this._createPfeIcon("web-icon-user"));
      logInLink.dataset.analyticsLevel = "1";
      logInLink.dataset.analyticsText = "Log In";
      logInLink.dataset.analyticsCategory = "Log In";
      logInLink.id = "pfe-navigation__log-in-link";
      this._accountLogInLink = logInLink;
      return logInLink;
    }
  }

  /**
   * Creates Avatar Markup
   * @param {string} name User's Name
   * @param {string} src Optional, Path to avatar image
   */
  _createPfeAvatar(name, src) {
    const pfeAvatar = document.createElement(`pfe-avatar`);
    pfeAvatar.setAttribute("name", name);
    pfeAvatar.setAttribute("shape", "circle");

    if (typeof src === "string") {
      pfeAvatar.setAttribute("src", src);
    }

    return pfeAvatar;
  }

  /**
   * Create Account menu button
   * @param {string} fullName Full name of the user
   * @param {string} avatarSrc URL for an avatar image
   * @return {object} Reference to toggle
   */
  _createAccountToggle(fullName, avatarSrc) {
    if (this._accountToggle === null) {
      const accountToggle = document.createElement("button");
      accountToggle.classList.add("pfe-navigation__account-toggle");
      accountToggle.id = "pfe-navigation__account-toggle";
      // @todo probably needs more a11y thought
      // @todo translate
      accountToggle.setAttribute("aria-label", "Open user menu");

      accountToggle.dataset.analyticsLevel = "1";
      accountToggle.dataset.analyticsText = "Account";
      accountToggle.dataset.analyticsCategory = "Account";

      const pfeAvatar = this._createPfeAvatar(fullName, avatarSrc);
      accountToggle.appendChild(pfeAvatar);
      this._accountToggle = accountToggle;

      return accountToggle;
    }
  }

  _accountToggleClick() {
    this._changeNavigationState(this._accountToggle.id);
  }

  /**
   * Handle DOM updates on the account dropdown
   * @param {object} mutationList Part of a mutationObserver event object for the change
   */
  _processAccountDropdownChange(mutationList) {
    if (this._accountLogInLink === null) {
      // Create login link
      const logInLink = this._accountComponent.getAttribute("login-link");
      if (logInLink) {
        this._accountOuterWrapper.prepend(this._createLogInLink(logInLink));
      }
    }

    if (this._accountToggle === null) {
      // Create account toggle
      const fullName = this._accountComponent.getAttribute("full-name");
      if (fullName) {
        this._accountOuterWrapper.prepend(
          this._createAccountToggle(fullName, this._accountComponent.getAttribute("avatar-url"))
        );
        this._accountOuterWrapper.classList.add("pfe-navigation__account-wrapper--logged-in");
        this._accountToggle.setAttribute("aria-controls", this._accountDropdownWrapper.id);
        this._addCloseDropdownAttributes(this._accountToggle, this._accountDropdownWrapper);

        this._accountToggle.addEventListener("click", this._accountToggleClick);

        // Recalculate secondary links breakpoint
        this._menuBreakpoints.secondaryLinks = null;
      }
    }
    for (let index = 0; index < mutationList.length; index++) {
      const mutationItem = mutationList[index];
      // Deal with account toggle changes
      if (mutationItem.type === "attributes") {
        if (mutationItem.attributeName === "login-link") {
          // Deal with login link changes
          this.shadowRoot
            .getElementById("pfe-navigation__log-in-link")
            .setAttribute("href", this._accountComponent.getAttribute("login-link"));
        }
        if (mutationItem.attributeName === "avatar-url") {
          this._accountToggle
            .querySelector("pfe-avatar")
            .setAttribute("src", this._accountComponent.getAttribute("avatar-url"));
        }
        if (mutationItem.attributeName === "full-name") {
          this._accountToggle
            .querySelector("pfe-avatar")
            .setAttribute("full-name", this._accountComponent.getAttribute("full-name"));
        }
      }
    }

    // Unset the secondaryLinks bound because it will update with an account toggle
    // Then recalculate the JS breakpoints
    this._menuBounds.secondaryLinksLeft = null;
    window.setTimeout(this._calculateMenuBreakpoints, 0);
  }

  /**
   * Gets the last focusable element in a mobile-slider so we can trap focus
   * @param {object} mobileSwipeParent DOM Element that is slotted and has the mobile-slider attribute
   * @return {object} DOM Reference to last focusable element
   */
  _getLastFocusableItemInMobileSlider(mobileSwipeParent) {
    const dropdown = mobileSwipeParent.querySelector(".pfe-navigation__dropdown");
    let focusableChildren = null;
    if (dropdown) {
      focusableChildren = dropdown.querySelectorAll(this._focusableElements);
    }
    if (focusableChildren.length) {
      const toggle = mobileSwipeParent.querySelector(".pfe-navigation__secondary-link");
      const firstFocusableElement = focusableChildren[0];
      const lastFocusableElement = focusableChildren[focusableChildren.length - 1];

      // Initialize arrays for first and last elements and events if they don't exist
      if (!this._mobileSliderFocusTrapElements[toggle.id]) {
        this._mobileSliderFocusTrapElements[toggle.id] = [];
      }
      if (!this._mobileSliderFocusTrapEvents[toggle.id]) {
        this._mobileSliderFocusTrapEvents[toggle.id] = [];
      }

      // If there was any change in the first or last element, redo everything
      if (
        !this._mobileSliderFocusTrapElements[toggle.id] ||
        this._mobileSliderFocusTrapElements[toggle.id]["last"] !== lastFocusableElement ||
        !this._mobileSliderFocusTrapElements[toggle.id] ||
        this._mobileSliderFocusTrapElements[toggle.id]["first"] !== firstFocusableElement
      ) {
        // Preventing issues in IE11 & Edge
        if (_isCrustyBrowser() && this._mobileSliderMutationObservers[toggle.id]) {
          this._mobileSliderMutationObservers[toggle.id].disconnect();
        }

        // Cleanup any previous last focusable elements
        const previousLastFocusableElement = this._mobileSliderFocusTrapElements[toggle.id]
          ? this._mobileSliderFocusTrapElements[toggle.id]["last"]
          : null;
        if (previousLastFocusableElement) {
          previousLastFocusableElement.removeEventListener(
            "keydown",
            this._mobileSliderFocusTrapEvents[toggle.id]["last"]
          );
        }

        // Setup new last focusable element
        this._mobileSliderFocusTrapElements[toggle.id]["last"] = lastFocusableElement;
        this._mobileSliderFocusTrapEvents[toggle.id]["last"] = (event) => {
          if (event.key === "Tab") {
            if (this.breakpoint === "mobile") {
              if (!event.shiftKey) {
                event.preventDefault();
                firstFocusableElement.focus();
              }
            }
          }
        };
        lastFocusableElement.addEventListener("keydown", this._mobileSliderFocusTrapEvents[toggle.id]["last"]);

        // Handle first focusable element
        // Cleanup any previous first focusable elements
        const previousFirstFocusableElement = this._mobileSliderFocusTrapElements[toggle.id]
          ? this._mobileSliderFocusTrapElements[toggle.id]["first"]
          : null;
        if (previousFirstFocusableElement) {
          previousFirstFocusableElement.removeEventListener(
            "keydown",
            this._mobileSliderFocusTrapEvents[toggle.id]["first"]
          );
        }

        // Setup new first focusable element
        this._mobileSliderFocusTrapElements[toggle.id]["first"] = firstFocusableElement;
        this._mobileSliderFocusTrapEvents[toggle.id]["first"] = (event) => {
          if (event.key === "Tab") {
            if (this.breakpoint === "mobile") {
              if (event.shiftKey) {
                event.preventDefault();
                lastFocusableElement.focus();
              }
            }
          }
        };
        firstFocusableElement.addEventListener("keydown", this._mobileSliderFocusTrapEvents[toggle.id]["first"]);

        // Reconnecting mutationObserver for IE11 & Edge
        if (_isCrustyBrowser() && this._mobileSliderMutationObservers[toggle.id]) {
          this._mobileSliderMutationObservers[toggle.id].observe(dropdown, { subtree: true, childList: true });
        }
      }
    } else {
      this.log("Couldn't find any focusable children in a mobile-slide element", mobileSwipeParent);
    }
  }
}

PFElement.create(PfeNavigation);

class PfeNavigationDropdown extends PFElement {

  private processDomObserverConfig: MutationObserverInit = {
    subtree: true,
    childList: true,
  };
  private _processDomMutationObserver: MutationObserver;

  static get tag() {
    return "pfe-navigation-dropdown";
  }

  get schemaUrl() {
    return "pfe-navigation-dropdown.json";
  }

  get templateUrl() {
    return "pfe-navigation-dropdown.html";
  }

  get styleUrl() {
    return "pfe-navigation-dropdown.scss";
  }

  static get events() {
    return {};
  }

  static get properties() {
    return {
      name: {
        title: "Button text/Dropdown name",
        type: String,
      },
      icon: {
        title: "What icon to use, must be available in pfe-icon",
        type: String,
      },
      dropdownWidth: {
        type: String,
        title: "Width of the dropdown, 'single' or 'full' for single column, or full screen width",
        default: "full",
        values: ["single", "full"],
      },
      alerts: {
        type: String,
        title: "Adds bubble next to icon with the value of the attribute",
      },
    };
  }

  static get slots() {
    return {};
  }

  // Declare the type of this component
  static get PfeType() {
    return PFElement.PfeTypes.Container;
  }

  constructor() {
    super(PfeNavigationDropdown, { type: PfeNavigationDropdown.PfeType });

    // Make sure 'this' is set to the component in our methods
    this._processDom = this._processDom.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    // Process DOM on connect
    this._processDom();
    // Observe in case there are updates
    this._processDomMutationObserver = new MutationObserver(this._processDom);
    this._processDomMutationObserver.observe(this, this.processDomObserverConfig);
  }

  /*
   * @note v1.x markup:
   * 1.x secondary links with special slots should appear in dropdown
   * Have to run this in a mutation observer in case we're in an Angular context
   * @see https://medium.com/patternfly-elements/more-resilientweb-components-in-angular-or-anywhere-else-with-mutationobserver-72a91cd7cf22
   */
  _processDom() {
    // Preventing issues in IE11 & Edge
    if (_isCrustyBrowser() && this._processDomMutationObserver) {
      this._processDomMutationObserver.disconnect();
    }

    // Iterate over children and create new slots based on old nav slots
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];
      const childSlot = child.getAttribute("slot");

      if (childSlot && !this.shadowRoot.querySelector(`[slot="${childSlot}"]`)) {
        const newSlot = document.createElement("slot");
        newSlot.setAttribute("name", childSlot);
        this.shadowRoot.getElementById("dropdown-container").appendChild(newSlot);
      }

      // Hide the trigger, since we don't use it in this version of nav
      const trigger = this.querySelector('[slot="trigger"]') as HTMLElement;
      if (trigger) {
        trigger.hidden = true;
      }

      // Unhide tray which is generally the default
      const tray = this.querySelector('[slot="tray"]') as HTMLElement;
      if (tray) {
        tray.hidden = false;
      }

      // Reconnecting mutationObserver for IE11 & Edge
      if (_isCrustyBrowser() && this._processDomMutationObserver) {
        this._processDomMutationObserver.observe(this, this.processDomObserverConfig);
      }
    }
  }
}

// PFElement.create(PfeNavigationDropdown);
