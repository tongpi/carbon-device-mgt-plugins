/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

$(document).ready(function () {
    invokerUtil.get(
        "/api/device-mgt/android_sense/v1.0/configuration",
        function (data) {
            data = JSON.parse(data);
            if (data && data.configuration) {
                for (var i = 0; i < data.configuration.length; i++) {
                    var config = data.configuration[i];
                    if (config.name == "ARDUINO_HTTP_IP") {
                        $("input#http-endpoint").val(config.value);
                    } else if (config.name == "ARDUINO_HTTP_PORT") {
                        $("input#https-endpoint").val(config.value);
                    }
                }
            }
        }, function (data) {
            console.log(data);
        });

});


// Start of HTML embedded invoke methods
var showAdvanceOperation = function (operation, button) {
    $(button).addClass('selected');
    $(button).siblings().removeClass('selected');
    var hiddenOperation = ".wr-hidden-operations-content > div";
    $(hiddenOperation + '[data-operation="' + operation + '"]').show();
    $(hiddenOperation + '[data-operation="' + operation + '"]').siblings().hide();
};

// Start of HTML embedded invoke methods
var addConfiguration = function () {
    var errorMsgWrapper = "#android_sense-config-error-msg";
    var errorMsg = "#android_sense-config-error-msg span";
    var addConfigFormData = {};
    var configList = [];
    var mqttEp = $("input#mqtt-endpoint").val();
    var mqttConfig = {
        "name": "ANDROID_SENSE_MQTT_EP",
        "value": String(mqttEp),
        "contentType": "text"
    };

    configList.push(mqttConfig);
    addConfigFormData.type = "android_sense";
    addConfigFormData.configuration = configList;

    var addConfigAPI = "/api/device-mgt/android_sense/v1.0/configuration";
    invokerUtil.post(
        addConfigAPI,
        addConfigFormData,
        function (data) {
            data = JSON.parse(data);
            if (data.statusCode == 201) {
                $("#config-save-form").addClass("hidden");
                $("#record-created-msg").removeClass("hidden");
            } else if (data == 500) {
                $(errorMsg).text("后台发生异常错误。");
            } else if (data == 403) {
                $(errorMsg).text("操作不允许。");
            } else {
                $(errorMsg).text("发生异常错误。");
            }

            $(errorMsgWrapper).removeClass("hidden");
        }, function (data) {
            data = data.status;
            if (data == 500) {
                $(errorMsg).text("后台发生异常错误。");
            } else if (data == 403) {
                $(errorMsg).text("操作不允许。");
            } else {
                $(errorMsg).text("发生异常错误。");
            }
            $(errorMsgWrapper).removeClass("hidden");
        }
    );
};

var artifactUpload = function () {
	var contentType = "application/json";
	var backendEndBasePath = "/api/device-mgt/v1.0";
	var urix = backendEndBasePath + "/admin/publish-artifact/deploy/android_sense";
	var defaultStatusClasses = "fw fw-stack-1x";
	var content = $("#androidsense-statistic-response-template").find(".content");
	var title = content.find("#title");
	var statusIcon = content.find("#status-icon");
	var data = {}
	invokerUtil.post(urix, data, function (data) {
		title.html("部署统计工件。 请稍候...");
		statusIcon.attr("class", defaultStatusClasses + " fw-check");
		$(modalPopupContent).html(content.html());
		showPopup();
		setTimeout(function () {
			hidePopup();
			location.reload(true);
		}, 5000);

	}, function (jqXHR) {
		title.html("部署工件失败，请联系管理员。");
		statusIcon.attr("class", defaultStatusClasses + " fw-error");
		$(modalPopupContent).html(content.html());
		showPopup();
	}, contentType);
};