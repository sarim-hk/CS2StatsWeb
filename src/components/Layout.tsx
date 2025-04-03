import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-white">

            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <a href="/" className="flex-shrink-0">
                            <img
                                className="h-10 w-auto hover:opacity-90 transition-opacity"
                                src="/logo_wide.png"
                                alt="Logo"
                            />
                        </a>

                        {/* Navigation Links */}
                        <div className="flex space-x-1">
                            <NavLink href="/matches">Matches</NavLink>
                            <NavLink href="/players">Players</NavLink>
                            <NavLink href="/stats">Stats</NavLink>
                            <NavLink href="/balancer">Balancer</NavLink>
                        </div>

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

// Navigation Link Component
function NavLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <a
            href={href}
            className="px-4 py-2 rounded-sm text-[18px] font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
        >
            {children}
        </a>
    );
}

export default Layout;
