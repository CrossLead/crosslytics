import { Identity } from './identity';
import { Page } from './page';
import { TrackedEvent } from './trackedEvent';
import { Tracker } from './tracker';

/**
 * Main API entry point
 */
export class Crosslytics {
  public readonly trackers = new Map<string, Tracker>();

  public async track<T>(event: TrackedEvent<T>) {
    const promises = [];

    const iterable = this.trackers.values();
    let next = iterable.next();
    while (!next.done) {
      promises.push(next.value.track(event));
      next = iterable.next();
    }

    return Promise.all(promises);
  }

  public async page(page: Page | string) {
    const p: Page = typeof page === 'string' ? { url: page } : page;

    const promises = [];

    const iterable = this.trackers.values();
    let next = iterable.next();
    while (!next.done) {
      promises.push(next.value.page(p));
      next = iterable.next();
    }

    return Promise.all(promises);
  }
}
