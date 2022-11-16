sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/ToolbarSpacer",
	"sap/ui/table/Row",
	"jquery.sap.sjax"
], function (Controller, JSONModel, MessageToast, ToolbarSpacer, TableRow, jQuery) {
	"use strict";
	var thisController;
	return Controller.extend("NYX.bsincrv01.ext.controller.TaskTable", {
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
			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			if (!oDraggedRowContext) {
				return;
			}

			// reset the rank property and update the model to refresh the bindings
			this.oProductsModel.setProperty("Rank", this.config.initialRank, oDraggedRowContext);
			this.oProductsModel.refresh(true);
		},

		moveToTable1: function () {
			this.getSelectedRowContext("table2", function (oSelectedRowContext, iSelectedRowIndex, oTable2) {
				// reset the rank property and update the model to refresh the bindings
				this.oProductsModel.setProperty("Rank", this.config.initialRank, oSelectedRowContext);
				this.oProductsModel.refresh(true);

				// select the previous row when there is no row to select
				var oNextContext = oTable2.getContextByIndex(iSelectedRowIndex + 1);
				if (!oNextContext) {
					oTable2.setSelectedIndex(iSelectedRowIndex - 1);
				}
			});
		},

		onDropTable2: function (oEvent) {
			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			if (!oDraggedRowContext) {
				return;
			}

			var oConfig = this.config;
			var iNewRank = oConfig.defaultRank;
			var oDroppedRow = oEvent.getParameter("droppedControl");

			if (oDroppedRow && oDroppedRow instanceof TableRow) {
				// get the dropped row data
				var sDropPosition = oEvent.getParameter("dropPosition");
				var oDroppedRowContext = oDroppedRow.getBindingContext();
				var iDroppedRowRank = oDroppedRowContext.getProperty("Rank");
				var iDroppedRowIndex = oDroppedRow.getIndex();
				var oDroppedTable = oDroppedRow.getParent();

				// find the new index of the dragged row depending on the drop position
				var iNewRowIndex = iDroppedRowIndex + (sDropPosition === "After" ? 1 : -1);
				var oNewRowContext = oDroppedTable.getContextByIndex(iNewRowIndex);
				if (!oNewRowContext) {
					// dropped before the first row or after the last row
					iNewRank = oConfig.rankAlgorithm[sDropPosition](iDroppedRowRank);
				} else {
					// dropped between first and the last row
					iNewRank = oConfig.rankAlgorithm.Between(iDroppedRowRank, oNewRowContext.getProperty("Rank"));
				}
			}

			// set the rank property and update the model to refresh the bindings
			this.oProductsModel.setProperty("Rank", iNewRank, oDraggedRowContext);
			this.oProductsModel.refresh(true);
		},

		moveToTable2: function () {
			this.getSelectedRowContext("table1", function (oSelectedRowContext) {
				var oTable2 = this.byId("table2");
				var oFirstRowContext = oTable2.getContextByIndex(0);

				// insert always as a first row
				var iNewRank = this.config.defaultRank;
				if (oFirstRowContext) {
					iNewRank = this.config.rankAlgorithm.Before(oFirstRowContext.getProperty("Rank"));
				}

				this.oProductsModel.setProperty("Rank", iNewRank, oSelectedRowContext);
				this.oProductsModel.refresh(true);

				// select the inserted row
				oTable2.setSelectedIndex(0);
			});
		},

		moveSelectedRow: function (sDirection) {
			this.getSelectedRowContext("table2", function (oSelectedRowContext, iSelectedRowIndex, oTable2) {
				var iSiblingRowIndex = iSelectedRowIndex + (sDirection === "Up" ? -1 : 1);
				var oSiblingRowContext = oTable2.getContextByIndex(iSiblingRowIndex);
				if (!oSiblingRowContext) {
					return;
				}

				// swap the selected and the siblings rank
				var iSiblingRowRank = oSiblingRowContext.getProperty("Rank");
				var iSelectedRowRank = oSelectedRowContext.getProperty("Rank");
				this.oProductsModel.setProperty("Rank", iSiblingRowRank, oSelectedRowContext);
				this.oProductsModel.setProperty("Rank", iSelectedRowRank, oSiblingRowContext);
				this.oProductsModel.refresh(true);

				// after move select the sibling
				oTable2.setSelectedIndex(iSiblingRowIndex);
			});
		},

		moveUp: function () {
			this.moveSelectedRow("Up");
		},

		moveDown: function () {
			this.moveSelectedRow("Down");
		}
	});

});