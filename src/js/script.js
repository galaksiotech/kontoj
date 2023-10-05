$( document ).ready(function() {

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

// strings
var serviceUrlStr = "";
var emailStr = "";
var loginStr = "";
var googleStr = "";
var passwordStr = "";

async function loadStrings() {
  serviceUrlStr = await document.l10n.formatValue('service-mailbody-url');
  emailStr = await document.l10n.formatValue('service-mailbody-email');
  loginStr = await document.l10n.formatValue('service-mailbody-login');
  googleStr = await document.l10n.formatValue('service-login-google-account');
  passwordStr = await document.l10n.formatValue('service-mailbody-password');
  noFileSelectedStr = await document.l10n.formatValue('json-no-file-selected');
  newListWarningStr = await document.l10n.formatValue('new-list-warning');
}

loadStrings();

refreshColorTheme();
refreshLabelButton();

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
    $("#saveSettings").addClass('btn-outline-light');
    $("#saveSettings").removeClass('btn-outline-dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    $("#saveSettings").addClass('btn-outline-dark');
    $("#saveSettings").removeClass('btn-outline-light');
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

function refreshLabelButton() {
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
  const titleKey = findKey.attributes.find(a => a.name == "title").value
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
    const titleKey = findKey.attributes.find(a => a.name == "title").value
    $(this).html($(this).html().split(titleKey.replace(/&/g, '&amp;'))[0]);
    if($(this).attr("id") == "fillAll") {
      $("#numberOfServicesChecked").remove();
      $(this).html($(this).html() + ' <span id="numberOfServicesChecked" class="badge bg-secondary">'+numberOfServicesChecked+'</span>');
    }
  });
 }

$(".dialogButton").on("click", function(e){
  $("#" + $(this).data("dialog-id")).modal("showModal");
  if($(this).data("dialog-id") == "settingsDialog") {
    if (localStorage.getItem('mailto')) {
      mailTo = localStorage.getItem('mailto'); // body or html-body
      $('input[name=setting-mailto-type][value=' + mailTo + ']').prop( "checked", true );
    } else {
      mailTo = "body";
      $("#setting-body").prop( "checked", true );
    }
    if (localStorage.getItem('colorTheme')) {
      colorTheme = localStorage.getItem('colorTheme');
      $('input[name=setting-theme-scheme][value=' + colorTheme + ']').prop( "checked", true );
    } else {
      colorTheme = "system";
      $("#setting-theme-system").prop( "checked", true );
    }
    if (localStorage.getItem('labelButton')) {
      labelButton = localStorage.getItem('labelButton');
      $('input[name=setting-labelbutton-type][value=' + labelButton + ']').prop( "checked", true );
    } else {
      labelButton = "true";
      $("#setting-display").prop( "checked", true );
    }
    if (localStorage.getItem('overrideSettings')) {
      overrideSettings = localStorage.getItem('overrideSettings');
      $('input[name=setting-override][value=' + overrideSettings + ']').prop( "checked", true );
    } else {
      overrideSettings = "false";
      $("#setting-override-disable").prop( "checked", true );
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
        loadConfig();
      }
    } else {
      loadConfig();
    }
  } else {
    alert(noFileSelectedStr);
  }
});

$("#clearConfig").on("click", function() {
  localStorage.removeItem('config');
});

