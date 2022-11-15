sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageToast", "./ObjectPageExt.controller"],
	function (Controller, JSONModel, MessageToast) {
		"use strict";

		return Controller.extend("NYX.bsincrv01.ext.controller.Timeline", {

			onInit: function () {
				this._timeline = this.byId("idTimeline");
			},

			sliderChanged: function (oEvent) {
				var panel = this.byId("idPanel");
				var timeline = this.byId("idTimeline");
				var currentHeight = oEvent.getParameter("value");
				panel.setHeight((currentHeight) + "px");
				timeline.setHeight(currentHeight + "px");
			}
		});
	});