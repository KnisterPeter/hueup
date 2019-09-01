import { Routes, useNavigation } from "../store/navigation";

export default function Overview() {
  const navigation = useNavigation();

  navigation.to = Routes["/groups"];
  return null;
}
