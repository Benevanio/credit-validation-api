import { describe, expect, it } from 'vitest';
import { DebtResponseDTO } from '../../../src/application/dto/debt.response.dto';

describe('DebtResponseDTO', () => {
  describe('Structure Validation', () => {
    it('should have all required fields', () => {
      const validDto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 5432.5,
        recordsCount: 3,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(validDto).toHaveProperty('cpf');
      expect(validDto).toHaveProperty('status');
      expect(validDto).toHaveProperty('totalAmount');
      expect(validDto).toHaveProperty('recordsCount');
      expect(validDto).toHaveProperty('lastNegativationDate');
      expect(validDto).toHaveProperty('consultedAt');
    });

    it('should accept optional summary field', () => {
      const dtoWithSummary: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 5432.5,
        recordsCount: 3,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        summary: 'Pendências financeiras identificadas',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dtoWithSummary).toHaveProperty('summary');
      expect(dtoWithSummary.summary).toBe('Pendências financeiras identificadas');
    });

    it('should work without optional summary', () => {
      const dtoWithoutSummary: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dtoWithoutSummary.summary).toBeUndefined();
    });
  });

  describe('Field Type Validation', () => {
    it('should have cpf as string', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(typeof dto.cpf).toBe('string');
      expect(dto.cpf).toMatch(/^\d{11}$/);
    });

    it('should have status as string', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 1000,
        recordsCount: 1,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(typeof dto.status).toBe('string');
    });

    it('should have totalAmount as number', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 5432.5,
        recordsCount: 3,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(typeof dto.totalAmount).toBe('number');
    });

    it('should have recordsCount as number', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 1000,
        recordsCount: 3,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(typeof dto.recordsCount).toBe('number');
      expect(dto.recordsCount).toBeGreaterThanOrEqual(0);
    });

    it('should have lastNegativationDate as string or null', () => {
      const dtoWithDate: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 1000,
        recordsCount: 1,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      const dtoWithNull: DebtResponseDTO = {
        cpf: '98765432100',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(typeof dtoWithDate.lastNegativationDate).toBe('string');
      expect(dtoWithNull.lastNegativationDate).toBeNull();
    });

    it('should have consultedAt as string', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(typeof dto.consultedAt).toBe('string');
      expect(dto.consultedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('Status Validation', () => {
    it('should accept INADIMPLENTE status', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 5000,
        recordsCount: 2,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.status).toBe('INADIMPLENTE');
    });

    it('should accept ADIMPLENTE status', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.status).toBe('ADIMPLENTE');
    });
  });

  describe('Amount Validation', () => {
    it('should accept zero amount for ADIMPLENTE', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.totalAmount).toBe(0);
    });

    it('should accept positive amounts for INADIMPLENTE', () => {
      const amounts = [100, 500.5, 1000, 5432.75, 15000];

      amounts.forEach((amount) => {
        const dto: DebtResponseDTO = {
          cpf: '12345678909',
          status: 'INADIMPLENTE',
          totalAmount: amount,
          recordsCount: 1,
          lastNegativationDate: '2025-11-15T00:00:00.000Z',
          consultedAt: '2025-12-24T10:00:00.000Z',
        };

        expect(dto.totalAmount).toBe(amount);
        expect(dto.totalAmount).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle decimal values', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 5432.75,
        recordsCount: 3,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.totalAmount).toBe(5432.75);
      expect(Number.isFinite(dto.totalAmount)).toBe(true);
    });

    it('should handle large amounts', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 999999.99,
        recordsCount: 10,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.totalAmount).toBe(999999.99);
    });
  });

  describe('Records Count Validation', () => {
    it('should accept zero records for ADIMPLENTE', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.recordsCount).toBe(0);
    });

    it('should accept positive counts for INADIMPLENTE', () => {
      const counts = [1, 2, 3, 5, 10];

      counts.forEach((count) => {
        const dto: DebtResponseDTO = {
          cpf: '12345678909',
          status: 'INADIMPLENTE',
          totalAmount: 1000 * count,
          recordsCount: count,
          lastNegativationDate: '2025-11-15T00:00:00.000Z',
          consultedAt: '2025-12-24T10:00:00.000Z',
        };

        expect(dto.recordsCount).toBe(count);
        expect(dto.recordsCount).toBeGreaterThan(0);
      });
    });
  });

  describe('Date Validation', () => {
    it('should accept null for lastNegativationDate when ADIMPLENTE', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.lastNegativationDate).toBeNull();
    });

    it('should accept ISO date string for lastNegativationDate when INADIMPLENTE', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 5000,
        recordsCount: 2,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.lastNegativationDate).toBe('2025-11-15T00:00:00.000Z');
      expect(dto.lastNegativationDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should have consultedAt in ISO format', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.consultedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      const date = new Date(dto.consultedAt);
      expect(date.toISOString()).toBe(dto.consultedAt);
    });

    it('should have consultedAt after lastNegativationDate', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 5000,
        recordsCount: 2,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      const negativation = new Date(dto.lastNegativationDate!);
      const consulted = new Date(dto.consultedAt);

      expect(consulted.getTime()).toBeGreaterThan(negativation.getTime());
    });
  });

  describe('ADIMPLENTE Scenarios', () => {
    it('should represent a person with no debts', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        summary: 'Sem pendências',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.status).toBe('ADIMPLENTE');
      expect(dto.totalAmount).toBe(0);
      expect(dto.recordsCount).toBe(0);
      expect(dto.lastNegativationDate).toBeNull();
      expect(dto.summary).toBe('Sem pendências');
    });

    it('should have consistent data for ADIMPLENTE status', () => {
      const dto: DebtResponseDTO = {
        cpf: '98765432100',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        consultedAt: '2025-12-24T12:00:00.000Z',
      };

      expect(dto.totalAmount).toBe(0);
      expect(dto.recordsCount).toBe(0);
      expect(dto.lastNegativationDate).toBeNull();
    });
  });

  describe('INADIMPLENTE Scenarios', () => {
    it('should represent a person with debts', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 5432.5,
        recordsCount: 3,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        summary: 'Pendências financeiras identificadas',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.status).toBe('INADIMPLENTE');
      expect(dto.totalAmount).toBeGreaterThan(0);
      expect(dto.recordsCount).toBeGreaterThan(0);
      expect(dto.lastNegativationDate).not.toBeNull();
      expect(dto.summary).toBe('Pendências financeiras identificadas');
    });

    it('should handle single debt record', () => {
      const dto: DebtResponseDTO = {
        cpf: '11122233344',
        status: 'INADIMPLENTE',
        totalAmount: 1500.0,
        recordsCount: 1,
        lastNegativationDate: '2025-12-01T00:00:00.000Z',
        summary: '1 registro de inadimplência encontrado',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.recordsCount).toBe(1);
      expect(dto.totalAmount).toBe(1500.0);
    });

    it('should handle multiple debt records', () => {
      const dto: DebtResponseDTO = {
        cpf: '55566677788',
        status: 'INADIMPLENTE',
        totalAmount: 7250.75,
        recordsCount: 5,
        lastNegativationDate: '2025-11-20T10:30:00.000Z',
        summary: '5 registros de inadimplência encontrados',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.recordsCount).toBe(5);
      expect(dto.totalAmount).toBeGreaterThan(7000);
      expect(dto.summary).toContain('5 registros');
    });
  });

  describe('Complete Response Examples', () => {
    it('should create a complete INADIMPLENTE response', () => {
      const completeDto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 5432.5,
        recordsCount: 3,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        summary: 'Pendências financeiras identificadas',
        consultedAt: '2025-12-24T20:05:00.000Z',
      };

      expect(completeDto.cpf).toBe('12345678909');
      expect(completeDto.status).toBe('INADIMPLENTE');
      expect(completeDto.totalAmount).toBe(5432.5);
      expect(completeDto.recordsCount).toBe(3);
      expect(completeDto.lastNegativationDate).toBe('2025-11-15T00:00:00.000Z');
      expect(completeDto.summary).toBeDefined();
      expect(completeDto.consultedAt).toBeDefined();
    });

    it('should create a complete ADIMPLENTE response', () => {
      const completeDto: DebtResponseDTO = {
        cpf: '98765432100',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        summary: 'Sem pendências',
        consultedAt: '2025-12-24T20:05:00.000Z',
      };

      expect(completeDto.cpf).toBe('98765432100');
      expect(completeDto.status).toBe('ADIMPLENTE');
      expect(completeDto.totalAmount).toBe(0);
      expect(completeDto.recordsCount).toBe(0);
      expect(completeDto.lastNegativationDate).toBeNull();
      expect(completeDto.summary).toBe('Sem pendências');
      expect(completeDto.consultedAt).toBeDefined();
    });
  });

  describe('Real-world API Responses', () => {
    it('should simulate successful debt consultation', () => {
      const apiResponse: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 7250.75,
        recordsCount: 2,
        lastNegativationDate: '2025-11-20T10:30:00.000Z',
        summary: '2 registros de inadimplência encontrados',
        consultedAt: '2025-12-24T14:25:30.000Z',
      };

      expect(apiResponse).toBeDefined();
      expect(apiResponse.status).toBe('INADIMPLENTE');
      expect(apiResponse.totalAmount).toBeGreaterThan(0);
    });

    it('should simulate clean record consultation', () => {
      const apiResponse: DebtResponseDTO = {
        cpf: '11122233344',
        status: 'ADIMPLENTE',
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        summary: 'Nenhum registro de inadimplência encontrado',
        consultedAt: '2025-12-24T14:30:00.000Z',
      };

      expect(apiResponse).toBeDefined();
      expect(apiResponse.status).toBe('ADIMPLENTE');
      expect(apiResponse.totalAmount).toBe(0);
      expect(apiResponse.lastNegativationDate).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very recent negativation', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 1000,
        recordsCount: 1,
        lastNegativationDate: '2025-12-23T23:59:59.999Z',
        consultedAt: '2025-12-24T00:00:00.000Z',
      };

      const negativation = new Date(dto.lastNegativationDate!);
      const consulted = new Date(dto.consultedAt);
      const diffMs = consulted.getTime() - negativation.getTime();

      expect(diffMs).toBeGreaterThan(0);
      expect(diffMs).toBeLessThan(1000); // Less than 1 second
    });

    it('should handle old negativation', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 5000,
        recordsCount: 1,
        lastNegativationDate: '2020-01-01T00:00:00.000Z',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      const negativation = new Date(dto.lastNegativationDate!);
      const consulted = new Date(dto.consultedAt);
      const diffYears = consulted.getFullYear() - negativation.getFullYear();

      expect(diffYears).toBeGreaterThan(5);
    });

    it('should handle very large debt amounts', () => {
      const dto: DebtResponseDTO = {
        cpf: '12345678909',
        status: 'INADIMPLENTE',
        totalAmount: 999999999.99,
        recordsCount: 100,
        lastNegativationDate: '2025-11-15T00:00:00.000Z',
        consultedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.totalAmount).toBeGreaterThan(999999999);
      expect(dto.recordsCount).toBe(100);
    });
  });
});
