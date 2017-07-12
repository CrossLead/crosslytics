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
  constructor(public id: string) {}
  public identify(identity: Identity) {
    return;
  }
  public track<T>(event: TrackedEvent<T>) {
    return Promise.resolve();
  }
}

test('Should only register a Tracker once', t => {
  const cl = new Crosslytics();
  const tracker = new TestTracker('test');
  cl.trackers.set(tracker.id, tracker);
  cl.trackers.set(tracker.id, tracker);
  t.is(cl.trackers.size, 1);
});

test('Should overwrite Trackers by id', t => {
  const cl = new Crosslytics();
  const trackerA = new TestTracker('test');
  const trackerB = new TestTracker('test');
  cl.trackers.set(trackerA.id, trackerA);
  cl.trackers.set(trackerB.id, trackerB);
  t.is(cl.trackers.size, 1);
});

test('Should deregister a Tracker once', t => {
  const cl = new Crosslytics();
  const trackerA = new TestTracker('test');
  const trackerB = new TestTracker('test2');
  cl.trackers.set(trackerA.id, trackerA);
  cl.trackers.set(trackerB.id, trackerB);
  t.is(cl.trackers.size, 2);
  cl.trackers.delete(trackerA.id);
  cl.trackers.delete(trackerA.id);
  t.is(cl.trackers.size, 1);
});
