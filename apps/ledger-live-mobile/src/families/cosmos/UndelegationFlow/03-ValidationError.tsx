import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { getAccountCurrency } from "@ledgerhq/live-common/account/index";
import { useTheme } from "@react-navigation/native";
import { accountScreenSelector } from "../../../reducers/accounts";
import { TrackScreen } from "../../../analytics";
import ValidateError from "../../../components/ValidateError";
import type {
  BaseComposite,
  StackNavigatorNavigation,
  StackNavigatorProps,
} from "../../../components/RootNavigator/types/helpers";
import type { CosmosUndelegationFlowParamList } from "./types";
import type { BaseNavigatorStackParamList } from "../../../components/RootNavigator/types/BaseNavigator";
import { ScreenName } from "../../../const";

type Props = BaseComposite<
  StackNavigatorProps<CosmosUndelegationFlowParamList, ScreenName.CosmosUndelegationValidationError>
>;

export default function ValidationError({ navigation, route }: Props) {
  const { colors } = useTheme();
  const { account } = useSelector(accountScreenSelector(route));
  const { ticker } = getAccountCurrency(account);
  const onClose = useCallback(() => {
    navigation.getParent<StackNavigatorNavigation<BaseNavigatorStackParamList>>().pop();
  }, [navigation]);
  const retry = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const error = route.params.error;
  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <TrackScreen
        category="CosmosUndelegation"
        name="ValidationError"
        flow="stake"
        action="undelegation"
        currency={ticker}
      />
      <ValidateError error={error} onRetry={retry} onClose={onClose} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
