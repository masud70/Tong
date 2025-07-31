import { StyleSheet } from "react-native";

export const Const = {
	color: {
		background: "#0f2032",
	},
	text: {
		size: {
			xs: 12,
			sm: 15,
			md: 18,
			lg: 20,
			xl: 25,
			xxl: 28,
			xxxl: 35,
		},
		family: {
			spaceMono: "SpaceMono",
			Roboto: "Roboto",
			RobotoSemiBold: "RobotoSemiBold",
			RobotoBold: "RobotoBold",
			RobotoExtraBold: "RobotoExtraBold",
		},
	},
	buttonColor: {
		primary: "#23B82B",
		secondary: "#FFBC4C",
		danger: "#FF2B22",
		transparent: "transparent",
	},
};

export const styles = StyleSheet.create({
	subText: {
		opacity: 0.6,
	},
	xsText: {
		fontFamily: Const.text.family.Roboto,
		fontSize: Const.text.size.xs,
	},
	smallText: {
		fontFamily: Const.text.family.Roboto,
		fontSize: Const.text.size.sm,
	},
	smallTextBold: {
		fontFamily: Const.text.family.RobotoSemiBold,
		fontSize: Const.text.size.sm,
	},
	regularText: {
		fontFamily: Const.text.family.Roboto,
		fontSize: Const.text.size.md,
	},
	regularTextBold: {
		fontFamily: Const.text.family.RobotoBold,
		fontSize: Const.text.size.md,
		fontStyle: "normal",
	},
	largeText: {
		fontFamily: Const.text.family.Roboto,
		fontSize: Const.text.size.xl,
		fontStyle: "normal",
	},
	largeTextBold: {
		fontFamily: Const.text.family.RobotoBold,
		fontSize: Const.text.size.xl,
		fontStyle: "normal",
	},
	extraLargeText: {
		fontSize: Const.text.size.xxl,
		width: 300,
		textAlign: "center",
		fontStyle: "normal",
		fontFamily: Const.text.family.RobotoSemiBold,
	},
	logoText: {
		fontSize: Const.text.size.xxxl,
		fontStyle: "normal",
		fontFamily: Const.text.family.RobotoExtraBold,
	},
});
