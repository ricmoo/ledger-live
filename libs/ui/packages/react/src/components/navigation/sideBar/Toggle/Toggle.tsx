import React, { useContext } from "react";
import styled from "styled-components";

import ArrowLeftIcon from "@ledgerhq/icons-ui/react/ArrowLeftMedium";
import ArrowRightIcon from "@ledgerhq/icons-ui/react/ArrowRightMedium";
import TransitionInOut from "../../../transitions/TransitionInOut";
import SideBarContext from "../../../navigation/sideBar";

const ToggleButtonContainer = styled(TransitionInOut)`
  --ll-side-bar-toggle-button-size: ${p => p.theme.space[10]}px;

  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: var(--ll-side-bar-toggle-button-size);
  right: calc(var(--ll-side-bar-toggle-button-size) / -2);
  cursor: pointer;

  background: ${p => p.theme.colors.neutral.c20};
  border: 1px solid ${p => p.theme.colors.neutral.c100};
  border-radius: 50%;
  width: var(--ll-side-bar-toggle-button-size);
  height: var(--ll-side-bar-toggle-button-size);
`;

type ToggleButtonProps = { isDisplayed: boolean };
const ToggleButton = ({ isDisplayed }: ToggleButtonProps): JSX.Element => {
  const { isExpanded, onToggle } = useContext(SideBarContext);

  return (
    <ToggleButtonContainer
      timeout={200}
      in={isDisplayed}
      appear
      unmountOnExit
      onClick={onToggle}
      role="button"
    >
      {isExpanded ? <ArrowLeftIcon /> : <ArrowRightIcon />}
    </ToggleButtonContainer>
  );
};

export default ToggleButton;
