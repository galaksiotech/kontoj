// ==UserScript==
// @name           Kontoj Companion
// @name:fr        Companion Kontoj
// @namespace      kontoj@galaksio.tech
// @version        1.2.20231012
// @description    Autofill informations on services based on jQuery selectors
// @description:fr Rempli automatiquement les informations sur les services en se basant sur les sélecteurs jQuery
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
// ==/UserScript==

function cleanString(string, prefix) {
    string = string.replaceAll(" ", "_").replaceAll("é","e").replaceAll(".", "").toLowerCase();
    if(prefix) {
      string = prefix + string;
    }
    return string;
}

var kontoj_hosts = ["kontoj.galaksio.tech"];
if(GM_getValue('kontoj_debug.host','') != '') {
    kontoj_hosts.push(GM_getValue('kontoj_debug.host'));
}

const isKontojHost = kontoj_hosts.some(r=> window.location.host.includes(r))

if (isKontojHost) {
    const asyncKeys = await GM.listValues();
    $( document ).ready(function() {
        $("#apptitle").text($("#apptitle").text() + " ✨");
        $("body").on("change", "#jsonFile", function(){
            var fileInputCompanion = $('#jsonFile');
            var fileCompanion = fileInputCompanion[0].files[0];
            var readerCompanion = new FileReader();
            readerCompanion.onload = function() {
                var data = JSON.parse(readerCompanion.result);
                GM_setValue('kontoj_json', data);
            }
            readerCompanion.readAsText(fileCompanion);

            asyncKeys.forEach(function(e) {
                if(e.includes("service_")) {
                    GM.deleteValue(e);
                }
            });
        });

        $("body").on("click", ".url-create-account", function(){
            var userFirstName = $("#userFirstName").val();
            var userLastName = $("#userLastName").val();
            var serviceName = $(this).parent().parent().data("service-name");

            var email = $('[data-service-name="'+serviceName+'"] .emailfield').val();
            var password = $('[data-service-name="'+serviceName+'"] .passwordfield').val();
            var login = $('[data-service-name="'+serviceName+'"] .loginfield').val();

            GM_setValue('userFirstName', userFirstName);
            GM_setValue('userLastName', userLastName);
            GM_setValue(serviceName + '.email', email);
            GM_setValue(serviceName + '.password', password);
            GM_setValue(serviceName + '.login', login);
        });

    });
}

function fillRecords(e, serviceName) {
    // Load all fields
    if(e.fields['autofill'].login){
        eval(e.fields['autofill'].login).val(GM_getValue(serviceName + '.login', ''));
    }
    if(e.fields['autofill'].fullname){
        eval(e.fields['autofill'].fullname).val(GM_getValue('userFirstName', '') + ' ' + GM_getValue('userLastName', ''));
    }
    if(e.fields['autofill'].firstname){
        eval(e.fields['autofill'].firstname).val(GM_getValue('userFirstName', ''));
    }
    if(e.fields['autofill'].lastname){
        eval(e.fields['autofill'].lastname).val(GM_getValue('userLastName', ''));
    }
    if(e.fields['autofill'].email){
        eval(e.fields['autofill'].email).val(GM_getValue(serviceName + '.email',''));
    }
    if(e.fields['autofill'].password){
        eval(e.fields['autofill'].password).val(GM_getValue(serviceName + '.password',''));
    }
    if(e.fields['autofill'].passwordconfirm){
        eval(e.fields['autofill'].passwordconfirm).val(GM_getValue(serviceName + '.password',''));
    }

    // Load custom code if needed
    if(e.fields['autofill'].custom){
        eval(e.fields['autofill'].custom);
    }
}

var data = GM_getValue('kontoj_json', '');
data.records.forEach(function(e) {
    if(window.location.href.includes(e.fields["URL Create Account"])) {
        var serviceName = cleanString(e.fields["Name"], "service_");

        if (typeof $ !== 'undefined') {
            fillRecords(e, serviceName);

        } else {
            //console.log('jQuery is not loaded.');
            // Load jquery from userscript metadata block:
            // @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
            // Load jQuery from userscript content: (may not work due to CSP rules of website/server)
            fetch('https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js')
                .then(response => response.text())
                .then(code => eval(code)).then(function() {
                fillRecords(e, serviceName);
            });
        }

    // TODO: Load Role
    // TODO: Reset Values in UserScript storage on click on create button
    }
});