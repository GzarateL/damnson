'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getEvents() {
  return db.event.findMany({
    orderBy: { eventDate: 'desc' },
  });
}

export async function createEvent(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const eventDate = formData.get('eventDate') as string;
  const eventTime = formData.get('eventTime') as string;
  const location = formData.get('location') as string;
  const entryCost = parseFloat(formData.get('entryCost') as string);
  const pointsReward = parseInt(formData.get('pointsReward') as string);
  const isActive = formData.get('isActive') === 'on';

  let flyerImageUrl = null;
  const file = formData.get('flyerImage') as File | null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fs = require('fs');
    const path = require('path');
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    flyerImageUrl = `/uploads/${filename}`;
  }

  const dateObj = new Date(`${eventDate}T00:00:00Z`);
  const timeObj = new Date(`1970-01-01T${eventTime}:00Z`);

  await db.event.create({
    data: {
      title,
      description,
      eventDate: dateObj,
      eventTime: timeObj,
      location,
      entryCost,
      pointsReward,
      isActive,
      flyerImageUrl,
    },
  });

  revalidatePath('/admin/events');
  redirect('/admin/events');
}

export async function toggleEventStatus(id: number, currentStatus: boolean) {
  await db.event.update({
    where: { id },
    data: { isActive: !currentStatus },
  });
  revalidatePath('/admin/events');
}

export async function deleteEvent(id: number) {
  await db.event.delete({ where: { id } });
  revalidatePath('/admin/events');
}
