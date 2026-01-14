import { Component, Input } from "@angular/core";
import { BaseView } from "../../../base.view";
import { AuthService } from "../../../../../auth/services/auth.service";
import { UserInfoDto } from "../../../../models/user-info.dto";
import { getUserRoleEnumLabel, UserRoleEnum } from "../../../../../auth/models/enum/user-role.enum";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styles: ``,
})
export class HeaderComponent extends BaseView {
    USER_ROLE = UserRoleEnum;
    @Input() sidebar!: SidebarComponent;


    toggleSidebar(): void {
        if (this.sidebar) {
            this.sidebar.toggleSidebar();
        }
    }

    constructor(private readonly authService: AuthService, private readonly offcanvasService: NgbOffcanvas) {
        super();
    }

    public get userInfo(): UserInfoDto {
        return this.authService.userInfo;
    }
    public get userRoleLabel(): string {
        return getUserRoleEnumLabel(this.userInfo?.role);
    }

    onLogout(): void {
        this.authService.logout();
    }
}
