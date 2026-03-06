export interface CreateUserRequestDto {
  name: string
  email: string
  password: string
  team_id: number
  role: "ADMIN" | "USER"

}