'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const sliderRef = useRef(null);
  const [news, setNews] = useState([]);

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/news?category=${'সর্বশেষ'}`,
          {
            cache: 'no-store',
          }
        );
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNews();
  }, []);

  // Auto slide
  useEffect(() => {
    if (isPaused || news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, news.length]);

  const goToSlide = index => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide(prev => (prev - 1 + news.length) % news.length);
  };

  const goToNext = () => {
    setCurrentSlide(prev => (prev + 1) % news.length);
  };

  return (
    <div className="max-w-4xl mx-auto relative group cursor-pointer">
      <div
        className="relative overflow-hidden "
        onMouseEnter={() => {
          setIsPaused(true);
          setShowControls(true);
        }}
        onMouseLeave={() => {
          setIsPaused(false);
          setShowControls(false);
        }}
      >
        <div
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {news.map((slide, index) => (
            <div key={slide._id || index} className="w-full flex-shrink-0 ">
              <div className="relative h-64 md:h-80 lg:h-96 w-full">
                <Image
                  src={
                    slide?.image?.startsWith('http')
                      ? slide.image
                      : slide?.image
                      ? `${process.env.NEXT_PUBLIC_ROOT_URL}${slide.image}`
                      : '/fallback.jpg'
                  }
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                />

                <div
                  className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                ></div>
              </div>
              <div className="bg-white ">
                <h3 className=" text-xl md:text-2xl font-bold mt-3">
                  {slide.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Prev Button */}
        <button
          onClick={goToPrev}
          className={`absolute left-4 cursor-pointer top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-md z-10 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className={`absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-md z-10 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Slider;
