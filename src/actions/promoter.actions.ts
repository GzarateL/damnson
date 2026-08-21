'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addGuestAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const eventId = parseInt(formData.get('eventId') as string);
  const guestName = formData.get('guestName') as string;
  
  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event) return;

  const cutoffDate = new Date(event.eventDate);
  cutoffDate.setHours(cutoffDate.getHours() + 26); 

  if (new Date() > cutoffDate) {
    redirect(`/promoter/events/${eventId}?error=El+plazo+para+registrar+invitados+venció+a+las+2:00+AM`);
  }
  
  await db.attendance.create({
    data: {
      eventId,
      promoterId: parseInt(session.user.id),
      deviceFingerprint: `MANUAL_${guestName}_${Date.now()}`
    }
  });

  revalidatePath(`/promoter/events/${eventId}`);
}

import { EarningType, PaymentStatus, FinanceType } from '@prisma/client';

export async function awardBonusAction(formData: FormData) {
  const promoterId = parseInt(formData.get('promoterId') as string);
  const amount = parseFloat(formData.get('amount') as string);
  const paymentType = formData.get('paymentType') as string || 'BONO';
  
  if (isNaN(promoterId) || isNaN(amount) || amount <= 0) {
    return { error: 'Datos inválidos' };
  }

  const promoter = await db.user.findUnique({ where: { id: promoterId } });
  if (!promoter) return { error: 'Promotor no encontrado' };

  const earningType = paymentType === 'PAGO' ? EarningType.COMMISSION : EarningType.BONUS_MOST_VOTED;
  const descPrefix = paymentType === 'PAGO' ? 'Pago de comisión a' : 'Bono especial otorgado a';

  // Ejecutar en una transacción para asegurar que ambos registros se creen juntos
  await db.$transaction(async (tx) => {
    // 1. Crear el registro de ganancia del promotor
    await tx.promoterEarning.create({
      data: {
        promoterId,
        amount,
        type: earningType,
        status: PaymentStatus.PAID
      }
    });

    // 2. Crear el registro de egreso en finanzas generales
    await tx.finance.create({
      data: {
        type: FinanceType.EXPENSE,
        category: 'Bonos a Promotores',
        amount,
        description: `${descPrefix} ${promoter.firstName} ${promoter.lastName}`,
        status: PaymentStatus.PAID,
        transactionDate: new Date()
      }
    });
  });

  revalidatePath('/admin/promoters');
  revalidatePath('/admin/finances');
  revalidatePath('/admin');
}
