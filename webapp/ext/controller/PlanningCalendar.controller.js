sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast'
],
    function (Controller, JSONModel, MessageToast) {
        "use strict";

        return Controller.extend("NYX.bsincrv01.ext.controller.PlanningCalendar", {

            onInit: function () {
                // create model
                var oModel = new JSONModel();
                oModel.setData({
                    startDate: new Date("2017", "10", "13", "8", "0"),
                    people: [
                        {
                            pic: "test-resources/sap/ui/documentation/sdk/images/John_Miller.png",
                            name: "John Miller",
                            role: "team member",
                            appointments: [
                                {
                                    start: new Date("2017", "10", "13", "08", "00"),
                                    end: new Date("2017", "10", "13", "09", "00"),
                                    title: "Team sync",
                                    info: "Canteen",
                                    type: "Type07",
                                    pic: "sap-icon://family-care"
                                },
                                {
                                    start: new Date("2017", "10", "13", "09", "0"),
                                    end: new Date("2017", "10", "13", "11", "0"),
                                    title: "Morning Sync",
                                    info: "I call you",
                                    type: "Type01",
                                    pic: "sap-icon://call"
                                },
                                {
                                    start: new Date("2017", "10", "13", "10", "00"),
                                    end: new Date("2017", "10", "13", "12", "00"),
                                    title: "Sync Bill",
                                    info: "Online",
                                    type: "Type03"
                                },
                                {
                                    start: new Date("2017", "10", "13", "10", "00"),
                                    end: new Date("2017", "10", "13", "13", "00"),
                                    title: "Check Flights",
                                    info: "no room",
                                    type: "Type09",
                                    pic: "sap-icon://flight"
                                },
                                {
                                    start: new Date("2017", "10", "13", "13", "00"),
                                    end: new Date("2017", "10", "13", "14", "00"),
                                    title: "Lunch",
                                    info: "canteen",
                                    type: "Type05",
                                    pic: "sap-icon://private"
                                },
                                {
                                    start: new Date("2017", "10", "13", "18", "00"),
                                    end: new Date("2017", "10", "13", "20", "00"),
                                    title: "Discussion of the plan",
                                    info: "Online meeting",
                                    type: "Type04"
                                },
                                {
                                    start: new Date("2017", "10", "14", "03", "00"),
                                    end: new Date("2017", "10", "14", "23", "00"),
                                    title: "Deadline",
                                    type: "Type05"
                                },
                                {
                                    start: new Date("2017", "10", "14", "09", "00"),
                                    end: new Date("2017", "10", "14", "14", "00"),
                                    title: "Blocker",
                                    info: "room 6",
                                    type: "Type08"
                                },
                                {
                                    start: new Date("2017", "10", "17", "09", "00"),
                                    end: new Date("2017", "10", "17", "18", "00"),
                                    title: "Boss Birthday",
                                    type: "Type02"
                                },
                                {
                                    start: new Date("2017", "10", "24", "09", "00"),
                                    end: new Date("2017", "10", "24", "18", "00"),
                                    title: "Urgent Planning",
                                    type: "Type08"
                                },
                                {
                                    start: new Date("2017", "10", "20", "01", "00"),
                                    end: new Date("2017", "10", "20", "23", "00"),
                                    title: "Planning",
                                    type: "Type09"
                                }
                            ]
                        }
                    ]
                });
                this.getView().setModel(oModel);

            },
            handleAppointmentDrop: function (oEvent) {
                var oAppointment = oEvent.getParameter("appointment"),
                    oStartDate = oEvent.getParameter("startDate"),
                    oEndDate = oEvent.getParameter("endDate"),
                    oCalendarRow = oEvent.getParameter("calendarRow"),
                    bCopy = oEvent.getParameter("copy"),
                    sTitle = oAppointment.getTitle(),
                    oModel = this.getView().getModel(),
                    oAppBindingContext = oAppointment.getBindingContext(),
                    oRowBindingContext = oCalendarRow.getBindingContext(),
                    handleAppointmentDropBetweenRows = function () {
                        var aPath = oAppBindingContext.getPath().split("/"),
                            iIndex = aPath.pop(),
                            sRowAppointmentsPath = aPath.join("/");

                        oRowBindingContext.getObject().appointments.push(
                            oModel.getProperty(oAppBindingContext.getPath())
                        );

                        oModel.getProperty(sRowAppointmentsPath).splice(iIndex, 1);
                    };

                if (bCopy) { // "copy" appointment
                    var oProps = Object.assign({}, oModel.getProperty(oAppointment.getBindingContext().getPath()));
                    oProps.start = oStartDate;
                    oProps.end = oEndDate;

                    oRowBindingContext.getObject().appointments.push(oProps);
                } else { // "move" appointment
                    oModel.setProperty("start", oStartDate, oAppBindingContext);
                    oModel.setProperty("end", oEndDate, oAppBindingContext);

                    if (oAppointment.getParent() !== oCalendarRow) {
                        handleAppointmentDropBetweenRows();
                    }
                }

                oModel.refresh(true);

                MessageToast.show(oCalendarRow.getTitle() + "'s '" + "Appointment '" + sTitle + "' now starts at \n" + oStartDate + "\n and end at \n" + oEndDate + ".");
            },

            handleAppointmentResize: function (oEvent) {
                var oAppointment = oEvent.getParameter("appointment"),
                    oStartDate = oEvent.getParameter("startDate"),
                    oEndDate = oEvent.getParameter("endDate");
                MessageToast.show("Appointment '" + oAppointment.getTitle() + "' now starts at \n" + oStartDate + "\n and end at \n" + oEndDate + ".");
                oAppointment
                    .setStartDate(oStartDate)
                    .setEndDate(oEndDate);
            },

            handleAppointmentCreate: function (oEvent) {
                var oStartDate = oEvent.getParameter("startDate"),
                    oEndDate = oEvent.getParameter("endDate"),
                    oPlanningCalendarRow = oEvent.getParameter("calendarRow"),
                    oModel = this.getView().getModel(),
                    sPath = oPlanningCalendarRow.getBindingContext().getPath();

                oModel.getProperty(sPath).appointments.push({
                    title: "New Appointment",
                    start: oStartDate,
                    end: oEndDate
                });

                MessageToast.show("New Appointment is created at \n" + oStartDate + "\n and end at \n" + oEndDate + ".");

                oModel.refresh(true);
            }

        });

    });
