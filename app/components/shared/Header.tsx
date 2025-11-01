import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#175DDC] to-[#FF6B35] bg-clip-text text-transparent">
              QuizMe
            </h1>
            <span className="text-sm text-gray-500">Study Buddy</span>
          </Link>
          
          <nav className="flex space-x-6">
            <Link
              href="/mindmap"
              className="text-gray-700 hover:text-[#175DDC] transition-colors font-medium"
            >
              Mindmaps
            </Link>
            <Link
              href="/quiz"
              className="text-gray-700 hover:text-[#FF6B35] transition-colors font-medium"
            >
              Quizzes
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
