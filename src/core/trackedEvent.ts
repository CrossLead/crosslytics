import { Value } from './value';

/**
 * A user action. Logically equivalent to an Event in the Segment spec.
 * Pass in a type defining your event's arguments.
 * @example
 * type DashboardPanelEventArgs = {
 *   'Panel ID': string,
 *   'Panel Color'?: string,
 *   'Panel Type'?: number,
 *   'Panel Name'?: string
 * };
 * class DashboardPanelCreated extends TrackedEvent<DashboardPanelEventArgs> {
 *   readonly name = 'DashboardPanel Created';
 *   readonly category = 'Dashboard';
 *   readonly argPriority: (keyof DashboardPanelEventArgs)[] = [
 *     'Panel ID',
 *     'Panel Type',
 *     'Panel Name',
 *     'Panel Color'
 *   ];
 * }
 * @see {@link https://segment.com/docs/spec/track/#event}
 */
export abstract class TrackedEvent<T> {
  /**
   * We suggest human readable names consisting of noun + past tense verb.
   * @see {@link https://segment.com/academy/collecting-data/naming-conventions-for-clean-data/}
   */
  public abstract readonly name: string;
  public abstract readonly category: string;
  public organizationId: string;

  /**
   * Many trackers only support a limited number of arguments. For example,
   * Google Analytics only supports 2: a string Event Label and an integer 
   * Event Value. By defining a priority to your arguments here, trackers
   * will submit the highest priority args satisfying their constraints. In
   * the Google Analytics case, the tracker will submit the first string match
   * as the Label and the first integer match as the Value.
   */
  public abstract readonly argPriority: Array<keyof T>;

  constructor(public args: T) {}
}
