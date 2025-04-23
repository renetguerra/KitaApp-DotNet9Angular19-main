import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { filter, firstValueFrom, switchMap } from "rxjs";
import { AccountService } from "../_services/account.service";
import { NotificationService } from "../_services/notification.service";
import { NotificationSheetComponent } from "../sheet/notification-sheet/notification-sheet.component";
import { Member } from "../_models/member";
import { BsModalService } from "ngx-bootstrap/modal";
import { NotificationsModalComponent } from "../modals/notifications-modal/notifications-modal.component";


@Injectable({ providedIn: 'root' })
export class NotificationStore {
  
  private accountService = inject(AccountService);
  private notificationService = inject(NotificationService);
  private _bottomSheet = inject(MatBottomSheet);

  private modalService = inject(BsModalService);

  readonly user = signal(this.accountService.currentUser());
  readonly username = computed(() => this.user()?.username ?? '');

  private triggerLoad = signal(false);

  readonly assignedNotifications = toSignal(
    toObservable(this.username).pipe(
      filter(username => !!username),
      switchMap(username => this.notificationService.getAssignedNotifications(username))
    ),
    { initialValue: [] }
  );

  readonly availableNotifications = toSignal(
    toObservable(this.triggerLoad).pipe(
      filter(load => load === true),
      switchMap(() => this.notificationService.getAvailablesNotifications())
    ),
    { initialValue: [] }
  );

  readonly isLoaded = computed(() => this.availableNotifications().length > 0);

  constructor() {
    effect(() => {
      const notifications = this.assignedNotifications();
      if (notifications.length > 0) {
        this._bottomSheet.open(NotificationSheetComponent, {
          disableClose: true,
          data: {
            username: this.username(),
            assignedNotifications: notifications
          }
        });
      }
    });
  }

  async openNotificationsModal(member: Member) {
    const notifications = await firstValueFrom(this.notificationService.getAvailablesNotifications());

    this.modalService.show(NotificationsModalComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        username: member.username,
        availableNotifications: notifications,
        selectedNotifications: []
      }
    });
  }

  loadAvailableNotifications() {
    this.triggerLoad.set(true);
  }

  clear() {
    this.triggerLoad.set(false);
  }
}
