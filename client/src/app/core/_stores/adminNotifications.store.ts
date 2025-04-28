import { Injectable, computed, inject, signal } from "@angular/core";
import { NotificationService } from "../_services/notification.service";
import { Notification } from "../_models/notification";
import { Pagination } from "../_models/pagination";

@Injectable({ providedIn: 'root' })
export class AdminNotificationStore {
  private readonly notificationService = inject(NotificationService);

  private readonly _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  readonly pagination = signal<Pagination | undefined>(undefined);

  constructor() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getAvailablesNotifications().subscribe({
      next: availableNotifications => this._notifications.set(availableNotifications)
    });
  }

  addNotification(notification: Notification) {
    const current = this._notifications();
    this._notifications.set([...current, notification]);
  }

  updateNotification(updated: Notification): void {
    this._notifications.set(
      this.notifications().map(n => n.id === updated.id ? updated : n)
    );
  }

  removeNotification(id: number) {
    this._notifications.set(this._notifications().filter(n => n.id !== id));
  }
}