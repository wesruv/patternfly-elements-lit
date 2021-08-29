/**
 * Figures out if string starts with certain characters
 * @note Removing need for startsWithPolyfill, which may be causing issues with Solutions Engine
 * @param {string} haystack String to search in
 * @param {string} needle What we're checking for
 * @return {boolean}
 */
function stringStartsWith(haystack, needle) {
  return haystack.substring(0, needle.length) === needle;
}

/**
 * Debounce helper function
 * @see https://davidwalsh.name/javascript-debounce-function
 *
 * @param {function} func Function to be debounced
 * @param {number} delay How long until it will be run
 * @param {boolean} immediate Whether it should be run at the start instead of the end of the debounce
 */
function debounce(func, delay, immediate = false) {
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

const _isCrustyBrowser = () => window.ShadyCSS && !window.ShadyCSS.nativeShadow;
