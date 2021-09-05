import { html } from "@patternfly/pfelement";

export const template = html`
<nav id="pfe-navigation__wrapper" class="pfe-navigation__wrapper" aria-label="Main">
  <!-- @todo: make sure all icons are the updated redesigned versions -->
  <button class="pfe-navigation__menu-toggle" id="mobile__button">
    <div class="pfe-navigation__burger-icon"></div>
    <span id="mobile__button-text">Menu</span>
  </button>

  <div class="pfe-navigation__outer-menu-wrapper" id="mobile__dropdown">
    <div id="pfe-navigation__outer-menu-wrapper__inner" class="pfe-navigation__outer-menu-wrapper__inner">

      <!-- Placeholder to move search form at mobile breakpoint to maintain tab order -->
      <div id="pfe-navigation__search-wrapper--xs"></div>

      <div id="pfe-navigation__menu-wrapper" class="pfe-navigation__menu-wrapper">
      </div>

      <div class="pfe-navigation__secondary-links-wrapper" id="pfe-navigation__secondary-links-wrapper">
        <div>
          <button class="pfe-navigation__search-toggle" id="secondary-links__button--search" hidden data-analytics-text="Search" data-analytics-category="Search" data-analytics-level="1">
            <pfe-icon icon="web-search" pfe-size="sm" aria-hidden="true"></pfe-icon>
            <span id="secondary-links__button--search-text">Search</span>
          </button>
          <div class="pfe-navigation__dropdown-wrapper pfe-navigation__dropdown-wrapper--search" id="pfe-navigation__search-wrapper--md">
            <slot name="search" class="pfe-navigation__search" id="search-slot">
            </slot>
          </div>
        </div>

        <slot name="secondary-links" id="secondary-links"></slot>

      </div>
    </div>
  </div>

  <div class="pfe-navigation__account-wrapper" id="pfe-navigation__account-wrapper">
    <div id="pfe-navigation__account-dropdown-wrapper" class="pfe-navigation__dropdown-wrapper pfe-navigation__dropdown-wrapper--account pfe-navigation__dropdown-wrapper--invisible">
      <slot name="account" id="pfe-navigation__account-slot"></slot>
    </div>
  </div>

</nav>
<div class="pfe-navigation__overlay" hidden></div>
`;
