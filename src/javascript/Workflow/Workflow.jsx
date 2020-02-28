import React, {useEffect} from 'react';

let renderWorkflow = function () {
    if (window.authoringApi !== undefined && window.authoringApi.openWorkflow !== undefined) {
        clearInterval(checkAuthoringApi);
        let elementById = document.getElementById('workflowComponent');
        if (elementById !== null) {
            elementById.lastChild.remove();
            window.authoringApi.openWorkflow('workflowComponent');
        }
    }
};

let checkAuthoringApi;

const Workflow = () => {
    useEffect(() => {
        if (window.authoringApi === undefined || window.authoringApi.openWorkflow === undefined) {
            checkAuthoringApi = setInterval(() => {
                renderWorkflow();
            },
            100);
        }

        renderWorkflow();
    }, []);
    return (
        <div style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            position: 'fixed'
        }}
             id="workflowComponent"
        >
            <h1>Loading Workflow</h1>
        </div>
    );
};

export default Workflow;
