# Crosslytics
[![Build Status](https://travis-ci.org/CrossLead/crosslytics.svg?branch=master)](https://travis-ci.org/CrossLead/crosslytics.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/CrossLead/crosslytics/badge.svg?branch=master)](https://coveralls.io/github/CrossLead/crosslytics?branch=master)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Tired of writing repetitive code to send the same analytics data to all your different tracking services? Or formatting the same data slightly differently for each service, like using [`eventAction`](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventAction) for Google Analytics but [`event_name`](https://developers.intercom.com/reference#event-model) for Intercom?

Use Crosslytics for a unified event definition and analytics reporting API: Define events once and report them to all your analytics services with a single call. We've also abstracted the services themselves into a pluggable [Tracker](#trackers) architecture so you can use only the services you need and quickly add support for new ones.

_Why not use [Segment](https://segment.com/)?_ We didn't want to add another hosted service dependency, so we came up with a light-weight library to send telemetry directly. The meat of Crosslytics lies with its unified datamodels. The models are in fact based on the [Segment spec](https://segment.com/docs/spec/), so usage semantics should actually be very similar.

# Usage

## Define events
Define events by implementing the `TrackedEvent` interface. Since the Crosslytics library is isomorphic, you only have to do this once. You can then share the same event definitions between your client and server code:
```ts
// events.ts
type DashboardPanelEventArgs = {
  'Panel ID': string,
  'Panel Type'?: number,
  'Panel Name'?: string
};

export class DashboardPanelCreated implements TrackedEvent<DashboardPanelEventArgs> {
  readonly name = 'DashboardPanel Created';
  readonly category = 'Dashboard';
  readonly argPriority: (keyof DashboardPanelEventArgs)[] = [
    'Panel ID',
    'Panel Type',
    'Panel Name'
  ];
  constructor(public args: DashboardPanelEventArgs) {}
}
```
Note that you don't necessarily have to use classes. You could, for instance, define factories that construct your `TrackedEvent`s:
```ts
type DashboardPanelCreated = TrackedEvent<DashboardPanelEventArgs>;
const makeDashboardPanelCreated = (args: DashboardPanelEventArgs): DashboardPanelCreated => {
  return {
    name: 'DashboardPanel Created',
    category: 'Dashboard',
    argPriority: [
        'Panel ID',
        'Panel Type',
        'Panel Name'
    ],
    args
  };
}
```

## Server-side
### Node.js with [Express](https://expressjs.com/)

Do a one-time setup of trackers in your application code using [Express middleware](https://expressjs.com/en/guide/writing-middleware.html):
```ts
// server.ts
import * as express from 'express';
import { Crosslytics, Identity } from 'crosslytics';
import { GoogleAnalyticsTracker } from 'crosslytics-node-google-analytics-tracker';
// Other trackers as desired, e.g.
// import { IntercomTracker } from 'crosslytics-node-intercom-tracker';

const app = express();
app.use((req: Request, res: Response, next: NextFunction) => {
  // Store a reference to use later
  req.telemetry = new Crosslytics();

  const gaTracker = new GoogleAnalyticsTracker('UA-12345678-9');
  req.telemetry.trackers.set(gaTracker.id, gaTracker);

  // Add more trackers as desired
  // const intercomTracker = new IntercomTracker('token');
  // req.telemetry.trackers.set('token', intercomTracker);

  // Set current user if you know who it is
  req.telemetry.identify({userId: ''});
  next();
});
```

Now you can report events to all trackers using a single call:
```ts
// dashboard.controller.ts
import { DashboardPanelCreated } from './events';
app.route('panel').post((req: Request, res: Response, next: NextFunction) => {
  ... // App stuff
  
  const ev = new DashboardPanelCreated({
    'Panel ID': '123456',
    'Panel Name': 'Test Panel'
  });
  req.telemetry.track(ev); // Wait if you want
});
```

## Client-side
### [React](https://facebook.github.io/react/) with [Redux](http://redux.js.org/)
We recommend adding analytics metadata to [Redux Actions](http://redux.js.org/docs/basics/Actions.html). For example, you could include an `action.analytics` property when you want an action to be tracked. This way, you can setup [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html) to report analytics and greatly reduce the amount of tracking code you need to write.

First, do a one-time setup of trackers and create a middleware:
```ts
// middleware.ts
import { Action, Middleware } from 'redux';
import { Crosslytics, Identity, TrackedEvent } from 'crosslytics';
import { GoogleAnalyticsTracker } from 'crosslytics-browser-google-analytics-tracker';
// Other trackers as desired, e.g.
// import { IntercomTracker } from 'crosslytics-browser-intercom-tracker';

export const crosslytics = new Crosslytics();

const gaTracker = new GoogleAnalyticsTracker('UA-12345678-9');
crosslytics.trackers.set(gaTracker.id, gaTracker);

// Add more trackers as desired
// const intercomTracker = new IntercomTracker('token');
// crosslytics.trackers.set('token', intercomTracker);

// Create a middleware to use with your Redux store
export function analyticsMiddleware(crosslytics: Crosslytics): Middleware {
  return () => next => <T, A extends TrackableAction<T>>(action: A) => {
    if (action.analytics) {
      crosslytics.track(action.analytics);
    }
    return next(action);
  };
}

// Woohoo TypeScript type-safety
interface TrackableAction<T> extends Action { analytics?: TrackedEvent<T> }
```

Then add the middleware to your Redux store (also one-time):
```ts
// store.ts
import { createStore, applyMiddleware } from 'redux';
import { analyticsMiddleware, crosslytics } from './middelware.ts';

let store = createStore(
  reducers, // defined elsewhere
  applyMiddleware(
    analyticsMiddleware
    // other middleware
  )
);

// If you're using a router, you can also track page views
const history = createHistory(); // your router of choice, e.g. 'react-router-redux'
history.listen(location => crosslytics.page({ url: location.pathname }));
```

Finally, you can now just add an `action.analytics` property to your actions and the events will be tracked automatically by the middleware. An example [async action creator](http://redux.js.org/docs/advanced/AsyncActions.html):
```ts
// dashboards.actions.ts

// See server example: this is the same event defintion across client and server
import { DashboardPanelCreated } from './events';

// Action for successful panel creation
export const panelCreated = (panel) => {
  const ev = new DashboardPanelCreated({
    'Panel ID': panel.id,
    'Panel Name': panel.name
  });
  return {
    type: 'PANEL_CREATED', // Could even reuse ev.name here
    payload: panel,
    analytics: ev
  };
};
```
If you further want to decouple event construction from your action creators, we recommend implementing a factory function to create the events and [dependency injecting](https://en.wikipedia.org/wiki/Dependency_injection) the factory into your action creators. For example, if you're using [`redux-thunk`](https://github.com/gaearon/redux-thunk), you could inject the factory via the [`withExtraArgument()`](https://github.com/gaearon/redux-thunk#injecting-a-custom-argument) method.
# Trackers
_Docs coming soon_