import { EventEmitter } from 'node:events'
import type { DestinationCreatedEvent } from '@/features/destination/domain/destination-created.event'
import type { Notifier } from '@/features/notification/domain/notifier'
import { ConsoleNotifier } from '@/features/notification/infrastructure/console.notifier'
import { NotifyCrewOnDestinationCreatedListener } from '@/features/notification/application/notify-crew-on-destination-created.listener'

export interface DomainEvents {
  'destination.created': [destinationCreatedEvent: DestinationCreatedEvent]
  error: [error: unknown]
}

export type DomainEventEmitter = EventEmitter<DomainEvents>

export function createDomainEventEmitter(notifier: Notifier): DomainEventEmitter {
  // captureRejections sends a failing async listener to 'error', so the request that emitted the event still succeeds
  const domainEventEmitter = new EventEmitter<DomainEvents>({ captureRejections: true })
  domainEventEmitter.on('error', error => console.error('A domain event listener failed:', error))

  const notifyCrewOnDestinationCreatedListener = new NotifyCrewOnDestinationCreatedListener(notifier)
  domainEventEmitter.on('destination.created', event => notifyCrewOnDestinationCreatedListener.handle(event))

  return domainEventEmitter
}

const globalForDomainEvents = globalThis as unknown as {
  domainEventEmitter?: DomainEventEmitter
}

// One emitter per server process, kept on globalThis so hot reload does not register the listeners twice
export function getDomainEventEmitter(): DomainEventEmitter {
  if (!globalForDomainEvents.domainEventEmitter) {
    globalForDomainEvents.domainEventEmitter = createDomainEventEmitter(new ConsoleNotifier())
  }
  return globalForDomainEvents.domainEventEmitter
}
