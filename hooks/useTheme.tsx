import { Colors } from "@/constants/Colors";
import { useAuthStore } from "@/zustand/stores";

export const useTheme = () => {
	const colorScheme = useAuthStore.use.theme();
	const setTheme = useAuthStore.use.setTheme();

	const theme = {
		color: Colors[colorScheme],
	};
	return { theme, setTheme };
};
