import React from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { RectButton } from "react-native-gesture-handler";

import LText from "../LText";
import colors from "../../colors";
import { useBanner } from "./hooks";
import ExchangeIcon from "../../icons/Exchange";
import CloseIcon from "../../icons/Close";

export function BuyCryptoBanner() {
  const { t } = useTranslation();

  const [isDismissed, dismiss] = useBanner("EXCHANGE_BUY_CRYPTO_BANNER");

  if (isDismissed) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <RectButton style={styles.closeButton} onPress={dismiss}>
        <CloseIcon size={18} color={colors.grey} />
      </RectButton>
      <View style={styles.iconContainer}>
        <ExchangeIcon size={22} color={colors.live} />
      </View>
      <View style={styles.contentContainer}>
        <LText style={styles.title} bold>
          {t("banner.exchangeBuyCrypto.title")}
        </LText>
        <LText semiBold style={styles.description}>
          {t("banner.exchangeBuyCrypto.description")}
        </LText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    margin: 16,
    minHeight: 128,
    padding: 16,
    position: "relative",
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: colors.darkBlue,
    flexDirection: "row",
    marginBottom: 6,
  },
  bannerImage: {
    position: "absolute",
    right: 24,
    bottom: -38,
  },
  title: {
    color: colors.grey,
    fontSize: 10,
    lineHeight: 15,
    marginRight: 90,
    marginBottom: 4,
  },
  contentContainer: {},
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: colors.white,
    marginBottom: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  description: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 19,
    marginRight: 90,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
