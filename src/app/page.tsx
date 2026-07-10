'use client';

import { useEffect, useState } from 'react';

interface GalleryImage {
  _id: string;
  url: string;
  alt: string;
  title: string;
}

export default function Home() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const res = await fetch('/api/public/gallery');
      const data = await res.json();
      if (data.success) {
        setGalleryImages(data.data);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default images if none in database
  const defaultImages = [
    { _id: '1', url: '/images/gallery-1.jpg', alt: 'Community engagement', title: 'Community Engagement' },
    { _id: '2', url: '/images/gallery-2.jpg', alt: 'Youth empowerment', title: 'Youth Empowerment' },
    { _id: '3', url: '/images/gallery-3.jpg', alt: 'Education program', title: 'Education Program' },
    { _id: '4', url: '/images/gallery-4.jpg', alt: 'Health awareness', title: 'Health Awareness' },
    { _id: '5', url: '/images/gallery-5.jpg', alt: 'Community support', title: 'Community Support' },
    { _id: '6', url: '/images/gallery-6.jpg', alt: 'Sustainable development', title: 'Sustainable Development' },
  ];

  const images = galleryImages.length > 0 ? galleryImages : defaultImages;

  return (
    <main>
      {/* Hero Section - Full Screen with Background Image */}
      <section className="relative h-screen w-full flex items-center justify-center bg-primary-dark">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Empowering individuals to build stronger communities
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-9xl mx-auto">
            Founded in 2024 by Kenyan changemakers inspired by young women's challenges around menstrual health in Kibera
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="inline-block px-8 py-4 bg-secondary text-neutral-900 font-bold rounded-lg hover:bg-secondary-dark transition-colors text-lg"
            >
              Donate Now
            </a>
            <a
              href="/get-involved"
              className="inline-block px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-colors text-lg"
            >
              Get Involved
            </a>
          </div>
        </div>
      </section>

      {/* Auto-Scrolling Gallery Section - h-70 */}
      <section className="h-70 w-full bg-neutral-100 overflow-hidden relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-neutral-500">Loading gallery...</p>
          </div>
        ) : (
          <div className="flex items-center h-full">
            <div 
              className="flex gap-6 animate-scroll-right"
              style={{
                animation: 'scrollRight 25s linear infinite',
              }}
            >
              {images.map((img) => (
                <div 
                  key={img._id}
                  className="flex-shrink-0 w-64 h-48 rounded-lg overflow-hidden shadow-md group relative"
                >
                  <img 
                    src={img.url} 
                    alt={img.alt || img.title || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {img.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 text-center">
                      {img.title}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Duplicate for seamless scrolling */}
            <div 
              className="flex gap-6 animate-scroll-right"
              style={{
                animation: 'scrollRight 25s linear infinite',
              }}
              aria-hidden="true"
            >
              {images.map((img) => (
                <div 
                  key={`duplicate-${img._id}`}
                  className="flex-shrink-0 w-64 h-48 rounded-lg overflow-hidden shadow-md group relative"
                >
                  <img 
                    src={img.url} 
                    alt={img.alt || img.title || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {img.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 text-center">
                      {img.title}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Rest of the sections remain the same */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-8">Who We Are</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-neutral-700 leading-relaxed">
              Founded in 2024 by Kenyan changemakers inspired by young women's challenges around menstrual health in Kibera, 
              Amplify Hope Africa formally registered to tackle education, livelihoods, and mentorship.
            </p>
            <p className="text-lg text-neutral-700 leading-relaxed mt-4">
              Today, we serve over 20,000 youth and women across multiple counties including Nairobi, Kisumu, Siaya, Kisii and Homabay.
            </p>
            <a
              href="/about"
              className="inline-block mt-6 text-primary font-semibold hover:underline"
            >
              Read More →
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">20,000+</div>
              <p className="text-neutral-600">Youth in life skills development</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">20,000+</div>
              <p className="text-neutral-600">Students reached in school training</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">20,000+</div>
              <p className="text-neutral-600">Community engagement participants</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-3">Our Goal</h2>
              <p className="text-neutral-600">
                Empower communities through integrated education and training programs that foster sustainable agricultural practices, enhance resilience to climate change, and develop essential life skills.
              </p>
            </div>
            <div className="bg-neutral-50 p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-3">Our Vision</h2>
              <p className="text-neutral-600">
                To inspire and empower children, women, and youth to achieve success and sustainable community growth in order to break the cycle of poverty for future generation.
              </p>
            </div>
            <div className="bg-neutral-50 p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-3">Our Mission</h2>
              <p className="text-neutral-600">
                Committed to empowering children, women, and youth throughout Africa by providing transformative skills, training, education, and opportunities that foster community peace and cohesion.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">Our Objectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Create', desc: 'Create opportunities for young people through education and other development programs to eradicate poverty and uplift their socio-economic status.' },
              { title: 'Empower', desc: 'Empower youths and women to identify and develop innovative approaches to confront the challenges they face with the resources they or their community already have.' },
              { title: 'Mentor', desc: 'Mentor positive behavior development among the children and the youths so that they are productive and compassionate leaders in their communities, families and the world at large.' },
              { title: 'Develop', desc: 'Develop communities that understands the value of working as a unit and promoting each other by engaging in activities aimed at enhancing their well-being.' },
            ].map((obj) => (
              <div key={obj.title} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-2xl font-bold text-primary mb-3">{obj.title}</h3>
                <p className="text-neutral-600 text-sm">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Compassion', desc: 'Compels us to take action to alleviate suffering and promote well-being, creating supportive environments where our people feel valued and cared for.' },
              { title: 'Integrity', desc: 'Builds trust and credibility, both personally and professionally, fostering a culture of respect and responsibility.' },
              { title: 'Collaboration', desc: 'Encourages open communication, mutual respect, and teamwork, leading to innovative solutions and stronger relationships.' },
              { title: 'Equity', desc: 'Actively working to dismantle barriers and ensure that everyone has the support they need to thrive even as we reach out to all.' },
            ].map((value) => (
              <div key={value.title} className="bg-neutral-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
                <p className="text-neutral-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What We Do</h2>
          <p className="text-xl text-primary-light max-w-3xl mx-auto mb-12">
            Amplify Hope Africa believes in the power of community. We actively engage local stakeholders, partner with schools, and collaborate with like-minded organizations to maximize our impact.
          </p>
          <h3 className="text-2xl font-bold mb-6">Targeted Counties</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Nairobi', 'Kisumu', 'Siaya', 'Homabay', 'Kisii'].map((county) => (
              <span key={county} className="px-6 py-2 bg-white/10 rounded-full text-white font-medium">
                {county}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-neutral-700 mb-8 max-w-2xl mx-auto">
            Join us in empowering communities and creating sustainable change across Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Donate Now
            </a>
            <a
              href="/get-involved"
              className="inline-block px-8 py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Get Involved
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
