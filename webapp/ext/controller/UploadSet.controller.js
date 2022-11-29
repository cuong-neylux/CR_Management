sap.ui.define([
	"sap/m/library",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Item",
	"sap/ui/model/json/JSONModel",
	"sap/m/upload/Uploader",
	"sap/m/StandardListItem",
	"sap/m/MessageToast",
	"sap/ui/model/odata/ODataModel"
], function (MobileLibrary, Controller, Item, JSONModel, Uploader, ListItem, MessageToast, ODataModel) {
	"use strict";

	var ListMode = MobileLibrary.ListMode;
	var CustomUploader = Uploader.extend("sap.m.sample.UploadSetCustomUploader.CustomUploader", {
		metadata: {}
	});

	CustomUploader.prototype.uploadItem = function (oItem, aHeaders) {
		var tmpModel = new ODataModel("/sap/opu/odata/nyx/BS_IN_CR_GP01_V01_SRV/", true);
		tmpModel.setUseBatch(false);

		var sNewUploadUrl = "/sap/opu/odata/nyx/BS_IN_CR_GP01_V01_SRV/DocumentSet"; // This value may be result of a backend request eg.
		aHeaders.push(new Item({key: "SomePostKey", text: "SomePostText"}));
		this.setUploadUrl(sNewUploadUrl);



		Uploader.prototype.uploadItem.call(this, oItem, aHeaders);
	};

	CustomUploader.prototype.downloadItem = function (oItem, aHeaders, bAskForLocation) {
		var sNewDownloadUrl = oItem.getUrl(); // This value may be result of a backend request eg.
		aHeaders.push(new Item({key: "SomeGetKey", text: "SomeGetText"}));
		this.setDownloadUrl(sNewDownloadUrl);

		Uploader.prototype.downloadItem.call(this, oItem, aHeaders, bAskForLocation);
	};

	return Controller.extend("sap.m.sample.UploadSet.Page", {
		onInit: function () {
			var sPath = sap.ui.require.toUrl("mockdata/items.json"),
				oUploadSet = this.byId("UploadSet"),
				oCustomUploader = new CustomUploader();

			this.getView().setModel(new JSONModel(sPath));

			oUploadSet.setUploader(oCustomUploader);
			oUploadSet.registerUploaderEvents(oCustomUploader);

			// Attach separate set of event handlers to demonstrate custom progress monitoring
			oCustomUploader.attachUploadStarted(this.onUploadStarted.bind(this));
			oCustomUploader.attachUploadProgressed(this.onUploadProgressed.bind(this));
			oCustomUploader.attachUploadCompleted(this.onUploadCompleted.bind(this));
			oCustomUploader.attachUploadAborted(this.onUploadAborted.bind(this));

			oUploadSet.getList().setMode(ListMode.MultiSelect);
		},
		handleUploadPress: function(oEvent){
			var that = this;
			var oFileUploader = this.getView().byId("fileUploader");
			var domRef = oFileUploader.getFocusDomRef();
			var file = domRef.files[0];
			this.fileName = file.name;
			this.fileType = file.type;

			var reader = new FileReader();
			reader.onload = function (e){
				debugger;
				var content = e.currentTarget.result;
				var myArray = content.split(";base64,");
				content = myArray[1];
				that.postFileToBackend(that.fileName, that.fileType, content);
			};
			reader.readAsDataURL(file);

		},
		postFileToBackend: function(fileName, fileType, content){
			var ODataModel = this.getOwnerComponent().getModel();
			var crNum = this.getView().getModel("crNum").getData();
			var payload = {
				CrNum: crNum,
				FileName: fileName,
				MimeType: fileType,
				Content: btoa(encodeURI(content))
			}
			ODataModel.create("/DocumentSet", payload, {
				success: function(){
					sap.m.MessageToast.show("The file is uploaded successfully!");
				},
				error: function(error){
					sap.m.MessageToast.show(error);
				}
			})
		}
		,

		onUploadStarted: function (oEvent) {

/* 			var oModel = this.getOwnerComponent().getModel();
			oModel.create("/DocumentSet", oItem, {
				success: function () {
					alert("Uploaded successfully!");
					oModel.refresh();
				},
				error: function (error) {
					alert(error);
					alert("Failed to upload file!");
				}
			}) */

			var oList = this.byId("progressList"),
				oItem = oEvent.getParameter("item");
			oList.insertItem(new ListItem({
				title: "Upload started: " + oItem.getFileName()
			}));
		},
		onUploadProgressed: function (oEvent) {
			var oList = this.byId("progressList"),
				oItem = oEvent.getParameter("item");
			oList.insertItem(new ListItem({
				//title: "Upload progressed: " + oItem.getFileName()
			}));
		},
		onUploadCompleted: function (oEvent) {
			var oList = this.byId("progressList"),
				oItem = oEvent.getParameter("item");
			oList.insertItem(new ListItem({
				title: "Upload completed: " + oItem.getFileName()
			}));
		},
		onUploadAborted: function (oEvent) {
			var oList = this.byId("progressList"),
				oItem = oEvent.getParameter("item");
			oList.insertItem(new ListItem({
				title: "Upload aborted: " + oItem.getFileName()
			}));
		},
		onFileRenamed: function(oEvent) {
			MessageToast.show("FileRenamed event triggered.");
		}
	});
});