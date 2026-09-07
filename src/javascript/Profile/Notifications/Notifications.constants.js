/**
 * The contract other modules implement to put notifications on the profile icon.
 *
 * A module contributes a SOURCE: a React component that fetches whatever it knows about and
 * reports a list of items. It is mounted once, high in the tree and outside the navigation, so it
 * keeps its list current whether or not anybody ever opens the panel -- the count on the icon is
 * the whole point, and a source that only ran on hover could never produce one.
 *
 *     import {registry} from '@jahia/ui-extender';
 *
 *     registry.add(PROFILE_NOTIFICATION_TYPE, 'my-module', {
 *         targets: [`${PROFILE_NOTIFICATION_TARGET}:10`],
 *         component: MyNotifications
 *     });
 *
 * `component` receives a single prop, `onReport`, and renders nothing:
 *
 *     const MyNotifications = ({onReport}) => {
 *         useEffect(() => { fetchThings().then(things => onReport(things.map(toItem))); }, [onReport]);
 *         return null;
 *     };
 *
 * Each item is `{id, title, subtitle?, date?, onClick?}` -- `date` an ISO-8601 instant, used to
 * order the merged list newest first and shown to the reader as a relative age. `onReport` is
 * stable across renders and ignores a report that names the same ids in the same order, so
 * calling it on every render is wasteful but not a loop.
 *
 * A source owns its own idea of "already seen": this module never marks anything read, it only
 * shows what it is told about. Report the unseen ones and nothing else.
 */
export const PROFILE_NOTIFICATION_TYPE = 'profile-notification';

export const PROFILE_NOTIFICATION_TARGET = 'profile-notifications';
