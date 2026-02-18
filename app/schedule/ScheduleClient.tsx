'use client';

import { useRouter } from 'next/navigation';
import Events from '@/components/Events';
import type { Event } from '@/lib/types';

interface ScheduleClientProps {
  initialEvents: Event[];
}

export default function ScheduleClient({ initialEvents }: ScheduleClientProps) {
  const router = useRouter();

  const handleSelectEvent = (event: Event) => {
    const eventSlug = event.slug || String(event.id);
    router.push(`/tickets/event/${eventSlug}`);
  };

  return (
    <Events
      onSelectEvent={handleSelectEvent}
      initialEvents={initialEvents}
    />
  );
}
