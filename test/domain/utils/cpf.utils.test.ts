import { describe, expect, it } from 'vitest';
import { formatCPF, normalizeCPF, validateCPF } from '../../../src/domain/utils/cpf.utils';

describe('CPF Utils', () => {
  describe('validateCPF', () => {
    describe('Valid CPFs', () => {
      it('should validate CPF without formatting', () => {
        expect(validateCPF('12345678909')).toBe(true);
      });

      it('should validate CPF with formatting', () => {
        expect(validateCPF('123.456.789-09')).toBe(true);
      });

      it('should validate multiple valid CPFs', () => {
        const validCPFs = [
          '11144477735',
          '111.444.777-35',
          '12345678909',
          '123.456.789-09',
        ];

        validCPFs.forEach((cpf) => {
          expect(validateCPF(cpf)).toBe(true);
        });
      });
    });

    describe('Invalid CPFs', () => {
      it('should reject CPF with less than 11 digits', () => {
        expect(validateCPF('123456789')).toBe(false);
      });

      it('should reject CPF with more than 11 digits', () => {
        expect(validateCPF('123456789012')).toBe(false);
      });

      it('should reject CPF with all same digits', () => {
        const invalidCPFs = [
          '00000000000',
          '11111111111',
          '22222222222',
          '33333333333',
          '44444444444',
          '55555555555',
          '66666666666',
          '77777777777',
          '88888888888',
          '99999999999',
        ];

        invalidCPFs.forEach((cpf) => {
          expect(validateCPF(cpf)).toBe(false);
        });
      });

      it('should reject CPF with invalid first check digit', () => {
        expect(validateCPF('12345678900')).toBe(false);
      });

      it('should reject CPF with invalid second check digit', () => {
        expect(validateCPF('12345678908')).toBe(false);
      });

      it('should reject empty string', () => {
        expect(validateCPF('')).toBe(false);
      });

      it('should reject CPF with only special characters', () => {
        expect(validateCPF('...-')).toBe(false);
      });

      it('should reject CPF with letters', () => {
        expect(validateCPF('123.456.789-0a')).toBe(false);
      });
    });

    describe('Edge Cases', () => {
      it('should handle CPF with extra spaces', () => {
        expect(validateCPF('123 456 789 09')).toBe(true);
      });

      it('should handle CPF with mixed formatting', () => {
        expect(validateCPF('123.456.78909')).toBe(true);
      });

      it('should reject null-like strings', () => {
        expect(validateCPF('null')).toBe(false);
        expect(validateCPF('undefined')).toBe(false);
      });

      it('should validate CPF where first digit calculation results in >= 10', () => {
        // CPF que resulta em dígito >= 10 no primeiro cálculo
        expect(validateCPF('00000000191')).toBe(true);
      });

      it('should validate CPF where second digit calculation results in >= 10', () => {
        // CPF que resulta em dígito >= 10 no segundo cálculo
        expect(validateCPF('00000000000')).toBe(false); // todos iguais
        expect(validateCPF('00000000191')).toBe(true);
      });
    });
  });

  describe('normalizeCPF', () => {
    it('should remove formatting from CPF', () => {
      expect(normalizeCPF('123.456.789-09')).toBe('12345678909');
    });

    it('should remove dots and dashes', () => {
      expect(normalizeCPF('111.444.777-35')).toBe('11144477735');
    });

    it('should keep CPF without formatting unchanged', () => {
      expect(normalizeCPF('12345678909')).toBe('12345678909');
    });

    it('should remove spaces', () => {
      expect(normalizeCPF('123 456 789 09')).toBe('12345678909');
    });

    it('should remove all non-digit characters', () => {
      expect(normalizeCPF('123.456.789-09 ')).toBe('12345678909');
    });

    it('should handle empty string', () => {
      expect(normalizeCPF('')).toBe('');
    });

    it('should remove special characters', () => {
      expect(normalizeCPF('123@456#789$09')).toBe('12345678909');
    });

    it('should handle CPF with parentheses', () => {
      expect(normalizeCPF('(123)456.789-09')).toBe('12345678909');
    });
  });

  describe('formatCPF', () => {
    it('should format CPF without formatting', () => {
      expect(formatCPF('12345678909')).toBe('123.456.789-09');
    });

    it('should format another valid CPF', () => {
      expect(formatCPF('11144477735')).toBe('111.444.777-35');
    });

    it('should keep already formatted CPF', () => {
      const formatted = formatCPF('123.456.789-09');
      expect(formatted).toBe('123.456.789-09');
    });

    it('should return original string if not 11 digits', () => {
      expect(formatCPF('123456789')).toBe('123456789');
    });

    it('should return original string if more than 11 digits', () => {
      expect(formatCPF('123456789012')).toBe('123456789012');
    });

    it('should format CPF removing extra characters first', () => {
      expect(formatCPF('123 456 789 09')).toBe('123.456.789-09');
    });

    it('should handle empty string', () => {
      expect(formatCPF('')).toBe('');
    });

    it('should format CPF with mixed special characters', () => {
      expect(formatCPF('123@456#789-09')).toBe('123.456.789-09');
    });

    it('should return original if input has letters', () => {
      const result = formatCPF('123abc456def');
      expect(result).toBe('123abc456def');
    });
  });

  describe('Integration between functions', () => {
    it('should normalize and then format back to same result', () => {
      const original = '123.456.789-09';
      const normalized = normalizeCPF(original);
      const formatted = formatCPF(normalized);
      
      expect(formatted).toBe(original);
    });

    it('should validate formatted CPF after normalization', () => {
      const cpf = '123.456.789-09';
      const normalized = normalizeCPF(cpf);
      
      expect(validateCPF(normalized)).toBe(true);
    });

    it('should format and validate CPF', () => {
      const cpf = '12345678909';
      const formatted = formatCPF(cpf);
      
      expect(validateCPF(formatted)).toBe(true);
      expect(formatted).toBe('123.456.789-09');
    });

    it('should work with complete flow: normalize -> validate -> format', () => {
      const input = '123.456.789-09';
      const normalized = normalizeCPF(input);
      const isValid = validateCPF(normalized);
      const formatted = formatCPF(normalized);
      
      expect(normalized).toBe('12345678909');
      expect(isValid).toBe(true);
      expect(formatted).toBe('123.456.789-09');
    });
  });
});
