import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTransition, animated } from "react-spring";
import IconArrowRight from "~/renderer/icons/ArrowRight";
import Box, { Card } from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import TimeBasedProgressBar from "~/renderer/components/Carousel/TimeBasedProgressBar";
import IconCross from "~/renderer/icons/Cross";
import { getTransitions, useDefaultSlides } from "~/renderer/components/Carousel/helpers";
import { setCarouselVisibility } from "~/renderer/actions/settings";
import { carouselVisibilitySelector } from "~/renderer/reducers/settings";
import { Trans } from "react-i18next";
import { track } from "~/renderer/analytics/segment";

const CarouselWrapper = styled(Card)`
  position: relative;
  height: 100px;
  margin: 20px 0;
`;

const Close = styled.div`
  position: absolute;
  color: ${p => p.theme.colors.palette.text.shade30};
  top: 16px;
  right: 16px;
  cursor: pointer;
  &:hover {
    color: ${p => p.theme.colors.palette.text.shade100};
  }
`;

const Previous = styled.div`
  position: absolute;
  color: ${p => p.theme.colors.palette.text.shade30};
  bottom: 16px;
  right: 42px;
  cursor: pointer;
  transform: rotate(180deg);
  &:hover {
    color: ${p => p.theme.colors.palette.text.shade100};
  }
`;

const Next = styled.div`
  position: absolute;
  color: ${p => p.theme.colors.palette.text.shade30};
  bottom: 11px;
  right: 16px;
  cursor: pointer;
  &:hover {
    color: ${p => p.theme.colors.palette.text.shade100};
  }
`;

// NB left here because it handles the transitions
const ProgressBarWrapper = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 100;
  width: 100%;
  display: none;
`;

const Bullets = styled.div<{ index: number }>`
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  & > div {
    cursor: pointer;
    & > span {
      display: block;
      border-radius: 6px;
      height: 6px;
      width: 6px;
      background: ${p => p.theme.colors.palette.text.shade40};
    }
    padding: 15px 5px;
    margin-bottom: -15px;
    &:nth-child(${p => p.index + 1}) > span {
      background: ${p => p.theme.colors.palette.text.shade80};
    }
  }
`;

const Disclaimer = styled(Card)`
  padding: 40px;
  height: 100px;
  margin: 20px 0;
  background: ${p => p.theme.colors.palette.background.paper};
  text-align: center;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const Slides = styled.div`
  width: 100%;
  height: 100px;
  border-radius: 4px;
  perspective: 1000px;
  overflow: hidden;
  background: ${p => p.theme.colors.palette.background.paper};

  & > div {
    transform-origin: center right;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: 800;
    font-size: 8em;
    will-change: transform, opacity;
  }
`;

export const Label = styled(Text)`
  color: ${p => p.theme.colors.palette.text.shade100};
  margin-bottom: 8px;
  max-width: 404px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const IllustrationWrapper = styled.div`
  width: 257px;
  height: 100%;
  pointer-events: none;
  position: relative;
  right: 0;
  align-self: flex-end;
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  cursor: pointer;
`;

export const CAROUSEL_NONCE = 6;

const Carousel = ({
  withArrows = true,
  controls = true,
  speed = 6000,
  type = "slide",
}: {
  withArrows?: boolean;
  controls?: boolean;
  speed?: number;
  type?: "slide" | "flip";
}) => {
  const { slides, logSlideImpression } = useDefaultSlides();
  const [index, setIndex] = useState(0);
  const hidden = useSelector(carouselVisibilitySelector);
  const [paused, setPaused] = useState(false);
  const [wantToDismiss, setWantToDismiss] = useState(false);
  const [reverse, setReverse] = useState(false);
  const transitions = useTransition(index, p => p, getTransitions(type, reverse));

  useEffect(() => {
    logSlideImpression(0);
  }, [logSlideImpression]);

  const changeVisibleSlide = useCallback(
    index => {
      setIndex(index);
      logSlideImpression(index);
    },
    [logSlideImpression],
  );

  const dispatch = useDispatch();

  const onChooseSlide = useCallback(
    newIndex => {
      setReverse(index > newIndex);
      changeVisibleSlide(newIndex);
    },
    [index, changeVisibleSlide],
  );

  const onNext = useCallback(() => {
    setReverse(false);
    changeVisibleSlide((index + 1) % slides.length);
    track("contentcards_slide", {
      button: "next",
      page: "Portfolio",
    });
  }, [index, slides.length, changeVisibleSlide]);

  const onPrev = useCallback(() => {
    setReverse(true);
    changeVisibleSlide(!index ? slides.length - 1 : index - 1);
    track("contentcards_slide", {
      button: "previous",
      page: "Portfolio",
    });
  }, [index, slides.length, changeVisibleSlide]);

  const onDismiss = useCallback(() => {
    setWantToDismiss(true);
    track("contentcards_dismissed", {
      page: "Portfolio",
    });
  }, []);

  const onUndo = useCallback(() => {
    setWantToDismiss(false);
    track("button_clicked", {
      button: "Show cards again",
      page: "Portfolio",
    });
  }, []);

  const close = useCallback(() => {
    dispatch(setCarouselVisibility(CAROUSEL_NONCE));
    track("button_clicked", {
      button: "Confirm cards dismissal",
      page: "Portfolio",
    });
  }, [dispatch]);

  if (!slides.length || hidden >= CAROUSEL_NONCE) {
    // No slides or dismissed, no problem
    return null;
  }

  const showControls = controls && slides.length > 1;

  return wantToDismiss ? (
    <Disclaimer>
      <Text ff="Inter|Regular" fontSize={4} color="palette.text.shade80">
        <Trans i18nKey="carousel.hidden.disclaimer" />
      </Text>
      <Box horizontal mt={3}>
        <Button mr={1} small primary data-test-id="carousel-dismiss-confirm-button" onClick={close}>
          <Trans i18nKey="carousel.hidden.close" />
        </Button>
        <Button ml={1} small secondary outlineGrey onClick={onUndo}>
          <Trans i18nKey="carousel.hidden.undo" />
        </Button>
      </Box>
    </Disclaimer>
  ) : (
    <CarouselWrapper
      data-test-id="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.length > 1 ? (
        <ProgressBarWrapper>
          <TimeBasedProgressBar onComplete={onNext} duration={speed} paused={paused} />
        </ProgressBarWrapper>
      ) : null}
      <Slides>
        {transitions.map(({ item, props, key }) => {
          const { Component } = slides[item];
          return (
            <animated.div key={key} style={{ ...props }}>
              <Component />
            </animated.div>
          );
        })}
      </Slides>
      <Close data-test-id="carousel-close-button" onClick={onDismiss}>
        <IconCross size={16} />
      </Close>
      {showControls ? (
        <>
          {withArrows ? (
            <>
              <Next onClick={onNext}>
                <IconArrowRight size={16} />
              </Next>
              <Previous onClick={onPrev}>
                <IconArrowRight size={16} />
              </Previous>
            </>
          ) : (
            <Bullets index={index}>
              {slides.map((_, i) => (
                <div key={i} onClick={() => onChooseSlide(i)}>
                  <span />
                </div>
              ))}
            </Bullets>
          )}
        </>
      ) : null}
    </CarouselWrapper>
  );
};

export default Carousel;
