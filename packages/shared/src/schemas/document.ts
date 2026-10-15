import { z } from 'zod';

export const CertificateTypeEnum = z.enum(['BONAFIDE', 'TRANSFER_CERTIFICATE', 'CHARACTER', 'CUSTOM']);
export type CertificateType = z.infer<typeof CertificateTypeEnum>;

export const CreateCertificateTemplateSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  name: z.string().min(1, { message: 'Template name is required' }),
  type: CertificateTypeEnum.default('CUSTOM'),
  headerText: z.string().optional(),
  bodyTemplate: z.string().min(1, { message: 'Body template content is required' }),
  footerText: z.string().optional(),
});

export type CreateCertificateTemplateDto = z.infer<typeof CreateCertificateTemplateSchema>;

export const GenerateCertificateSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  templateId: z.string().uuid({ message: 'Valid Template ID is required' }),
  studentId: z.string().uuid({ message: 'Valid Student ID is required' }),
  certificateNo: z.string().min(1, { message: 'Certificate number is required' }),
  customFields: z.record(z.string()).optional(),
});

export type GenerateCertificateDto = z.infer<typeof GenerateCertificateSchema>;
