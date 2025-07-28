// app/login/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DynamicForm } from '../components/DynamicForm/DynamicForm';
import type { FieldModel } from '../components/DynamicForm/types';
import { useTheme } from '../context/ThemeContext/ThemeContext';
import { ToggleButton } from '../components/ToogleButton.tsx/ToogleButton';

const loginFields: FieldModel[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Correo electrónico',
    value: '',
    validations: [{ type: 'required' }, { type: 'email' }],
  },
  {
    name: 'password',
    type: 'password',
    label: 'Contraseña',
    value: '',
    validations: [{ type: 'required' }, { type: 'minLength', value: 6 }],
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = (values: Record<string, any>) => {
    console.log('Login con:', values);
    router.push('/main-page/dashboard');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Toggle de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <ToggleButton
          checked={theme === 'dark'}
          onChange={toggleTheme}
          label={theme === 'light' ? '🌙' : '☀️'}
        />
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>
        <DynamicForm
          fields={loginFields}
          onSubmit={handleLogin}
          submitLabel="Entrar"
        />
      </div>
    </div>
  );
}
