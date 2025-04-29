import { Routes } from "@angular/router";
import { adminGuard } from "./core/_guards/admin.guard";
import { authGuard } from "./core/_guards/auth.guard";
import { preventUnsavedChangesGuard } from "./core/_guards/prevent-unsaved-changes.guard";
import { memberDetailedResolver } from "./core/_resolvers/member-detailed.resolver";
import { AdminPanelComponent } from "./features/admin/pages/admin-panel/admin-panel.component";
import { NotificationManagementComponent } from "./features/admin/pages/notification-management/notification-management.component";
import { NotFoundComponent } from "./features/errors/not-found/not-found.component";
import { HomeComponent } from "./features/home/home.component";
import { MemberDetailComponent } from "./features/members/pages/member-detail/member-detail.component";
import { MemberEditComponent } from "./features/members/pages/member-edit/member-edit.component";
import { MemberListComponent } from "./features/members/pages/member-list/member-list.component";
import { MenuComponent } from "./features/menu/menu.component";
import { MessagesComponent } from "./features/messages/messages.component";


export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'members', component: MemberListComponent },
            { path: 'members/:username', component: MemberDetailComponent, resolve: { member: memberDetailedResolver } },
            { path: 'member/edit', component: MemberEditComponent, canDeactivate: [preventUnsavedChangesGuard] },            
            { path: 'messages', component: MessagesComponent },
            { path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard] },            
            { path: 'admin-notification', component: NotificationManagementComponent, canActivate: [adminGuard] },            
        ]
    },
    { path: 'menu', component: MenuComponent },    
    { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];