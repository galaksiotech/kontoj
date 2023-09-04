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


const newLineMailToBody = "%0D%0A";
const newLineMailToHtmlBody = "<br/>";
var subjectMail = "";
var bodyMailStart = "";
var bodyMailEnd = "";
var passwordLength = 20;
var passwordChars = "";
var mailTo = "body";
var newLine = "";
var boldTagOpen = "";
var boldTagClose = "";

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
}

loadStrings();

$(".dialogButton").on("click", function(e){
  $("#" + $(this).data("dialog-id")).modal("showModal");
  if($(this).data("dialog-id") == "settingsDialog") {
    if (localStorage.getItem('mailto')) {
      mailTo = localStorage.getItem('mailto') // body or html-body
      $('input[name=setting-mailto-type][value=' + mailTo + ']').prop( "checked", true );
    } else {
      mailTo = "body";
      $("#setting-body").prop( "checked", true );
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

$("#loadConfig").on("click", function() {
  //valueConfig = localStorage.getItem('config');
  //$("#valueConfig").val(valueConfig);
  if($('#jsonFile')[0].files[0]) {
    loadConfig();
  } else {
    alert(noFileSelectedStr);
  }
});

$("#clearConfig").on("click", function() {
  localStorage.removeItem('config');
});

$("#saveSettings").on("click", function(){
 localStorage.setItem('mailto', $("input[name='setting-mailto-type']:checked").val());
 $("#settingsDialog").modal("close");
});

$.getJSON("manifest.json", function( manifest ) {
  $("#version").text($("#version").text() + " " + manifest.version);
  if(manifest.build != "") {
    $("#version").text($("#version").text() + " - build " + manifest.build);
  }
  $("#projectUrl").attr("href",manifest.repository.url);
  $("#projectUrl").text(manifest.repository.url);
  $("#licenceUrl").attr("href",manifest.repository.url + '/blob/main/LICENSE');
  $(".docUrl").attr("href",manifest.documentation);
  $(".docUrl").text(manifest.documentation);
});

function loadConfig() {
  window.onbeforeunload = confirmExit;

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
      accordionHtml += '<div class="accordion-item" id="AcItem_' + cleanString(val) + '">';
      accordionHtml += '<h2 class="accordion-header"><input type="checkbox" class="larger cbg" id="cbg_'+ cleanString(val) +'" data-service-group="'+ cleanString(val) +'" />';
      accordionHtml += '<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAc_' + cleanString(val) + '">' + val + '</button>';
      accordionHtml += '</h2>';
      accordionHtml += '<div id="collapseAc_' + cleanString(val) + '" class="accordion-collapse collapse">';
      accordionHtml += '<div class="accordion-body"></div>';
      accordionHtml += '</div>';
      accordionHtml += '</div>';
    });

    $('#myAccordion').append(accordionHtml);

    $.each(data.records, function(key, val) {
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
      accordionItemHtml +=  '<div class="col-2"><img src="' + val.fields["Icon"] + '" class="service_logo" alt="service logo"/> <span class="serviceNameClean">' + val.fields["Name"] + '</span></div>';

      if(val.fields["Password Type"] == "email-password" || val.fields["Password Type"] == "third-party") {
        accordionItemHtml +=  '<div class="col-5">';
        accordionItemHtml +=  '<input class="emailfield" data-l10n-id="service-email" type="email"/> ';
        accordionItemHtml +=  '<input class="passwordfield" data-l10n-id="service-password" type="text"/> ';
        accordionItemHtml +=  '<a data-l10n-id="service-generate-password" class="icon-button gen_pass_service">🔑</a> ';
        accordionItemHtml +=  '<a data-l10n-id="service-unlock-password" class="icon-button unlock_pass">🔓</a> ';
        if(val.fields["Password Notes"]) {
          accordionItemHtml +=  '<span class="password-notes" title="' + val.fields["Password Notes"] + '">❓</span>';
        }
        accordionItemHtml +=  '</div>';
      }
      if(val.fields["Password Type"] == "login-password") {
        accordionItemHtml +=  '<div class="col-5">';
        accordionItemHtml +=  '<input class="loginfield" data-l10n-id="service-login" type="text"/> ';
        accordionItemHtml +=  '<input class="passwordfield" data-l10n-id="service-password" type="text"/> ';
        accordionItemHtml +=  '<a data-l10n-id="service-generate-password" class="icon-button gen_pass_service">🔑</a> ';
        accordionItemHtml +=  '<a data-l10n-id="service-unlock-password" class="icon-button unlock_pass">🔓</a> ';
        if(val.fields["Password Notes"]) {
          accordionItemHtml +=  '<span class="password-notes" title="' + val.fields["Password Notes"] + '">❓</span>';
        }
        accordionItemHtml +=  '</div>';
      }
      if(val.fields["Password Type"] == "google-account") {
        accordionItemHtml +=  '<div class="col-5"><i><span data-l10n-id="service-login-google-account"></span></i></div>';
      }
      if(val.fields["URL Login"]) {
        accordionItemHtml +=  '<div class="col-1"><a href="' + val.fields["URL Login"] + '" target="_blank" class="url-login icon-button" data-l10n-id="service-action-login">🚪</a></div>';
      }
      if(val.fields["URL Create Account"]) {
        accordionItemHtml +=  '<div class="col-1"><a href="' + val.fields["URL Create Account"] + '" target="_blank" class="url-create-account icon-button" data-l10n-id="service-action-create-account">👤';
        if(val.fields["autofill"]) {
          accordionItemHtml += '➕</a></div>';
        } else {
          accordionItemHtml += '</a></div>';
        }
      }
      accordionItemHtml +=  '</div>';
      $('#AcItem_' + cleanString(val.fields["Service Group"]) + ' .accordion-body').append(accordionItemHtml);
    });

    $('.accordion-item').each(function() {
      $(this).find('.accordion-button').attr('aria-expanded', 'true');
      $(this).find('.accordion-collapse').addClass('collapse show');
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

  subjectMail = data.subjectMail;
  bodyMailStart = data.bodyMailStart;
  bodyMailEnd = data.bodyMailEnd;
  passwordLength = data.passwordLength;
  passwordChars = data.passwordChars;

  };
  reader.readAsText(file);
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

$("body").on("click", '.url-create-account', function() {
  var serviceName = $(this).parent().parent().data("service-name");
  $('[data-service-name="'+serviceName+'"] .passwordfield').prop("disabled", "disabled");
  $('[data-service-name="'+serviceName+'"] .passwordfield').css("background-color", "#1c2440");
  $('[data-service-name="'+serviceName+'"] .unlock_pass').css("display", "inline");
  $('[data-service-name="'+serviceName+'"] .gen_pass_service').css("display", "none");
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

// Generate and fill password on services checked
$("#genPassAll").on("click", function(){
  $(".service-row").each(function() {
    if($(this).find('input[type="checkbox"]').is(":checked")) {
      var serviceName = $(this).data("service-name");
      if (!$('[data-service-name="'+serviceName+'"] .passwordfield').prop("disabled")) {
        $('[data-service-name="'+serviceName+'"] .passwordfield').val(genPassword(passwordLength, passwordChars));
      }
    }
  })
  checkIfAtLeastOneServiceChecked();
});

// Fill email address on services checked
$("#fillEmail").on("click", function(){
  $(".service-row").each(function() {
    if($(this).find('input[type="checkbox"]').is(":checked")) {
      var serviceName = $(this).data("service-name")
      $('[data-service-name="'+serviceName+'"] input[type=email').val($("#userEmail").val());
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
      window.onbeforeunload = confirmExit;
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
        emailBody += bodyMailEnd;
      }
    }
  })
  console.log(emailBody);
  return emailBody;
}

});
