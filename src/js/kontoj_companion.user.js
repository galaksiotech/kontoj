// ==UserScript==
// @name           Kontoj Companion
// @name:fr        Companion Kontoj
// @namespace      kontoj@galaksio.tech
// @version        2.0.20240716
// @description    Autofill informations on services based on CSS selectors
// @description:fr Rempli automatiquement les informations sur les services en se basant sur les sélecteurs CSS
// @author         Antoine Turmel <antoineturmel@gmail.com>
// @copyright      MIT Licence
// @downloadURL    https://kontoj.galaksio.tech/js/kontoj_companion.user.js
// @updateURL      https://kontoj.galaksio.tech/js/kontoj_companion.user.js
// @supportURL     https://github.com/galaksiotech/kontoj/issues
// @homepageURL    https://github.com/galaksiotech/kontoj
// @match          *://*/*
// @icon           https://kontoj.galaksio.tech/images/favicon.svg
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @grant          GM_deleteValue
// @grant          GM_listValues
// ==/UserScript==

GM_registerMenuCommand("Configure userscript stored credentials deletion rule", function() {
  GM_setValue('kontoj_wipeServiceInfo',prompt("• Enter -1 if you want to delete when clicking the account creation icon\n• Enter 0 to never remove credentials\n• Enter a positive value to delete credentials after X minutes",GM_getValue('kontoj_wipeServiceInfo','')));
}, {
  accessKey: "a",
  autoClose: true
});

const keys = GM_listValues();

async function getUserscriptVersion(url) {
  try {
    // Fetch the userscript file
    const response = await fetch(url);
    const userscript = await response.text();

    // Regular expression to match the version in the metadata block
    const versionRegex = /\/\/\s*@version\s+([\d.]+)/;

    // Execute the regex on the userscript content
    const match = userscript.match(versionRegex);

    // Extract the version if it matches
    if (match && match[1]) {
      return match[1];
    } else {
      throw new Error("Version not found in the userscript.");
    }
  } catch (error) {
    console.error("Failed to get userscript version:", error);
  }
}

function cleanString(string, prefix) {
    string = string.replaceAll(" ", "_").replaceAll("é","e").replaceAll(".", "").toLowerCase();
    if(prefix) {
      string = prefix + string;
    }
    return string;
}

function getAppName() {
    // Look for 'application-name' meta tag
    let appName = document.querySelector('meta[name="application-name"]');
    if (appName) {
        return appName.getAttribute('content');
    }
    // Default case:
    return '';
}

if (getAppName() == 'Kontoj') {
    $( document ).ready(function() {
        // Display on Kontoj that userscript is installed and check if version is up to date
        $("#apptitle").text($("#apptitle").text() + " ✨");
        $("#companionInstallInformationButton").css("display", "block");
        $("#kontoj-companion-installed-status-version").css("display", "block");
        $("#version-installed-number").text(GM_info.script.version);
        const userscriptUrl = window.location.protocol + "//" + window.location.host + '/js/kontoj_companion.user.js';
        getUserscriptVersion(userscriptUrl).then(version => {
            //console.log("Remote Userscript version:", version);
            if(version > GM_info.script.version) {
                $("#kontoj-companion-installed-status-nok").css("display", "block");
                $("#version-available").css("display", "block");
                $("#version-available-number").text(version);
            } else {
                $("#kontoj-companion-installed-status-ok").css("display", "block");
            }
        });
        $("#companionInstallInformation").removeClass("show");

        $("body").on("click", ".url-create-account", function(){
            var data = JSON.parse(localStorage.getItem("currentList"));
            GM_setValue('kontoj_json', data);

            var userFirstName = $("#userFirstName").val();
            var userLastName = $("#userLastName").val();
            var serviceName = $(this).parent().parent().parent().data("service-name");

            var email = $('[data-service-name="'+serviceName+'"] .emailfield').val();
            var password = $('[data-service-name="'+serviceName+'"] .passwordfield').val();
            var login = $('[data-service-name="'+serviceName+'"] .loginfield').val();

            GM_setValue('userFirstName', userFirstName);
            GM_setValue('userLastName', userLastName);
            GM_setValue(serviceName + '.email', email);
            GM_setValue(serviceName + '.password', btoa(password));
            GM_setValue(serviceName + '.login', login);
        });

    });
}

function fillRecords(e, serviceName) {
    // Load all fields
    if(e.fields['autofill'].login){
        document.querySelector(e.fields['autofill'].login).value = GM_getValue(serviceName + '.login', '');
    }
    if(e.fields['autofill'].fullname){
        document.querySelector(e.fields['autofill'].fullname).value = GM_getValue('userFirstName', '') + ' ' + GM_getValue('userLastName', '');
    }
    if(e.fields['autofill'].firstname){
        document.querySelector(e.fields['autofill'].firstname).value = GM_getValue('userFirstName', '');
    }
    if(e.fields['autofill'].lastname){
        document.querySelector(e.fields['autofill'].lastname).value = GM_getValue('userLastName', '');
    }
    if(e.fields['autofill'].email){
        document.querySelector(e.fields['autofill'].email).value = GM_getValue(serviceName + '.email','');
    }
    if(e.fields['autofill'].password){
        document.querySelector(e.fields['autofill'].password).value = atob(GM_getValue(serviceName + '.password',''));
    }
    if(e.fields['autofill'].passwordconfirm){
        document.querySelector(e.fields['autofill'].passwordconfirm).value = atob(GM_getValue(serviceName + '.password',''));
    }

    // Load custom code if needed
    if(e.fields['autofill'].custom){
        eval(e.fields['autofill'].custom);
    }
    // Set default wipe to 5mn
    if(GM_getValue("kontoj_wipeServiceInfo", -2) == -2) {
        GM_setValue("kontoj_wipeServiceInfo", 5);
    }
    if(GM_getValue("kontoj_wipeServiceInfo") == -1) {
        GM_deleteValue(serviceName + '.login');
        GM_deleteValue(serviceName + '.email');
        GM_deleteValue(serviceName + '.password');
    } else {
        var nb_of_minutes = GM_getValue("kontoj_wipeServiceInfo");
        var current_date = new Date();
        var current_date_added_time = current_date.getTime() + (nb_of_minutes * 60 * 1000)
        GM_setValue("kontoj_wipeDate", current_date_added_time);
    }
}

var data = GM_getValue('kontoj_json', '');
if(data){
    data.records.forEach(function(e) {
        if(window.location.href.includes(e.fields["URL Create Account"])) {
            var serviceName = cleanString(e.fields["Name"], "service_");
            fillRecords(e, serviceName);
            // TODO: Load Role
        }
    });
} else {
    //console.log("no json list loaded in userscript storage");
}

function deleteValueForServiceKey(key){
    if(key.startsWith('service_')) {
      GM_deleteValue(key);
    }
}

if(GM_getValue("kontoj_wipeServiceInfo",-1) > 0) {
    var current_date_now = new Date();
    var remaining_time = GM_getValue("kontoj_wipeDate", current_date_now.getTime())-current_date_now.getTime();
    // console.log("remaining time before credentials deletion in miliseconds: " + remaining_time);
    // If no time remaining, we list all key and deletes value for key beginning by service_
    if(remaining_time <= 0){
        keys.forEach((element) => deleteValueForServiceKey(element));
    }
}
