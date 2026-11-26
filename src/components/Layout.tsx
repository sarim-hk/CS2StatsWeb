import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <div className="relative min-h-[100dvh] text-white">
            
            <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[#030D19] via-[#050B13] to-[#07090C]" />

            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 h-16 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0">
                            <img
                                className="h-10 w-auto hover:opacity-90 transition-opacity"
                                src="/logo_wide.png"
                                alt="Logo"
                            />
                        </Link>

                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto lg:px-8 py-2">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-sm shadow-xl border border-gray-700/50">
                    <div className="p-2 font-display">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Layout;
