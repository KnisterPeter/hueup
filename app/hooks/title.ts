import { useEffect } from "react";
import { useNavigation } from "../store/navigation";

export const useTitle = (title: string) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.title = title;
    return () => (navigation.title = undefined);
  }, [navigation]);
};
