import styled, { createGlobalStyle } from "styled-components";
import Text from "~/renderer/components/Text";
import { rgba } from "~/renderer/styles/helpers";
const MockedGlobalStyle = createGlobalStyle`
  *, :before, :after {
    caret-color: transparent !important;
    transition-property: none !important;
    animation: none !important;
  }
`;
const Item = styled(Text)`
  color: white;
  padding: 5px;
  background: ${p => p.theme.colors.alertRed};
  opacity: 0.9;
`;
const MockContainer = styled.div``;
const EllipsesText = styled(Text).attrs({
  ff: "Inter|Regular",
  color: "palette.text.shade100",
  fontSize: 3,
})`
  margin-left: 10px;
  overflow: hidden;
  max-width: 20ch;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const DebugWrapper = styled.div`
  &:empty {
    display: none;
  }
  ${process.env.DISABLE_MOCK_POINTER_EVENTS === "true" ? "pointer-events: none;" : ""}
  display: flex;
  flex-direction: row;
  position: absolute;
  left: 8px;
  bottom: 8px;
  color: black;
  border-radius: 4px;
  overflow: hidden;
  border: 4px solid ${p => rgba(p.theme.colors.alertRed, 0.9)};
  opacity: 0.9;
  z-index: 9999;
  background: #dededeaa;
`;
export { Item, MockContainer, EllipsesText, MockedGlobalStyle, DebugWrapper };
