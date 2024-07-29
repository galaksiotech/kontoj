// This script is an example to support Pro Features using remote JS
console.log("Pro remote script loaded");

// Adding a Pro Button
var proButton = '<button id="proButton" class="btn btn-outline-light buttonTop dialogButton"'
proButton += 'data-dialog-id="proDialog" data-l10n-id="general-pro" title="Pro"><i class="bi-patch-check-fill"></i></button>';
$(proButton).insertAfter("#companionButton");

var proDialog = '<dialog id="proDialog"><div class="row"><span><b>Pro Loaded !</b></span></div></dialog>';
$(proDialog).insertAfter("#companionDialog");

$(".dialogButton").on("click", function(e){
  $("#" + $(this).data("dialog-id")).modal("showModal");
});

$("dialog").on("click", function(e){
  var rect = $(e.target).modal("getBoundingClientRect");
  var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
    && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
  if (!isInDialog) {
    $(e.target).modal("close");
  }
});