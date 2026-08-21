'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createGiveawayAction(formData: FormData) {
  const title = formData.get('title') as string;
  const targetAudience = formData.get('targetAudience') as string;
  const mode = formData.get('mode') as string;
  const riggedWinnerId = formData.get('riggedWinnerId') ? parseInt(formData.get('riggedWinnerId') as string) : null;

  if (!title || !targetAudience || !mode) return;

  await db.giveaway.create({
    data: {
      title,
      targetAudience,
      mode,
      riggedWinnerId: mode === 'SUCIO' ? riggedWinnerId : null
    }
  });

  revalidatePath('/admin/giveaways');
}

export async function toggleGiveawayStatusAction(id: number, currentStatus: boolean) {
  await db.giveaway.update({
    where: { id },
    data: { isActive: !currentStatus }
  });
  revalidatePath('/admin/giveaways');
}

export async function setGiveawayWinnerAction(id: number, winnerId: number) {
  await db.giveaway.update({
    where: { id },
    data: {
      isCompleted: true,
      actualWinnerId: winnerId
    }
  });
  revalidatePath('/admin/giveaways');
}

export async function resetGiveawayAction(id: number) {
  await db.giveaway.update({
    where: { id },
    data: {
      isCompleted: false,
      actualWinnerId: null
    }
  });
  revalidatePath('/admin/giveaways');
}

export async function deleteGiveawayAction(id: number) {
  await db.giveaway.delete({ where: { id } });
  revalidatePath('/admin/giveaways');
}
