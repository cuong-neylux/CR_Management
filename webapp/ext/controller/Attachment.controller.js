sap.ui.define([
	"jquery.sap.global",
	"sap/m/library",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Item",
	"sap/ui/model/json/JSONModel",
	"sap/m/upload/Uploader"
], function (jQuery, MobileLibrary, Controller, Item, JSONModel, Uploader) {
	"use strict";

	return Controller.extend("NYX.bsincrv01.ext.controller.Attachment", {
		onInit: function () {
			// Mock data, two files should be shown in the list
			var sPath = "../mockdata" + "/items.json";
			this.getView().setModel(new JSONModel(sPath));

			var oUploadSet = this.byId("UploadSet");
			oUploadSet.getList().setMode(MobileLibrary.ListMode.MultiSelect);

			// Modify "add file" button
			oUploadSet.getDefaultFileUploader().setButtonOnly(false);
			oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
		},
		onAfterRendering: function () {
			var oUploadSet = this.byId("UploadSet");
			oUploadSet.attachBeforeUploadStarts(function (oEvent){
				debugger;
			});
			oUploadSet.attachAfterItemAdded(function (oEvent) {
				var oItem = oEvent.mParameters.item;
				this.addIncompleteItem(oItem);
			});

		},
		onUploadSelectedButton: function () {
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/nyx/BS_IN_CR_GP01_V01_SRV/", true);
			var oUploadSet = this.byId("UploadSet");

			oUploadSet.getIncompleteItems().forEach(function (oItem) {
				if (oItem.getListItem().getSelected()) {
					// Get the file name
					var headerField = new Item({
						key: "slug",
						text: oItem.getFileName()
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
				}
			});
		},
		onDownloadSelectedButton: function () {
			var oUploadSet = this.byId("UploadSet");

			oUploadSet.getItems().forEach(function (oItem) {
				if (oItem.getListItem().getSelected()) {
					oItem.download(true);
				}
			});
		}
	});
});