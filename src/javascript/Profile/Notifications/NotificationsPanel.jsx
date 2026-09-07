import React from 'react';
import {createPortal} from 'react-dom';
import PropTypes from 'prop-types';
import {Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import styles from './NotificationsPanel.scss';

const MINUTE = 60000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * "3 hours ago" rather than a timestamp: what a notification is asking is whether this is news,
 * and a reader answers that by subtracting the date from today. Doing that subtraction for them
 * is the whole value of the line.
 */
const relativeAge = (iso, language) => {
    if (!iso) {
        return null;
    }

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const elapsed = Date.now() - date.getTime();
    const format = new Intl.RelativeTimeFormat(language, {numeric: 'auto'});
    if (elapsed < HOUR) {
        return format.format(-Math.round(elapsed / MINUTE), 'minute');
    }

    if (elapsed < DAY) {
        return format.format(-Math.round(elapsed / HOUR), 'hour');
    }

    return format.format(-Math.round(elapsed / DAY), 'day');
};

/**
 * The hover panel, in a portal on document.body.
 *
 * Not a child of the nav item: the rail is a narrow, clipping column, and a panel rendered inside
 * it would either be cut off or force the rail to scroll. Positioned from the item's own bounding
 * rect instead, and `position: fixed`, so it stays put against a rail that scrolls under it.
 */
const NotificationsPanel = ({anchor, items, language, onMouseEnter, onMouseLeave}) => {
    const {t} = useTranslation('jahia-user-entries');

    // Bottom-aligned with the icon and pushed clear of the rail. Clamped so a long list opening
    // from an icon near the floor cannot run off the top of the window.
    const bottom = Math.max(8, window.innerHeight - anchor.bottom);

    return createPortal(
        <div className={styles.panel}
             style={{left: anchor.right + 8, bottom}}
             role="status"
             /* Stable across the CSS-modules hashing, so a test can find the panel. */
             data-sel-role="profile-notifications"
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseLeave}
        >
            <Typography isNowrap isUpperCase variant="caption" weight="semiBold" className={styles.title}>
                {t('userEntries.notifications.title')}
            </Typography>
            <ul className={styles.list}>
                {items.map(item => {
                    const age = relativeAge(item.date, language);
                    return (
                        <li key={item.id} className={styles.item}>
                            {/* A button only where the source gave somewhere to go: an entry that
                                does nothing on click should not look as though it would. */}
                            {item.onClick ? (
                                <button type="button"
                                        className={styles.action}
                                        onClick={item.onClick}
                                >
                                    <Typography variant="body" weight="semiBold">{item.title}</Typography>
                                </button>
                            ) : (
                                <Typography variant="body" weight="semiBold">{item.title}</Typography>
                            )}
                            {item.subtitle && (
                                <Typography variant="caption" weight="light">{item.subtitle}</Typography>
                            )}
                            {age && (
                                <Typography variant="caption" weight="light" className={styles.age}>
                                    {age}
                                </Typography>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>,
        document.body
    );
};

NotificationsPanel.propTypes = {
    anchor: PropTypes.shape({
        right: PropTypes.number.isRequired,
        bottom: PropTypes.number.isRequired
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        date: PropTypes.string,
        onClick: PropTypes.func
    })).isRequired,
    language: PropTypes.string.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
};

export default NotificationsPanel;
