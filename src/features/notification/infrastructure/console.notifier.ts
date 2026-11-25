import type { Notifier } from '@/features/notification/domain/notifier'

export class ConsoleNotifier implements Notifier {
  async notify(message: string): Promise<void> {
    console.info(`[crew notification] ${message}`)
  }
}
