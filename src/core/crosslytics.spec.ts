import test from 'ava';
import { Crosslytics } from './crosslytics';
import { Identity } from './identity';
import { TrackedEvent } from './trackedEvent';
import { Tracker } from './tracker';

interface TestEventArgs {
  'Color': string;
}

class TestEvent extends TrackedEvent<TestEventArgs> {
  name = 'Test Event';
  category = 'Test Category';
  organizationId = 'abc123';
  argPriority = new Array<keyof TestEventArgs>();
}

class TestTracker implements Tracker {
  public identify(identity: Identity) {
    return;
  }
  public track<T>(event: TrackedEvent<T>) {
    return Promise.resolve();
  }
}

test('Should only register a Tracker once', t => {
  const cl = new Crosslytics();
  const tracker = new TestTracker();
  cl.registerTracker(tracker);
  cl.registerTracker(tracker);
  t.is(cl.trackers.length, 1);
});

test('Should deregister a Tracker', t => {
  const cl = new Crosslytics();
  const trackerA = new TestTracker();
  const trackerB = new TestTracker();
  cl.registerTracker(trackerA);
  cl.registerTracker(trackerB);
  t.is(cl.trackers.length, 2);
  cl.deregisterTracker(trackerB);
  cl.deregisterTracker(trackerB);
  t.is(cl.trackers.length, 1);
});
