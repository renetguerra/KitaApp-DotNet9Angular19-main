import { Component, HostListener, OnInit, inject, viewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/core/_models/member';
import { AccountService } from 'src/app/core/_services/account.service';
import { TimeagoModule } from 'ngx-timeago';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GalleryModule } from 'ng-gallery';
import { MemberStore } from 'src/app/core/_stores/member.store';
import { PhotoStore } from 'src/app/core/_stores/photo.store';
import { PhotoEditorComponent } from '../../components/member-photo/photo-editor/photo-editor.component';
import { PhotoDeleteComponent } from '../../components/member-photo/photo-delete/photo-delete.component';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css'],
    imports: [TabsModule, FormsModule, DatePipe, TimeagoModule, GalleryModule,
      MatDialogModule, MatIconModule, MatButtonModule,
    ]
})
export class MemberEditComponent implements OnInit  {

  private accountService = inject(AccountService);  
  private toastr = inject(ToastrService);
  readonly dialog = inject(MatDialog);

  private memberStore = inject(MemberStore);
  private photoStore = inject(PhotoStore);
  
  editForm = viewChild<NgForm>('editForm');
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm()?.dirty) {
      $event.returnValue = true;
    }
  }

  user = this.accountService.currentUser();
  member = this.memberStore.member;

  galleryImages = this.photoStore.galleryImages;

  ngOnInit(): void {   
    const memberValue = this.member();
    if (memberValue) {
      this.memberStore.setMember(memberValue);
    }
  }    
  
  updateMember() {
    const formValue = this.editForm()?.value;
    if (!formValue) return;

    const current = this.member();
    if (!current) return;

    const updatedMember: Member = {
      ...current,
      ...formValue      
    };

    this.memberStore.updateMember(updatedMember).subscribe({
      next: () => {        
        this.toastr.success('Profile updated successfully');
        this.editForm()?.reset(updatedMember);
      }
    });
  }
  
  openDialogAddPhoto() {    
    this.dialog.open(PhotoEditorComponent, {
      data: this.member()
    });    
  }
  
  openDialogDeletePhoto() {        
    this.dialog.open(PhotoDeleteComponent, {
      data: this.member()
    });            
  }
}