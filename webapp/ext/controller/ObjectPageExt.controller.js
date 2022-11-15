sap.ui.define(["./BaseController", "sap/ui/core/mvc/Controller"],
    function () {
        "use strict";

        // Global varables
        var crNum;
        var gModel;
        var gController ;

        return {
            onInit: function () {
                gController = this;
                // Attach a handler to the PageDataLoaded event. This event is fired each time the object page is navigated to or the object to be displayed is changed Note.
                this.extensionAPI.attachPageDataLoaded(function (oEvent) {
                    gModel = this.getOwnerComponent().getModel();
                }.bind(this));
            },
            onBeforeRendering: function(oEvent){
                console.log("Test", 1+1);
            },
            onAfterRendering: function(oEvent){
                this.extensionAPI.getTransactionController().attachAfterSave(async function (oEvent) {
                    sap.ui.controller("NYX.bsincrv01.ext.controller.TaskTable").test();
                });
                console.log("Test", 2+1);
            },
            onSubmitClick: function (oEvent) {
                alert('onSubmitClick');
            }
        };
    });
