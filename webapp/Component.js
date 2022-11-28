sap.ui.define(
    ["sap/suite/ui/generic/template/lib/AppComponent"],
    function (Component) {
        "use strict";

        return Component.extend("NYX.bsincrv01.Component", {
            metadata: {
                manifest: "json",
                dependencies: {
                    libs: ["sap.m",
                        "sap.se.mi.plm.lib.attachmentservice"
                    ],
                    components: [
                        "sap.se.mi.plm.lib.attachmentservice.attachment.components.stcomponent"
                    ]
                }
            }
        });
    }
);