import { Identity } from "./identity";
import { TrackedEvent } from "./trackedEvent";

/**
 * A Tracker is a 3rd party analytics service such as Google Analytics or Intercom
 * that ultimately receives your `TrackedEvent`s.
 */
export interface Tracker {
  track<T>(identity: Identity, event: TrackedEvent<T>): Promise<void>;
}
