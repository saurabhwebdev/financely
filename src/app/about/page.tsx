export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          About Financly
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Financly is a modern, user-friendly personal finance tracker designed to help you manage your money with ease.
        </p>
        <div className="mt-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-center">
              <span className="text-indigo-600 mr-2">✓</span>
              Track income and expenses
            </li>
            <li className="flex items-center">
              <span className="text-indigo-600 mr-2">✓</span>
              Categorize transactions
            </li>
            <li className="flex items-center">
              <span className="text-indigo-600 mr-2">✓</span>
              View transaction history
            </li>
            <li className="flex items-center">
              <span className="text-indigo-600 mr-2">✓</span>
              Modern, clean interface
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
} 