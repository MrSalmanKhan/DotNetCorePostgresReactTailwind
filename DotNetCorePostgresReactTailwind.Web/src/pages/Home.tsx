/**
 * Home page for the app.
 * Beautiful, responsive hero section using TailwindCSS.
 */
export default function Home() {
    return (
        <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="max-w-2xl w-full text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-2 drop-shadow-sm">
                    Welcome to <span className="text-blue-500">MyStore</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-4">
                    Effortlessly manage your products with AI-powered tools and a beautiful, modern interface.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <a
                        href="/products"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors text-base"
                    >
                        View Products
                    </a>
                    <a
                        href="/about"
                        className="px-6 py-3 bg-white border border-blue-600 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-50 transition-colors text-base"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </section>
    );
}