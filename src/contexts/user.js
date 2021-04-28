import React from 'react';

/** User context for storing the users detail. To be used by components in the SPA. */
const UserContext = React.createContext();
UserContext.displayName = 'User Context';

export default UserContext;
