import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "../../App.css";


function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 30;
  const [slidesPerView, setSlidesPerView] = useState(3);
  
  const updateSlidesPerView = () => {
    if (window.innerWidth < 750) {
      setSlidesPerView(1);
    } else if (window.innerWidth < 1100) {
      setSlidesPerView(2);
    } else {
      setSlidesPerView(3);
    }
  };


  useEffect(() => {
    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => {
      window.removeEventListener('resize', updateSlidesPerView);
};})


  useEffect(() => {
    const sampleData = [
      {
        user: {
          firstName: "John",
          lastName: "Doe",
          image: "",
        },
        course: {
          courseName: "React for Beginners",
        },
        review:
          "This is an amazing course! It helped me understand the basics of React in a very simple and efficient way.",
        rating: 4.5,
      },
      {
        user: {
          firstName: "Jane",
          lastName: "Smith",
          image: "",
        },
        course: {
          courseName: "Advanced JavaScript",
        },
        review:
          "I loved this course. The examples were very clear and the instructor was great at explaining complex topics.",
        rating: 5,
      },
      {
        user: {
          firstName: "Alice",
          lastName: "Johnson",
          image: "",
        },
        course: {
          courseName: "CSS Flexbox and Grid",
        },
        review:
          "A must-take course for anyone looking to improve their CSS skills. Highly recommend!",
        rating: 4,
      },
      {
        user: {
          firstName: "Bob",
          lastName: "Brown",
          image: "",
        },
        course: {
          courseName: "Fullstack Development",
        },
        review:
          "Great course covering both frontend and backend development. The projects were very practical.",
        rating: 4.8,
      },

    {
      user: { firstName: "Sara", lastName: "Lee", image: "" },
      course: { courseName: "Python Mastery" },
      review: "Python concepts explained so well. Loved the hands-on approach.",
      rating: 4.7,
    },
    {
      user: { firstName: "Mike", lastName: "Chan", image: "" },
      course: { courseName: "Data Structures" },
      review: "Helped me ace my interviews. Highly recommended for CS students.",
      rating: 4.9,
    },
    {
      user: { firstName: "Priya", lastName: "Singh", image: "" },
      course: { courseName: "Web Design Basics" },
      review: "Design principles are explained with great examples.",
      rating: 4.3,
    },
    {
      user: { firstName: "Tom", lastName: "Evans", image: "" },
      course: { courseName: "Node.js Essentials" },
      review: "Backend made easy! Projects were super helpful.",
      rating: 4.6,
    },

    ];

    setReviews(sampleData);
  }, []);

  return (
    <div className="text-lg">
      <div className="my-[50px] border-2 border-white p-4 h-fitContent max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          slidesPerView={slidesPerView} 
          spaceBetween={30}
          loop={reviews.length >= 6} // Loop if there are enough reviews
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay, Navigation]} // Include Navigation module
          navigation={true} // Enable navigation
          className="w-11/12 h-fitContent"
        >
          {reviews.map((review, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="flex flex-col gap-1  bg-richblack-800 rounded-xl p-3 text-[14px] text-richblack-25 ">
                  <div className="flex items-center gap-2 text-2xl">
                    <img 
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-9 w-9 rounded-full object-cover mx-5 my-2"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-[12px] font-medium text-richblack-500">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="font-medium text-richblack-5 italic p-8 text-center">
                    {review?.review.split(" ").length > truncateWords
                      ? `"${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ..."`
                      : `"${review?.review}"`}
                  </p>
                  <div className="mx-auto">
                  <div className="flex items-center gap-2">
                  <StarRatings
                    rating={review.rating}
                    starRatedColor="#ffd700"
                    numberOfStars={5}
                    name="rating"
                    starDimension="20px"
                    starSpacing="2px"
                  />
                  </div>
                    <h3 className="font-semibold text-yellow-100 text-center">
                      {review.rating.toFixed(1)}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default ReviewSlider;
