import { Component, computed, inject, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HasRoleDirective } from '../_directives/has-role.directive';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
    imports: [RouterLink, RouterLinkActive, HasRoleDirective, BsDropdownModule, FormsModule]
})
export class NavComponent implements OnInit {
  model: any = {}

  private router = inject(Router);
  private toastr = inject(ToastrService);
  private accountService = inject(AccountService);  
  user = computed(() => this.accountService.currentUser());

  constructor() { }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        debugger;
        console.log('Username:', this.model.username);
        this.router.navigateByUrl('/members/' + this.model.username);
        this.model = {}
      }
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

}
