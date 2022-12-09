sap.ui.define([
    'sap/m/MessageBox',
    'sap/ui/core/mvc/Controller',
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (MessageBox, Controller, Fragment, MessageToast) {
    "use strict";

    var LinkGroupController = Controller.extend("NYX.bsincrv01.ext.controller.Link", {

        onInit: function () {
            Fragment.load({
                name: 'NYX.bsincrv01.ext.fragment.CreateLink_Dialog',
                controller: this,
            }).then(function (oDialog) {
                this._oDialogCreateLink = oDialog;
                this.getView().addDependent(this._oDialogCreateLink);
            }.bind(this));
        },
        onAddLinkClick: function () {
            this._oDialogCreateLink.open()
        }
        ,
        onDeleteLinkClick: function () {
            var oModel = this.getView().getModel();
            var oTable = this.byId("linkTable");
            if (oTable.getSelectedContextPaths() === []) {
                MessageToast.show("Please select a row!");
                return;
            }
            var sPath = oTable.getSelectedContextPaths();
            oModel.remove(sPath[0], {
                success: function () {
                    oModel.refresh(true);
                    MessageToast.show("Deleted reference successfully!");
                },
                error: function () {
                    MessageToast.show("Could not delete reference!");
                }
            });
        },
        onOKClick: function () {
            this._oDialogCreateLink.close();
            var oModel = this.getOwnerComponent().getModel();
            var crNum = this.getView().getModel("crNum").getData();
            var linkText = this._oDialogCreateLink.getContent()[0].getContent()[1]._lastValue;
            var url = this._oDialogCreateLink.getContent()[0].getContent()[3]._lastValue;

            // Check the content before sending to the backend
            if (linkText === "" || url === "") {
                MessageToast.show("Please fill all the mandatory fields!");
                return;
            }

            var oEntry = {
                CrNum: crNum,
                Text: linkText,
                Url: url
            }

            // Create a new Task
            oModel.create("/CR_HeaderSet('" + crNum + "')/CR_Links", oEntry, {
                method: "POST",
                success: function (oData) {
                    oModel.refresh(true);
                    MessageToast.show("Created reference successfully!");
                },
                error: function () {
                    MessageToast.show("Could not reference task!");
                }
            });
        },
        onCancelClick: function () {
            this._oDialogCreateLink.close();
        }
    });

    return LinkGroupController;

});
