import { Candidate } from "api";
import React, { Fragment } from "react";
import { Box, Typography } from "@mui/material";
import { SingleCandidatePage } from "./SingleCandidatePage";
import { styles } from "./styles";
import { Pagination, A11y, Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  candidates: Candidate[];
  group_name?: string;
}

export const CandidateSlider: React.FC<Props> = ({
  candidates,
  group_name,
}) => {
  return (
    <Fragment>
      {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        group_name !== null ? (
          <Box sx={styles.topLevelBox}>
            <Typography variant={"h4"}>{group_name}</Typography>
          </Box>
        ) : (
          <></>
        )
      }
      <Swiper
        modules={[Pagination, Mousewheel]}
        spaceBetween={50}
        autoHeight
        threshold={50}
        preventInteractionOnTransition={true}
        preventClicks={true}
        edgeSwipeThreshold={50}
        touchMoveStopPropagation={true}
        pagination={{ clickable: true }}
        centeredSlides={true}
        grabCursor={true}
        breakpoints={{
          200: {
            slidesPerView: 1,
          },
          1200: {
            slidesPerView: 2,
          },
          1500: {
            slidesPerView: 3,
          },
        }}
        mousewheel={true}
      >
        {candidates.map((candidate) => (
          <SwiperSlide
            key={candidate.student.uuid}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <SingleCandidatePage {...{ candidate }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Fragment>
  );
};
