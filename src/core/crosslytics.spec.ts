import test from 'ava';
import { Crosslytics } from './crosslytics';
import { Identity } from './identity';
import { Page } from './page';
import { TrackedEvent } from './trackedEvent';
import { Tracker } from './tracker';

interface TestEventArgs {
  'Color': string;
}

class TestEvent extends TrackedEvent<TestEventArgs> {
  public name = 'Test Event';
  public category = 'Test Category';
  public organizationId = 'abc123';
  public argPriority = new Array<keyof TestEventArgs>();
}

// tslint:disable-next-line:max-classes-per-file
class TestTracker implements Tracker {
  public trackedCalled = 0;
  public pageCalled = 0;
  constructor(public id: string) {}
  public identify(identity: Identity) {
    return;
  }
  public track<T>(event: TrackedEvent<T>) {
    this.trackedCalled++;
    return Promise.resolve();
  }
  public page(p: Page) {
    this.pageCalled++;
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

test('Should call track() once per Tracker', async t => {
  const cl = new Crosslytics();
  const trackerA = new TestTracker('test');
  const trackerB = new TestTracker('test2');
  const trackerC = new TestTracker('test3');
  cl.trackers.set(trackerA.id, trackerA);
  cl.trackers.set(trackerB.id, trackerB);
  cl.trackers.set(trackerC.id, trackerC);
  t.is(cl.trackers.size, 3);
  const ev = new TestEvent({ Color: 'Green' });
  await cl.track(ev);
  t.is(trackerA.trackedCalled, 1);
  t.is(trackerB.trackedCalled, 1);
  t.is(trackerC.trackedCalled, 1);
});

test('Should call page() once per Tracker', async t => {
  const cl = new Crosslytics();
  const trackerA = new TestTracker('test');
  const trackerB = new TestTracker('test2');
  const trackerC = new TestTracker('test3');
  cl.trackers.set(trackerA.id, trackerA);
  cl.trackers.set(trackerB.id, trackerB);
  cl.trackers.set(trackerC.id, trackerC);
  t.is(cl.trackers.size, 3);
  await cl.page({ url: 'https://crosslead.com' });
  t.is(trackerA.pageCalled, 1);
  t.is(trackerB.pageCalled, 1);
  t.is(trackerC.pageCalled, 1);
});

test('Should be able to call page() with a string', async t => {
  const cl = new Crosslytics();
  const tracker = new TestTracker('test');
  cl.trackers.set(tracker.id, tracker);
  await t.notThrows(cl.page('https://crosslead.com'));
});
