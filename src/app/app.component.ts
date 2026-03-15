import { Component, OnInit } from "@angular/core";
import packageJson from "../../package.json";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styles: [],
})
export class AppComponent implements OnInit {
    public version: string = packageJson.version;
    title = "money-law-gep-frontend-web-app";

    ngOnInit(): void {
        console.log(`Money Law GEP: frontend-web-app v${this.version}`);
    }
}