$("#saveSettings").on("click", function(){
  localStorage.setItem('mailto', $("input[name='setting-mailto-type']:checked").val());
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

$.getJSON("manifest.json", function( manifest ) {
  $("#version").text($("#version").text() + " " + manifest.version);
  $("#relnotesUrl").attr("href",manifest.releaseNotes + "tag/v" + manifest.version);
  $("#hostUrl").attr("href",manifest.host.url);
  $("#hostUrl").text(manifest.host.name);
  $("#projectUrl").attr("href",manifest.repository.url);
  $("#projectUrl").text(manifest.repository.url);
  $("#licenseUrl").attr("href",manifest.repository.url + '/blob/main/LICENSE');
  $(".docUrl").attr("href",manifest.documentation);
  $(".docUrl").text(manifest.documentation);
});

function loadConfig() {
  if(!window.location.host.includes("localhost")) {
    window.onbeforeunload = confirmExit;
  }

  $(".welcome-screen").empty();
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

    var servicesGroups = [];
    var userGroups = [];

    $.each(data.records, function(key, val) {
      servicesGroups.indexOf(val.fields["Service Group"]) === -1 ? servicesGroups.push(val.fields["Service Group"]) : console.log("This item already exists");
      $.each(val.fields["User Group"], function(key, val) {
        userGroups.indexOf(val) === -1 ? userGroups.push(val) : console.log("This item already exists");
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
        accordionItemHtml =  '';
        accordionItemHtml +=  '<div class="row align-items-center service-row" data-password-type="' + val.fields["Password Type"] + '" data-service-name="' + cleanString(val.fields["Name"], "service_") + '">';
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
        if(val.fields["Password Type"] == "email-password" || val.fields["Password Type"] == "third-party") {
          accordionItemHtml +=  '<div class="col-5">';
          accordionItemHtml +=  '<input class="emailfield';
          if(val.fields["Config"] && val.fields["Config"].includes("disableFillEmail")) {
            accordionItemHtml +=  ' disable-fill';
          }
          accordionItemHtml +=  '"data-l10n-id="service-email" type="email" ';
          if((val.fields["Config"] && val.fields["Config"].includes("disableFillEmail"))) {
            accordionItemHtml +=  'data-noautofill="true" ';
          }
          accordionItemHtml +=  '/> ';
          accordionItemHtml +=  '<input class="passwordfield';
          if(val.fields["Config"] && val.fields["Config"].includes("disableFillPassword")) {
            accordionItemHtml +=  ' disable-fill';
          }
          accordionItemHtml +=  '" data-l10n-id="service-password" type="text" ';
          if((val.fields["Config"] && val.fields["Config"].includes("disableFillPassword"))) {
            accordionItemHtml +=  'data-noautofill="true" ';
          }
          accordionItemHtml +=  '/> ';
          accordionItemHtml +=  '<a data-l10n-id="service-generate-password" class="icon-button gen_pass_service"><i class="bi-key-fill"></i></a> ';
          accordionItemHtml +=  '<a data-l10n-id="service-unlock-password" class="icon-button unlock_pass"><i class="bi-unlock-fill"></i></a> ';
          if(val.fields["Password Notes"]) {
            accordionItemHtml +=  '<span class="password-notes" title="' + val.fields["Password Notes"] + '"><i class="bi-info-circle-fill"></i></span>';
          }
          accordionItemHtml +=  '</div>';
        }
        if(val.fields["Password Type"] == "login-password") {
          accordionItemHtml +=  '<div class="col-5">';
          accordionItemHtml +=  '<input class="loginfield" data-l10n-id="service-login" type="text"/> ';
          accordionItemHtml +=  '<input class="passwordfield" data-l10n-id="service-password" type="text" ';
          if((val.fields["Config"] && val.fields["Config"].includes("disableFillPassword"))) {
            accordionItemHtml +=  'data-noautofill="true" ';
          }
          accordionItemHtml +=  '/> ';
          accordionItemHtml +=  '<a data-l10n-id="service-generate-password" class="icon-button gen_pass_service"><i class="bi-key-fill"></i></a> ';
          accordionItemHtml +=  '<a data-l10n-id="service-unlock-password" class="icon-button unlock_pass"><i class="bi-unlock-fill"></i></a> ';
          if(val.fields["Password Notes"]) {
            accordionItemHtml +=  '<span class="password-notes" title="' + val.fields["Password Notes"] + '"><i class="bi-info-circle-fill"></i></span>';
          }
          accordionItemHtml +=  '</div>';
        }
        if(val.fields["Password Type"] == "google-account") {
          accordionItemHtml +=  '<div class="col-5"><i><span data-l10n-id="service-login-google-account"></span></i></div>';
        }
        if(val.fields["URL Create Account"]) {
          accordionItemHtml +=  '<div class="col-1"><a href="' + val.fields["URL Create Account"] + '" target="_blank" class="url-create-account icon-button" data-l10n-id="service-action-create-account">';
          if(val.fields["autofill"]) {
            accordionItemHtml += '<i class="bi-person-plus-fill"></i></a></div>';
          } else {
            accordionItemHtml += '<i class="bi-person-fill"></a></div>';
          }
        }
        accordionItemHtml +=  '</div>';
        $('#AcItem_' + cleanString(val.fields["Service Group"]) + ' .accordion-body').append(accordionItemHtml);
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

  };
  reader.readAsText(file);
  listLoaded = true;
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
  var serviceName = $(this).parent().parent().data("service-name");
  if (!$('[data-service-name="'+serviceName+'"] .passwordfield').prop("disabled")) {
    $('[data-service-name="'+serviceName+'"] .passwordfield').val(genPassword(passwordLength, passwordChars));
  }
});

function lockPasswordField(serviceName) {
  $('[data-service-name="'+serviceName+'"] .passwordfield').prop("disabled", "disabled");
  $('[data-service-name="'+serviceName+'"] .passwordfield').css("background-color", "#1c2440");
  $('[data-service-name="'+serviceName+'"] .unlock_pass').css("display", "inline");
  $('[data-service-name="'+serviceName+'"] .gen_pass_service').css("display", "none");
}

$("body").on("click", '.url-create-account', function() {
  var serviceName = $(this).parent().parent().data("service-name");
  lockPasswordField(serviceName);
});

$("body").on("click", '.unlock_pass', function() {
  var serviceName = $(this).parent().parent().data("service-name");
  $('[data-service-name="'+serviceName+'"] .passwordfield').prop("disabled", false);
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

      if(mailTo == "body") {
        newLine = newLineMailToBody;
        boldTagOpen = "";
        boldTagClose = "";
      } else if(mailTo == "html-body") {
        newLine = newLineMailToHtmlBody;
        boldTagOpen = "<b>";
        boldTagClose = "</b>";
      }

      window.onbeforeunload = "";
      var email = $("#userEmail").val();
      var subject = subjectMail.replaceAll("_firstname_", $("#userFirstName").val()).replaceAll("_lastname_", $("#userLastName").val());
      var emailBody = genBodyMail();
      window.location = 'mailto:' + email + '?subject=' + subject + '&'+mailTo+'=' + emailBody;

      if(!window.location.host.includes("localhost")) {
        window.onbeforeunload = confirmExit;
      }
    }
  }
});

function genBodyMail() {
  var emailBody = '';
  if(bodyMailStart != "") {
    emailBody += bodyMailStart.replaceAll("_firstname_", $("#userFirstName").val()).replaceAll("_lastname_", $("#userLastName").val());
    emailBody += newLine+newLine;
  }
  $(".service-row").each(function() {
    if($(this).find('input[type="checkbox"]').is(":checked")) {
      var serviceName = $(this).data("service-name");
      lockPasswordField(serviceName);
      emailBody += boldTagOpen+$('[data-service-name="'+serviceName+'"] .serviceNameClean').text()+boldTagClose;
      emailBody += newLine;
      if($('[data-service-name="'+serviceName+'"] .url-login').prop("href") != null) {
        if(mailTo == "html-body") {
          emailBody += serviceUrlStr + " <a href='"+$('[data-service-name="'+serviceName+'"] .url-login').prop("href")+"'>"+$('[data-service-name="'+serviceName+'"] .url-login').prop("href")+"</a>";
        } else {
          emailBody += serviceUrlStr + " "+$('[data-service-name="'+serviceName+'"] .url-login').prop("href");
        }
        emailBody += newLine;
      }
      if($(this).data("password-type") == "google-account") {
        emailBody += googleStr;
        emailBody += newLine;
      } else {
        if($(this).data("password-type") == "email-password") {
          emailBody += emailStr + " " + $('[data-service-name="'+serviceName+'"] .emailfield').val();
          emailBody += newLine;
        }
        if($(this).data("password-type") == "login-password") {
          emailBody += loginStr + " " + $('[data-service-name="'+serviceName+'"] .loginfield').val();
          emailBody += newLine;
        }
        emailBody += passwordStr + " " + $('[data-service-name="'+serviceName+'"] .passwordfield').val();
        emailBody += newLine;
      }
      emailBody += newLine;
      if(bodyMailEnd != "") {
        emailBody += bodyMailEnd.replaceAll("_firstname_", $("#userFirstName").val()).replaceAll("_lastname_", $("#userLastName").val());
      }
    }
  })
  return emailBody;
}

});
