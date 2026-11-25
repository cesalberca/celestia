import type { DestinationCreatedEvent } from '@/features/destination/domain/destination-created.event'
import type { Notifier } from '@/features/notification/domain/notifier'

export class NotifyCrewOnDestinationCreatedListener {
  constructor(private readonly notifier: Notifier) {}

  async handle(destinationCreatedEvent: DestinationCreatedEvent): Promise<void> {
    const { emoji, name } = destinationCreatedEvent.destination

    await this.notifier.notify(`${emoji} ${name} is now open for trips`)
  }
}
