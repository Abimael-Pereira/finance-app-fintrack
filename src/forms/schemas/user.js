import z from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Email é inválido'),
  password: z.string().trim().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'Nome é obrigatório')
      .regex(/^[^\d]+$/, 'Nome não pode conter números'),
    lastName: z
      .string()
      .trim()
      .min(1, 'Sobrenome é obrigatório')
      .regex(/^[^\d]+$/, 'Sobrenome não pode conter números'),
    email: z.string().trim().email('Email é inválido'),
    password: z
      .string()
      .trim()
      .min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z
      .string()
      .trim()
      .min(6, 'Confirmação de senha é obrigatória'),
    terms: z.boolean().refine((value) => value === true, {
      message: 'Você deve aceitar os termos de uso',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });
