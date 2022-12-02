sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/upload/UploadSetItem"],
    function () {
        "use strict";

        return {
            onInit: function (Controller, UploadSetItem) {
                var oPromise;
                // Attach a handler to the PageDataLoaded event. This event is fired each time the object page is navigated to or the object to be displayed is changed Note.
                this.extensionAPI.attachPageDataLoaded(function (oEvent) {
                    console.log("OP: Page Loaded!");
                    var crObject = oEvent.context.sPath;
                    //Store current CrNum in model
                    var crNum = this.getOwnerComponent().getModel().getProperty(crObject).CrNum;
                    this.getView().getModel("crNum").setData(crNum);

                }.bind(this));
            },
            onBeforeRendering: function (oEvent) {
                console.log("OP: onBeforeRendering!");
            },
            onAfterRendering: function (oEvent) {
                console.log("OP: onAfterRendering!");
                this.extensionAPI.getTransactionController().attachAfterSave(async function (oEvent) {
                    sap.ui.controller("NYX.bsincrv01.ext.controller.TaskTable").test();
                });
            },
            onSubmitClick: function (oEvent) {
                alert('onSubmitClick');
            }
        };
    });
