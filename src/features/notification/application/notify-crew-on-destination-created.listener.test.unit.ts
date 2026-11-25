import { describe, it } from 'vitest'
import { instance, mock, verify } from '@typestrong/ts-mockito'
import { NotifyCrewOnDestinationCreatedListener } from '@/features/notification/application/notify-crew-on-destination-created.listener'
import type { Notifier } from '@/features/notification/domain/notifier'
import { DestinationCreatedEvent } from '@/features/destination/domain/destination-created.event'
import { DestinationMother } from '@/features/destination/tests/destination.mother'

describe('NotifyCrewOnDestinationCreatedListener', () => {
  it('should tell the crew the new destination is open for trips', async () => {
    const { notifyCrewOnDestinationCreatedListener, notifier } = setup()

    await notifyCrewOnDestinationCreatedListener.handle(new DestinationCreatedEvent(DestinationMother.europe()))

    verify(notifier.notify('🧊 Europa is now open for trips')).once()
  })
})

function setup() {
  const notifier = mock<Notifier>()
  const notifyCrewOnDestinationCreatedListener = new NotifyCrewOnDestinationCreatedListener(instance(notifier))

  return { notifyCrewOnDestinationCreatedListener, notifier }
}
