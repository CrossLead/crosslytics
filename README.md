# Crosslytics
[![Build Status](https://travis-ci.org/CrossLead/crosslytics.svg?branch=master)](https://travis-ci.org/CrossLead/crosslytics.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/CrossLead/crosslytics/badge.svg?branch=master)](https://coveralls.io/github/CrossLead/crosslytics?branch=master)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# Usage

## Isomorphic/Do-these-once!
Define some events in your library code:
```ts
// events.ts
type DashboardPanelEventArgs = {
  'Panel ID': string,
  'Panel Type'?: number,
  'Panel Name'?: string
};

export class DashboardPanelCreated extends TrackedEvent<DashboardPanelEventArgs> {
  readonly name = 'DashboardPanel Created';
  readonly category = 'Dashboard';
  readonly argPriority: (keyof DashboardPanelEventArgs)[] = [
    'Panel ID',
    'Panel Type',
    'Panel Name'
  ];
}
```
## Server-side
### Node.js with [Express](https://expressjs.com/)

Use middleware to setup trackers in your application code:
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
  // Set current user if you know who it is
  gaTracker.identify({userId: ''});
  req.telemetry.trackers.set(gaTracker.id, gaTracker);

  // Add more trackers as desired
  // const intercomTracker = new IntercomTracker('token');
  // req.telemetry.trackers.set('token', intercomTracker);
  next();
});
```

Report an event to all trackers using a single call:
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
_TBD_