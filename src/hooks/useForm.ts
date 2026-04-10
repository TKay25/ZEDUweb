import { useState, useCallback, useMemo } from 'react';
import type { ChangeEvent } from 'react';

// Remove unused ValidationRule interface
// interface ValidationRule {
//   required?: boolean;
//   min?: number;
//   max?: number;
//   minLength?: number;
//   maxLength?: number;
//   pattern?: RegExp;
//   custom?: (value: any) => boolean;
//   message?: string;
// }

interface FormErrors {
  [key: string]: string;
}

interface FormTouched {
  [key: string]: boolean;
}

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((_name: string, _value: any): string => {
    // This would be replaced with actual validation rules
    return '';
  }, []);

  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' 
      ? (e as ChangeEvent<HTMLInputElement>).target.checked
      : value;

    setValues(prev => ({ ...prev, [name]: finalValue }));
    
    const error = validateField(name, finalValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);

  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
    
    const newErrors = { ...errors };
    Object.keys(newValues).forEach(key => {
      const error = validateField(key, newValues[key as keyof T]);
      newErrors[key] = error;
    });
    setErrors(newErrors);
  }, [errors, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(values).forEach(key => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  const handleSubmit = useCallback((
    onSubmit: (values: T) => Promise<void> | void
  ) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      
      setTouched(
        Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );

      if (validateForm()) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    };
  }, [values, validateForm]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && Object.keys(values).length > 0;
  }, [errors, values]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    setValue,
    setMultipleValues,
    resetForm,
    handleSubmit,
    validateForm
  };
}

// Hook for multi-step forms
export function useMultiStepForm<T extends Record<string, any>>(
  steps: Array<{ title: string; fields: string[] }>,
  initialValues: T,
  onSubmit: (values: T) => Promise<void>
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData] = useState<T>(initialValues);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const form = useForm(formData);

  const goToNextStep = useCallback(() => {
    // Validate current step fields
    const currentFields = steps[currentStep].fields;
    const stepValid = currentFields.every(field => !form.errors[field]);

    if (stepValid) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  }, [currentStep, steps, form.errors]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step <= currentStep || completedSteps.has(step - 1)) {
      setCurrentStep(step);
    }
  }, [currentStep, completedSteps]);

  const handleFinalSubmit = useCallback(async () => {
    if (form.validateForm()) {
      await onSubmit(form.values);
    }
  }, [form, onSubmit]);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return {
    ...form,
    currentStep,
    steps,
    isLastStep,
    isFirstStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleFinalSubmit,
    completedSteps: Array.from(completedSteps)
  };
}

// Hook for forms with arrays (e.g., dynamic fields)
export function useArrayField<T>(initialArray: T[] = []) {
  const [array, setArray] = useState<T[]>(initialArray);

  const push = useCallback((item: T) => {
    setArray(prev => [...prev, item]);
  }, []);

  const pop = useCallback(() => {
    setArray(prev => prev.slice(0, -1));
  }, []);

  const remove = useCallback((index: number) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  }, []);

  const update = useCallback((index: number, item: T) => {
    setArray(prev => prev.map((oldItem, i) => i === index ? item : oldItem));
  }, []);

  const insert = useCallback((index: number, item: T) => {
    setArray(prev => [...prev.slice(0, index), item, ...prev.slice(index)]);
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const move = useCallback((fromIndex: number, toIndex: number) => {
    setArray(prev => {
      const newArray = [...prev];
      const [movedItem] = newArray.splice(fromIndex, 1);
      newArray.splice(toIndex, 0, movedItem);
      return newArray;
    });
  }, []);

  return {
    array,
    setArray,
    push,
    pop,
    remove,
    update,
    insert,
    clear,
    move,
    length: array.length
  };
}