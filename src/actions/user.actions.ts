'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

import bcrypt from 'bcryptjs';

export async function getUsersByRole(role: Role) {
  return db.user.findMany({
    where: { role },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createUser(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as Role || Role.PROMOTOR;

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      role,
    },
  });

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function registerPublicAttendee(prevState: any, formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: 'El correo ya está registrado.' };

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        role: Role.ASISTENTE,
      },
    });
  } catch(e) {
    return { error: 'Ocurrió un error al crear la cuenta.' };
  }

  redirect('/login?registered=true');
}

export async function toggleUserStatus(id: number, currentStatus: boolean) {
  await db.user.update({
    where: { id },
    data: { isActive: !currentStatus },
  });
  revalidatePath('/admin/users');
}

export async function deleteUser(id: number) {
  await db.user.delete({ where: { id } });
  revalidatePath('/admin/users');
}

export async function toggleQrStatus(id: number, currentStatus: boolean) {
  await db.user.update({
    where: { id },
    data: { isQrActive: !currentStatus },
  });
  revalidatePath('/admin/users');
}

export async function updateProfile(prevState: any, formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const password = formData.get('password') as string;

  try {
    const updateData: any = { firstName, lastName };
    
    if (password && password.length >= 8) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    await db.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/user');
    return { success: 'Perfil actualizado correctamente.' };
  } catch (error) {
    return { error: 'Ocurrió un error al actualizar el perfil.' };
  }
}
