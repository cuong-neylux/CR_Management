sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/base/util/deepExtend",
	"sap/ui/core/syncStyleClass",
	"sap/ui/core/mvc/Controller",
	"sap/m/ObjectMarker",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/m/library",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/FileSizeFormat",
	"sap/ui/Device",
	"sap/ui/core/Fragment"
], function (jQuery, deepExtend, syncStyleClass, Controller, ObjectMarker, MessageToast, UploadCollectionParameter, MobileLibrary, JSONModel, FileSizeFormat, Device, Fragment) {
	"use strict";

	var ListMode = MobileLibrary.ListMode,
		ListSeparators = MobileLibrary.ListSeparators;

	return Controller.extend("NYX.bsincrv01.ext.controller.UploadCollection", {
		onInit: function () {
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/nyx/BS_IN_CR_GP01_V01_SRV", false);
			this.getView().setModel(oModel);

			// Sets the text to the label
			this.byId("UploadCollection").addEventDelegate({
				onBeforeRendering: function () {
					this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
				}.bind(this)
			});
		},
		onBeforeUploadStarts: function (oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			
			var oModel = this.getView().getModel();
			oModel.refreshSecurityToken();
			var oHeaders = oModel.oHeaders;
			var sToken = oHeaders['x-csrf-token'];
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderToken);
		},
		createObjectMarker: function (sId, oContext) {
			var mSettings = null;

			if (oContext.getProperty("type")) {
				mSettings = {
					type: "{type}",
					press: this.onMarkerPress
				};
			}
			return new ObjectMarker(sId, mSettings);
		},

		formatAttribute: function (sValue) {
			if (jQuery.isNumeric(sValue)) {
				return FileSizeFormat.getInstance({
					binaryFilesize: false,
					maxFractionDigits: 1,
					maxIntegerDigits: 3
				}).format(sValue);
			} else {
				return sValue;
			}
		},

		onChange: function (oEvent) {
			var oUploadCollection = oEvent.getSource();
		},

		onFileDeleted: function (oEvent) {
			this.deleteItemById(oEvent.getParameter("documentId"));
			MessageToast.show("FileDeleted event triggered.");
		},

		deleteItemById: function (sItemToDeleteId) {
			var oData = this.byId("UploadCollection").getModel().getData();
			var aItems = deepExtend({}, oData).items;
			jQuery.each(aItems, function (index) {
				if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
					aItems.splice(index, 1);
				}
			});
			this.byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},

		deleteMultipleItems: function (aItemsToDelete) {
			var oData = this.byId("UploadCollection").getModel().getData();
			var nItemsToDelete = aItemsToDelete.length;
			var aItems = deepExtend({}, oData).items;
			var i = 0;
			jQuery.each(aItems, function (index) {
				if (aItems[index]) {
					for (i = 0; i < nItemsToDelete; i++) {
						if (aItems[index].documentId === aItemsToDelete[i].getDocumentId()) {
							aItems.splice(index, 1);
						}
					}
				}
			});
			this.byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},

		onFilenameLengthExceed: function () {
			MessageToast.show("FilenameLengthExceed event triggered.");
		},

		onFileRenamed: function (oEvent) {
			var oData = this.byId("UploadCollection").getModel().getData();
			var aItems = deepExtend({}, oData).items;
			var sDocumentId = oEvent.getParameter("documentId");
			jQuery.each(aItems, function (index) {
				if (aItems[index] && aItems[index].documentId === sDocumentId) {
					aItems[index].fileName = oEvent.getParameter("item").getFileName();
				}
			});
			this.byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			MessageToast.show("FileRenamed event triggered.");
		},

		onFileSizeExceed: function () {
			MessageToast.show("FileSizeExceed event triggered.");
		},

		onTypeMissmatch: function () {
			MessageToast.show("TypeMissmatch event triggered.");
		},

		onUploadComplete: function (oEvent) {
			this.getView().getModel().refresh();

			// Sets the text to the label
			this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},

		onUploadTerminated: function () {
			/*
			// get parameter file name
			var sFileName = oEvent.getParameter("fileName");
			// get a header parameter (in case no parameter specified, the callback function getHeaderParameter returns all request headers)
			var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
			*/
		},

		onFileTypeChange: function (oEvent) {
			this.byId("UploadCollection").setFileType(oEvent.getSource().getSelectedKeys());
		},

		onSelectAllPress: function (oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			if (!oEvent.getSource().getPressed()) {
				this.deselectAllItems(oUploadCollection);
				oEvent.getSource().setPressed(false);
				oEvent.getSource().setText("Select all");
			} else {
				this.deselectAllItems(oUploadCollection);
				oUploadCollection.selectAll();
				oEvent.getSource().setPressed(true);
				oEvent.getSource().setText("Deselect all");
			}
			this.onSelectionChange(oEvent);
		},

		deselectAllItems: function (oUploadCollection) {
			var aItems = oUploadCollection.getItems();
			for (var i = 0; i < aItems.length; i++) {
				oUploadCollection.setSelectedItem(aItems[i], false);
			}
		},

		getAttachmentTitleText: function () {
			var aItems = this.byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		},

		onModeChange: function (oEvent) {
			var oSettingsModel = this.getView().getModel("settings");
			if (oEvent.getParameters().selectedItem.getProperty("key") === ListMode.MultiSelect) {
				oSettingsModel.setProperty("/visibleEdit", false);
				oSettingsModel.setProperty("/visibleDelete", false);
				this.enableToolbarItems(true);
			} else {
				oSettingsModel.setProperty("/visibleEdit", true);
				oSettingsModel.setProperty("/visibleDelete", true);
				this.enableToolbarItems(false);
			}
		},

		enableToolbarItems: function (status) {
			this.byId("selectAllButton").setVisible(status);
			this.byId("deleteSelectedButton").setVisible(status);
			this.byId("selectAllButton").setEnabled(status);
			// This is only enabled if there is a selected item in multi-selection mode
			if (this.byId("UploadCollection").getSelectedItems().length > 0) {
				this.byId("deleteSelectedButton").setEnabled(true);
			}
		},

		onDeleteSelectedItems: function () {
			var aSelectedItems = this.byId("UploadCollection").getSelectedItems();
			this.deleteMultipleItems(aSelectedItems);
			if (this.byId("UploadCollection").getSelectedItems().length < 1) {
				this.byId("selectAllButton").setPressed(false);
				this.byId("selectAllButton").setText("Select all");
			}
			MessageToast.show("Delete selected items button press.");
		},

		onSearch: function () {
			MessageToast.show("Search feature isn't available in this sample");
		},

		onSelectionChange: function () {
			var oUploadCollection = this.byId("UploadCollection");
			// Only it is enabled if there is a selected item in multi-selection mode
			if (oUploadCollection.getMode() === ListMode.MultiSelect) {
				if (oUploadCollection.getSelectedItems().length > 0) {
					this.byId("deleteSelectedButton").setEnabled(true);
				} else {
					this.byId("deleteSelectedButton").setEnabled(false);
				}
			}
		},

		onAttributePress: function (oEvent) {
			MessageToast.show("Attribute press event - " + oEvent.getSource().getTitle() + ": " + oEvent.getSource().getText());
		},

		onMarkerPress: function (oEvent) {
			MessageToast.show("Marker press event - " + oEvent.getSource().getType());
		},

		onOpenAppSettings: function (oEvent) {
			var oView = this.getView();

			if (!this._pSettingsDialog) {
				this._pSettingsDialog = Fragment.load({
					id: oView.getId(),
					name: "sap.m.sample.UploadCollection.AppSettings",
					controller: this
				}).then(function (oSettingsDialog) {
					oView.addDependent(oSettingsDialog);
					return oSettingsDialog;
				});
			}

			this._pSettingsDialog.then(function (oSettingsDialog) {
				syncStyleClass("sapUiSizeCompact", oView, oSettingsDialog);
				oSettingsDialog.setContentWidth("42rem");
				oSettingsDialog.open();
			});
		},

		onDialogCloseButton: function () {
			this._pSettingsDialog.then(function (oSettingsDialog) {
				oSettingsDialog.close();
			});
		}
	});
});