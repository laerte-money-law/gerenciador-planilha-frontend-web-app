import { Component, Input, OnInit } from "@angular/core";
import { BaseView } from "src/app/shared/views/base.view";

@Component({
    selector: "admin-quotation-request-page",
    templateUrl: "./admin-quotation-request.page.html",
    styles: "",
})
export class AdminQuotationRequestPage extends BaseView implements OnInit {
    @Input("clientCode") clientCode: string;

    ngOnInit(): void {
        console.log("ADMIN QUOTATION REQUEST PAGE EXAMPLO AQUI");
        //throw new Error("Method not implemented.");
    }
}
