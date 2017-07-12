import { Value } from './value';

/**
 * A group of users. Logically equivalent to a Group in the Segment spec.
 * @see {@link https://segment.com/docs/spec/group/}
 */
export interface Organization {
  organizationId: string;
  traits?: {
    name: string;
    [key: string]: Value;
  };
}
