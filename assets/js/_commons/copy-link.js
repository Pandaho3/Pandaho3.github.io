/*
 * Copy current page url to clipboard.
 * v2.1
 * https://github.com/Pandaho3/Pandaho3.github.io
 * © 2020 Cotes Chung
 * MIT License
 */

function copyLink(url) {
  if (!url || 0 === url.length) {
    return;
  }

  url = window.location.href;
  var $temp = $("<input>");

  $("body").append($temp);
  $temp.val(url).select();
  document.execCommand("copy");
  $temp.remove();

  alert("Link copied successfully!");

}