sap.ui.define([
    'sap/m/MessageBox',
    'sap/ui/core/mvc/Controller',
    "sap/ui/core/Fragment"
], function(MessageBox, Controller, Fragment) {
"use strict";

var LinkGroupController = Controller.extend("NYX.bsincrv01.ext.controller.Link", {

    onInit: function(){
        Fragment.load({
            name: 'NYX.bsincrv01.ext.fragment.CreateLink_Dialog',
            controller: this,
        }).then(function (oDialog) {
            this._oDialogCreateLink = oDialog;
            this.getView().addDependent(this._oDialogCreateLink);
        }.bind(this));
    },
    onAddLinkClick: function(){
        this._oDialogCreateLink.open()
    }
    ,
    onDeleteLinkClick: function(){

    },
    onOKClick: function(){

    },
    onCancelClick: function(){
        this._oDialogCreateLink.close();
    }
});

return LinkGroupController;

});
