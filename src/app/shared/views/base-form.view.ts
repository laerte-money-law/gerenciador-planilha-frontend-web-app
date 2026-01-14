import { BaseView } from "./base.view";

export enum FormStateEnum {
    INITIAL = "INITIAL",
    SUBMITION_LOADING = "SUBMITION_LOADING",
    SUBMITTED_SUCCESSFULLY = "SUBMITTED_SUCCESSFULLY",
    SUBMITION_FAILED = "SUBMITION_FAILED",
}

export abstract class BaseFormView extends BaseView {
    protected formState: FormStateEnum = FormStateEnum.INITIAL;
    protected formErrorMessage: string = null;

    constructor() {
        super();
    }

    isFormInInitialState = (formState?: FormStateEnum): boolean =>
        formState ? formState === FormStateEnum.INITIAL : this.formState === FormStateEnum.INITIAL;
    isFormInLoadingState = (formState?: FormStateEnum): boolean =>
        formState ? formState === FormStateEnum.SUBMITION_LOADING : this.formState === FormStateEnum.SUBMITION_LOADING;
    isFormInSuccessState = (formState?: FormStateEnum): boolean =>
        formState ? formState === FormStateEnum.SUBMITTED_SUCCESSFULLY : this.formState === FormStateEnum.SUBMITTED_SUCCESSFULLY;
    isFormInErrorState = (formState?: FormStateEnum): boolean =>
        formState ? formState === FormStateEnum.SUBMITION_FAILED : this.formState === FormStateEnum.SUBMITION_FAILED;
    isFormInEditableState = (formState?: FormStateEnum): boolean =>
        this.isFormInInitialState(formState) || this.isFormInErrorState(formState);

    protected abstract onSubmit(): void;
    protected abstract isFormValid(): boolean;
}
