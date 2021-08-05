/**
 * Expand or close the sidebar in mobile screens.
 * v2.0
 * https://github.com/Pandaho3/Pandaho3.github.io
 * © 2018-2019 Cotes Chung
 * MIT License
 */

$(function() {

  var sidebarUtil = (function() {
    const ATTR_DISPLAY = "sidebar-display";
    var isExpanded = false;
    var body = $("body");

    return {
      toggle() {
        if (isExpanded === false) {
          body.attr(ATTR_DISPLAY, "");
        } else {
          body.removeAttr(ATTR_DISPLAY);
        }

        isExpanded = !isExpanded;
      }
    };

  }());

  $("#sidebar-trigger").click(sidebarUtil.toggle);

  $("#mask").click(sidebarUtil.toggle);

});
