sap.ui.define([],
    function () {
        "use strict";
        return {
            /*
    * onAfterRendering: Enhance the List Report page with some logic after rendering the page
    *                       
    */
            onAfterRendering: function () {
                //Hide settings button
                this.getView().byId("NYX.bsincrv01::sap.suite.ui.generic.template.ListReport.view.ListReport::CR_HeaderSet--listReport-btnPersonalisation").setVisible(false);
                //Table Buttons
                this._oCreateButton = this.getView().byId("NYX.bsincrv01::sap.suite.ui.generic.template.ListReport.view.ListReport::CR_HeaderSet--addEntry");
                if (this._oCreateButton != undefined) {
                    this._oCreateButton.setType("Emphasized");
                };
            }
            ,
            onCopyClick: function (oEvent) {
                alert('onCopyClick');
            }
        };
    });
