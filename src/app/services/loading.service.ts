// loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private timeoutId: any;

  show() {
    this.clearTimeout();
    this.loadingSubject.next(true);
  }

  hide() {
    this.clearTimeout();
    this.loadingSubject.next(false);
  }

  // Não sei se tem necessidade, mas adicionei tbm
  showByTime(seconds: number) {
    this.show();

    this.timeoutId = setTimeout(() => {
      this.hide();
    }, seconds * 1000);
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
