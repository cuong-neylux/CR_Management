sap.ui.define([
	"jquery.sap.global",
	"sap/m/library",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Item",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (jQuery, MobileLibrary, Controller, Item, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("NYX.bsincrv01.ext.controller.UploadSet", {
		onInit: function () {
			this._oUploadSet = this.byId("UploadSet");
			this._oModel = this.getView().getModel();
			this._oUploadSet.getList().setMode(MobileLibrary.ListMode.MultiSelect);

			// Modify "add file" button
			this._oUploadSet.getDefaultFileUploader().setButtonOnly(false);
			this._oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");

			this._oUploadSetItem = this.byId("UploadSet-UploadSetItem");

		},
		onAfterRendering: function(){
			var oModel = this._oModel;

			this._oUploadSet.attachAfterItemAdded(function (oEvent) {
				var oItem = oEvent.mParameters.item;
				this.addIncompleteItem(oItem);
			});

			this._oUploadSet.attachBeforeItemRemoved(function(oEvent){
				debugger;
				var sPath = oEvent.mParameters.item.mBindingInfos.fileName.binding.oContext.sPath;
				var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/nyx/BS_IN_CR_GP01_V01_SRV/", true);
				oModel.remove(sPath,{
					success: function(){
						MessageToast.show("Deleted the file successfully!");
						oModel.refresh(true);
					},
					error: function(){
						MessageToast.show("Couldn't delete the file!");
					}
				})
				
			});
		},
		onUploadSelectedButton: function () {
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/nyx/BS_IN_CR_GP01_V01_SRV/", true);
			var crNum = this.getView().getModel("crNum").getData();
			var oUploadSet = this._oUploadSet;
			var that = this;
			



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
				debugger
				this.addItem(oEvent.mParameters.item);
				// TODO: Load the DocumentSet again and refresh the model
			});



		},
		onDownloadSelectedButton: function () {
			this._oUploadSet.getItems().forEach(function (oItem) {
				if (oItem.getListItem().getSelected()) {
					oItem.download(true);
				}
			});
		}
	});
});