import { PageRoute } from "../models/page-route";
import { BaseView } from "./base.view";

export abstract class BaseAppPageView extends BaseView {
    abstract getBreadcrumbs(): PageRoute[];
}
