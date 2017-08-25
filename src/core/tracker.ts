import { Identity } from './identity';
import { Page } from './page';
import { TrackedEvent } from './trackedEvent';

/**
 * A Tracker is a 3rd party analytics service such as Google Analytics or Intercom
 * that ultimately receives your `TrackedEvent`s.
 */
export interface Tracker {
  id: string;
  identify(identity: Identity): void;
  track<T>(event: TrackedEvent<T>): Promise<void>;
  page(page: Page): Promise<void>;
}
