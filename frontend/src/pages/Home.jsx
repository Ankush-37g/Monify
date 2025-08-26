import { useContext,useRef, useEffect } from 'react';
import FeatureCard from '../components/FeatureCard';
import { UserContext } from '../context/UserContext';
import * as THREE from 'three';
import {
  Wallet,
  PieChart,
  Target,
  BarChart2,
  Lock,
  Menu,
  X,
} from 'lucide-react';

// Landing Page Content
function Home() {

  const {navigate} = useContext(UserContext)

  const mountRef = useRef(null);

  useEffect(() => {
    // Ensure the ref is attached before proceeding
    if (!mountRef.current) {
        return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    // Position camera
    camera.position.z = 5;

    // Create a particle system
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    // Particle colors in teal and white shades
    const color1 = new THREE.Color(0x36A2EB); // blue
    const color2 = new THREE.Color(0x4BC0C0); // light teal
    const color3 = new THREE.Color(0x9966FF); // purple
    const color4 = new THREE.Color(0xe2e8f0); // off-white
    const palette = [color1, color2, color3, color4];

    for (let i = 0; i < particleCount; i++) {
        // Position particles randomly within a sphere
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        vertices.push(x, y, z);
        
        // Assign a random color from the palette
        const randomColor = palette[Math.floor(Math.random() * palette.length)];
        colors.push(randomColor.r, randomColor.g, randomColor.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ 
        size: 0.05, 
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the particle system for a gentle animation effect
      points.rotation.x += 0.0005;
      points.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement);
        // Dispose of Three.js objects to free up memory
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);
  return (
    <div className='text-gray-200'>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center  text-center bg-gray-950">
        <div className="container mx-auto max-w-4xl space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tighter text-gray-200">
            Take Control of Your <span className="text-teal-400">Finances</span>, Effortlessly.
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Monify is the simplest way to track your expenses, set budgets, and gain a clear view of your financial health.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={()=>navigate('/login')}
              className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Monifying Now
            </button>
            <a
              href="#features"
              className="px-8 py-3 border border-gray-700 text-gray-300 rounded-full hover:bg-gray-800 transition-colors duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-16 ">
            Key Features to Manage Your Money
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Wallet size={48} className="text-teal-400" />}
              title="Track Expenses"
              description="Log every transaction with ease. Categorize spending to see where your money goes."
            />
            <FeatureCard
              icon={<Target size={48} className="text-teal-400" />}
              title="Set Budgets"
              description="Create and stick to budgets. Get alerts when you're nearing your spending limits."
            />
            <FeatureCard
              icon={<PieChart size={48} className="text-teal-400" />}
              title="Visualize Spending"
              description="Intuitive charts and graphs help you understand your financial habits at a glance."
            />
            <FeatureCard
              icon={<Lock size={48} className="text-teal-400" />}
              title="Secure & Private"
              description="Your financial data is protected with bank-level encryption and security measures."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How Monify Works
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              Our platform simplifies finance tracking into three easy steps. First, you securely link your bank accounts. Next, Monify automatically categorizes your transactions. Finally, you get a beautiful dashboard with actionable insights to help you make smarter financial decisions.
            </p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <BarChart2 size={24} className="text-teal-400 flex-shrink-0 mt-1" />
                <span>Automated transaction import and categorization.</span>
              </li>
              <li className="flex items-start gap-3">
                <Target size={24} className="text-teal-400 flex-shrink-0 mt-1" />
                <span>Personalized budget recommendations and alerts.</span>
              </li>
              <li className="flex items-start gap-3">
                <PieChart size={24} className="text-teal-400 flex-shrink-0 mt-1" />
                <span>Rich, interactive reports on your spending habits.</span>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Placeholder for an image or mockup */}
            <div className="w-full max-w-md h-72 bg-gray-800 rounded-lg shadow-xl flex items-center justify-center p-4">
              <span className="text-gray-500 text-sm italic">
                
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-500 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            Ready to Take Control?
          </h2>
          <p className="text-lg text-gray-800 mb-8">
            Join thousands of users who are simplifying their financial lives with Monify. Sign up today and start your journey to financial freedom.
          </p>
          <button
            onClick={()=>navigate('/login')}
            className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Create Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-950 text-gray-500 text-center text-sm border-t border-gray-800">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Monify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;



