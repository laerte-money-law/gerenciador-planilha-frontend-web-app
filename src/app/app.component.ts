import { Component, OnInit } from "@angular/core";
import packageJson from "../../package.json";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styles: [],
})
export class AppComponent implements OnInit {
    public version: string = packageJson.version;
    title = "money-law-insurance-frontend-web-app";

    ngOnInit(): void {
        console.log(`Money Law Insurance: frontend-web-app v${this.version}`);
    }
}
