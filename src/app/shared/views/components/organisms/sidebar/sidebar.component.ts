import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { getUserRoleEnumLabel, UserRoleEnum } from 'src/app/auth/models/enum/user-role.enum';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BaseView } from '../../../base.view';
import { UserInfoDto } from 'src/app/shared/models/user-info.dto';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``,
})
export class SidebarComponent extends BaseView {
    USER_ROLE = UserRoleEnum;
    isSidebarCollapsed = true;
    isMobile = false;

    constructor(private readonly authService: AuthService, private readonly offcanvasService: NgbOffcanvas) {
        super();
    }

    public get userInfo(): UserInfoDto {
        return this.authService.userInfo;
    }
    public get userRoleLabel(): string {
        return getUserRoleEnumLabel(this.userInfo?.role);
    }


    onDismissSidebar(): void {
        this.offcanvasService.dismiss();
    }

    onLogout(): void {
        this.authService.logout();
    }
    toggleSidebar(): void {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }

    expandSidebar(): void {
        if (!this.isMobile) {
            this.isSidebarCollapsed = false;
        }
    }

    collapseSidebar(): void {
        if (!this.isMobile) {
            this.isSidebarCollapsed = true;
        }
    }

    ngOnInit(): void {
        this.isMobile = window.innerWidth <= 991;

        if (!this.userInfo) {
            this.authService.isLoggedIn(); // Isso já chama setUserInfoFromToken() internamente
        }
    }


}
