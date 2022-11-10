sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("NYX.bsincrv01.ext.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		// Get user list from Odata and find the user name that matches the given personal number
		loadUsers: function(pNumber){
			oModel = this.getOwnerComponent.getModel();
			oModel.read("/UserSet", {
				success: function (oData) {
					var users = oData.results;
					window.users = this.users;
				},
				error: function () {
					console.log("Load UserSet", "Could not load the user list");
				}
			});
		},

		getUserSet:function(){
			return this.users;
		},

        /**
		 * Convenience method for setting the controller.
		 * @public
		 * @param {sap.ui.model.Controller} controller the controller instance
		 */
		setController: function(controller) {
			this.globalController = controller;
		},
        		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @returns {sap.ui.model.Controller} the controller instance
		 */
		getController: function() {
			return this.globalController;
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

	});

});