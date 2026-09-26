'use server'

import { schema } from '@/Schema/Register/register';
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
      'https://ecommerce.routemisr.com/api/v1/auth/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData.data),
      }
    );

    const result = await response.json();

    return {
      success: response.ok,
      message: result.message,
    };

  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

