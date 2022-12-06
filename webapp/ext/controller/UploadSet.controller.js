sap.ui.define([
	"jquery.sap.global",
	"sap/m/library",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Item",
	"sap/ui/model/json/JSONModel"
], function (jQuery, MobileLibrary, Controller, Item, JSONModel) {
	"use strict";

	return Controller.extend("NYX.bsincrv01.ext.controller.UploadSet", {
		onInit: function () {
			var oUploadSet = this.byId("UploadSet");
			oUploadSet.getList().setMode(MobileLibrary.ListMode.MultiSelect);

			// Modify "add file" button
			oUploadSet.getDefaultFileUploader().setButtonOnly(false);
			oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");

		},
		onAfterRendering: function () {
			console.log("UploadSet: onAfterRendering!");
			var oUploadSet = this.byId("UploadSet");

			oUploadSet.attachAfterItemAdded(function (oEvent) {
				var oItem = oEvent.mParameters.item;
				this.addIncompleteItem(oItem);
			});

		},
		onUploadSelectedButton: function () {
			debugger;
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/nyx/BS_IN_CR_GP01_V01_SRV/", true);
			var crNum = this.getView().getModel("crNum").getData();
			var oUploadSet = this.byId("UploadSet");

			oUploadSet.getIncompleteItems().forEach(function (oItem) {
				if (oItem.getListItem().getSelected()) {
					// Get the file name
					var headerField = new Item({
						key: "slug",
						text: oItem.getFileName() + ";" + crNum
					});
					oUploadSet.addHeaderField(headerField);

					// Get security token
					headerField = new Item({
						key: "x-csrf-token",
						text: oModel.getSecurityToken()
					});
					oUploadSet.addHeaderField(headerField);

					// Trigger upload: Send file to backend
					oUploadSet.uploadItem(oItem);
					oUploadSet.destroyHeaderFields();
				}
			});

			oUploadSet.attachUploadCompleted(function (oEvent) {

			});
		},
		onDownloadSelectedButton: function () {
			var oUploadSet = this.byId("UploadSet");

			oUploadSet.getItems().forEach(function (oItem) {
				if (oItem.getListItem().getSelected()) {
					oItem.download(true);
				}
			});
		},
		loadDocumentSet(crNum){
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/nyx/BS_IN_CR_GP01_V01_SRV/", true);
			var that = this;
			oModel.read("/CR_HeaderSet('" + crNum +"')/CR_DocumentSet", {
				success: function(oData){
				},
				error: function(error){

				}
			});
		}
	});
});