// One entry = one Find-a-Tutor page + one Tutoring-Jobs page, both auto-generated.
// To add a city: add an object here. No new files, no new routes.
export const locations = [
  { slug: 'mumbai', city: 'Mumbai', region: 'Maharashtra', country: 'India', countrySlug: 'india', flag: '🇮🇳', boards: 'CBSE, ICSE & State Board',
    areas: ['Andheri East', 'Andheri West', 'Bandra', 'Borivali', 'Dadar', 'Powai', 'Malad', 'Juhu', 'Kurla', 'Ghatkopar', 'Thane', 'Navi Mumbai', 'Vashi', 'Worli'] },
  { slug: 'pune', city: 'Pune', region: 'Maharashtra', country: 'India', countrySlug: 'india', flag: '🇮🇳', boards: 'CBSE, ICSE & State Board',
    areas: ['Kothrud', 'Baner', 'Aundh', 'Viman Nagar', 'Hinjewadi', 'Kharadi', 'Wakad', 'Hadapsar', 'Koregaon Park', 'Camp', 'Deccan', 'Pimpri-Chinchwad', 'Kalyani Nagar', 'Magarpatta'] },
  { slug: 'delhi', city: 'Delhi', region: 'NCR', country: 'India', countrySlug: 'india', flag: '🇮🇳', boards: 'CBSE, ICSE & State Board',
    areas: ['Connaught Place', 'Dwarka', 'Rohini', 'Vasant Kunj', 'Saket', 'Karol Bagh', 'Pitampura', 'Janakpuri', 'Lajpat Nagar', 'Greater Kailash', 'Mayur Vihar', 'Rajouri Garden'] },
  { slug: 'bangalore', city: 'Bangalore', region: 'Karnataka', country: 'India', countrySlug: 'india', flag: '🇮🇳', boards: 'CBSE, ICSE & State Board',
    areas: ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'JP Nagar', 'Jayanagar', 'Malleswaram', 'Marathahalli', 'BTM Layout', 'Electronic City', 'Yelahanka', 'Sarjapur Road'] },
  { slug: 'hyderabad', city: 'Hyderabad', region: 'Telangana', country: 'India', countrySlug: 'india', flag: '🇮🇳', boards: 'CBSE, ICSE & State Board',
    areas: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Kondapur', 'Kukatpally', 'Secunderabad', 'Miyapur', 'Begumpet', 'Ameerpet', 'Himayatnagar', 'LB Nagar'] },
  { slug: 'chennai', city: 'Chennai', region: 'Tamil Nadu', country: 'India', countrySlug: 'india', flag: '🇮🇳', boards: 'CBSE, ICSE & State Board',
    areas: ['T Nagar', 'Adyar', 'Anna Nagar', 'Velachery', 'Nungambakkam', 'Mylapore', 'Porur', 'OMR', 'Tambaram', 'Chromepet', 'Besant Nagar', 'Kilpauk'] },
  { slug: 'kolkata', city: 'Kolkata', region: 'West Bengal', country: 'India', countrySlug: 'india', flag: '🇮🇳', boards: 'CBSE, ICSE & State Board',
    areas: ['Salt Lake', 'Park Street', 'Ballygunge', 'Behala', 'Howrah', 'New Town', 'Rajarhat', 'Garia', 'Dum Dum', 'Jadavpur', 'Alipore', 'Tollygunge'] },
  { slug: 'ahmedabad', city: 'Ahmedabad', region: 'Gujarat', country: 'India', countrySlug: 'india', flag: '🇮🇳', boards: 'CBSE, ICSE & State Board',
    areas: ['Satellite', 'Vastrapur', 'Bopal', 'Navrangpura', 'Maninagar', 'Prahladnagar', 'Thaltej', 'SG Highway', 'Bodakdev', 'CG Road', 'Naranpura', 'Chandkheda'] },
  { slug: 'new-york', city: 'New York', region: 'New York', country: 'USA', countrySlug: 'usa', flag: '🇺🇸', boards: 'SAT, AP & K-12',
    areas: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Upper East Side', 'Upper West Side', 'Astoria', 'Williamsburg', 'Long Island City'] },
  { slug: 'los-angeles', city: 'Los Angeles', region: 'California', country: 'USA', countrySlug: 'usa', flag: '🇺🇸', boards: 'SAT, AP & K-12',
    areas: ['Downtown LA', 'Santa Monica', 'Beverly Hills', 'Pasadena', 'Culver City', 'Hollywood', 'Westwood', 'Sherman Oaks', 'Long Beach', 'Glendale'] },
  { slug: 'london', city: 'London', region: '', country: 'UK', countrySlug: 'uk', flag: '🇬🇧', boards: 'GCSE, A-Level & 11+',
    areas: ['Westminster', 'Kensington', 'Chelsea', 'Camden', 'Islington', 'Hampstead', 'Wandsworth', 'Battersea', 'Clapham', 'Canary Wharf', 'Richmond', 'Croydon'] },
];

export const findLocation = (countrySlug, slug) =>
  locations.find(l => l.countrySlug === countrySlug && l.slug === slug);

export const subjects = [
  { name: 'Maths', icon: '🔢' }, { name: 'English', icon: '📚' }, { name: 'Science', icon: '🔬' },
  { name: 'Physics', icon: '⚛️' }, { name: 'Chemistry', icon: '🧪' },
];
