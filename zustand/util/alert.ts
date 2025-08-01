import { Alert } from "react-native";

export const showAlert = (head: string, body: string) => {
	Alert.alert(head, body);
};
