'use server'

import { schema } from '@/Schema/Register/register';
import { routeApiUrl } from '@/API/server'
import * as zod from 'zod';

type UserData = zod.infer<typeof schema>;

export async function userRegister(data: UserData) {
  const validatedData = schema.safeParse(data)
  if (!validatedData.success) {
    return {
      success: false,
      message: validatedData.error.issues[0]?.message ?? 'Enter valid registration details.',
    }
  }

  try {
    const response = await fetch(
      routeApiUrl('/auth/signup'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData.data),
      }
    );

    const result = await response.json().catch(() => null);

    return {
      success: response.ok,
      message: response.status >= 500 ? 'Could not create your account. Please try again.' : typeof result?.message === 'string' ? result.message : (response.ok ? 'Registration successful.' : 'Could not create your account.'),
    };

  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
