import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { filter, firstValueFrom, switchMap } from "rxjs";
import { AccountService } from "../_services/account.service";
import { NotificationService } from "../_services/notification.service";
import { Member } from "../_models/member";
import { BsModalService } from "ngx-bootstrap/modal";
import { MemberStore } from "./member.store";
import { NotificationSheetComponent } from "src/app/features/sheet/notification-sheet/notification-sheet.component";
import { NotificationsModalComponent } from "src/app/features/modals/notifications-modal/notifications-modal.component";


@Injectable({ providedIn: 'root' })
export class NotificationStore {
  
  private accountService = inject(AccountService);
  private notificationService = inject(NotificationService);
  private _bottomSheet = inject(MatBottomSheet);

  private modalService = inject(BsModalService);

  private memberStore = inject(MemberStore);

  readonly user = computed(() => this.accountService.currentUser());
  readonly username = computed(() => this.user()?.username ?? '');
  
  private triggerLoadAssigned = signal(false);
  private triggerLoadAvailable = signal(false);

  readonly assignedNotifications = toSignal(
    toObservable(this.triggerLoadAssigned).pipe(
      filter(load => load === true),
      switchMap(() => this.notificationService.getAssignedNotifications(this.username()))
    ),
    { initialValue: [] }
  );

  readonly assignedNotificationsCount = computed(() => this.assignedNotifications().length);

  readonly availableNotifications = toSignal(
    toObservable(this.triggerLoadAvailable).pipe(
      filter(load => load === true),
      switchMap(() => this.notificationService.getAvailablesNotifications())
    ),
    { initialValue: [] }
  );

  readonly isLoaded = computed(() => this.availableNotifications().length > 0);

  constructor() {
    
    effect(() => {      
      const notifications = this.assignedNotifications();      
      if (this.user() &&  notifications.length > 0) {
        this.openNotificationSheet();
      }              
    });
  }  

  openNotificationSheet() {
    this.triggerLoadAssigned.set(true);
    const assignedNotifications = this.assignedNotifications();
    
    this._bottomSheet.open(NotificationSheetComponent, {
      disableClose: true,
      data: {
        username: this.username(),
        assignedNotifications: assignedNotifications
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

  loadAssignedNotifications() {
    this.triggerLoadAssigned.set(true);    
  }

  loadAvailableNotifications() {
    this.triggerLoadAvailable.set(true);
  }

  clear() {
    this.triggerLoadAssigned.set(false);
    this.triggerLoadAvailable.set(false);
  }
}
