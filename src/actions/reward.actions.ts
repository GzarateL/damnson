'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getRewards() {
  return db.reward.findMany({
    orderBy: { pointsCost: 'asc' }
  });
}

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function createReward(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const pointsCost = parseInt(formData.get('pointsCost') as string);
  const isActive = formData.get('isActive') === 'on';
  const image = formData.get('image') as File | null;

  let imageUrl: string | null = null;

  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore
    }

    const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);
    imageUrl = `/uploads/${fileName}`;
  }

  await db.reward.create({
    data: { name, description, pointsCost, isActive, imageUrl }
  });

  revalidatePath('/admin/rewards');
  revalidatePath('/rewards');
  redirect('/admin/rewards');
}

export async function toggleRewardStatus(id: number, currentStatus: boolean) {
  await db.reward.update({
    where: { id },
    data: { isActive: !currentStatus }
  });
  revalidatePath('/admin/rewards');
  revalidatePath('/rewards');
}

export async function deleteReward(id: number) {
  await db.reward.delete({ where: { id } });
  revalidatePath('/admin/rewards');
  revalidatePath('/rewards');
}
