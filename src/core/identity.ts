import { Organization } from './organization';
import { Value } from './value';

/**
 * A user that you're tracking. Logically equivalent to an Identity in the Segment spec.
 * @see {@link https://segment.com/docs/spec/identify/#identities}
 */
export interface Identity {
  userId: string;
  organization?: Organization;
  traits?: {
    email: string;
    name: string;
    [key: string]: Value;
  };
}
