sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/ToolbarSpacer",
	"sap/ui/table/Row",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageToast, ToolbarSpacer, TableRow, Fragment) {
	"use strict";
	return Controller.extend("NYX.bsincrv01.ext.controller.TaskTable", {
		onInit: function(){
			// Initiate the Dialog
			Fragment.load({
				name: 'NYX.bsincrv01.ext.fragment.CreateTask_Dialog',
				controller: this,
			}).then(function (oDialog) {
				this._oDialogCreateTask = oDialog;
				this.getView().addDependent(this._oDialogCreateTask);
			}.bind(this));
		},
		getSelectedRowContext: function (sTableId, fnCallback) {
			var oTable = this.byId(sTableId);
			var iSelectedIndex = oTable.getSelectedIndex();

			if (iSelectedIndex === -1) {
				MessageToast.show("Please select a row!");
				return;
			}

			var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
			if (oSelectedContext && fnCallback) {
				fnCallback.call(this, oSelectedContext, iSelectedIndex, oTable);
			}

			return oSelectedContext;
		},

		onDragStart: function (oEvent) {
			var oDraggedRow = oEvent.getParameter("target");
			var oDragSession = oEvent.getParameter("dragSession");

			// keep the dragged row context for the drop action
			oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext());
		},

		onDropTable1: function (oEvent) {
			var oModel = this.getOwnerComponent().getModel();
			var newTask = {};
			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			if (!oDraggedRowContext) {
				return;
			}
			var sPath = oDraggedRowContext.sPath;
			newTask.TaskStatus = "In Process";
			oModel.update(sPath, newTask, {
				method: "PUT",
				success: function () {
					oModel.refresh();
				},
				error: function (error) {
					alert(error);
				}
			})

		},

		moveToTable1: function () {
			this.getSelectedRowContext("table2", function (oSelectedRowContext) {
				var oModel = this.getOwnerComponent().getModel();
				var newTask = {};
				var sPath = oSelectedRowContext.sPath;
				newTask.TaskStatus = "In Process";
				oModel.update(sPath, newTask, {
					method: "PUT",
					success: function () {
						oModel.refresh();
					},
					error: function (error) {
						alert(error);
					}
				});
				var oTable2 = this.byId("table2");
				oTable2.setSelectedIndex( -1 );
			});
		},

		onDropTable2: function (oEvent) {
			var oModel = this.getOwnerComponent().getModel();
			var newTask = {};
			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			if (!oDraggedRowContext) {
				return;
			}
			var sPath = oDraggedRowContext.sPath;
			newTask.TaskStatus = "Done";
			oModel.update(sPath, newTask, {
				method: "PUT",
				success: function () {
					oModel.refresh();
				},
				error: function (error) {
					alert(error);
				}
			})

		},

		moveToTable2: function () {
			this.getSelectedRowContext("table1", function (oSelectedRowContext) {
				var oModel = this.getOwnerComponent().getModel();
				var newTask = {};
				var sPath = oSelectedRowContext.sPath;
				newTask.TaskStatus = "Done";
				oModel.update(sPath, newTask, {
					method: "PUT",
					success: function () {
						oModel.refresh();
					},
					error: function (error) {
						alert(error);
					}
				})
				var oTable1 = this.byId("table1");
				oTable1.setSelectedIndex( -1 );
			});
		},
		onAddTaskClick: function(){
			this._oDialogCreateTask.open();
		},
		onDeleteTaskClick: function(){

		},
		onOKClick: function(){
			var taskText = this._oDialogCreateTask.getContent()[0].getContent()[1]._lastValue;
			var assignedTeam = this._oDialogCreateTask.getContent()[0].getContent()[3].getSelectedKey();
			
			// Create a new Task
		},
		onCancelClick: function(){
			this._oDialogCreateTask.close();
		}
	});

});