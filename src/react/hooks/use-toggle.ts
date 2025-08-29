import { useCallback, useState } from 'react';

export const useToggle = (initialState?: boolean) => {
  const [toggled, setToggled] = useState(!!initialState);

  const toggle = useCallback(() => setToggled((toggled) => !toggled), []);

  return [toggled, toggle, setToggled] as const;
};
