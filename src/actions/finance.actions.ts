'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { FinanceType, PaymentStatus } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function getFinances() {
  return db.finance.findMany({
    orderBy: { transactionDate: 'desc' },
    include: {
      event: {
        select: { title: true }
      }
    }
  });
}

export async function getEventsForSelect() {
  return db.event.findMany({
    where: { isActive: true },
    select: { id: true, title: true },
    orderBy: { eventDate: 'desc' }
  });
}

export async function addFinanceRecord(formData: FormData) {
  const type = formData.get('type') as FinanceType;
  const category = formData.get('category') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const description = formData.get('description') as string;
  const status = formData.get('status') as PaymentStatus;
  const transactionDate = formData.get('transactionDate') as string;
  
  const eventIdRaw = formData.get('eventId') as string;
  const eventId = eventIdRaw && eventIdRaw !== 'null' ? parseInt(eventIdRaw) : null;

  await db.finance.create({
    data: {
      type,
      category,
      amount,
      description,
      status,
      transactionDate: new Date(`${transactionDate}T00:00:00Z`),
      eventId,
    }
  });

  revalidatePath('/admin/finances');
  revalidatePath('/admin');
}

export async function deleteFinanceRecord(id: number) {
  await db.finance.delete({ where: { id } });
  revalidatePath('/admin/finances');
  revalidatePath('/admin');
}

export async function toggleFinanceStatus(id: number, currentStatus: PaymentStatus) {
  await db.finance.update({
    where: { id },
    data: { status: currentStatus === PaymentStatus.PAID ? PaymentStatus.PENDING : PaymentStatus.PAID }
  });
  revalidatePath('/admin/finances');
  revalidatePath('/admin');
}

export async function getFinanceCategories() {
  return db.financeCategory.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function addFinanceCategory(formData: FormData) {
  const name = formData.get('name') as string;
  const type = formData.get('type') as FinanceType;
  
  if (!name || name.trim() === '') return { error: 'Nombre inválido' };

  try {
    await db.financeCategory.create({
      data: { name: name.trim(), type }
    });
  } catch (e) {
    return { error: 'La categoría ya existe o hubo un error' };
  }
  revalidatePath('/admin/finances/categories');
}
