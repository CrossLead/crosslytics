import { Identity } from './identity';
import { Page } from './page';
import { TrackedEvent } from './trackedEvent';
import { Tracker } from './tracker';

/**
 * Main API entry point
 */
export class Crosslytics {
  public readonly trackers = new Map<string, Tracker>();

  /**
   * Helper method equivalent to calling .track() on all registered trackers
   */
  public async track<T>(event: TrackedEvent<T>) {
    const promises = Array.from(this.trackers.values()).map(t =>
      t.track(event)
    );
    return Promise.all(promises);
  }

  /**
   * Helper method equivalent to calling .page() on all registered trackers
   */
  public async page(page: Page | string) {
    const p: Page = typeof page === 'string' ? { url: page } : page;

    const promises = Array.from(this.trackers.values()).map(t => t.page(p));

    return Promise.all(promises);
  }

  /**
   * Helper method equivalent to calling .identify() on all registered trackers
   */
  public identify(identity: Identity): void {
    Array.from(this.trackers.values()).forEach(t => t.identify(identity));
  }
}
