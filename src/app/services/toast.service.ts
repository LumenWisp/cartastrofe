import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  showSuccessToast(title: string, description: string) {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: description,
      life: 3000
    });
  }

  showErrorToast(title: string, description: string) {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: description,
      life: 3000
    });
  }
}
