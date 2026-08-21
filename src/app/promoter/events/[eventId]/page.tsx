import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { EventManagerClient } from './EventManagerClient';

export default async function PromoterEventDashboard({ params, searchParams }: { params: Promise<{ eventId: string }>, searchParams: Promise<{ error?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const eventId = parseInt(resolvedParams.eventId);
  
  if (isNaN(eventId)) notFound();

  const session = await auth();
  if (!session?.user?.id) notFound();
  const promoterId = parseInt(session.user.id);

  const [event, promoterUser, attendances] = await Promise.all([
    db.event.findUnique({ where: { id: eventId } }),
    db.user.findUnique({ where: { id: promoterId } }),
    db.attendance.findMany({
      where: { promoterId, eventId },
      include: { attendee: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  if (!event || !promoterUser) notFound();

  const serializedEvent = {
    ...event,
    eventDate: event.eventDate.toISOString(),
    eventTime: event.eventTime.toISOString(),
    entryCost: Number(event.entryCost),
    createdAt: event.createdAt.toISOString()
  };

  const initialGuests = attendances.map(att => {
    let name = 'Invitado Anónimo';
    if (att.attendee) name = `${att.attendee.firstName} ${att.attendee.lastName}`;
    else if (att.deviceFingerprint?.startsWith('MANUAL_')) {
      name = att.deviceFingerprint.split('_').slice(1, -1).join(' ') || 'Desconocido';
    }
    return { id: att.id, name, date: att.createdAt.toISOString() };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <EventManagerClient 
        event={serializedEvent} 
        promoterUser={promoterUser} 
        initialGuests={initialGuests}
        errorMsg={resolvedSearch.error}
      />
    </div>
  );
}
