import { Destination } from '../types';

export const destinations: Destination[] = [
  {
    id: 'bali-indonesia',
    name: 'Bali',
    country: 'Indonesia',
    coordinates: {
      lat: -8.4095,
      lon: 115.1889
    },
    description: 'Bali is a paradise for beach lovers and cultural explorers. With its lush landscapes, ancient temples, and vibrant arts scene, it offers a perfect blend of relaxation and adventure.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    bestTimeToVisit: 'March - October',
    budget: {
      low: { min: 500, max: 900, currency: 'USD' },
      medium: { min: 900, max: 1800, currency: 'USD' },
      high: { min: 1800, max: 3500, currency: 'USD' }
    },
    interests: ['beaches', 'culture', 'nature', 'relaxation'],
    topAttractions: [
      {
        name: 'Uluwatu Temple',
        description: 'A Balinese Hindu sea temple perched on a cliff',
        imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47'
      },
      {
        name: 'Ubud Monkey Forest',
        description: 'A nature reserve and temple complex with many monkeys',
        imageUrl: 'https://images.unsplash.com/photo-1560997027-42da74fbf4c8'
      },
      {
        name: 'Tegallalang Rice Terraces',
        description: 'Stunning rice terraces offering beautiful views',
        imageUrl: 'https://images.unsplash.com/photo-1531592937781-344ad608fabf'
      }
    ],
    flightLink: 'https://www.skyscanner.com/transport/flights/to/dps/',
    hotelLink: 'https://www.booking.com/region/id/bali.html',
    tourLink: 'https://www.getyourguide.com/bali-l347/'
  },
  {
    id: 'kyoto-japan',
    name: 'Kyoto',
    country: 'Japan',
    coordinates: {
      lat: 35.0116,
      lon: 135.7681
    },
    description: 'The cultural heart of Japan, Kyoto is home to over 1,600 Buddhist temples, hundreds of Shinto shrines, and exquisite gardens. Experience traditional tea ceremonies and witness the beauty of cherry blossoms in spring.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    bestTimeToVisit: 'March - May and October - November',
    budget: {
      low: { min: 700, max: 1200, currency: 'USD' },
      medium: { min: 1200, max: 2100, currency: 'USD' },
      high: { min: 2100, max: 4000, currency: 'USD' }
    },
    interests: ['culture', 'food', 'nature'],
    topAttractions: [
      {
        name: 'Fushimi Inari Shrine',
        description: 'Famous for its thousands of vermilion torii gates',
        imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36'
      },
      {
        name: 'Arashiyama Bamboo Grove',
        description: 'A stunning bamboo forest that offers a peaceful walk',
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26'
      },
      {
        name: 'Kinkaku-ji (Golden Pavilion)',
        description: 'A Zen temple whose top two floors are completely covered in gold leaf',
        imageUrl: 'https://images.unsplash.com/photo-1587639739012-5ccf33be561d'
      }
    ],
    flightLink: 'https://www.skyscanner.com/transport/flights/to/osa/',
    hotelLink: 'https://www.booking.com/city/jp/kyoto.html',
    tourLink: 'https://www.getyourguide.com/kyoto-l96632/'
  },
  {
    id: 'barcelona-spain',
    name: 'Barcelona',
    country: 'Spain',
    coordinates: {
      lat: 41.3851,
      lon: 2.1734
    },
    description: 'Barcelona is a vibrant city known for its iconic architecture, amazing food, and beautiful beaches. From Gaudí\'s masterpieces to the Gothic Quarter, there\'s something for everyone.',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4',
    bestTimeToVisit: 'May - June and September - October',
    budget: {
      low: { min: 600, max: 1000, currency: 'USD' },
      medium: { min: 1000, max: 1800, currency: 'USD' },
      high: { min: 1800, max: 3500, currency: 'USD' }
    },
    interests: ['culture', 'food', 'beaches', 'relaxation'],
    topAttractions: [
      {
        name: 'Sagrada Familia',
        description: 'Antoni Gaudí\'s iconic unfinished church, a UNESCO World Heritage site',
        imageUrl: 'https://images.unsplash.com/photo-1583779457094-ab5319950fe7'
      },
      {
        name: 'Park Güell',
        description: 'A public park system with gardens and architectural elements designed by Gaudí',
        imageUrl: 'https://images.unsplash.com/photo-1576654663784-672c774a458b'
      },
      {
        name: 'La Rambla',
        description: 'A famous street in central Barcelona popular with tourists and locals',
        imageUrl: 'https://images.unsplash.com/photo-1544708795-a5550ace546e'
      }
    ],
    flightLink: 'https://www.skyscanner.com/transport/flights/to/bcn/',
    hotelLink: 'https://www.booking.com/city/es/barcelona.html',
    tourLink: 'https://www.getyourguide.com/barcelona-l45/'
  },
  {
    id: 'bangkok-thailand',
    name: 'Bangkok',
    country: 'Thailand',
    "coordinates": {
    "lat": 13.736717,
    "lon": 100.523186
  },
    description: 'Bangkok, Thailand\'s vibrant capital, offers a fascinating mix of tradition and modernity. Experience magnificent temples, floating markets, and a street food scene that\'s second to none.',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5',
    bestTimeToVisit: 'November - February',
    budget: {
      low: { min: 400, max: 800, currency: 'USD' },
      medium: { min: 800, max: 1500, currency: 'USD' },
      high: { min: 1500, max: 3000, currency: 'USD' }
    },
    interests: ['culture', 'food', 'adventure'],
    topAttractions: [
      {
        name: 'Grand Palace',
        description: 'A complex of buildings that served as the official residence of the Kings of Thailand',
        imageUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed'
      },
      {
        name: 'Wat Arun',
        description: 'A Buddhist temple on the west bank of the Chao Phraya River',
        imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f'
      },
      {
        name: 'Chatuchak Weekend Market',
        description: 'One of the world\'s largest weekend markets with over 15,000 stalls',
        imageUrl: 'https://images.unsplash.com/photo-1569660072562-48a035e65c30'
      }
    ],
    flightLink: 'https://www.skyscanner.com/transport/flights/to/bkk/',
    hotelLink: 'https://www.booking.com/city/th/bangkok.html',
    tourLink: 'https://www.getyourguide.com/bangkok-l169/'
  },
  {
    id: 'reykjavik-iceland',
    name: 'Reykjavik',
    country: 'Iceland',
    "coordinates": {
    "lat": 64.1466,
    "lon": -21.9426
  },
    description: 'Reykjavik is the perfect base for exploring Iceland\'s otherworldly landscapes. From the Northern Lights to geothermal spas, experience nature at its most dramatic.',
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67',
    bestTimeToVisit: 'June - August (Summer), September - March (Northern Lights)',
    budget: {
      low: { min: 900, max: 1600, currency: 'USD' },
      medium: { min: 1600, max: 2800, currency: 'USD' },
      high: { min: 2800, max: 5000, currency: 'USD' }
    },
    interests: ['nature', 'adventure'],
    topAttractions: [
      {
        name: 'Blue Lagoon',
        description: 'A geothermal spa that is one of the most visited attractions in Iceland',
        imageUrl: 'https://images.unsplash.com/photo-1598536527213-7e539a3a7666'
      },
      {
        name: 'Golden Circle',
        description: 'A popular tourist route that includes geysers, waterfalls, and national parks',
        imageUrl: 'https://images.unsplash.com/photo-1537519646099-335112f03225'
      },
      {
        name: 'Northern Lights',
        description: 'A natural light display visible in the Arctic regions during winter months',
        imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7'
      }
    ],
    flightLink: 'https://www.skyscanner.com/transport/flights/to/kef/',
    hotelLink: 'https://www.booking.com/city/is/reykjavik.html',
    tourLink: 'https://www.getyourguide.com/reykjavik-l30/'
  },
  {
    id: 'marrakech-morocco',
    name: 'Marrakech',
    country: 'Morocco',
    "coordinates": {
    "lat": 31.6295,
    "lon": -7.9811
  },
    description: 'Marrakech is a magical place known for its bustling souks, beautiful riads, and the famous Djemaa el-Fna square. The "Red City" offers a sensory overload of colors, smells, and tastes.',
    imageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f9b',
    bestTimeToVisit: 'March - May and September - November',
    budget: {
      low: { min: 500, max: 900, currency: 'USD' },
      medium: { min: 900, max: 1600, currency: 'USD' },
      high: { min: 1600, max: 3000, currency: 'USD' }
    },
    interests: ['culture', 'food', 'adventure', 'relaxation'],
    topAttractions: [
      {
        name: 'Jardin Majorelle',
        description: 'A botanical garden designed by the French painter Jacques Majorelle',
        imageUrl: 'https://images.unsplash.com/photo-1535332371349-a5d229f49cb5'
      },
      {
        name: 'Bahia Palace',
        description: 'A palace built in the late 19th century intended to be the greatest palace of its time',
        imageUrl: 'https://images.unsplash.com/photo-1612211657307-95e9dd5e7014'
      },
      {
        name: 'Medina of Marrakech',
        description: 'The old walled city with narrow alleyways filled with shops, food vendors, and artisans',
        imageUrl: 'https://images.unsplash.com/photo-1585670347971-b429d59e1ab3'
      }
    ],
    flightLink: 'https://www.skyscanner.com/transport/flights/to/rak/',
    hotelLink: 'https://www.booking.com/city/ma/marrakech.html',
    tourLink: 'https://www.getyourguide.com/marrakech-l208/'
  },
  {
    id: 'new-york-usa',
    name: 'New York City',
    country: 'USA',
    "coordinates": {
    "lat": 40.7128,
    "lon": -74.0060
  },
    description: 'The "Big Apple" offers something for everyone - world-class museums, iconic landmarks, Broadway shows, and an endless array of dining options. Experience the energy of this iconic metropolis.',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    bestTimeToVisit: 'April - June and September - November',
    budget: {
      low: { min: 1000, max: 1800, currency: 'USD' },
      medium: { min: 1800, max: 3000, currency: 'USD' },
      high: { min: 3000, max: 6000, currency: 'USD' }
    },
    interests: ['culture', 'food', 'adventure'],
    topAttractions: [
      {
        name: 'Central Park',
        description: 'An urban park in Manhattan that spans 843 acres',
        imageUrl: 'https://images.unsplash.com/photo-1534969783039-f10d31d4bd5c'
      },
      {
        name: 'Statue of Liberty',
        description: 'A colossal neoclassical sculpture on Liberty Island in New York Harbor',
        imageUrl: 'https://images.unsplash.com/photo-1546436836-07a91091f160'
      },
      {
        name: 'Metropolitan Museum of Art',
        description: 'One of the world\'s largest and finest art museums',
        imageUrl: 'https://images.unsplash.com/photo-1565794462320-94de25c23b6c'
      }
    ],
    flightLink: 'https://www.skyscanner.com/transport/flights/to/nyca/',
    hotelLink: 'https://www.booking.com/city/us/new-york.html',
    tourLink: 'https://www.getyourguide.com/new-york-l59/'
  },
  {
    id: 'cape-town-south-africa',
    name: 'Cape Town',
    country: 'South Africa',
    "coordinates": {
    "lat": -33.9249,
    "lon": 18.4241
  },
    description: 'Cape Town is a stunning coastal city nestled between the iconic Table Mountain and the Atlantic Ocean. With its diverse landscapes, rich history, and vibrant culture, it offers a unique African adventure.',
    imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
    bestTimeToVisit: 'February - April and September - November',
    budget: {
      low: { min: 600, max: 1100, currency: 'USD' },
      medium: { min: 1100, max: 2000, currency: 'USD' },
      high: { min: 2000, max: 4000, currency: 'USD' }
    },
    interests: ['nature', 'adventure', 'culture', 'beaches'],
    topAttractions: [
      {
        name: 'Table Mountain',
        description: 'A flat-topped mountain forming a prominent landmark overlooking the city',
        imageUrl: 'https://images.unsplash.com/photo-1563302905-4c12cf21be8f'
      },
      {
        name: 'Robben Island',
        description: 'Where Nelson Mandela was imprisoned for 18 of his 27 years behind bars',
        imageUrl: 'https://images.unsplash.com/photo-1591294372276-2bed46cc6d2f'
      },
      {
        name: 'Cape of Good Hope',
        description: 'A rocky headland on the Atlantic coast of South Africa',
        imageUrl: 'https://images.unsplash.com/photo-1576020799627-aeac74d58d9d'
      }
    ],
    flightLink: 'https://www.skyscanner.com/transport/flights/to/cpt/',
    hotelLink: 'https://www.booking.com/city/za/cape-town.html',
    tourLink: 'https://www.getyourguide.com/cape-town-l103/'
  }
];