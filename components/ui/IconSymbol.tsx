// Fallback for using MaterialIcons on Android and web.

// import MaterialIcons from "@expo/vector-icons/Ionicons";
import IonIcons from "@expo/vector-icons/Ionicons";
import { SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

export function IconSymbol({
	name,
	size = 24,
	color,
	style,
}: {
	name: ComponentProps<typeof IonIcons>["name"];
	size?: number;
	color: string | OpaqueColorValue;
	style?: StyleProp<TextStyle>;
	weight?: SymbolWeight;
}) {
	return <IonIcons color={color} size={size} name={name} style={style} />;
}
