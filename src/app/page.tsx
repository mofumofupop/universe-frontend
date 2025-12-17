import Link from 'next/link';

export default function Home () {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Welcome to Universe</h1>
            <Link href="/sparkle">
                <button className="bg-slate-400 text-white p-2 rounded-lg shadow-md">
                    Log in
                </button>
            </Link>
        </div>
    );
}