import { Identity } from './identity';
import { TrackedEvent } from './trackedEvent';
import { Tracker } from './tracker';

/**
 * Main API entry point
 */
export class Crosslytics {
  public identity: Identity;

  public readonly trackers = new Array<Tracker>();
  public registerTracker(tracker: Tracker) {
    if (this.trackers.indexOf(tracker) >= 0) {
      return;
    }

    this.trackers.push(tracker);
  }

  public deregisterTracker(tracker: Tracker) {
    const index = this.trackers.indexOf(tracker);
    if (index >= 0) {
      this.trackers.splice(index, 1);
    }
  }

  public async track<T>(event: TrackedEvent<T>) {
    return this.trackers.map(t => t.track(this.identity, event));
  }
}
