import React, { memo } from "react";
import { StyleSheet, SafeAreaView, View, Dimensions } from "react-native";
import type { BaseButtonProps } from "../../../components/Button";
import Button from "../../../components/Button";
import BottomModal from "../../../components/BottomModal";

const { height } = Dimensions.get("window");

type Props = {
  isOpened: Boolean,
  onClose: Function,
  children: Node,
  actions: Array<BaseButtonProps>,
};

const ActionModal = ({ isOpened, onClose, children, actions = [] }: Props) => {
  return (
    <BottomModal
      isOpened={isOpened}
      onClose={onClose}
      containerStyle={styles.modal}
    >
      <SafeAreaView style={styles.root}>
        {children}
        <View style={styles.modalFooter}>
          {actions.map(({ title, onPress, type = "primary", ...props }, i) => (
            <Button
              key={i}
              containerStyle={styles.actionButton}
              type={type}
              title={title}
              onPress={onPress}
              {...props}
            />
          ))}
        </View>
      </SafeAreaView>
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  root: {
    maxHeight: height - 100,
    flexDirection: "column",
    paddingTop: 36,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  modal: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalFooter: {
    width: "100%",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  actionButton: {
    height: 48,
    borderRadius: 3,
  },
});

export default memo(ActionModal);
