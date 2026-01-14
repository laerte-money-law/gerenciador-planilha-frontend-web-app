import { Component, EventEmitter, Input, Output } from "@angular/core";
import { BaseView } from "../../../base.view";
import { FileInfoDto } from "../../../../models/file-info.dto";

@Component({
    selector: "app-file-display",
    templateUrl: "./file-display.component.html",
    styles: ``,
})
export class FileDisplayComponent extends BaseView {
    @Input() fileInfo: FileInfoDto;
    @Input() isEditable: boolean = false;
    @Output() replaceFile = new EventEmitter();
    @Output() deleteFile = new EventEmitter();
    @Output() downloadFile = new EventEmitter();

    protected onReplaceFile = (): void => this.replaceFile.emit();
    protected onDeleteFile = (): void => this.deleteFile.emit();
    protected onDownloadFile = (): void => this.downloadFile.emit();
}
