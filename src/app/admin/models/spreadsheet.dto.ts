
export class SpreadSheetDto {
    id: string;
    name: number;
    team: TeamDto;
    service: string;
    status: string;
    createdAt: Date;
    teamName: String
}

export class SpreadSheetRequestParamsDto {
    limit: number;
    page: number;
    search?: string;
    status?: string;
}

export class TeamDto{
    id: number;
    name: string;
}

export class SpreadSheetDetailsDto {
    id: string;
    name: string;
    columns: string[];
    rows: SpreadsheetRowDto[];
    page: number;
    limit: number;
    total: number
}

export class SpreadsheetRowDto {
  id: number;
  [key: string]: any;
}

export class SpreadsheetContext {
    id: string;
}