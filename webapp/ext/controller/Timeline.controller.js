sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageToast", "./ObjectPageExt.controller"],
	function (Controller, JSONModel, MessageToast) {
		"use strict";

		var messages;
		var lController;
		var controller;
		return Controller.extend("sap.suite.ui.commons.sample.TimelineTextHeight.Timeline", {

			loadMessages: function (gController, gModel,crNum) {
				lController = this;
				controller = gController;
				var filter = new sap.ui.model.Filter("CrNum", sap.ui.model.FilterOperator.EQ, crNum + '"');
				var aFilters = [filter];
				gModel.read("/CommentSet", {
					filters: aFilters,
					success: function (oData) {
						messages = oData.results;
						lController.displayMessages(gController);
					},
					error: function () {
						var messageHistorySection = controller.getView().byId("NYX.bsincrv01::sap.suite.ui.generic.template.ObjectPage.view.Details::CR_HeaderSet--AfterFacet::CR_HeaderSet::op_section_docList::Section");
						messageHistorySection.setVisible(false);
					}
				});

			},
			displayMessages: function (){
				var aData = {
					Items: []
				};

				var oDate;
				for (var i = 0; i < messages.length; i++) {
					oDate = new Date(messages[i].CommentDate);
					//oDate.setTime(oDate.getTime() + messages[i].CommentTime - 3600000)						
					aData.Items.push({
						Date: oDate,
						Title: i + "",
						Text: messages[i].Note,
						UserName: 'User'//messages[i].FirstName + ', ' + messages[i].Surname
					});
				}

				var lModel = new JSONModel(aData);
				controller.getView().setModel(lModel, "timelineModel");
				this._timeline = this.byId("idTimeline");
			},

			sliderChanged: function (oEvent) {
				this.byId("idPanel").setHeight(oEvent.getParameter("value") + "px");
			},
			onTestClick: function(){

			}
		});
	});