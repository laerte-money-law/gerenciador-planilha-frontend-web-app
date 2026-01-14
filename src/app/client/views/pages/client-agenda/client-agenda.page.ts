import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDatepicker, NgbDateStruct, NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

import { BaseAppPageView } from 'src/app/shared/views/base-app-page.view';
import { PageRoute } from 'src/app/shared/models/page-route';
import {
  ClientPolicyService,
  AgendaFilter,
  AgendaItemDto,
  AgendaResponseDto
} from 'src/app/client/services/client-policy.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';
import { daysRemaining, endOfMonth, fromDate, parseIsoLocalDate, startOfDay, startOfMonth, toDate, toIsoDate } from 'src/app/shared/utils/dates.utils';
import { addDays } from '@fullcalendar/core/internal';
import { RemotePagination } from 'src/app/shared/services/remote-pagination';


type StatusName = 'Vencida' | 'A vencer';

type ListedPolicyEvent = {
  date: Date;
  title: string;
  colorClass: 'danger' | 'warning' | 'secondary';
  statusName: StatusName;
  daysRemaining: number;
  extendedProps: {
    policy: { insured?: { document?: string }, policyNumber?: string };
    expiration: Date;
  };
};

const COLOR_DUE = '#DC3545'; 
const COLOR_D90 = '#FFC107';

@Component({
  selector: 'client-agenda-page',
  templateUrl: './client-agenda.page.html',
})
export class ClientAgendaPage extends BaseAppPageView implements OnInit {
  @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;
  @ViewChild('miniCalendar', { static: false }) miniCalendar!: NgbDatepicker;

  override getBreadcrumbs(): PageRoute[] {
    return [new PageRoute(this.URLS.PATHS.CLIENT.AGENDA.ROOT(), 'Agenda', 'Agenda')];
  }
  

  //backend filter (daily policy table)
  showOverDue = true;
  showToExpire = true;
  agendaFilter: AgendaFilter = 'all';

  // pagination table (daily policy table)
  page = 1;
  limit = 15;
  totalItems = 0;
  pagination = new RemotePagination<ListedPolicyEvent>((p) => this.loadAgenda(p));

  // selected day (daily policy table)
  selectedDate: NgbDateStruct = fromDate(new Date());

  selectedPolicies: ListedPolicyEvent[] = [];

  private viewStart!: Date;
  private viewEnd!: Date;
  private viewAnchor!: Date; //some day in the current month 
  private hasSeenFirstMiniNavigate = false;

  // Cache to dots by month (chave: YYYY-M)
  private monthDotsCache = new Map<string, AgendaItemDto[]>();
  private monthKey(viewStart: Date) {
    return `${viewStart.getFullYear()}-${viewStart.getMonth() + 1}`;
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    locale: ptBrLocale,
    timeZone: 'local',
    events: [],
    dateClick: (info) => this.onCalendarDayClick(info.date),
    datesSet: (args) => this.onCalendarDatesSet(args),
    height: 'auto',
    eventDisplay: 'list-item',
    dayMaxEvents: 3,
    moreLinkClick: 'popover',
    moreLinkContent: (arg) => `+${arg.num}`,
  };

  constructor(
    private readonly clientPolicyService: ClientPolicyService,
    private readonly authService: AuthService,
    private readonly notifier: NotificationService,
    private readonly router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.reconcileCheckboxesToFilter();
    this.loadAgenda(1);

    const today = startOfDay(new Date());
    this.viewAnchor = today; 
    this.loadMonthDots(this.viewAnchor);
  }

  private reconcileCheckboxesToFilter(): void {
    const both = this.showOverDue && this.showToExpire;
    const none = !this.showOverDue && !this.showToExpire;
    if (both) { this.agendaFilter = 'all'; return; }
    if (none) {
      this.agendaFilter = 'all';
      this.selectedPolicies = [];
      this.totalItems = 0;
      return;
    }
    this.agendaFilter = this.showOverDue ? 'dueOnDay' : 'upcoming';
  }

