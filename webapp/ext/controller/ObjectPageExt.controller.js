sap.ui.define([],
function (){
    "use strict";

    // Global varables
    var crNum;
    var oModel;
    var that;

    return {
        onInit: function(){
            oModel = this.getOwnerComponent().getModel();
            that = this;

            this.extensionAPI.attachPageDataLoaded(function (oEvent){
                crNum = this.getView().byId("NYX.bsincrv01::sap.suite.ui.generic.template.ObjectPage.view.Details::CR_HeaderSet--header::headerEditable::op_cr_general_info::CrNum::Field").getValue();
                sap.ui.controller("NYX.bsincrv01.ext.controller.Timeline").loadMessages(that, oModel, crNum);
            }.bind(this));
        },
        onSubmitClick: function(oEvent) {
            alert('onSubmitClick');
        }
    };
});
