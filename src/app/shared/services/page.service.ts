import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PageRoute } from "../models/page-route";

@Injectable({
    providedIn: "root",
})
export class PageService {
    constructor() {}

    private breadcrumpsSubject = new BehaviorSubject<PageRoute[]>([]);
    breadcrumbs$ = this.breadcrumpsSubject.asObservable();

    setToolbar(breadcrumbs: PageRoute[]) {
        this.breadcrumpsSubject.next(breadcrumbs);
    }
}
