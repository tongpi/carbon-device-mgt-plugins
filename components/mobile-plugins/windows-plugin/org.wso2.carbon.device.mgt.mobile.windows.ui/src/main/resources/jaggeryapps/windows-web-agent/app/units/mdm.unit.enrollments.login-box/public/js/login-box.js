/*
 * Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * This method will return query parameter value given its name
 * @param name Query parameter name
 * @returns {string} Query parameter value
 */
var getParameterByName = function (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

var errorMsgWrapper = "#enrollment-error-msg";
var errorMsg = errorMsgWrapper + " span";

/**
 * This method will execute on login form submission and validate input.
 * @returns {boolean}
 */
var validate = function () {
    var username = $("input#username").val();
    var password = $("input#password").val();

    if (!username && !password) {
        $(errorMsg).text("用户名和密码都是空的。你不能继续。");
        if ($(errorMsgWrapper).hasClass("hidden")) {
            $(errorMsgWrapper).removeClass("hidden");
        }
        return false;
    } else if (!username && password) {
        $(errorMsg).text("用户名不能为空。");
        if ($(errorMsgWrapper).hasClass("hidden")) {
            $(errorMsgWrapper).removeClass("hidden");
        }
        return false;
    } else if (username && !password) {
        $(errorMsg).text("密码不能为空。");
        if ($(errorMsgWrapper).hasClass("hidden")) {
            $(errorMsgWrapper).removeClass("hidden");
        }
        return false;
    } else {
        return true;
    }
};

$(document).ready(function () {
    var error = getParameterByName("error");
    if (error == "auth-failed") {
        var defaultMessage = "请提供正确的用户名和密码以继续。";
        var customMessage = getParameterByName("message");
        if (customMessage) {
            $(errorMsg).text("认证失败。 " + customMessage);
        } else {
            $(errorMsg).text("认证失败。 " + defaultMessage);
        }
        $(errorMsgWrapper).removeClass("hidden");
    } else if (error == "unexpected") {
        $(errorMsg).text("发生异常错误，请重试。");
        $(errorMsgWrapper).removeClass("hidden");
    }
});

$(".btn-download-agent").click(function () {
    $(".form-login-box").submit();
});


