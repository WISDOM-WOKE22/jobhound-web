"use client"

import { useState } from "react";
import { ScanText, StickyNote, LayoutGrid, Sparkles  } from "lucide-react"
import Image from "next/image";

// import GenerateCourseImage from "@/assets/image/generate-course.png";
// import FlashcardImage from "@/assets/image/flashcard.png";
// import NotesImage from  "@/assets/image/notes.png";
// import Quiz from '@/assets/image/quiz.png';

type FeatureType = "generate-course" | "notes" | "flashcards" | "quiz";

interface Feature {
    id: FeatureType;
    icon: React.ReactNode;
    title: string;
    description: string;
    // image: typeof GenerateCourseImage;
}

const features: Feature[] = [
    {
        id: "generate-course",
        icon: <Sparkles className="w-6 h-6" />,
        title: "Generate Course",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque sequi omnis animi nisi magnam, et consequuntur laborum rerum tempore suscipit provident atque sit repellendus porro ducimus recusandae minima magni maiores?",
        // image: GenerateCourseImage,
    },
    {
        id: "notes",
        icon: <StickyNote className="w-6 h-6" />,
        title: "Notes",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque sequi omnis animi nisi magnam, et consequuntur laborum rerum tempore suscipit provident atque sit repellendus porro ducimus recusandae minima magni maiores?",
        // image: NotesImage,
    },
    {
        id: "flashcards",
        icon: <LayoutGrid className="w-6 h-6" />,
        title: "Flash Cards",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque sequi omnis animi nisi magnam, et consequuntur laborum rerum tempore suscipit provident atque sit repellendus porro ducimus recusandae minima magni maiores?",
        // image: FlashcardImage,
    },
    {
        id: "quiz",
        icon: <ScanText className="w-6 h-6" />,
        title: "Quiz",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque sequi omnis animi nisi magnam, et consequuntur laborum rerum tempore suscipit provident atque sit repellendus porro ducimus recusandae minima magni maiores?",
        // image: Quiz,
    },
];

export const Features2 = () => {
    const [activeFeature, setActiveFeature] = useState<FeatureType>("generate-course");

    return (
        <div className="flex flex-row justify-center items-center w-full my-6 md:my-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-[1200px]">
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight animate-fade-in-up">
                        Learn Your Way
                    </h1>
                </div>

                <div className="mt-8 sm:mt-12 md:mt-20 flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-30 items-center md:items-start justify-between">
                    <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 w-full md:max-w-[500px]">
                        {features.map((feature, index) => {
                            const isActive = activeFeature === feature.id;
                            return (
                                <div key={feature.id}>
                                    <div 
                                        className="flex flex-col gap-2 sm:gap-3 cursor-pointer group"
                                        onMouseEnter={() => setActiveFeature(feature.id)}
                                        // onMouseLeave={() => setActiveFeature("generate-course")}
                                        onClick={() => setActiveFeature(feature.id)}
                                    >
                                        <div className="flex flex-row gap-2 sm:gap-3 items-center transition-all duration-300 ease-in-out">
                                            <div className={`transition-all duration-300 ease-in-out text-gray-400 group-hover:text-gray-600 ${
                                                isActive ? "text-gray-600" : ""
                                            }`}>
                                                {feature.icon}
                                            </div>
                                            <h2 className={`text-lg sm:text-xl md:text-2xl transition-all duration-300 ease-in-out ${
                                                isActive
                                                    ? "text-gray-900 font-semibold" 
                                                    : "text-gray-600 group-hover:text-gray-700"
                                            }`}>
                                                {feature.title}
                                            </h2>
                                        </div>
                                        <div 
                                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                                isActive
                                                    ? "max-h-96 opacity-100" 
                                                    : "max-h-0 opacity-0"
                                            }`}
                                        >
                                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed pt-2">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                    {index < features.length - 1 && (
                                        <div className="border-dashed border-[1px] border-gray-200 mt-6 sm:mt-8 md:mt-10" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="hidden md:block relative md:top-20 w-full max-w-[600px] h-[400px] md:h-[500px] flex-shrink-0">
                        <div className="relative w-full h-full rounded-3xl overflow-hidden">
                            {features.map((feature) => (
                                <div
                                    key={feature.id}
                                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                        activeFeature === feature.id
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-95 pointer-events-none"
                                    }`}
                                >
                                    <Image
                                        // src={feature.image}
                                        src=".././assets/image/generate-course.png"
                                        className="rounded-3xl"
                                        alt={feature.title}
                                        fill
                                        // sizes="(max-width: 768px) 100vw, 600px"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}