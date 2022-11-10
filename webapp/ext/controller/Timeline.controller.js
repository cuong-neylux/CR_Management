sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageToast", "./ObjectPageExt.controller"],
	function (Controller, JSONModel, MessageToast) {
		"use strict";

		return Controller.extend("NYX.bsincrv01.ext.controller.Timeline", {

			onInit: function () {
				this._timeline = this.byId("idTimeline");
			},

			sliderChanged: function (oEvent) {
				this.byId("idPanel").setHeight(oEvent.getParameter("value") + "px");
			},

			onTestClick: function(){

			}
		});
	});