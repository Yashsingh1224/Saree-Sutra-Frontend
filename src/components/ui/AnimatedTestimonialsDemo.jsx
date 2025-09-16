import { AnimatedTestimonials } from "./animated-testimonials";

export default function AnimatedTestimonialsDemo() {
    const testimonials = [
        {
            quote:
                "The saree I ordered was even more beautiful than the pictures! The fabric is soft, elegant, and perfect for special occasions.",
            name: "Priya Sharma",
            designation: "Homemaker, Delhi",
            src: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=2000&auto=format&fit=crop",
        },
        {
            quote:
                "I wore the silk saree for my cousin’s wedding and received endless compliments. Excellent finishing, rich colors, and timely delivery!",
            name: "Ananya Iyer",
            designation: "Software Engineer, Bangalore",
            src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2000&auto=format&fit=crop",
        },
        {
            quote:
                "Finding affordable yet premium-quality sarees online was tough until now. Absolutely loved the collection—great value for money!",
            name: "Ritika Patel",
            designation: "Teacher, Ahmedabad",
            src: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww",
        },
        {
            quote:
                "The Kanjeevaram saree I purchased is just stunning. Packaging was neat and delivery was super fast. Will shop again soon!",
            name: "Meera Krishnan",
            designation: "Doctor, Chennai",
            src: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2000&auto=format&fit=crop",
        },
        {
            quote:
                "Amazing craftsmanship! The handloom cotton saree feels so comfortable for daily wear. My mother also loved the saree I gifted her.",
            name: "Neha Agarwal",
            designation: "Entrepreneur, Kolkata",
            src: "https://media.istockphoto.com/id/486894969/photo/young-adult-girl-portrait.jpg?s=170667a&w=0&k=20&c=SkHprgfZvbIrKqh6bCqnNCiP6sxV15n2Bh7kHpqagH8=",
        },
    ];

    return (
        <section className="py-16 px-6 md:px-20 mx-auto bg-gradient-to-r from-amber-50 via-pink-50 to-white">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-pink-700 mb-12 font-['Yatra One'] animate-fade-in-up">
                What Our Customers Say
            </h2>
            <AnimatedTestimonials testimonials={testimonials} />
        </section>
    )
}
