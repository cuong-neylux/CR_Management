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
			this._oUploadSet = this.byId("UploadSet");
			this._oUploadSet.getList().setMode(MobileLibrary.ListMode.MultiSelect);

			// Modify "add file" button
			this._oUploadSet.getDefaultFileUploader().setButtonOnly(false);
			this._oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");

			this._oUploadSetItem = this.byId("UploadSet-UploadSetItem");

		},
		onAfterRendering: function () {
			console.log("UploadSet: onAfterRendering!");

			this._oUploadSet.attachAfterItemAdded(function (oEvent) {
				var oItem = oEvent.mParameters.item;
				this.addIncompleteItem(oItem);
			});

			this._oUploadSetItem.attachOpenPressed(function(oEvent){
				var sUrl = oEvent.getSource().mProperties.url;
				var oNewWindow = window.open('', '_blank');
				oNewWindow.location = sUrl;
			});

		},
		onUploadSelectedButton: function () {
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/nyx/BS_IN_CR_GP01_V01_SRV/", true);
			var crNum = this.getView().getModel("crNum").getData();
			var oUploadSet = this._oUploadSet;
			this._oUploadSet.getIncompleteItems().forEach(function (oItem) {
				if (oItem.getListItem().getSelected()) {
					debugger;
					// Get the file name
					var fileSize = oItem._fFileSize.toFixed(2);
					var headerField = new Item({
						key: "slug",
						text: oItem.getFileName() + ";" + crNum + ";" + fileSize
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

			this._oUploadSet.attachUploadCompleted(function (oEvent) {
				oModel.refresh(true);
			});
		},
		onDownloadSelectedButton: function () {

			this._oUploadSet.getItems().forEach(function (oItem) {
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
		},
		convertByteToMB:function(bytes){
			return bytes / 1048576;
		}
	});
});