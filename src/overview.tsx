import { Routes, useNavigation } from "./store/navigation";

export function Overview() {
  const navigation = useNavigation();

  navigation.to = Routes["/groups"];
  return null;
}