  onCheckboxChange(): void {
    this.reconcileCheckboxesToFilter();
    if (!this.showOverDue && !this.showToExpire) return;
    this.loadAgenda(1); 
  }

  private loadAgenda(goToPage?: number): void {
    const clientCode = this.authService?.userClientInfo?.clientCode;
    if (!clientCode) {
      this.notifier.showError('Não foi possível identificar o cliente para carregar a agenda.');
      return;
    }
    if (goToPage) this.page = goToPage;

    const date = toIsoDate(toDate(this.selectedDate));
    this.getFilteredPolicyListAPI(clientCode, this.limit, this.page, date)
  }

  private applyAgendaResponse(resp: AgendaResponseDto): void {
    const { data, meta } = resp;
    const refDate = toDate(this.selectedDate);
    const items = (data ?? []).map((it) => this.mapAgendaItemToListed(it, refDate));
    this.selectedPolicies = items;
    this.pagination.sync(items, { page: meta?.page ?? 1, pageCount: meta?.pageCount ?? 1 });
    this.totalItems = meta?.totalItems ?? items.length;
  }

  private mapAgendaItemToListed(item: AgendaItemDto, reference: Date): ListedPolicyEvent {
    const expiration = parseIsoLocalDate(item.endDate);
    const colorClass =
      item.color === 'red' ? 'danger' :
      item.color === 'yellow' ? 'warning' : 'secondary';

    const statusName: StatusName = (item.color === 'red') ? 'Vencida' : 'A vencer';

    const policyObj = {
      insured: { document: item.insuredDocument },
      policyNumber: item.policyNumber
    };

    return {
      title: item.title,
      date: expiration,
      colorClass,
      statusName,
      daysRemaining: daysRemaining(expiration, reference),
      extendedProps: { policy: policyObj, expiration }
    };
  }

  private loadMonthDots(viewMonthAnchor: Date): void {
    const clientCode = this.authService?.userClientInfo?.clientCode;
    if (!clientCode) return;

    const mStart = startOfMonth(viewMonthAnchor);
    const mEnd   = endOfMonth(viewMonthAnchor);

    const startStr = toIsoDate(mStart);
    const endStr   = toIsoDate(mEnd);

    const key = this.monthKey(mStart);

    const cached = this.monthDotsCache.get(key);
    if (cached) {
      this.applyCalendarDots(cached);
      return;
    }

    this.getPolicyRangeAPI(clientCode, startStr, endStr, key)
  }


  private applyCalendarDots(items: AgendaItemDto[]): void {
    const anchor = this.viewAnchor ?? new Date();
    const monthStart = startOfMonth(anchor);
    const monthEnd   = endOfMonth(anchor);

    const dots: EventInput[] = this.generateDotsCalendarEvent(monthStart, monthEnd, items);
   

    const api = this.fullCalendar?.getApi();
    if (api) {
      api.removeAllEventSources();
      api.addEventSource(dots);
      api.render();
    } else {
      this.calendarOptions = { ...this.calendarOptions, events: dots };
    }
  }

  onDaySelect(date: NgbDateStruct): void {
    this.selectedDate = date;
    this.fullCalendar?.getApi()?.gotoDate(toDate(date));
    this.loadAgenda(1); 
  }

  onCalendarDayClick(date: Date): void {
    this.selectedDate = fromDate(date);
    this.loadAgenda(1); 
  }

  goToToday(): void {
    const today = new Date();
    this.selectedDate = fromDate(today);
    this.fullCalendar?.getApi()?.gotoDate(today);
    this.hasSeenFirstMiniNavigate = false;

    this.monthDotsCache.clear();
    this.viewAnchor = startOfDay(today);
    this.loadMonthDots(this.viewAnchor);
    this.loadAgenda(1);
  }

