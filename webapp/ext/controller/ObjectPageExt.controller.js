sap.ui.define([],
function (){
    "use strict";
    return {
        onInit: function(){
            alert('onInit is called!');
        },
        onSubmitClick: function(oEvent) {
            alert('onSubmitClick');
        }
    };
});
