import React from 'react';

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

// Const Workflow = () => {
//     console.log('workflow');
//     useEffect(() => {
//         console.log('Run effect');
//         checkAuthoringApi = setInterval(() => {
//             console.log('Check workflow');
//             renderWorkflow();
//         },
//         200);
//
//         return () => {
//             console.log('Unmount');
//             if (checkAuthoringApi) {
//                 clearInterval(checkAuthoringApi);
//             }
//         };
//     }, []);
//
//     return (
//         <div style={{
//             height: '100%',
//             width: '100%',
//             display: 'flex',
//             position: 'fixed'
//         }}
//              id="workflowComponent"
//         >
//             <h1>Loading Workflow</h1>
//         </div>
//     );
// };

// This fixes Firefox issue when useEffect hook is not called, instead it seems that a click listener is attached to
// the body so that clicking ANYWHERE in the window (yes, even empty areas) leads to execution of the hook. See BACKLOG-12880
class Workflow extends React.Component {
    componentDidMount() {
        checkAuthoringApi = setInterval(() => {
            renderWorkflow();
        },
        200);
    }

    componentWillMount() {
        if (checkAuthoringApi) {
            clearInterval(checkAuthoringApi);
        }
    }

    render() {
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
    }
}

export default Workflow;
