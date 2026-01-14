import { PageRoute } from "../models/page-route";
import { BaseFormView } from "./base-form.view";

export abstract class BaseAppPageFormView extends BaseFormView {
    abstract getBreadcrumbs(): PageRoute[];
}
