import { Identity } from './identity';
import { TrackedEvent } from './trackedEvent';
import { Tracker } from './tracker';

/**
 * Main API entry point
 */
export class Crosslytics {
  public readonly trackers = new Map<string, Tracker>();

  public async track<T>(event: TrackedEvent<T>) {
    const promises = [];

    let next = this.trackers.values().next();
    while (!next.done) {
      promises.push(next.value.track(event));
      next = this.trackers.values().next();
    }

    return Promise.all(promises);
  }
}
