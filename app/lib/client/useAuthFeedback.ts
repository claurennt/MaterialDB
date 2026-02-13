'use client';

import { useFormState } from 'react-dom'; // Next 14 uses react-dom
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { registerAdmin } from './sendRequest';

export const useAuthFeedback = () => {
  // state: return value from server
  // formAction: pass this to your <form action={...}>
  const [state, formAction] = useFormState(registerAdmin, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state?.success) {
      toast.success('Check your email to activate!');
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return { formAction };
};
