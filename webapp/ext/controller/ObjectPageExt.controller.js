sap.ui.define(["sap/ui/core/mvc/Controller"],
    function () {
        "use strict";

        return {
            onInit: function () {
                var oPromise;
                // Attach a handler to the PageDataLoaded event. This event is fired each time the object page is navigated to or the object to be displayed is changed Note.
                this.extensionAPI.attachPageDataLoaded(function (oEvent) {
                    var crObject = oEvent.context.sPath;
                    //Store current A1mnr and Pernr in a model
                    var crNum = this.getOwnerComponent().getModel().getProperty(crObject).CrNum;
                    this.getView().getModel("crNum").setData(crNum);    
                }.bind(this));
            },
            onBeforeRendering: function(oEvent){

            },
            onAfterRendering: function(oEvent){

                this.extensionAPI.getTransactionController().attachAfterSave(async function (oEvent) {
                    sap.ui.controller("NYX.bsincrv01.ext.controller.TaskTable").test();
                });
            },
            onSubmitClick: function (oEvent) {
                alert('onSubmitClick');
            }
        };
    });
