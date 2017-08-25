/**
 * A page visit. Logically equivalent to page() arguments in the Segment spec.
 *
 * @example
 * const page: Page = {
 *   url: 'https://crosslead.com',
 *   title: 'Homepage'
 * }
 * @see {@link https://segment.com/docs/spec/page/#properties}
 */
export interface Page {
  /**
   * Full URL of the page. Typically `location.href` if in a browser context.
   */
  url: string;

  /**
   * Title of the page. Typically `document.title` if in a browser context.
   */
  title?: string;

  /**
   * Full URL of the previous page. Typically `document.referrer` if in a browser context.
   */
  referrer?: string;
}
