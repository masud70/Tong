import { format } from "date-fns";
import { Dimensions } from "react-native";

export const useCommon = () => {
	const { width, height } = Dimensions.get("window");
	const formatDT = (date: Date) => {
		return format(date, "dd-MM-yy hh:mm a");
	};
	const formatTime = (date: Date): string => {
		try {
			date = new Date(date);
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch (error) {
			console.log("Format Time Error:", error);
			return "Unknown";
		}
	};

	const formatDate = (date: Date): string => {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		date = new Date(date);
		try {
			if (date.toDateString() === today.toDateString()) {
				return "Today";
			} else if (date.toDateString() === yesterday.toDateString()) {
				return "Yesterday";
			} else {
				return date.toLocaleDateString();
			}
		} catch (error) {
			console.log("Format Date Error:", error);
			return "Unknown";
		}
	};

	return { width, height, formatDT, formatTime, formatDate };
};
