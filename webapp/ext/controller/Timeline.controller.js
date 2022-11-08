sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
	function (Controller, JSONModel, MessageToast) {
		"use strict";

		var oModel;
		var messages;
		var that;
		return Controller.extend("sap.suite.ui.commons.sample.TimelineTextHeight.Timeline", {

			loadMessages: function (globalController, pModel, crNum) {
				that = this;
				oModel = pModel;
				var filter = new sap.ui.model.Filter("CrNum", sap.ui.model.FilterOperator.EQ, crNum + '"');
				var aFilters = [filter];
				oModel.read("/CommentSet", {
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

				var oDate = new Date();
				for (var i = 0; i < messages.length; i++) {
					aData.Items.push({
						Date: new Date(messages[i].CommentDate),
						Title: i + "",
						Text: messages[i].Note,
						UserName: 'User'//messages[i].FirstName + ', ' + messages[i].Surname
					});
				}

				var lModel = new JSONModel(aData);
				globalController.getView().setModel(lModel);
				globalController._timeline = this.byId("idTimeline");
			},
			onPressItems: function (evt) {
				MessageToast.show("The TimelineItem is pressed.");
			},
			sliderChanged: function (oEvent) {
				this.byId("idPanel").setHeight(oEvent.getParameter("value") + "px");
			}
		});
	});