/**
 * Create Employee Page
 * Same submit flow as before (authService.createEmployee), now validated with
 * React Hook Form + Zod and restyled for the enterprise theme.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  HiOutlineArrowLeft,
  HiOutlineUserAdd,
  HiOutlineCheckCircle,
  HiOutlineClipboard,
  HiOutlineExclamation,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import authService from '../../services/auth.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FormField, TextInput, SelectInput } from '../../components/ui/FormField';

const roles = [
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'TEAM_LEAD', label: 'Team Lead' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'HR_MANAGER', label: 'HR Manager' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'IT_ADMIN', label: 'IT Admin' },
  { value: 'AUDITOR', label: 'Auditor' },
  { value: 'ORG_ADMIN', label: 'Organization Admin' },
];

const employmentTypes = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'intern', label: 'Intern' },
];

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(60),
  lastName: z.string().min(1, 'Last name is required').max(60),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^[0-9+\-()\s]{7,20}$/.test(v), 'Enter a valid phone number'),
  designation: z.string().optional(),
  role: z.string().min(1, 'Select a role'),
  employmentType: z.string().min(1, 'Select an employment type'),
});

const CreateEmployeePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [createdEmployee, setCreatedEmployee] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      designation: '',
      role: 'EMPLOYEE',
      employmentType: 'full_time',
    },
  });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setSubmitError('');
    try {
      const response = await authService.createEmployee(formData);
      setCreatedEmployee(response.data);
      toast.success('Employee created successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create employee.';
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (createdEmployee) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
        <Card className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.12)' }}>
            <HiOutlineCheckCircle className="w-8 h-8 text-[#10B981]" />
          </div>
          <h2 className="text-3xl font-bold text-[#F8FAFC] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Employee Created!
          </h2>
          <p className="text-xs text-[#64748B] uppercase tracking-wider mb-8">
            An email with login credentials has been sent.
          </p>

          <div className="p-6 rounded-xl text-left border" style={{ backgroundColor: 'var(--surface-muted, #172033)', borderColor: 'var(--border-color, rgba(148,163,184,0.12))' }}>
            <h3 className="font-bold text-[10px] uppercase tracking-widest text-[#64748B] mb-4">Credentials Details</h3>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Employee ID', value: createdEmployee.employee.employeeId },
                { label: 'Email', value: createdEmployee.employee.email },
                { label: 'Temporary Password', value: createdEmployee.tempPassword, highlight: true },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between p-3.5 rounded-lg border" style={{ borderColor: 'rgba(148,163,184,0.08)', backgroundColor: 'rgba(148,163,184,0.03)' }}>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase tracking-wider">{row.label}</span>
                    <p className={`font-bold mt-0.5 ${row.highlight ? 'text-[#F59E0B] text-sm' : 'text-[#F8FAFC]'}`}>{row.value}</p>
                  </div>
                  <button onClick={() => copyToClipboard(row.value)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <HiOutlineClipboard className="w-4 h-4 text-[#64748B]" />
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] text-[#F87171] uppercase font-bold tracking-widest">
              ⚠️ Password change is mandatory on first login.
            </p>
          </div>

          <div className="mt-8 flex gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => {
                setCreatedEmployee(null);
                reset();
              }}
            >
              Create Another
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/dashboard')}>
              Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-lg border transition-all hover:bg-white/5"
          style={{ borderColor: 'var(--border-color, rgba(148,163,184,0.14))' }}
        >
          <HiOutlineArrowLeft className="w-4 h-4 text-[#94A3B8]" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>
            Create Employee
          </h1>
          <p className="text-xs text-[#64748B] mt-1.5">Fill in staff details to automatically provision credentials via email.</p>
        </div>
      </div>

      <Card>
        {submitError && (
          <div className="flex items-center gap-2.5 p-4 rounded-lg mb-6 border" style={{ backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }}>
            <HiOutlineExclamation className="w-4 h-4 text-[#EF4444] shrink-0" />
            <p className="text-xs text-[#FCA5A5]">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="First Name" required error={errors.firstName?.message}>
              <TextInput placeholder="First Name" error={errors.firstName} {...register('firstName')} />
            </FormField>
            <FormField label="Last Name" required error={errors.lastName?.message}>
              <TextInput placeholder="Last Name" error={errors.lastName} {...register('lastName')} />
            </FormField>
          </div>

          <FormField label="Email Address" required error={errors.email?.message}>
            <TextInput type="email" placeholder="name@company.com" error={errors.email} {...register('email')} />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Phone Number" error={errors.phone?.message}>
              <TextInput placeholder="Phone" error={errors.phone} {...register('phone')} />
            </FormField>
            <FormField label="Designation" error={errors.designation?.message}>
              <TextInput placeholder="Designation" error={errors.designation} {...register('designation')} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Role" error={errors.role?.message}>
              <SelectInput error={errors.role} {...register('role')}>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </SelectInput>
            </FormField>
            <FormField label="Employment Type" error={errors.employmentType?.message}>
              <SelectInput error={errors.employmentType} {...register('employmentType')}>
                {employmentTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </SelectInput>
            </FormField>
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary" size="lg" icon={HiOutlineUserAdd} loading={isLoading} className="w-full">
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateEmployeePage;
