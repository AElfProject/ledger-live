import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Icon, Text } from "@ledgerhq/react-ui";
import { useRampCatalog } from "@ledgerhq/live-common/platform/providers/RampCatalogProvider/index";
import { getAllSupportedCryptoCurrencyTickers } from "@ledgerhq/live-common/platform/providers/RampCatalogProvider/helpers";
import { Account, AccountLike } from "@ledgerhq/types-live";
import { closeModal, openModal } from "~/renderer/actions/modals";
import { useProviders } from "~/renderer/screens/exchange/Swap2/Form";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import EntryButton from "~/renderer/components/EntryButton/EntryButton";
import CoinsIcon from "./assets/CoinsIcon";
import { trackPage, track } from "~/renderer/analytics/segment";
import { stakeDefaultTrack } from "~/renderer/screens/stake/constants";
import { CryptoCurrency } from "@ledgerhq/types-cryptoassets";

const useText = (entryPoint: "noFunds" | "getFunds", currency: CryptoCurrency) => {
  const { t } = useTranslation();

  const textMap = {
    noFunds: {
      title: t("stake.noFundsModal.text", { coin: currency.ticker }),
      body: t("stake.noFundsModal.description"),
    },
    getFunds: {
      title: t("stake.getFundsModal.text", { coin: currency.ticker }),
      body: t("stake.getFundsModal.description"),
    },
  };

  return textMap[entryPoint];
};

interface NoFundsStakeModalProps {
  account: AccountLike | undefined | null;
  parentAccount?: Account | undefined | null;
  entryPoint?: "get-funds" | undefined;
}

const NoFundsStakeModal = ({ account, parentAccount, entryPoint }: NoFundsStakeModalProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const rampCatalog = useRampCatalog();
  const { providers, storedProviders } = useProviders();

  const onRampAvailableTickers: string[] = useMemo(() => {
    if (!rampCatalog.value) {
      return [];
    }
    return getAllSupportedCryptoCurrencyTickers(rampCatalog.value.onRamp);
  }, [rampCatalog.value]);

  const swapAvailableIds = useMemo(() => {
    return providers || storedProviders
      ? (providers || storedProviders)!
          .map(({ pairs }) => pairs.map(({ from, to }) => [from, to]))
          .flat(2)
      : [];
  }, [providers, storedProviders]);

  const currency: CryptoCurrency = parentAccount?.currency || (account as Account).currency;

  const text = useText(entryPoint === "get-funds" ? "getFunds" : "noFunds", currency);

  const availableOnBuy = currency && onRampAvailableTickers.includes(currency.ticker.toUpperCase());

  const availableOnSwap = useMemo(() => {
    return currency && swapAvailableIds.includes(currency.id);
  }, [currency, swapAvailableIds]);

  const availableOnReceive = true;

  const modalName = "MODAL_NO_FUNDS_STAKE";

  const onBuy = useCallback(() => {
    track("button_clicked", {
      button: "buy",
      page: history.location.pathname,
      ...stakeDefaultTrack,
    });

    dispatch(closeModal(modalName));

    history.push({
      pathname: "/exchange",
      state: {
        currency: currency.id,
        mode: "buy",
      },
    });
  }, [currency, history, dispatch]);

  const onSwap = useCallback(() => {
    track("button_clicked", {
      button: "swap",
      page: history.location.pathname,
      ...stakeDefaultTrack,
    });

    dispatch(closeModal(modalName));

    history.push({
      pathname: "/swap",
      state: {
        defaultCurrency: currency,
        defaultAccount: account,
        defaultParentAccount: parentAccount,
      },
    });
  }, [currency, account, parentAccount, history, dispatch]);

  const onReceive = useCallback(() => {
    track("button_clicked", {
      button: "receive",
      page: history.location.pathname,
      ...stakeDefaultTrack,
    });

    dispatch(closeModal(modalName));

    dispatch(openModal("MODAL_RECEIVE", { parentAccount, account }));
  }, [parentAccount, account, dispatch, history]);

  const onClose = useCallback(() => {
    dispatch(closeModal(modalName));
  }, [dispatch]);

  useEffect(() => {
    trackPage("Stake", "Service_modal", {
      source: history.location.pathname,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionsMap: Record<"buy" | "swap" | "receive", boolean> = {
    buy: availableOnBuy,
    swap: availableOnSwap,
    receive: availableOnReceive,
  };

  /** Capitalise first word for i18n list formatter to produce title e.g. "Buy or swap" */
  const availableActionsFormatted = Object.keys(actionsMap)
    .filter(action => actionsMap[action as keyof typeof actionsMap])
    .map(action => t(`stake.noFundsModal.options.${action}.title`).toLowerCase())
    .map((action, i) =>
      i === 0 ? `${action.substring(0, 1).toUpperCase()}${action.slice(1)}` : action,
    );

  return (
    <Modal name={modalName} centered>
      <ModalBody
        title={t("stake.noFundsModal.title", {
          actions: availableActionsFormatted,
          style: "long",
          type: "disjunction",
        })}
        onClose={onClose}
        render={() => (
          <Box paddingX={20}>
            <Box alignItems="center" mb={24}>
              <CoinsIcon />
            </Box>
            <Box textAlign="center" mb={16}>
              <Text fontWeight="semiBold">{text.title}</Text>
            </Box>
            <Box textAlign="center" mb={24}>
              <Text fontSize={13} fontWeight="regular" color="neutral.c70">
                {text.body}
              </Text>
            </Box>
            {availableOnBuy && (
              <EntryButton
                Icon={() => <Icon name="BuyCryptoAlt" />}
                title={t("stake.noFundsModal.options.buy.title")}
                body={t("stake.noFundsModal.options.buy.body")}
                onClick={onBuy}
                showChevron
              />
            )}
            {availableOnSwap && (
              <EntryButton
                Icon={() => <Icon name="BuyCrypto" />}
                title={t("stake.noFundsModal.options.swap.title")}
                label={t("stake.noFundsModal.options.swap.label")}
                body={t("stake.noFundsModal.options.swap.body")}
                onClick={onSwap}
                showChevron
              />
            )}
            {availableOnReceive && (
              <EntryButton
                Icon={() => <Icon name="ArrowToBottom" />}
                title={t("stake.noFundsModal.options.receive.title")}
                body={t("stake.noFundsModal.options.receive.body")}
                onClick={onReceive}
                showChevron
              />
            )}
          </Box>
        )}
      />
    </Modal>
  );
};

export default NoFundsStakeModal;
