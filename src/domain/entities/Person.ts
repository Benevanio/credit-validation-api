export class Person {
  constructor(
    public readonly id: number,
    public readonly cpf: string,
    public readonly name: string,
    public readonly birthDate: Date,
    public readonly email: string,
    public readonly phone?: string,
    public readonly address?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  static create(data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Omit<Person, 'id'> {
    return {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  isValidCPF(): boolean {
    const cpf = this.cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;

    return true;
  }
}
