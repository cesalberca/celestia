import type { Destination } from '@/features/destination/domain/destination'

export class DestinationCreatedEvent {
  constructor(
    readonly destination: Destination,
    readonly occurredOn = new Date(),
  ) {}
}
