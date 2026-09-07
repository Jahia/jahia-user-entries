import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {registry} from '@jahia/ui-extender';
import {PROFILE_NOTIFICATION_TARGET, PROFILE_NOTIFICATION_TYPE} from './Notifications.constants';
import NotificationsPanel from './NotificationsPanel';

const EMPTY = {items: [], openPanel: () => {}, closePanel: () => {}};

const ProfileNotificationsContext = createContext(EMPTY);

/**
 * `{items, openPanel(rect), closePanel()}` for whatever wants to show the count and open the list
 * -- the profile nav item, in practice.
 */
export const useProfileNotifications = () => useContext(ProfileNotificationsContext);

// Long enough to cross the gap between the icon and the panel without it vanishing under the
// pointer, short enough that leaving it does not feel sticky.
const CLOSE_DELAY_MS = 200;

// Two reports are "the same news" when they name the same items in the same order. Compared by id
// rather than by identity because a source that rebuilds its array on every render is the normal
// case, not a bug -- without this the first such source would loop the tree forever.
const sameItems = (a, b) => a.length === b.length && a.every((item, index) => item.id === b[index].id);

const Source = ({source, onReport}) => {
    const Component = source.component;
    const report = useCallback(items => onReport(source.key, items), [onReport, source.key]);
    return <Component onReport={report}/>;
};

Source.propTypes = {
    source: PropTypes.shape({
        key: PropTypes.string.isRequired,
        component: PropTypes.elementType.isRequired
    }).isRequired,
    onReport: PropTypes.func.isRequired
};

/**
 * Mounts every contributed notification source, holds what they report, and owns the hover panel.
 *
 * Registered as an `app` entry (see init.js) rather than rendered by the profile item itself, for
 * two reasons. The sources have to stay mounted while the reader is anywhere in the app, or the
 * count would exist only while the pointer was over the icon. And the profile item has to keep
 * returning a single PrimaryNavItem -- PrimaryNavGroup clones it to attach the item's role and
 * registry data attributes, and a fragment would silently swallow them -- so the panel cannot
 * hang off it as a sibling. The item reports where it is; the panel is drawn from up here.
 */
export const ProfileNotificationsProvider = ({children}) => {
    // Read on every render rather than memoised once: sources arrive from other modules'
    // app-init callbacks, and nothing in the shell promises those have all run before this first
    // renders. A memo on [] would freeze whatever happened to be registered at that instant --
    // an empty list, if this module's own callback ran first. The scan is over a handful of
    // registry entries, and a source appearing late simply mounts then, like any other child.
    const sources = registry.find({type: PROFILE_NOTIFICATION_TYPE, target: PROFILE_NOTIFICATION_TARGET});
    const [reported, setReported] = useState({});
    // The profile item's rectangle at the moment the pointer arrived, which is what the panel is
    // positioned from; null means closed. Read on hover rather than on render because the rail
    // scrolls, collapses and expands.
    const [anchor, setAnchor] = useState(null);
    const closeTimer = useRef(null);

    const report = useCallback((key, items) => {
        setReported(current => (sameItems(current[key] || [], items) ? current : {...current, [key]: items}));
    }, []);

    const cancelClose = useCallback(() => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    }, []);

    const openPanel = useCallback(rect => {
        cancelClose();
        setAnchor(rect);
    }, [cancelClose]);

    const closePanel = useCallback(() => {
        cancelClose();
        closeTimer.current = setTimeout(() => setAnchor(null), CLOSE_DELAY_MS);
    }, [cancelClose]);

    useEffect(() => cancelClose, [cancelClose]);

    const items = useMemo(() => {
        // Newest first, and stable for anything undated: an item with no date keeps the position
        // its source gave it rather than being flung to one end of the list. Built from what was
        // reported rather than by walking `sources`, so it does not churn on every render.
        const merged = Object.values(reported).flat();
        return merged
            .map((item, index) => ({item, index}))
            .sort((a, b) => {
                if (!a.item.date || !b.item.date) {
                    return a.index - b.index;
                }

                return b.item.date.localeCompare(a.item.date);
            })
            .map(entry => entry.item);
    }, [reported]);

    const value = useMemo(() => ({items, openPanel, closePanel}), [items, openPanel, closePanel]);

    return (
        <ProfileNotificationsContext.Provider value={value}>
            {sources.map(source => <Source key={source.key} source={source} onReport={report}/>)}
            {children}
            {anchor && items.length > 0 && (
                <NotificationsPanel anchor={anchor}
                                    items={items}
                                    language={window.contextJsParameters.uilang || 'en'}
                                    onMouseEnter={cancelClose}
                                    onMouseLeave={closePanel}/>
            )}
        </ProfileNotificationsContext.Provider>
    );
};

ProfileNotificationsProvider.propTypes = {
    children: PropTypes.node
};
