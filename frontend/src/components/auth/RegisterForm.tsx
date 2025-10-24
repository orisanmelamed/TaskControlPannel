import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { isValidEmail, isValidPassword } from '../../utils/helpers';
import './AuthForms.scss';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  general?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
    
    // Clear auth error
    if (error) {
      clearError();
    }
  };

  // Handle input blur for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
    validateField(name);
  };

  // Validate individual field
  const validateField = (fieldName: string) => {
    const newErrors: FormErrors = { ...errors };

    switch (fieldName) {
      case 'email':
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (!isValidPassword(formData.password)) {
          newErrors.password = 'Password must be at least 6 characters long';
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirmPassword':
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case 'name':
        if (formData.name.trim() && formData.name.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters long';
        } else {
          delete newErrors.name;
        }
        break;
    }

    setErrors(newErrors);
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.name.trim() && formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      name: true,
    });

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim() || undefined,
      });
      // Registration successful - redirect will be handled by auth context
    } catch (error) {
      // Error is handled by auth context
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form-header">
        <h2>Create Your Account</h2>
        <p>Join us to manage your tasks efficiently</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-body">
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.name ? 'form-input-error' : ''}`}
            placeholder="Enter your full name"
            autoComplete="name"
          />
          {touched.name && errors.name && (
            <span className="form-error">{errors.name}</span>
          )}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.email ? 'form-input-error' : ''}`}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
          {touched.email && errors.email && (
            <span className="form-error">{errors.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password <span className="required">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.password ? 'form-input-error' : ''}`}
            placeholder="Enter your password"
            autoComplete="new-password"
            required
          />
          {touched.password && errors.password && (
            <span className="form-error">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password <span className="required">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <span className="form-error">{errors.confirmPassword}</span>
          )}
        </div>

        {/* General Error */}
        {error && (
          <div className="form-error-general">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary form-submit"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-form-footer">
        <p>
          Already have an account?{' '}
          <button 
            type="button"
            onClick={onSwitchToLogin}
            className="auth-link"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;