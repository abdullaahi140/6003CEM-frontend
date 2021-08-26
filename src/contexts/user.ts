import React from 'react';
import { Dispatch, UserState } from '../react-app-env';

/** User context for storing the users detail. To be used by components in the SPA. */
const UserContext = React.createContext<{
	state: UserState;
	dispatch: Dispatch
} | undefined>(undefined);
UserContext.displayName = 'User Context';

export default UserContext;
