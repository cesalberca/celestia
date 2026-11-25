import { describe, expect, it, vi } from 'vitest'
import { anything, instance, mock, verify } from '@typestrong/ts-mockito'
import { createDomainEventEmitter } from '@/core/events/domain-event-emitter'
import type { Notifier } from '@/features/notification/domain/notifier'
import { DestinationCreatedEvent } from '@/features/destination/domain/destination-created.event'
import { DestinationMother } from '@/features/destination/tests/destination.mother'

describe('createDomainEventEmitter', () => {
  it('should notify the crew when a destination is created', async () => {
    const { domainEventEmitter, notifier } = setup()

    domainEventEmitter.emit('destination.created', new DestinationCreatedEvent(DestinationMother.europe()))

    await vi.waitFor(() => verify(notifier.notify(anything())).once())
  })

  it('should not throw to the emitter when a listener fails', () => {
    const { domainEventEmitter } = setup()
    domainEventEmitter.on('destination.created', async () => {
      throw new Error('Radio down')
    })

    const emitting = () =>
      domainEventEmitter.emit('destination.created', new DestinationCreatedEvent(DestinationMother.europe()))

    expect(emitting).not.toThrow()
  })

  it('should log the error of a failing listener', async () => {
    const { domainEventEmitter, consoleError } = setup()
    const radioDown = new Error('Radio down')
    domainEventEmitter.on('destination.created', async () => {
      throw radioDown
    })

    domainEventEmitter.emit('destination.created', new DestinationCreatedEvent(DestinationMother.europe()))

    await vi.waitFor(() => expect(consoleError).toHaveBeenCalledWith('A domain event listener failed:', radioDown))
  })

  it('should keep running the other listeners when one fails', async () => {
    const { domainEventEmitter, notifier } = setup()
    domainEventEmitter.prependListener('destination.created', async () => {
      throw new Error('Radio down')
    })

    domainEventEmitter.emit('destination.created', new DestinationCreatedEvent(DestinationMother.europe()))

    await vi.waitFor(() => verify(notifier.notify(anything())).once())
  })
})

function setup() {
  const notifier = mock<Notifier>()
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  const domainEventEmitter = createDomainEventEmitter(instance(notifier))

  return { domainEventEmitter, notifier, consoleError }
}
