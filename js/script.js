// Function to fetch the contents of a URL and create a file object
async function fetchURLAsFile(url, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename);
  } catch (error) {
    console.error('Error fetching URL:', error);
    return null;
  }
}

$( document ).ready(function() {

  const urlParams = new URLSearchParams(window.location.search);

  if(urlParams.get('proToken')) {
    localStorage.setItem('enablePro', true);
    localStorage.setItem('proToken', urlParams.get('proToken'));
    window.history.replaceState({}, document.title, "/");
  }

  function confirmExit() {
      return "";
  }

  jQuery.fn.extend({
    modal: function(action) {
      return this.each(function() {
        if (this.tagName === "DIALOG") {
          if (action === "showModal") {
            this.showModal();
          } else if (action === "close") {
            this.close();
          } else if (action === "getBoundingClientRect") {
            this.getBoundingClientRect();
          }
        }
      });
    }
  });

  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersLightScheme = window.matchMedia("(prefers-color-scheme: light)").matches;
  const newLineMailToBody = "%0D%0A";
  const newLineMailToHtmlBody = "<br/>";
  const newLineRawText = "\n";
  var subjectMail = "";
  var bodyMailStart = "";
  var bodyMailEnd = "";
  var passwordLength = 20;
  var passwordChars = "";
  var listSubjectMail = "";
  var listBodyMailStart = "";
  var listBodyMailEnd = "";
  var listPasswordLength = 20;
  var listPasswordChars = "";
  var mailTo = "body";
  var newLine = "";
  var boldTagOpen = "";
  var boldTagClose = "";

  var colorTheme = "system";
  var labelButton = true;
  var numberOfServicesChecked = "";
  var listLoaded = false;
  var enablePro = false;
  var proToken = "";
  var proUrl = "";
  var proCheckToken = "";
  var autoloadFilePath = "";
  var autofillGroup = "";
  var currentVersion = "";

  // strings
  var serviceUrlStr = "";
  var emailStr = "";
  var loginStr = "";
  var thirdpartyStr = "";
  var passwordStr = "";
  var proFeaturesReloadStr = "";

  async function loadStrings() {
    serviceUrlStr = await document.l10n.formatValue('service-mailbody-url');
    emailStr = await document.l10n.formatValue('service-mailbody-email');
    loginStr = await document.l10n.formatValue('service-mailbody-login');
    thirdpartyStr = await document.l10n.formatValue('service-login-third-party');
    passwordStr = await document.l10n.formatValue('service-mailbody-password');
    noFileSelectedStr = await document.l10n.formatValue('json-no-file-selected');
    newListWarningStr = await document.l10n.formatValue('new-list-warning');
    proFeaturesReloadStr = await document.l10n.formatValue('pro-features-reload');
    proEncryptedFileWarning = await document.l10n.formatValue('pro-encrypted-file-warning');
  }

  loadStrings();

  refreshColorTheme();

  function loadProFeatures() {
    if (localStorage.getItem('enablePro') && (localStorage.getItem('enablePro') == "true")) {
      enablePro = true;
    }
    if (localStorage.getItem('proToken') && (localStorage.getItem('proToken') != "")) {
      proToken = localStorage.getItem('proToken');
    }
    if (enablePro == true && proToken != "") {
      var scriptPro = document.createElement('script');
      scriptPro.src = proUrl.replace("{token}", proToken);
      document.head.appendChild(scriptPro);

      // Once the script is loaded, you can execute code or functions from it.
      scriptPro.onload = function() {
          // Code to run after script is loaded
          console.log("Remote script loaded successfully.");
          // Call any functions or execute any code from the loaded script here.
          refreshLabelButton();
          refreshColorTheme();
      };
      scriptPro.onerror = function() {
        console.log("Failed to load remote script.");
        refreshLabelButton();
        refreshColorTheme();
      }
    } else {
      refreshLabelButton();
      refreshColorTheme();
    }
  }

  function updateConfig() {
    if (localStorage.getItem('overrideSettings') && (localStorage.getItem('overrideSettings') == "true")) {
      subjectMail = localStorage.getItem('overrideSettings-subjectmail');
      bodyMailStart = localStorage.getItem('overrideSettings-bodymailstart');
      bodyMailEnd = localStorage.getItem('overrideSettings-bodymailend');
      passwordLength = localStorage.getItem('overrideSettings-passwordlength');
      passwordChars = localStorage.getItem('overrideSettings-passwordchars');
    } else {
      subjectMail = listSubjectMail;
      bodyMailStart = listBodyMailStart;
      bodyMailEnd = listBodyMailEnd;
      passwordLength = listPasswordLength;
      passwordChars = listPasswordChars;
    }
  }

  function refreshColorTheme() {
    if (localStorage.getItem('colorTheme')) {
      colorTheme = localStorage.getItem('colorTheme');
      if (colorTheme == "system") {
        setTheme(checkPrefersScheme());
      } else {
        setTheme(colorTheme);
      }
    } else {
      setTheme(checkPrefersScheme());
    }
  }

  function setTheme(theme){
    if(theme == "dark") {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      $(".btn-theme-switch").addClass('btn-outline-light');
      $(".btn-theme-switch").removeClass('btn-outline-dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      $(".btn-theme-switch").addClass('btn-outline-dark');
      $(".btn-theme-switch").removeClass('btn-outline-light');
    }
  }

  function checkPrefersScheme(){
    if (prefersDarkScheme) {
      return "dark";
    } else if (prefersLightScheme) {
      return "light";
    } else {
      return "light";
    }
  }

  refreshLabelButton = function() {
    if (localStorage.getItem('labelButton')) {
      labelButton = localStorage.getItem('labelButton');
      if (labelButton == "true") {
        addLabelButton();
      } else {
        removeLabelButton();
      }
    } else {
      addLabelButton();
    }
  }

  function addLabelButton() {
    $(".buttonTop").each(async function(e) {
      const [findKey] = await document.l10n.formatMessages([
        { id: $(this).data("l10n-id") },
      ]);
      var titleKey = "";
      if(findKey) {
        titleKey = findKey.attributes.find(a => a.name == "title").value
      } else {
        titleKey = $(this).attr("title");
      }
      $(this).html($(this).html() + " " + titleKey);

      if($(this).attr("id") == "fillAll") {
        $("#numberOfServicesChecked").remove();
        $(this).html($(this).html() + ' <span id="numberOfServicesChecked" class="badge bg-secondary">'+numberOfServicesChecked+'</span>');
      }
    });
  }

  function removeLabelButton() {
    $(".buttonTop").each(async function(e) {
      const [findKey] = await document.l10n.formatMessages([
        { id: $(this).data("l10n-id") },
      ]);
      var titleKey = "";
      if(findKey) {
        titleKey = findKey.attributes.find(a => a.name == "title").value
      } else {
        titleKey = $(this).attr("title");
      }
      $(this).html($(this).html().split(titleKey.replace(/&/g, '&amp;'))[0]);
      if($(this).attr("id") == "fillAll") {
        $("#numberOfServicesChecked").remove();
        $(this).html($(this).html() + ' <span id="numberOfServicesChecked" class="badge bg-secondary">'+numberOfServicesChecked+'</span>');
      }
    });
  }

  $("#dismiss-whatsnew-alert").on("click", function(){
    localStorage.setItem("dismissPopupWhatsnew","true");
  })

  $(".dialogButton").on("click", function(e){
    $("#" + $(this).data("dialog-id")).modal("showModal");
    if($(this).data("dialog-id") == "settingsDialog") {
      if (localStorage.getItem('mailto')) {
        mailTo = localStorage.getItem('mailto'); // body or html-body
        if(mailTo == "html-body") {
          $('input[name=setting-mailto-type]').prop( "checked", true );
        } else {
          $("#setting-mailto").prop( "checked", false );
        }
      } else {
        mailTo = "body";
        $("#setting-mailto").prop( "checked", false );
      }
      if (localStorage.getItem('colorTheme')) {
        colorTheme = localStorage.getItem('colorTheme');
        $('input[name=setting-theme-scheme][value=' + colorTheme + ']').prop( "checked", true );
      } else {
        colorTheme = "system";
        $("#setting-theme-system").prop( "checked", true );
      }
      if (localStorage.getItem('labelButton') == "true") {
        $("#setting-display").prop( "checked", true );
      }
      if (localStorage.getItem('overrideSettings')) {
        overrideSettings = localStorage.getItem('overrideSettings');
        $('input[name=setting-override][value=' + overrideSettings + ']').prop( "checked", true );
      } else {
        overrideSettings = "false";
        $("#setting-override-disable").prop( "checked", true );
      }
      if (localStorage.getItem('enablePro') == "true") {
        $("#setting-pro-enable").prop( "checked", true );
      }
      if (localStorage.getItem('proToken')) {
        $("#setting-pro-token").val(localStorage.getItem('proToken'));
      }
      if($("input[name='setting-override']:checked").val() == "true") {
        $("#settings-override-details").show();
        $("#setting-override-subjectmail").val(localStorage.getItem('overrideSettings-subjectmail'));
        $("#setting-override-bodymailstart").val(localStorage.getItem('overrideSettings-bodymailstart'));
        $("#setting-override-bodymailend").val(localStorage.getItem('overrideSettings-bodymailend'));
        $("#setting-override-passwordlength").val(localStorage.getItem('overrideSettings-passwordlength'));
        $("#setting-override-passwordchars").val(localStorage.getItem('overrideSettings-passwordchars'));
      } else {
        $("#settings-override-details").hide();
      }
      if($("input[name='setting-pro-enable']:checked").val() == "true") {
        $("#settings-pro-details").show();
      } else {
        $("#settings-pro-details").hide();
      }
    };
  });

  $("dialog").on("click", function(e){
    var rect = $(e.target).modal("getBoundingClientRect");
    var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
      && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      $(e.target).modal("close");
    }
  });

  function cleanString(string, prefix) {
    string = string.replaceAll(" ", "_").replaceAll("é","e").replaceAll(".", "").toLowerCase();
    if(prefix) {
      string = prefix + string;
    }
    return string;
  }

  if(localStorage.getItem('config')) {
    //TODO: load the saved json file content
    //$("#valueConfig").val(localStorage.getItem('config'));
    //loadConfig(localStorage.getItem('config'));
  }

  $("#saveConfig").on("click", function() {
    localStorage.setItem('config', $("#valueConfig").val());
  });

  $("#jsonFile").change(function() {
    //valueConfig = localStorage.getItem('config');
    //$("#valueConfig").val(valueConfig);
    if($('#jsonFile')[0].files[0]) {
      if(listLoaded == true) {
        if(confirm(newListWarningStr)) {
          loadConfig(false);
        }
      } else {
        loadConfig(false);
      }
    } else {
      alert(noFileSelectedStr);
    }
  });

  $("#clearConfig").on("click", function() {
    localStorage.removeItem('config');
  });

  $("#saveSettings").on("click", function(){
    localStorage.setItem('mailto', $("input[name='setting-mailto-type']:checked").val() ? "html-body" : "body");
    localStorage.setItem('colorTheme', $("input[name='setting-theme-scheme']:checked").val());
    localStorage.setItem('labelButton', $("input[name='setting-labelbutton-type']:checked").val());
    localStorage.setItem('overrideSettings', $("input[name='setting-override']:checked").val());
      if($("input[name='setting-override']:checked").val() == "true") {
      localStorage.setItem('overrideSettings-subjectmail', $("#setting-override-subjectmail").val());
      localStorage.setItem('overrideSettings-bodymailstart', $("#setting-override-bodymailstart").val());
      localStorage.setItem('overrideSettings-bodymailend', $("#setting-override-bodymailend").val());
      localStorage.setItem('overrideSettings-passwordlength', $("#setting-override-passwordlength").val());
      localStorage.setItem('overrideSettings-passwordchars', $("#setting-override-passwordchars").val());
    }
    updateConfig();

    if(($("input[name='setting-pro-enable']").is(":checked") != JSON.parse(localStorage.getItem('enablePro'))) ||
      ($("#setting-pro-token").val() != localStorage.getItem('proToken'))) {
        localStorage.setItem('proToken', $("#setting-pro-token").val());
        localStorage.setItem('enablePro', $("input[name='setting-pro-enable']").is(":checked"));
      if(confirm(proFeaturesReloadStr)) {
        location.reload();
      }
    }
    $("#settingsDialog").modal("close");
  });

  $("input[name='setting-theme-scheme']").change(function() {
    localStorage.setItem('colorTheme', $("input[name='setting-theme-scheme']:checked").val());
    refreshColorTheme();
  });

  $("input[name='setting-labelbutton-type']").change(function() {
    localStorage.setItem('labelButton', $("input[name='setting-labelbutton-type']:checked").val());
    refreshLabelButton();
  });

  $("input[name='setting-override']").change(function() {
    if($("input[name='setting-override']:checked").val() == "true") {
      $("#settings-override-details").show();
      $("#setting-override-subjectmail").val(localStorage.getItem('overrideSettings-subjectmail'));
      $("#setting-override-bodymailstart").val(localStorage.getItem('overrideSettings-bodymailstart'));
      $("#setting-override-bodymailend").val(localStorage.getItem('overrideSettings-bodymailend'));
      $("#setting-override-passwordlength").val(localStorage.getItem('overrideSettings-passwordlength'));
      $("#setting-override-passwordchars").val(localStorage.getItem('overrideSettings-passwordchars'));
    } else {
      $("#settings-override-details").hide();
    }
  });

  $("input[name='setting-pro-enable']").change(function() {
    if($("input[name='setting-pro-enable']:checked").val() == "true") {
      $("#settings-pro-details").show();
    } else {
      $("#settings-pro-details").hide();
    }
  });

  $.getJSON("manifest.json", function( manifest ) {
    $("#version").text($("#version").text() + " " + manifest.version);
    $(".version").text(manifest.version);
    $(".relnotesUrl").attr("href",manifest.releaseNotes + "tag/v" + manifest.version);
    $("#projectUrl").attr("href",manifest.repository.url);
    $("#projectUrl").text(manifest.repository.url);
    $("#licenseUrl").attr("href",manifest.repository.url + '/blob/main/LICENSE');
    $(".docUrl").attr("href",manifest.documentation);
    $(".docUrl").text(manifest.documentation);
    currentVersion = manifest.version;
    if((localStorage.getItem('currentVersion') == null) || localStorage.getItem('currentVersion') < currentVersion) {
      localStorage.setItem('currentVersion', currentVersion);
      localStorage.setItem('dismissPopupWhatsnew', "false");
    } else {
    }
  }).done(function() {
    if(localStorage.getItem('dismissPopupWhatsnew') == "false") {
      $('#whatsnew-alert').show();
    }
  });

  function disableProFeatures() {
    enablePro = false;
    localStorage.setItem('enablePro', false);
    $(".proSettings").hide();
  }

  function loadConfig(autoloadFilePath) {
    if(!window.location.host.includes("localhost")) {
      window.onbeforeunload = confirmExit;
    }

    $(".welcome-screen").hide();
    $(".welcome-screen").removeClass('d-flex');
    $('#myAccordion').empty();
    $('#userGroup').empty();
    $('#userGroup').append($('<option>', {
      value: "",
      text: "---",
      selected:"selected"
    }));

    var fileInput = $('#jsonFile');
    var file = fileInput[0].files[0];
    var reader = new FileReader();

    var accordionHtml = '';

    reader.onload = function() {
      var data = JSON.parse(reader.result);

      if(data.encryptedList){
        if(typeof overrideDecryptList !== 'undefined') {
          data = overrideDecryptList(data);
        } else {
          alert(proEncryptedFileWarning);
          return(false);
        }
      }

      var servicesGroups = [];
      var userGroups = [];

      $.each(data.records, function(key, val) {
        servicesGroups.indexOf(val.fields["Service Group"]) === -1 && servicesGroups.push(val.fields["Service Group"]);
        $.each(val.fields["User Group"], function(key, val) {
          userGroups.indexOf(val) === -1 && userGroups.push(val);
        });
      });

      $.each(userGroups, function(key, val) {
        $('#userGroup').append($('<option>', {
          value: val,
          text: val
        }));
      });

      $.each(servicesGroups, function(key, val) {
        if(data.disableGroups && data.disableGroups.includes(val)) {
        } else {
          accordionHtml += '<div class="accordion-item" id="AcItem_' + cleanString(val) + '">';
          accordionHtml += '<h2 class="accordion-header"><input type="checkbox" class="larger cbg" id="cbg_'+ cleanString(val) +'" data-service-group="'+ cleanString(val) +'" />';
          accordionHtml += '<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAc_' + cleanString(val) + '">' + val + '</button>';
          accordionHtml += '</h2>';
          accordionHtml += '<div id="collapseAc_' + cleanString(val) + '" class="accordion-collapse collapse">';
          accordionHtml += '<div class="accordion-body"></div>';
          accordionHtml += '</div>';
          accordionHtml += '</div>';
        }
      });

      $('#myAccordion').append(accordionHtml);

      $.each(servicesGroups, function(key, val) {
        if(data.hideGroups && data.hideGroups.includes(val)) {
          $("#AcItem_" + cleanString(val)).find('.accordion-button').attr('aria-expanded', 'false');
          $("#AcItem_" + cleanString(val)).find('.accordion-button').addClass('collapsed');
          $("#AcItem_" + cleanString(val)).find('.accordion-collapse').addClass('collapse');
        } else {
          $("#AcItem_" + cleanString(val)).find('.accordion-button').attr('aria-expanded', 'true');
          $("#AcItem_" + cleanString(val)).find('.accordion-collapse').addClass('collapse show');
        }
      });

      $.each(data.records, function(key, val) {
        if((val.fields["Config"] && val.fields["Config"].includes("disabled")) ||
            (data.disableGroups && data.disableGroups.includes(val.fields["Service Group"]))) {
        } else {
          if(val.fields["Third Party"]) {
            var thirdparty = val.fields["Third Party"];
          } else {
            var thirdparty = "";
          }
          accordionItemHtml =  '';
          accordionItemHtml +=  '<div class="row align-items-center service-row" data-third-party="'+thirdparty+'" data-password-type="' + val.fields["Password Type"] + '" data-service-name="' + cleanString(val.fields["Name"], "service_") + '">';
          var userGroups = "";
          if(val.fields["User Group"]) {
            userGroups = val.fields["User Group"].join(',');
          }
          accordionItemHtml +=  '<div class="col-1 my-auto"><input type="checkbox" class="larger cbs" id="cbs_' + cleanString(val.fields["Name"], "service_") + '" data-service-group="' + cleanString(val.fields["Service Group"]) + '" data-user-groups="' + userGroups + '"/></div>';
          if(val.fields["Icon"] == null || val.fields["Icon"] == "") {
            val.fields["Icon"] = "/images/default_service_icon.svg";
          }
          accordionItemHtml +=  '<div class="col-2">';
          if(val.fields["URL Login"]) {
            accordionItemHtml +=  '<a href="' + val.fields["URL Login"] + '" target="_blank" class="url-login" data-l10n-id="service-action-login">';
          }
          accordionItemHtml += '<img src="' + val.fields["Icon"] + '" class="service_logo" alt="service logo"/> <span class="serviceNameClean">' + val.fields["Name"] + '</span>';
          if(val.fields["URL Login"]) {
            accordionItemHtml +=  '</a>';
          }
          accordionItemHtml += '</div>';
          if(val.fields["Password Type"] == "email-password") {
            accordionItemHtml +=  '<div class="col-4"><div class="input-group input-group-sm">';
            accordionItemHtml +=  '<input class="emailfield form-control';
            if(val.fields["Config"] && val.fields["Config"].includes("disableFillEmail")) {
              accordionItemHtml +=  ' disable-fill';
            }
            accordionItemHtml +=  '"data-l10n-id="service-email" type="email" ';
            if((val.fields["Config"] && val.fields["Config"].includes("disableFillEmail"))) {
              accordionItemHtml +=  'data-noautofill="true" ';
            }
            accordionItemHtml +=  '/> ';
            accordionItemHtml +=  '<input class="passwordfield form-control hide-password';
            if(val.fields["Config"] && val.fields["Config"].includes("disableFillPassword")) {
              accordionItemHtml +=  ' disable-fill';
            }
            accordionItemHtml +=  '" data-l10n-id="service-password" type="text" ';
            if((val.fields["Config"] && val.fields["Config"].includes("disableFillPassword"))) {
              accordionItemHtml +=  'data-noautofill="true" ';
            }
            accordionItemHtml +=  '/> ';
            accordionItemHtml +=  '<button data-l10n-id="service-reveal-password" class="btn btn-outline-light btn-theme-switch reveal_pass_service"><i class="bi-eye-fill"></i></button> ';
            accordionItemHtml +=  '<button data-l10n-id="service-generate-password" class="btn btn-outline-light btn-theme-switch gen_pass_service"><i class="bi-key-fill"></i></button> ';
            accordionItemHtml +=  '<button data-l10n-id="service-unlock-password" class="btn btn-outline-light btn-theme-switch unlock_pass"><i class="bi-unlock-fill"></i></button> ';
            if(val.fields["Password Notes"]) {
              accordionItemHtml +=  '<button class="btn btn-outline-light btn-theme-switch" title="' + val.fields["Password Notes"] + '"><i class="bi-info-circle-fill"></i></button>';
            }
            accordionItemHtml +=  '</div></div>';
          }
          if(val.fields["Password Type"] == "login-password") {
            accordionItemHtml +=  '<div class="col-4"><div class="input-group input-group-sm">';
            accordionItemHtml +=  '<input class="loginfield form-control" data-l10n-id="service-login" type="text"/> ';
            accordionItemHtml +=  '<input class="passwordfield form-control hide-password" data-l10n-id="service-password" type="text" ';
            if((val.fields["Config"] && val.fields["Config"].includes("disableFillPassword"))) {
              accordionItemHtml +=  'data-noautofill="true" ';
            }
            accordionItemHtml +=  '/> ';
            accordionItemHtml +=  '<button data-l10n-id="service-reveal-password" class="btn btn-outline-light btn-theme-switch reveal_pass_service"><i class="bi-eye-fill"></i></button> ';
            accordionItemHtml +=  '<button data-l10n-id="service-generate-password" class="btn btn-outline-light btn-theme-switch gen_pass_service"><i class="bi-key-fill"></i></button> ';
            accordionItemHtml +=  '<button data-l10n-id="service-unlock-password" class="btn btn-outline-light btn-theme-switch unlock_pass"><i class="bi-unlock-fill"></i></button> ';
            if(val.fields["Password Notes"]) {
              accordionItemHtml +=  '<button class="btn btn-outline-light btn-theme-switch" title="' + val.fields["Password Notes"] + '"><i class="bi-info-circle-fill"></i></button>';
            }
            accordionItemHtml +=  '</div></div>';
          }
          if(val.fields["Password Type"] == "third-party") {
            accordionItemHtml +=  '<div class="col-4"><i><span data-l10n-id="service-login-third-party"></span> '+val.fields["Third Party"]+'</i></div>';
          }
          if(val.fields["URL Create Account"]) {
            accordionItemHtml +=  '<div class="col-1"><div class="input-group input-group-sm"><a href="' + val.fields["URL Create Account"] + '" target="_blank" class="url-create-account btn btn-outline-light btn-theme-switch" data-l10n-id="service-action-create-account">';
            if(val.fields["autofill"]) {
              accordionItemHtml += '<i class="bi-person-plus-fill"></i></a>';
            } else {
              accordionItemHtml += '<i class="bi-person-fill"></i></a>';
            }
            accordionItemHtml += '</div></div>';
          } else {
            accordionItemHtml +=  '<div class="col-1"><div class="input-group input-group-sm"><a href="#" class="btn btn-outline-light btn-theme-switch" data-l10n-id="service-action-no-account-creation">';
            accordionItemHtml += '<i class="bi-x-octagon-fill"></i></a></div></div>';
          }
          if(val.fields["Status"]) {
            if(val.fields["Status"]["iframe"] == false){
              var openIframe = false;
            } else {
              var openIframe = true;
            }
            accordionItemHtml +=  '<div class="col-1"><div class="input-group input-group-sm"><a href="' + val.fields["Status"]["URL"] + '" target="_blank" class="url-service-status btn btn-outline-light btn-theme-switch" data-open-iframe="' + openIframe + '" data-dialog-id="serviceStatusDialog" data-l10n-id="service-action-service-status">';
            accordionItemHtml += '<i class="bi-reception-4"></i></a></div></div>';
          }
          accordionItemHtml +=  '</div>';
          $('#AcItem_' + cleanString(val.fields["Service Group"]) + ' .accordion-body').append(accordionItemHtml);
        }
      });

      $(".url-service-status").on("click", function(e){
        if($(this).data("open-iframe") != false) {
          e.preventDefault();
          $("#" + $(this).data("dialog-id")).modal("showModal");
          $("#" + $(this).data("dialog-id")).find("#serviceStatus").attr("src", $(this).attr("href"));
        }
      });

      // Check/Uncheck all service from a group
      $(".cbg").change(function() {
        var group = $(this).data("service-group");
        if(this.checked) {
          $(".cbs[data-service-group=" + group + "]").prop('checked', true);
        }
        if(!this.checked) {
          $(".cbs[data-service-group=" + group + "]").prop('checked', false);
        }
      });

      // Check services based on user group
      $("#userGroup").on("change", function(){
        var userGroup = $(this).find(":selected").val();
        $(".cbs").each(function() {
          if ($(this).data("user-groups").split(',').includes(userGroup) && userGroup != "") {
            $(this).prop('checked', true);
          } else {
            $(this).prop('checked', false);
          }
        });
      });

      $(".cbs, .cbg, #userGroup").on("change", function() {
        numberOfServicesChecked = $(".cbs:checked").length;
        if(numberOfServicesChecked > 0) {
          $("#numberOfServicesChecked").text(numberOfServicesChecked);
        } else {
          $("#numberOfServicesChecked").text("");
        }
      });

    listSubjectMail = data.subjectMail;
    listBodyMailStart = data.bodyMailStart;
    listBodyMailEnd = data.bodyMailEnd;
    listPasswordLength = data.passwordLength;
    listPasswordChars = data.passwordChars;
    updateConfig();
    refreshColorTheme();

    if(autofillGroup) {
      $("#userGroup").val(autofillGroup).change();
    }

    localStorage.setItem("currentList", JSON.stringify(data));

    };

    if(autoloadFilePath) {
    const url = autoloadFilePath;
    const filename = autoloadFilePath;

    fetchURLAsFile(url, filename)
      .then(file => {
        if (file) {
          console.log('File object created:', file);
          reader.readAsText(file);
          listLoaded = true;
        } else {
          console.log('Failed to create file object.');
        }
      });
    } else {
      reader.readAsText(file);
      listLoaded = true;
    }

  }

  function genPassword(length, chars) {
    var passwordLength = length;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber +1);
    }
    return password;
  }

  $("body").on("click", '.gen_pass_service', function() {
    var serviceName = $(this).parent().parent().parent().data("service-name");
    if (!$('[data-service-name="'+serviceName+'"] .passwordfield').prop("disabled")) {
      $('[data-service-name="'+serviceName+'"] .passwordfield').val(genPassword(passwordLength, passwordChars));
    }
  });

  $("body").on("click", '.reveal_pass_service', function() {
    var serviceName = $(this).parent().parent().parent().data("service-name");
    if ($('[data-service-name="'+serviceName+'"] .passwordfield').hasClass("hide-password")) {
      $('[data-service-name="'+serviceName+'"] .passwordfield').removeClass("hide-password");
      $(this).find('i').removeClass("bi-eye-fill");
      $(this).find('i').addClass("bi-eye-slash-fill");
    } else {
      $('[data-service-name="'+serviceName+'"] .passwordfield').addClass("hide-password");
      $(this).find('i').addClass("bi-eye-fill");
      $(this).find('i').removeClass("bi-eye-slash-fill");
    }
  });

  function lockPasswordField(serviceName) {
    $('[data-service-name="'+serviceName+'"] .passwordfield').prop("disabled", "disabled");
    $('[data-service-name="'+serviceName+'"] .passwordfield').css("cursor", "not-allowed");
    $('[data-service-name="'+serviceName+'"] .unlock_pass').css("display", "inline");
    $('[data-service-name="'+serviceName+'"] .gen_pass_service').css("display", "none");
  }

  $("body").on("click", '.url-create-account', function() {
    var serviceName = $(this).parent().parent().parent().data("service-name");
    lockPasswordField(serviceName);
  });

  $("body").on("click", '.unlock_pass', function() {
    var serviceName = $(this).parent().parent().parent().data("service-name");
    $('[data-service-name="'+serviceName+'"] .passwordfield').prop("disabled", false);
    $('[data-service-name="'+serviceName+'"] .passwordfield').css("cursor", "inherit");
    $('[data-service-name="'+serviceName+'"] .passwordfield').css("background-color", "");
    $('[data-service-name="'+serviceName+'"] .unlock_pass').css("display", "none");
    $('[data-service-name="'+serviceName+'"] .gen_pass_service').css("display", "inline");
  });

  function checkIfAtLeastOneServiceChecked() {
    if(!$(".service-row").find('input[type="checkbox"]').is(":checked")) {
      async function alertEmptyServices() {
        let msg = await document.l10n.formatValue('general-no-services-checked');
        alert(msg);
      }
      alertEmptyServices();
      return false;
    } else {
      return true;
    }
  }

  // Fill all
  $("#fillAll").on("click", function(){
    $(".service-row").each(function() {
      if($(this).find('input[type="checkbox"]').is(":checked")) {
        var serviceName = $(this).data("service-name");
        if ($('[data-service-name="'+serviceName+'"] input[type=email]').data("noautofill") != true) {
          $('[data-service-name="'+serviceName+'"] input[type=email]').val($("#userEmail").val());
        }
        if (!$('[data-service-name="'+serviceName+'"] .passwordfield').prop("disabled") &&
            $('[data-service-name="'+serviceName+'"] .passwordfield').data("noautofill") != true) {
          $('[data-service-name="'+serviceName+'"] .passwordfield').val(genPassword(passwordLength, passwordChars));
        }
      }
    })
    checkIfAtLeastOneServiceChecked();
  });

  $('#genMail').on('click', function (event) {
    event.preventDefault();

    async function alertEmptyMail() {
      let msg = await document.l10n.formatValue('general-empty-email');
      alert(msg);
      $("#userEmail").focus();
    }

    if($("#userEmail").val() == "") {
      alertEmptyMail();
    } else {
      if(checkIfAtLeastOneServiceChecked()) {

        if (localStorage.getItem('mailto')) {
          mailTo = localStorage.getItem('mailto') // body or html-body
        }

        window.onbeforeunload = "";
        var email = $("#userEmail").val();
        var subject = subjectMail.replaceAll("_firstname_", $("#userFirstName").val()).replaceAll("_lastname_", $("#userLastName").val());
        var emailBody = "";

        if(typeof overrideEmailBody !== 'undefined') {
          newLine = newLineRawText;
          boldTagOpen = "";
          boldTagClose = "";
          overrideEmailBody(genListOfCredentials()).then(function(data){
            defineMailToSettings();
            emailBody = genBodyMail(data);
            window.location = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&'+mailTo+'=' + emailBody;
          });
        } else {
          defineMailToSettings();
          emailBody = genBodyMail();
          window.location = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&'+mailTo+'=' + emailBody;
        }

        if(!window.location.host.includes("localhost")) {
          window.onbeforeunload = confirmExit;
        }

      }
    }

  });

  $("#setting-pro-token").on("keyup change",function() {
    var that = $(this);
    $.getJSON(proCheckToken.replace("{token}", $(this).val()), function( checktoken ) {
      if(checktoken.exists && checktoken.valid) {
        that.removeClass("is-invalid");
        that.addClass("is-valid");
      } else {
        that.removeClass("is-valid");
        that.addClass("is-invalid");
      }
    }).fail(function() {
      that.removeClass("is-valid");
      that.addClass("is-invalid");
    }).always(function() {

    });
  });

  function defineMailToSettings() {
    if(mailTo == "body") {
      newLine = newLineMailToBody;
      boldTagOpen = "";
      boldTagClose = "";
    } else if(mailTo == "html-body") {
      newLine = newLineMailToHtmlBody;
      boldTagOpen = "<b>";
      boldTagClose = "</b>";
    }
  }

  function genListOfCredentials() {
    credentialsList = "";
    $(".service-row").each(function() {
      if($(this).find('input[type="checkbox"]').is(":checked")) {
        var serviceName = $(this).data("service-name");
        var serviceNameClean = encodeURIComponent($('[data-service-name="'+serviceName+'"] .serviceNameClean').text());
        var serviceUrlLogin = encodeURIComponent($('[data-service-name="'+serviceName+'"] .url-login').prop("href"));
        var serviceEmailField = encodeURIComponent($('[data-service-name="'+serviceName+'"] .emailfield').val());
        var serviceLoginField = encodeURIComponent($('[data-service-name="'+serviceName+'"] .loginfield').val());
        var servicePasswordField = encodeURIComponent($('[data-service-name="'+serviceName+'"] .passwordfield').val());
        lockPasswordField(serviceName);
        credentialsList += boldTagOpen+serviceNameClean+boldTagClose;
        credentialsList += newLine;
        if(serviceUrlLogin != null) {
          if(mailTo == "html-body" && (newLine != newLineRawText)) {
            credentialsList += serviceUrlStr + " <a href='"+serviceUrlLogin+"'>"+serviceUrlLogin+"</a>";
          } else {
            credentialsList += serviceUrlStr + " "+ serviceUrlLogin;
          }
          credentialsList += newLine;
        }
        if($(this).data("password-type") == "third-party") {
          credentialsList += thirdpartyStr;
          credentialsList += (" "+$(this).data("third-party"));
          credentialsList += newLine;
        } else {
          if($(this).data("password-type") == "email-password") {
            credentialsList += emailStr + " " + serviceEmailField;
            credentialsList += newLine;
          }
          if($(this).data("password-type") == "login-password") {
            credentialsList += loginStr + " " + serviceLoginField;
            credentialsList += newLine;
          }
          credentialsList += passwordStr + " " + servicePasswordField;
          credentialsList += newLine;
        }
        credentialsList += newLine;
      }
    })
    return credentialsList;
  }

  function genBodyMail(content) {
    var emailBody = '';

    if (content == null) {
      content = genListOfCredentials();
    }

    if(bodyMailStart != "") {
      emailBody = encodeURIComponent(bodyMailStart.replaceAll("_firstname_", $("#userFirstName").val()).replaceAll("_lastname_", $("#userLastName").val()))+newLine+newLine+content;
    }

    if(bodyMailEnd != "") {
      emailBody += newLine+encodeURIComponent(bodyMailEnd.replaceAll("_firstname_", $("#userFirstName").val()).replaceAll("_lastname_", $("#userLastName").val()));
    }

    return emailBody;
  }

  $.getJSON("config.json", function( config ) {
    if(config.autoload && config.autoload !== "") {
      autoloadFilePath = config.autoload;
    }
    if(config.pro && config.pro.enable){
      if(config.pro.enable == false) {
        disableProFeatures();
      }
    } else {
      disableProFeatures();
    }
    if(config.pro && config.pro.url) {
      proUrl = config.pro.url;
    }
    if(config.pro && config.pro.check_token) {
      proCheckToken = config.pro.check_token;
    }
    if(config.pro && config.pro.htmlContent){
      var reverseLanguages = [];
      Object.assign(reverseLanguages,  navigator.languages);
      reverseLanguages.reverse();
      localeToUse = "en";
      reverseLanguages.forEach(v => {
        if (Object.keys(config.pro.htmlContent).includes(v)) {
          localeToUse = v;
        }
      });
      $("#settings-pro-marketing-content").html(config.pro.htmlContent[localeToUse])
    } else {
      $("#settings-pro-marketing").hide();
    }
    if(config.pro && config.pro.statusPage) {
      $("#proServiceStatusUrl").attr("href",config.pro.statusPage);
    } else {
      $("#proServiceStatusInfo").hide();
    }
    if(config.dev && config.dev.autofillFirstname) {
      $("#userFirstName").val(config.dev.autofillFirstname);
    }
    if(config.dev && config.dev.autofillLastname) {
      $("#userLastName").val(config.dev.autofillLastname);
    }
    if(config.dev && config.dev.autofillLastname) {
      $("#userEmail").val(config.dev.autofillEmail);
    }
    if(config.dev && config.dev.autofillGroup) {
      autofillGroup = config.dev.autofillGroup;
    }
    if(config.host && config.host.url) {
      $("#hostUrl").attr("href",config.host.url);
      if(!config.host.name){
        $("#hostUrl").text(config.host.url);
      }
    }
    if(config.host && config.host.name) {
      $("#hostUrl").text(config.host.name);
      if(!config.host.url){
        $("#hostUrl").removeAttr("href");
      }
    }
    if(!config.host) {
      $("#hostInfo").hide();
    }
    if(config.env == "dev") {
      $('#favicon').attr('href','images/favicon_dev.svg');
      $('.info').append('<span class="ms-2 badge bg-light text-dark">Dev</span>');
    }
  }).fail(function() {
    disableProFeatures();
    $("#hostInfo").hide();
    //TODO: inform in someway that config.json is missing but not requiried.
  }).always(function() {
    loadProFeatures();
    if(autoloadFilePath){
      loadConfig(autoloadFilePath);
    }
  });

  // Firstrun Logic
  var firstrun = localStorage.getItem('firstrun')
  if (firstrun != 'false') {
    localStorage.setItem('labelButton', 'true')
    localStorage.setItem('firstrun', 'false');
  }

});
