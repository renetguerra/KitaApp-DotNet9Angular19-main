import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { toSignal, toObservable } from "@angular/core/rxjs-interop";
import { filter, switchMap, tap } from "rxjs";
import { AccountService } from "../_services/account.service";
import { CalendarService } from "../_services/calendar.service";
import { MembersService } from "../_services/members.service";
import { Member } from "../_models/member";
import { UserParams } from "../_models/userParams";

@Injectable({ providedIn: 'root' })
export class MemberStore {

    private accountService = inject(AccountService);
    private calendarService = inject(CalendarService);
    private memberService = inject(MembersService);

    readonly user = signal(this.accountService.currentUser());

    private _member = signal<Member | null>(null);
    readonly member = this._member.asReadonly()

    readonly calendarEvents = this.calendarService.getCalendarEventsSignal();

    readonly userParams = signal<UserParams | null>(this.memberService.getUserParams()!);

    readonly membersResponse = toSignal(
        toObservable(this.userParams).pipe(
          filter((params): params is UserParams => !!params),
          switchMap(params =>
            this.memberService.getMembers(params).pipe(
              tap(res => {
                this.memberService.setUserParams(params);
              })
            )
          )
        ),
        { initialValue: { result: [], pagination: undefined } }
      );
      
    readonly members = computed(() => this.membersResponse().result);
    readonly pagination = computed(() => this.membersResponse().pagination);

    readonly memberByUsername = toSignal(
        toObservable(computed(() => this.member()?.username)).pipe(
            filter((username): username is string => !!username),
            switchMap(username => this.memberService.getMember(username))
        ),
        { initialValue: null }
    );

    readonly userCalendars = computed(() => {
        const events = this.calendarEvents();
        const member = this.memberByUsername();

        if (!member || events.length === 0) return [];

        return events.map(event => ({
            userId: member.id,
            calendarId: event.id,
            calendar: event
        }));
    });

    
    readonly updateMember = (member: Member) => {
        return this.memberService.updateMember(member).pipe(
            tap(() => this.setMember(member))
        );
    };

    constructor() {        
        effect(() => {
          const value = this.memberByUsername();
          if (value) this._member.set(value);
        });
      }    

    setUserParams(params: UserParams) {        
        this.userParams.set(structuredClone(params));
        this.memberService.setUserParams(params);
    }
      
    resetFilters() {        
        const resetParams = this.memberService.resetUserParams();
        this.userParams.set(structuredClone(resetParams!));
    }
    
    changePage(page: number) {
        const current = this.userParams();
        if (current && current.pageNumber !== page) {
            const updated = structuredClone(current);
            updated.pageNumber = page;
            this.setUserParams(updated);
        }
    }        
    
    setMember(member: Member) {
        this._member.set(member);        
    }    
}