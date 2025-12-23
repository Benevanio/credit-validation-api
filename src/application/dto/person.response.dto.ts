
export interface PersonResponseDTO {
  id: number;
  cpf: string;
  name: string;
  birthDate: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}
