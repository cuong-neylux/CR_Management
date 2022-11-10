sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageToast", "./ObjectPageExt.controller"],
	function (Controller, JSONModel, MessageToast) {
		"use strict";

		return Controller.extend("sap.suite.ui.commons.sample.TimelineTextHeight.Timeline", {

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