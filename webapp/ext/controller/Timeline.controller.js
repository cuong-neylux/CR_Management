sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
	function (Controller, JSONModel, MessageToast) {
		"use strict";

		var gModel;
		var messages;
		var that;
		return Controller.extend("sap.suite.ui.commons.sample.TimelineTextHeight.Timeline", {

			loadMessages: function (globalController, globalModel, crNum) {
				that = this;
				gModel = globalModel;
				var filter = new sap.ui.model.Filter("CrNum", sap.ui.model.FilterOperator.EQ, crNum + '"');
				var aFilters = [filter];
				gModel.read("/CommentSet", {
					filters: aFilters,
					success: function (oData) {
						messages = oData.results;
						that.displayMessages(globalController);
						console.log("Load messages:", oData);
					},
					error: function (error) {
						console.log("Load messages:", error.Text);
						var messageHistorySection = this.getView.byId("NYX.bsincrv01::sap.suite.ui.generic.template.ObjectPage.view.Details::CR_HeaderSet--AfterFacet::CR_HeaderSet::op_section_docList::Section");
						messageHistorySection.setVisible(false);
					}
				});

			},
			displayMessages: function (globalController){
				var aData = {
					Items: []
				};

				var oDate;
				for (var i = 0; i < messages.length; i++) {
					oDate = new Date(messages[i].CommentDate);
					oDate.setTime(oDate.getTime() + messages[i].CommentTime)						// Subtract one hour
					aData.Items.push({
						Date: oDate,
						Title: i + "",
						Text: messages[i].Note,
						UserName: 'User'//messages[i].FirstName + ', ' + messages[i].Surname
					});
				}

				var lModel = new JSONModel(aData);
				globalController.getView().setModel(lModel, "timelineView");
				globalController._timeline = this.byId("idTimeline");
			},

			sliderChanged: function (oEvent) {
				this.byId("idPanel").setHeight(oEvent.getParameter("value") + "px");
			}
		});
	});