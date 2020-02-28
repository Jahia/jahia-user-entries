import React from 'react';
import Iframe from 'react-iframe';
import {useSelector} from 'react-redux';

let path = (locale, user) => {
    return `/cms/dashboardframe/default/${locale}${user}.me.html?redirect=false`;
};

export default function () {
    const redux = useSelector(state => ({language: state.language}));

    return <Iframe url={window.contextJsParameters.contextPath + path(redux.language, window.contextJsParameters.currentUserPath)} width="100%" height="100%"/>;
}
