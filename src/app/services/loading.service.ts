// loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  isLoading = false;
  messageLoading = '';

  private timeoutIds: any[] = [];

  show(message: string = '') {
    this.messageLoading = message;
    this.clearTimeouts();
    this.loadingSubject.next(true);
    this.isLoading = true;
  }

  hide() {
    this.clearTimeouts();
    this.loadingSubject.next(false);
    this.isLoading = false;
  }

  // Não sei se tem necessidade, mas adicionei tbm
  showByTime(seconds: number, messages: string[] = ['']) {
    this.show();
    this.clearTimeouts();

    for (let i = 0; i < messages.length; i++) {
      const timeoutId = setTimeout(() => {
        if (!this.isLoading) return;
        
        this.messageLoading = messages[i];
      }, ((seconds * 1000) / messages.length) * i);
      this.timeoutIds.push(timeoutId);
    }

    const hideTimeoutId = setTimeout(() => {
      this.hide();
    }, seconds * 1000);
    this.timeoutIds.push(hideTimeoutId);
  }

  private clearTimeouts() {
    if (this.timeoutIds.length) {
      this.timeoutIds.forEach(id => clearTimeout(id));
      this.timeoutIds = [];
    }
  }
}
