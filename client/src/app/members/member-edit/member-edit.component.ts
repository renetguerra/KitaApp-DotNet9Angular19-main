import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild, inject, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { TimeagoModule } from 'ngx-timeago';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PhotoDeleteComponent } from '../photo-delete/photo-delete.component';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';

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
  @ViewChild('editForm') editForm: NgForm | undefined;
  // editForm = viewChild.required<NgForm | undefined>('editForm');
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member = signal<Member | undefined>(undefined);
  user = this.accountService.currentUser();

  galleryImages: GalleryItem[] = [];

  readonly dialog = inject(MatDialog);

  constructor(private memberService: MembersService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadMember();        
  }  

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: member => {
        this.member.set(member)
        this.getImages();       
      }
    })
  }

  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.member());
      }
    })
  }

  getImages() {
    this.galleryImages = this.member()!.userPhotos.map(photo => 
      new ImageItem({ src: photo.url, thumb: photo.url })
    );
  }
  
  openDialogAddPhoto() {
    const dialogRef = this.dialog.open(PhotoEditorComponent, {
      data: this.member()
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getImages();
    });
  }
  
  openDialogDeletePhoto() {    
    const dialogRef = this.dialog.open(PhotoDeleteComponent, {
      data: this.member()
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getImages();
    });
  }
}