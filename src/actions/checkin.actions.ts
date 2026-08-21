'use server'

import { db } from '@/lib/db';
import { Role } from '@prisma/client';

export async function getEventDetails(eventId: number) {
  return db.event.findUnique({
    where: { id: eventId },
    select: { id: true, title: true, pointsReward: true, isActive: true, flyerImageUrl: true, eventDate: true, eventTime: true }
  });
}

export async function getActivePromoters() {
  return db.user.findMany({
    where: { role: Role.PROMOTOR, isActive: true, isQrActive: true },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { firstName: 'asc' }
  });
}

export async function submitCheckin(prevState: any, formData: FormData) {
  const eventId = parseInt(formData.get('eventId') as string);
  const promoterId = parseInt(formData.get('promoterId') as string);
  const deviceFingerprint = formData.get('deviceFingerprint') as string;
  const guestName = formData.get('guestName') as string;

  const { auth } = await import('@/auth');
  const session = await auth();
  const attendeeId = session?.user?.id ? parseInt(session.user.id as string) : null;

  try {
    if (!attendeeId && !deviceFingerprint) {
      return { success: false, message: 'No se pudo verificar tu dispositivo. Intenta recargar la página.' };
    }

    const targetPromoter = await db.user.findUnique({ where: { id: promoterId } });
    if (!targetPromoter || !targetPromoter.isQrActive) {
      return { success: false, message: 'El enlace o QR de este promotor ha sido desactivado por el administrador.' };
    }

    // Evitar votos múltiples
    const existingVote = await db.attendance.findFirst({
      where: attendeeId 
        ? { eventId, attendeeId } 
        : { eventId, deviceFingerprint }
    });

    if (existingVote) {
      return { success: false, message: 'Ya tienes una asistencia registrada para este evento. ¡Disfruta la fiesta!' };
    }

    await db.attendance.create({
      data: {
        eventId,
        promoterId,
        deviceFingerprint,
        attendeeId,
        guestName: attendeeId ? null : guestName // Solo guardar el nombre del invitado si no está autenticado
      }
    });

    if (attendeeId) {
      // Opcional: Sumar puntos directamente aquí si quieres (o lo hace el admin al pagar)
    }

    return { success: true, message: '¡Asistencia confirmada! Tu voto para el promotor ha sido registrado.' };
  } catch (error) {
    return { success: false, message: 'Ocurrió un error al procesar tu registro.' };
  }
}
