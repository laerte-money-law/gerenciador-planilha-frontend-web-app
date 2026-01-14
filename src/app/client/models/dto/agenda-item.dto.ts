export interface AgendaItemDto {
  title: string;
  insuredDocument: string;
  policyNumber: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  color: string | null; // "red" | "yellow" | null
}