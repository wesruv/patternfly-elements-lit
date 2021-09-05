/**
 * Figures out if string starts with certain characters
 * @note Removing need for startsWithPolyfill, which may be causing issues with Solutions Engine
 * @param {string} haystack String to search in
 * @param {string} needle What we're checking for
 * @return {boolean}
 */
export const stringStartsWith = (haystack: string, needle: string) => {
  const doesIt: boolean = haystack.substring(0, needle.length) === needle;
  return doesIt;
}

/**
 * Debounce helper function
 * @see https://davidwalsh.name/javascript-debounce-function
 *
 * @param {function} func Function to be debounced
 * @param {number} delay How long until it will be run
 * @param {boolean} immediate Whether it should be run at the start instead of the end of the debounce
 */
export const debounce = (func: Function, delay: number, immediate: boolean = false) => {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Detect browsers that can't support shadowDOM natively
 * @returns {boolean} True if browser can support shadow DOM
 */
export const _isCrustyBrowser = () => {
  // @ts-ignore
  const isIt: boolean = window.ShadyCSS && !window.ShadyCSS.nativeShadow;
  return isIt;
};
