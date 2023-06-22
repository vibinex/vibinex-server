import React from 'react';
import { RudderstackClientSideEvents } from "../utils/rudderstack_initialize";

interface RudderContextType {
  rudderEventMethods: RudderstackClientSideEvents | null;
}

const RudderContext = React.createContext<RudderContextType>({
  rudderEventMethods: null,
});

export default RudderContext;