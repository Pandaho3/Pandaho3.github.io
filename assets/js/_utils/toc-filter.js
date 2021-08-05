/*
 * Hide the empty ToC in posts.
 * v2.0
 * https://github.com/Pandaho3/Pandaho3.github.io
 * © 2019 Cotes Chung
 * MIT Licensed
 */

$(function() {
  if ($("#post-wrapper .post-content h1").length === 0
      && $("#post-wrapper .post-content h2").length === 0) {
    $("#toc-wrapper").addClass("unloaded");
  }
});