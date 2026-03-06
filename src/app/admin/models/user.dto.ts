import { TeamDto } from "./spreadsheet.dto";

export class UserResponseDto {
    id: number;
    name: string;
    email: string;
    role: string;
    team: TeamDto
}