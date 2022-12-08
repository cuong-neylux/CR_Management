sap.ui.define([
    "sap/ui/core/mvc/Controller"],
    function () {
        "use strict";

        return {
            onInit: function (Controller) {
                this._oToolbar = this.getView().byId("NYX.bsincrv01::sap.suite.ui.generic.template.ObjectPage.view.Details::CR_HeaderSet--template::ObjectPage::FooterToolbar");
                this._submitButton = this.getView().byId("NYX.bsincrv01::sap.suite.ui.generic.template.ObjectPage.view.Details::CR_HeaderSet--submitButton");
                this._submitButton.setType("Emphasized");
                this._editButton = this.getView().byId("NYX.bsincrv01::sap.suite.ui.generic.template.ObjectPage.view.Details::CR_HeaderSet--edit");
                // Attach a handler to the PageDataLoaded event. This event is fired each time the object page is navigated to or the object to be displayed is changed Note.
                this.extensionAPI.attachPageDataLoaded(function (oEvent) {
                    var crObject = oEvent.context.sPath;
                    //Store current CrNum in model
                    var crNum = this.getOwnerComponent().getModel().getProperty(crObject).CrNum;
                    this.getView().getModel("crNum").setData(crNum);

                }.bind(this));
            },
            onBeforeRendering: function (oEvent) {
                this._oToolbar.setVisible(false);
                this._editButton.attachPress(this.onEditClick, this);
                this.extensionAPI.getTransactionController().attachAfterSave(async function (oEvent) {
                    sap.ui.controller("NYX.bsincrv01.ext.controller.TaskTable").test();
                });
            },
            onAfterRendering: function (oEvent) {

            },
            onEditClick(){
                debugger;
                this._oToolbar.setVisible(true);
            },
            onSubmitClick: function (oEvent) {
                alert('onSubmitClick');
            }
        };
    });
