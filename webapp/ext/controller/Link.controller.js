sap.ui.define([
    'sap/m/MessageBox',
    'sap/ui/core/mvc/Controller'
], function(MessageBox, Controller) {
"use strict";

var LinkGroupController = Controller.extend("NYX.bsincrv01.ext.controller.Link", {

    handleLinkPress: function (evt) {
        MessageBox.alert("Link was clicked!");
    }

});

return LinkGroupController;

});
