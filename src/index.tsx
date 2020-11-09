import * as React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { SettingsProvider } from './settings-context';
import { bootstrapSettings, DEFAULT_PLACE, PATH_PLACES } from './utils';
import { App, NotFound } from './pages';

const Root = () => <Redirect to={DEFAULT_PLACE} />;

const Init: React.FC = () => {
    return (
        <SettingsProvider settings={bootstrapSettings()}>
            <Router>
                <Switch>
                    <Route exact path="/" component={Root} />
                    <Route exact path={PATH_PLACES} component={App} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        </SettingsProvider>
    );
};

Init.displayName = 'Init';

ReactDom.render(<Init />, document.getElementById('root'));
