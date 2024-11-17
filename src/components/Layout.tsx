import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex justify-center bg-zinc-900 text-white">
            <div className="w-full aspect-ratio-adjust bg-gray-700">

                <div className="flex bg-gray-800 p-4">
                    <a href="/">
                        <img
                            className="w-60 h-15 border-gray-800 border-solid border-2"
                            src="/logo_wide.png"
                            alt="Logo"
                        />
                    </a>
                    <div className="ml-auto flex">
                        <a className="p-2 text-xl flex items-center" href="/matches">Matches</a>
                        <a className="p-2 text-xl flex items-center" href="/players">Players</a>
                        <h1 className="p-2 text-xl flex items-center">Stats</h1>
                    </div>
                </div>
                
                <div className="p-1 font-display">{children}</div>

            </div>
        </div>
    );
}


export default Layout;
