import { useObserver } from "mobx-react";
import React, { FC } from "react";
import { Bridge } from "./store/bridge";
import { useNavigation } from "./store/navigation";

export const Overview: FC<{ bridge: Bridge }> = ({ bridge }) => {
  const navigation = useNavigation();

  return useObserver(() =>
    navigation.view ? <navigation.view bridge={bridge} /> : null
  );
};
