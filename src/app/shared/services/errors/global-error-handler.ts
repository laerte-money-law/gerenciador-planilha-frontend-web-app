import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, ErrorHandler, Injector } from "@angular/core";
import { ErrorService } from "./error.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}

    handleError(error: any): void {
        const errorService = this.injector.get(ErrorService);
        // Get any necessary services from the injector (e.g., logging service)
        // const loggingService = this.injector.get(LoggingService);

        if (error instanceof HttpErrorResponse) {
            // Handle HTTP errors
            errorService.showNotificationMessage(error);
            console.error("Ocorreu uma exceção do tipo HTTP:", error);
        } else {
            // Handle other errors
            console.error("Ocorreu um erro genérico:", error);
        }

        // You can also perform additional actions like logging errors
        // loggingService.logError(error);
        // or display error messages in a toaster/notification service
        // notificationService.showError('An error occurred');

        // Re-throw the error to ensure Angular's default error handling takes place
        throw error;
    }
}
