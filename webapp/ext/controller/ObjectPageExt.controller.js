sap.ui.define(["./BaseController", "sap/ui/core/mvc/Controller"],
    function (BaseController) {
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
                    crNum = this.getView().byId("NYX.bsincrv01::sap.suite.ui.generic.template.ObjectPage.view.Details::CR_HeaderSet--header::headerEditable::op_cr_general_info::CrNum::Field").getValue();
                    sap.ui.controller("NYX.bsincrv01.ext.controller.Timeline").loadMessages(gController, gModel, crNum);
                }.bind(this));
            },
            onSubmitClick: function (oEvent) {
                alert('onSubmitClick');
            }
        };
    });
