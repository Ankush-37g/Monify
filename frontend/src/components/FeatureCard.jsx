function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center text-center space-y-4 transform hover:-translate-y-2 transition-transform duration-300">
      <div className="p-4 bg-gray-900 rounded-full">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
export default FeatureCard;