import React from 'react';
import PropTypes from 'prop-types';
import {registry, useAdminRouteTreeStructure} from '@jahia/ui-extender';
import {LayoutModule, SecondaryNav, SecondaryNavHeader, TreeView} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {Route, Switch, useHistory} from 'react-router-dom';
import {useNodeInfo} from '@jahia/data-helper';
import ProfileConstants from './Profile.constants';

const getRegistryTarget = (item, target) => {
    const found = item.targets.find(t => t.id === target || t.id.startsWith(target + '-'));
    return found.id + ':' + found.priority;
};

/**
 * Which entry the current address is on. An entry may name its own `route` (the profile page
 * itself does, so that bare /profile selects it); everything else is /profile/<key>.
 */
const getPageId = match => {
    const byRoute = registry.find({type: 'adminRoute', route: match.url});
    if (byRoute.length > 0) {
        return byRoute[0].key;
    }

    const param = match.params[0];
    const key = param && param.substr(1);
    return key && registry.get('adminRoute', key) ? key : undefined;
};

/**
 * Everything that is about the person signed in, behind the profile icon: their profile, and
 * whatever other modules contribute to the `profile` adminRoute target (their projects, their
 * tasks, their API tokens).
 *
 * A flat list, deliberately, where the dashboard this replaced wrapped its tree in a
 * single-item "My workspace" accordion. One accordion holding one group is a fold that never has
 * anything to hide -- it costs a click and tells the reader nothing.
 */
export const ProfileLayout = ({match}) => {
    const history = useHistory();
    const {t} = useTranslation('jahia-user-entries');
    const selectedPage = getPageId(match);
    const {tree, routes, allPermissions} = useAdminRouteTreeStructure('profile', selectedPage);
    const {node} = useNodeInfo({path: '/'}, {getPermissions: allPermissions});

    const data = tree
        .filter(route => route.requiredPermission === undefined || (node && (node[route.requiredPermission] !== false)))
        .map(route => ({
            id: route.key,
            label: t(route.label),
            isSelectable: route.isSelectable,
            iconStart: route.icon,
            route: route.route,
            treeItemProps: {
                'data-sel-role': route.key,
                'data-registry-key': route.type + ':' + route.key,
                'data-registry-target': getRegistryTarget(route, 'profile')
            }
        }))
        .getData();

    const filteredRoutes = routes && routes.filter(route => route.isSelectable && route.render);

    return (
        <LayoutModule
            navigation={
                /* The reader's own name as the section header: every entry below it already
                   begins with "My", so repeating "My profile" up here would say nothing. */
                <SecondaryNav header={<SecondaryNavHeader>{window.contextJsParameters.user.fullname}</SecondaryNavHeader>}>
                    <TreeView isReversed
                              data={data}
                              selectedItems={[selectedPage]}
                              onClickItem={app => history.push(app.route || (ProfileConstants.ROUTE + '/' + app.id))}/>
                </SecondaryNav>
            }
            content={
                <Switch>
                    {filteredRoutes.map(r => (
                        <Route key={r.key}
                               exact
                               strict
                               path={r.route || ProfileConstants.ROUTE + '/' + r.key}
                               render={props => r.render(props)}/>
                    ))}
                </Switch>
            }
        />
    );
};

ProfileLayout.propTypes = {
    match: PropTypes.object.isRequired
};

export default ProfileLayout;
