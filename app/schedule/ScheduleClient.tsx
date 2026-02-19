'use client';

import { useRouter } from 'next/navigation';
import Events from '@/components/Events';
import type { Event } from '@/lib/types';

interface ScheduleClientProps {
  initialEvents: Event[];
  subtitle?: string;
}

export default function ScheduleClient({ initialEvents, subtitle }: ScheduleClientProps) {
  const router = useRouter();

  const handleSelectEvent = (event: Event) => {
    const eventSlug = event.slug || String(event.id);
    router.push(`/tickets/event/${eventSlug}`);
  };

  return (
    <Events
      onSelectEvent={handleSelectEvent}
      initialEvents={initialEvents}
      title="Select Your Match"
      subtitle={subtitle}
    />
  );
}
