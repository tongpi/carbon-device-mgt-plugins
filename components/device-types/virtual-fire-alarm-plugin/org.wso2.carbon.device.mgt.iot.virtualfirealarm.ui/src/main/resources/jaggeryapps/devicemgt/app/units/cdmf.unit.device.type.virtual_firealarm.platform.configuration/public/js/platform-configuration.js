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
        "/api/device-mgt/virtual_firealarm/v1.0/configuration",
        function (data) {
            data = JSON.parse(data);
            if (data && data.configuration) {
                for (var i = 0; i < data.configuration.length; i++) {
                    var config = data.configuration[i];
                    if (config.name == "VIRTUAL_FIREALARM_HTTP_EP") {
                        $("input#http-endpoint").val(config.value);
                    } else if (config.name == "VIRTUAL_FIREALARM_HTTPS_EP") {
                        $("input#https-endpoint").val(config.value);
                    } else if (config.name == "VIRTUAL_FIREALARM_MQTT_EP") {
                        $("input#mqtt-endpoint").val(config.value);
                    }
                }
            }
        }, function (data) {
            console.log(data);
        });

});

// Start of HTML embedded invoke methods
var addConfiguration = function () {
    var errorMsgWrapper = "#virtual_firelarm-config-error-msg";
    var errorMsg = "#virtual_firelarm-config-error-msg span";
    var addConfigFormData = {};
    var configList = new Array();
    var httpEp = $("input#http-endpoint").val();
    var httpConfig = {
        "name": "VIRTUAL_FIREALARM_HTTP_EP",
        "value": String(httpEp),
        "contentType": "text"
    };

    var httpsEp = $("input#https-endpoint").val();
    var httpsConfig = {
        "name": "VIRTUAL_FIREALARM_HTTPS_EP",
        "value": String(httpsEp),
        "contentType": "text"
    };

    var mqttEp = $("input#mqtt-endpoint").val();
    var mqttConfig = {
        "name": "VIRTUAL_FIREALARM_MQTT_EP",
        "value": String(mqttEp),
        "contentType": "text"
    };

    configList.push(httpConfig);
    configList.push(httpsConfig);
    configList.push(mqttConfig);
    addConfigFormData.type = "virtual_firealarm";
    addConfigFormData.configuration = configList;

    var addConfigAPI = "/api/device-mgt/virtual_firealarm/v1.0/configuration";
    invokerUtil.post(
        addConfigAPI,
        addConfigFormData,
        function (data) {
            data = JSON.parse(data);
            if (data.statusCode == 201) {
                $("#config-save-form").addClass("hidden");
                $("#record-created-msg").removeClass("hidden");
            } else if (data == 500) {
                $(errorMsg).text("后台发生异常。");
            } else if (data == 403) {
                $(errorMsg).text("操作不允许。");
            } else {
                $(errorMsg).text("发生异常错误。");
            }

            $(errorMsgWrapper).removeClass("hidden");
        }, function (data) {
            data = data.status;
            if (data == 500) {
                $(errorMsg).text("后台发生异常。");
            } else if (data == 403) {
                $(errorMsg).text("操作不允许。");
            } else {
                $(errorMsg).text("发生异常错误。");
            }
            $(errorMsgWrapper).removeClass("hidden");
        }
    );
};

var virtualfirealarmArtifactUpload = function () {
	var contentType = "application/json";
	var backendEndBasePath = "/api/device-mgt/v1.0";
	var urix = backendEndBasePath + "/admin/publish-artifact/deploy/virtual_firealarm";
	var defaultStatusClasses = "fw fw-stack-1x";
	var content = $("#virtual-firealarm-statistic-response-template").find(".content");
	var title = content.find("#title");
	var statusIcon = content.find("#status-icon");
	var data = {}
	invokerUtil.post(urix, data, function (data) {
		title.html("部署统计部件。请稍后...");
		statusIcon.attr("class", defaultStatusClasses + " fw-check");
		$(modalPopupContent).html(content.html());
		showPopup();
		setTimeout(function () {
			hidePopup();
			location.reload(true);
		}, 5000);

	}, function (jqXHR) {
		title.html("部署部件失败，请联系管理员。");
		statusIcon.attr("class", defaultStatusClasses + " fw-error");
		$(modalPopupContent).html(content.html());
		showPopup();
	}, contentType);
};
