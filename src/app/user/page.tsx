import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UserDashboardClient } from './UserDashboardClient';

export default async function UserDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect('/login');

  const userId = parseInt(session.user.id);

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      giveawaysWon: true,
      rewardRedemptions: {
        include: { reward: true },
        orderBy: { redeemedAt: 'desc' }
      },
      attendancesAsAttendee: {
        include: { event: true },
        orderBy: { event: { eventDate: 'asc' } }
      }
    }
  });

  if (!user) return redirect('/login');

  const futureEvents = user.attendancesAsAttendee.filter(
    (a) => new Date(a.event.eventDate) >= new Date(new Date().setHours(0,0,0,0))
  );

  const serializedUser = JSON.parse(JSON.stringify(user));
  const serializedFutureEvents = JSON.parse(JSON.stringify(futureEvents));

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 pt-12">
      <UserDashboardClient user={serializedUser} futureEvents={serializedFutureEvents} />
    </main>
  );
}