  onCalendarDatesSet(args: any): void {
    this.viewStart = startOfDay(new Date(args.start));
    this.viewEnd   = startOfDay(new Date(args.end));

    const anchor = new Date(args.start);
    anchor.setDate(anchor.getDate() + 15);
    this.viewAnchor = startOfDay(anchor);

    setTimeout(() => {
      this.miniCalendar?.navigateTo({
        year: this.viewAnchor.getFullYear(),
        month: this.viewAnchor.getMonth() + 1
      });
    });

    this.loadMonthDots(this.viewAnchor);
  }

  onMiniNavigate(ev: NgbDatepickerNavigateEvent): void {
    if (!this.hasSeenFirstMiniNavigate) {
      this.hasSeenFirstMiniNavigate = true;
      return;
    }
    const { year, month } = ev.next;
    const first: NgbDateStruct = { year, month, day: 1 };

    if (!this.selectedDate ||
        this.selectedDate.year !== year ||
        this.selectedDate.month !== month ||
        this.selectedDate.day !== 1) {
      this.selectedDate = first;
      const jsDate = toDate(first);
      this.fullCalendar?.getApi()?.gotoDate(jsDate);
      this.loadAgenda(1);
    }
  }

  onShowPolicyDetailsFromEvent(item: ListedPolicyEvent): void {
    const pol = item?.extendedProps?.policy;
    const insuredDocument = pol?.insured?.document;
    const policyNumber = pol?.policyNumber;

    if (!insuredDocument || !policyNumber) {
      this.notifier.showError('Dados da apólice incompletos para abrir os detalhes.');
      return;
    }

    this.router.navigate([
      this.URLS.PATHS.CLIENT.POLICY.DETAILS(false, String(insuredDocument), String(policyNumber))
    ]);
  }

  private getPolicyRangeAPI(clientCode, startStr, endStr, key){
    this.clientPolicyService.getAgendaRange(clientCode, {
    startDate: startStr,
    endDate: endStr,
  }).subscribe({
      next: (resp) => {
        const items: AgendaItemDto[] = Array.isArray(resp) ? resp : (resp?.data ?? []);
        this.monthDotsCache.set(key, items);
        this.applyCalendarDots(items);
      },
      error: (err) => {
        console.error('agenda range error', err);
        this.applyCalendarDots([]);
      }
    });
  }

  private getFilteredPolicyListAPI(clientCode, limit, page, date){
    this.clientPolicyService.getAgenda(clientCode, {
      limit: limit,
      page: page,
      date,
      filter: this.agendaFilter,
    }).subscribe({
      next: (resp: AgendaResponseDto) => this.applyAgendaResponse(resp),
      error: (err) => {
        console.error('Erro ao carregar agenda', err);
        this.notifier.showError('Erro ao carregar agenda. Tente novamente.');
        this.selectedPolicies = [];
        this.pagination.sync([], { page: 1, pageCount: 1 });
        this.totalItems = 0;
      }
    });
  }

  private generateDotsCalendarEvent( monthStart, monthEnd, items): EventInput[]{
     const dots: EventInput[] = [];
     
     for (const it of items) {
      const exp = startOfDay(parseIsoLocalDate(it.endDate));
      const dMinus90 = addDays(exp, -90);

      if (exp >= monthStart && exp <= monthEnd) {
        dots.push({
          start: exp,               
          allDay: true,
          display: 'list-item',
          title: it.title,
          backgroundColor: COLOR_DUE,
          borderColor: COLOR_DUE,
          color: COLOR_DUE,
          extendedProps: { policyNumber: it.policyNumber, insuredDocument: it.insuredDocument }
        });
      }

      if (dMinus90 >= monthStart && dMinus90 <= monthEnd) {
        dots.push({
          start: dMinus90,
          allDay: true,
          display: 'list-item',
          title: it.title,
          backgroundColor: COLOR_D90,
          borderColor: COLOR_D90,
          color: COLOR_D90,
          extendedProps: { policyNumber: it.policyNumber, insuredDocument: it.insuredDocument }
        });
      }
    }
    return dots;
  }
}
