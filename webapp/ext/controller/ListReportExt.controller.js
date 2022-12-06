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
                //Start button, to load the list of notifs
                this._oGoButton = this.getView().byId("NYX.bsincrv01::sap.suite.ui.generic.template.ListReport.view.ListReport::CR_HeaderSet--listReportFilter-btnGo");
                //Table Buttons
                this._oCreateButton = this.getView().byId("NYX.bsincrv01::sap.suite.ui.generic.template.ListReport.view.ListReport::CR_HeaderSet--addEntry");
                //List item in table                                              
                this._oColumnListItem = this.getView().byId("NYX.bsincrv01::sap.suite.ui.generic.template.ListReport.view.ListReport::CR_HeaderSet--template:::ListReportTable:::ColumnListItem");


                if (this._oCreateButton != undefined) {
                    this._oCreateButton.setType("Emphasized");
                };
                if (this._oColumnListItem != undefined) {
                    this._oColumnListItem.attachPress(this.onListItemClick, this);
                };

            },
            onListItemClick: function (oEvent) {
                debugger;
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/nyx/BS_IN_CR_GP01_V01_SRV/", true);
                var context = oEvent.getSource().getBindingContext();
                var crNum = context.getObject().CrNum;
                this.getView().getModel("crNum").setData(crNum);
            }
            ,
            onCopyClick: function (oEvent) {
                alert('onCopyClick');
            }
        };
    });
