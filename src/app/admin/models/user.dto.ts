import { TeamDto } from "./spreadsheet.dto";
import { ClientDto } from "./client.dto";

export class UserResponseDto {
    id: number;
    name: string;
    email: string;
    role: string;
    team: TeamDto;
    client: ClientDto;
}