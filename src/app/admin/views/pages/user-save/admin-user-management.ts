import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UsersService } from "src/app/admin/services/users.service";
import { UserResponseDto } from "src/app/admin/models/user.dto";
import { AdminUserModalComponent } from "./admin-user.modal";
import { PaginationSpreadsheet } from "src/app/shared/utils/pagination-spreadsheet";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "admin-user-management-page",
  templateUrl: "./admin-user-management.html",
})
export class AdminUsersManagementPage implements OnInit {

  allRecords: UserResponseDto[] = [];
  pagination: PaginationSpreadsheet<UserResponseDto> = new PaginationSpreadsheet([], 0, 1, 10);
  page = 1;
  limit = 15;
  total = 0;

  constructor(
    private readonly usersService: UsersService,
    private readonly modalService: NgbModal,
    private readonly spinner: NgxSpinnerService,

  ) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    const filter = {
      limit: this.limit,
      page: this.page
    };

    this.usersService
    .findAllUsers(filter)
    .subscribe({
        next: (response) => {
            this.allRecords = response.data

            this.pagination = new PaginationSpreadsheet(
                response.data,
                response.total,
                response.page,
                response.limit
            );
            this.spinner.hide()

        },
         error: (e) => {

            this.spinner.hide()

            throw e
        }

    });

  }

  openCreateUserModal(): void {

    const modalRef = this.modalService.open(AdminUserModalComponent, {
      centered: true,
      size: "lg"
    });

    modalRef.result.then((saved) => {
      if(saved) this.loadRecords();
    }).catch(()=>{});

  }

  onEditUser(user: UserResponseDto): void {

    const modalRef = this.modalService.open(AdminUserModalComponent, {
      centered: true,
      size: "lg"
    });

    modalRef.componentInstance.user = user;

    modalRef.result.then((saved) => {
      if(saved) this.loadRecords();
    }).catch(()=>{});

  }

  onDeleteClientUser(userId: number): void {
    if(!confirm("Tem certeza que deseja excluir este usuário?")){
        return;
    }

  this.usersService.deleteUser(userId).subscribe({
     next: () => {
        if (
        this.pagination.getPage().length === 1 &&
        this.page > 1
        ) {
        this.page--;
        }

        this.loadRecords();
    },
     error: (e) => {
        this.spinner.hide()
        throw e
    }

    });

}

goToNextPage(): void {
  this.page = this.pagination.goToNextPage()
  this.loadRecords()

}

goToPreviousPage(): void {
  this.page = this.pagination.goToPreviousPage()
  this.loadRecords()
}

goToPage(page: number): void {
  this.page = this.pagination.goToPage(page)
  this.loadRecords()
}

}