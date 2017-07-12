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
    for (const tracker of this.trackers.values()) {
      promises.push(tracker.track(event));
    }
    return Promise.all(promises);
  }
}
