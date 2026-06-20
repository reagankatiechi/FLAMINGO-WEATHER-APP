const API_KEY  = 'e991d096bfcd9a9b49e5efa6c9332058';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ── All 47 Kenyan Counties & Towns with GPS coordinates ───────────────────
const KENYA_TOWNS = {
  'Baringo': [
    { name:'Kabarnet', lat:0.4917, lon:35.7436 },
    { name:'Eldama Ravine', lat:0.0500, lon:35.7167 },
    { name:'Marigat', lat:0.4667, lon:35.9833 },
    { name:'Mogotio', lat:0.1667, lon:35.9833 },
    { name:'Nginyang', lat:1.0333, lon:35.9833 },
    { name:'Kapsabet', lat:0.2000, lon:35.1000 },
    { name:'Ravine', lat:0.0333, lon:35.7833 },
  ],
  'Bomet': [
    { name:'Bomet Town', lat:-0.7833, lon:35.3500 },
    { name:'Sotik', lat:-0.6833, lon:35.1333 },
    { name:'Chepalungu', lat:-0.9167, lon:35.4500 },
    { name:'Longisa', lat:-0.9500, lon:35.3167 },
    { name:'Silibwet', lat:-0.7667, lon:35.3333 },
  ],
  'Bungoma': [
    { name:'Bungoma Town', lat:0.5667, lon:34.5667 },
    { name:'Webuye', lat:0.6167, lon:34.7667 },
    { name:'Kimilili', lat:0.7833, lon:34.7167 },
    { name:'Sirisia', lat:0.6833, lon:34.5333 },
    { name:'Chwele', lat:0.6667, lon:34.4833 },
    { name:'Malakisi', lat:0.9167, lon:34.4167 },
    { name:'Tongaren', lat:0.6167, lon:34.9167 },
  ],
  'Busia': [
    { name:'Busia Town', lat:0.4608, lon:34.1111 },
    { name:'Malaba', lat:0.6333, lon:34.2833 },
    { name:'Port Victoria', lat:0.1167, lon:33.9833 },
    { name:'Nambale', lat:0.4167, lon:34.2333 },
    { name:'Funyula', lat:0.2667, lon:34.1000 },
    { name:'Butula', lat:0.4833, lon:34.2167 },
  ],
  'Elgeyo-Marakwet': [
    { name:'Iten', lat:0.6700, lon:35.5100 },
    { name:'Kapsowar', lat:0.8333, lon:35.5500 },
    { name:'Chepkorio', lat:0.5833, lon:35.5167 },
    { name:'Tambach', lat:0.6000, lon:35.5667 },
    { name:'Cherangany', lat:1.0833, lon:35.3500 },
  ],
  'Embu': [
    { name:'Embu Town', lat:-0.5333, lon:37.4500 },
    { name:'Runyenjes', lat:-0.3833, lon:37.5667 },
    { name:'Siakago', lat:-0.6333, lon:37.6667 },
    { name:'Ishiara', lat:-0.2833, lon:37.7167 },
    { name:'Ena', lat:-0.6833, lon:37.9000 },
  ],
  'Garissa': [
    { name:'Garissa Town', lat:-0.4532, lon:39.6461 },
    { name:'Dadaab', lat:0.0667, lon:40.3167 },
    { name:'Masalani', lat:-0.6167, lon:40.0333 },
    { name:'Ijara', lat:-1.5667, lon:40.5167 },
    { name:'Hulugho', lat:-1.6167, lon:40.1833 },
  ],
  'Homa Bay': [
    { name:'Homa Bay Town', lat:-0.5167, lon:34.4500 },
    { name:'Oyugis', lat:-0.7167, lon:34.7333 },
    { name:'Mbita', lat:-0.4333, lon:34.2000 },
    { name:'Ndhiwa', lat:-0.7833, lon:34.6167 },
    { name:'Rangwe', lat:-0.5833, lon:34.5500 },
    { name:'Kendu Bay', lat:-0.3667, lon:34.6500 },
    { name:'Rodi Kopany', lat:-0.7000, lon:34.4500 },
  ],
  'Isiolo': [
    { name:'Isiolo Town', lat:0.3540, lon:37.5820 },
    { name:'Merti', lat:1.0833, lon:38.1000 },
    { name:'Garbatulla', lat:0.9833, lon:38.5333 },
    { name:'Kinna', lat:0.6167, lon:38.3000 },
    { name:'Modogashe', lat:1.0000, lon:38.9167 },
  ],
  'Kajiado': [
    { name:'Kajiado Town', lat:-1.8500, lon:36.7833 },
    { name:'Ngong', lat:-1.3667, lon:36.6500 },
    { name:'Kitengela', lat:-1.4667, lon:36.9667 },
    { name:'Namanga', lat:-2.5500, lon:36.7833 },
    { name:'Loitokitok', lat:-2.9000, lon:37.5333 },
    { name:'Ongata Rongai', lat:-1.3833, lon:36.7333 },
    { name:'Kiserian', lat:-1.4167, lon:36.6667 },
  ],
  'Kakamega': [
    { name:'Kakamega Town', lat:0.2833, lon:34.7500 },
    { name:'Mumias', lat:0.3333, lon:34.4833 },
    { name:'Butere', lat:0.2167, lon:34.4833 },
    { name:'Malava', lat:0.4500, lon:34.8500 },
    { name:'Lugari', lat:0.6167, lon:34.9500 },
    { name:'Shinyalu', lat:0.2167, lon:34.7500 },
    { name:'Khwisero', lat:0.1000, lon:34.5667 },
  ],
  'Kericho': [
    { name:'Kericho Town', lat:-0.3667, lon:35.2833 },
    { name:'Litein', lat:-0.5667, lon:35.1333 },
    { name:'Londiani', lat:-0.1667, lon:35.5833 },
    { name:'Kipkelion', lat:-0.2167, lon:35.4500 },
    { name:'Roret', lat:-0.5000, lon:35.3333 },
    { name:'Sigowet', lat:-0.5833, lon:35.1833 },
  ],
  'Kiambu': [
    { name:'Kiambu Town', lat:-1.1667, lon:36.8333 },
    { name:'Thika', lat:-1.0333, lon:37.0833 },
    { name:'Ruiru', lat:-1.1500, lon:36.9667 },
    { name:'Limuru', lat:-1.1167, lon:36.6333 },
    { name:'Kikuyu', lat:-1.2500, lon:36.6667 },
    { name:'Githunguri', lat:-1.0167, lon:36.7167 },
    { name:'Gatundu', lat:-1.0000, lon:36.9167 },
    { name:'Karuri', lat:-1.1667, lon:36.7667 },
  ],
  'Kilifi': [
    { name:'Kilifi Town', lat:-3.6333, lon:39.8500 },
    { name:'Malindi', lat:-3.2167, lon:40.1167 },
    { name:'Watamu', lat:-3.3667, lon:40.0167 },
    { name:'Kaloleni', lat:-3.8000, lon:39.6500 },
    { name:'Mariakani', lat:-3.8667, lon:39.4667 },
    { name:'Ganze', lat:-3.3167, lon:39.7333 },
    { name:'Adu', lat:-3.5000, lon:39.8000 },
  ],
  'Kirinyaga': [
    { name:'Kerugoya', lat:-0.5000, lon:37.2833 },
    { name:'Kutus', lat:-0.5333, lon:37.3333 },
    { name:'Sagana', lat:-0.6667, lon:37.2000 },
    { name:'Kagio', lat:-0.5167, lon:37.3000 },
    { name:'Baricho', lat:-0.5333, lon:37.4000 },
  ],
  'Kisii': [
    { name:'Kisii Town', lat:-0.6817, lon:34.7667 },
    { name:'Nyanchwa', lat:-0.6677, lon:34.7801 },
    { name:'Suneka', lat:-0.7333, lon:34.8167 },
    { name:'Orero', lat:-0.7000, lon:34.7333 },
    { name:'Keumbu', lat:-0.7500, lon:34.8500 },
    { name:'Daraja Mbili', lat:-0.6833, lon:34.7667 },
    { name:'Iyabe', lat:-0.6500, lon:34.8000 },
    { name:'Gesonso', lat:-0.7167, lon:34.8333 },
    { name:'Bobaracho', lat:-0.6200, lon:34.7900 },
    { name:'Mosocho', lat:-0.6167, lon:34.8000 },
    { name:'Rigoma', lat:-0.6500, lon:34.7500 },
    { name:'Kenyenya', lat:-0.8500, lon:34.9833 },
    { name:'Nyamache', lat:-0.8833, lon:34.9667 },
    { name:'Sameta', lat:-0.7667, lon:34.9167 },
  ],
  'Kisumu': [
    { name:'Kisumu CBD', lat:-0.1022, lon:34.7617 },
    { name:'Kondele', lat:-0.1167, lon:34.7833 },
    { name:'Nyalenda', lat:-0.1333, lon:34.7667 },
    { name:'Mamboleo', lat:-0.0833, lon:34.8000 },
    { name:'Migosi', lat:-0.0833, lon:34.7667 },
    { name:'Riat Hills', lat:-0.0667, lon:34.7333 },
    { name:'Ahero', lat:-0.1667, lon:34.9167 },
    { name:'Nyamasaria', lat:-0.1500, lon:34.7500 },
    { name:'Muhoroni', lat:-0.1500, lon:35.1833 },
    { name:'Maseno', lat:0.0000, lon:34.6000 },
  ],
  'Kitui': [
    { name:'Kitui Town', lat:-1.3667, lon:38.0167 },
    { name:'Mwingi', lat:-0.9333, lon:38.0667 },
    { name:'Mutomo', lat:-1.8333, lon:38.2000 },
    { name:'Kyuso', lat:-0.7500, lon:38.3833 },
    { name:'Kabati', lat:-1.1833, lon:38.0333 },
    { name:'Zombe', lat:-1.5167, lon:38.1000 },
  ],
  'Kwale': [
    { name:'Kwale Town', lat:-4.1833, lon:39.4667 },
    { name:'Ukunda', lat:-4.2833, lon:39.5667 },
    { name:'Shimba Hills', lat:-4.2167, lon:39.3833 },
    { name:'Msambweni', lat:-4.4667, lon:39.4833 },
    { name:'Kinango', lat:-4.1333, lon:39.3167 },
    { name:'Lungalunga', lat:-4.5667, lon:39.1167 },
  ],
  'Laikipia': [
    { name:'Nanyuki', lat:0.0167, lon:37.0667 },
    { name:'Nyahururu', lat:0.0333, lon:36.3667 },
    { name:'Rumuruti', lat:0.2667, lon:36.5333 },
    { name:'Doldol', lat:0.3833, lon:37.0167 },
    { name:'Ol Kalou', lat:-0.2667, lon:36.3833 },
  ],
  'Lamu': [
    { name:'Lamu Town', lat:-2.2694, lon:40.9022 },
    { name:'Mpeketoni', lat:-2.1167, lon:40.7000 },
    { name:'Mokowe', lat:-2.2500, lon:40.8333 },
    { name:'Faza', lat:-2.0000, lon:41.0167 },
    { name:'Kiunga', lat:-1.7500, lon:41.4833 },
  ],
  'Machakos': [
    { name:'Machakos Town', lat:-1.5167, lon:37.2667 },
    { name:'Athi River', lat:-1.4500, lon:36.9833 },
    { name:'Kangundo', lat:-1.2500, lon:37.3500 },
    { name:'Mwala', lat:-1.3667, lon:37.4167 },
    { name:'Mavoko', lat:-1.4667, lon:37.0000 },
    { name:'Matungulu', lat:-1.3000, lon:37.3167 },
    { name:'Yatta', lat:-1.1667, lon:37.2833 },
  ],
  'Makueni': [
    { name:'Wote', lat:-1.7833, lon:37.6333 },
    { name:'Emali', lat:-2.0833, lon:37.4667 },
    { name:'Kibwezi', lat:-2.4167, lon:37.9833 },
    { name:'Makindu', lat:-2.2833, lon:37.8333 },
    { name:'Sultan Hamud', lat:-2.0500, lon:37.6833 },
    { name:'Kathiani', lat:-1.5833, lon:37.4667 },
  ],
  'Mandera': [
    { name:'Mandera Town', lat:3.9358, lon:41.8566 },
    { name:'Rhamu', lat:3.9333, lon:41.5167 },
    { name:'Elwak', lat:2.8167, lon:40.9333 },
    { name:'Takaba', lat:3.3833, lon:40.9333 },
    { name:'Banissa', lat:3.5000, lon:41.3833 },
  ],
  'Marsabit': [
    { name:'Marsabit Town', lat:2.3333, lon:37.9833 },
    { name:'Moyale', lat:3.5167, lon:39.0500 },
    { name:'Loiyangalani', lat:2.7500, lon:36.7167 },
    { name:'North Horr', lat:3.3167, lon:37.0667 },
    { name:'Sololo', lat:3.7833, lon:38.6333 },
  ],
  'Meru': [
    { name:'Meru Town', lat:0.0500, lon:37.6500 },
    { name:'Nkubu', lat:-0.1500, lon:37.6000 },
    { name:'Chuka', lat:-0.3333, lon:37.6500 },
    { name:'Timau', lat:0.1667, lon:37.2333 },
    { name:'Mikinduri', lat:0.1833, lon:38.0000 },
    { name:'Maua', lat:0.2167, lon:37.9500 },
    { name:'Laare', lat:0.3167, lon:37.8167 },
  ],
  'Migori': [
    { name:'Migori Town', lat:-1.0634, lon:34.4731 },
    { name:'Rongo', lat:-1.1167, lon:34.6667 },
    { name:'Awendo', lat:-1.2167, lon:34.5833 },
    { name:'Suna', lat:-1.0833, lon:34.5000 },
    { name:'Nyatike', lat:-1.2000, lon:34.3333 },
    { name:'Isibania', lat:-1.2167, lon:34.3333 },
    { name:'Uriri', lat:-1.1333, lon:34.6000 },
    { name:'Kehancha', lat:-1.2833, lon:34.6000 },
  ],
  'Mombasa': [
    { name:'Mombasa CBD', lat:-4.0435, lon:39.6682 },
    { name:'Nyali', lat:-4.0333, lon:39.7167 },
    { name:'Likoni', lat:-4.0833, lon:39.6667 },
    { name:'Bamburi', lat:-3.9833, lon:39.7333 },
    { name:'Kisauni', lat:-4.0000, lon:39.7000 },
    { name:'Shanzu', lat:-3.9500, lon:39.7167 },
    { name:'Changamwe', lat:-4.0333, lon:39.6333 },
    { name:'Diani', lat:-4.3167, lon:39.5667 },
    { name:'Mvita', lat:-4.0600, lon:39.6700 },
  ],
  'Murang\'a': [
    { name:'Murang\'a Town', lat:-0.7167, lon:37.1500 },
    { name:'Kangema', lat:-0.7500, lon:36.9833 },
    { name:'Maragua', lat:-0.8333, lon:37.1167 },
    { name:'Kenol', lat:-0.9167, lon:37.0500 },
    { name:'Kandara', lat:-0.9500, lon:37.0167 },
    { name:'Kigumo', lat:-0.7667, lon:37.0833 },
  ],
  'Nairobi': [
    { name:'Nairobi CBD', lat:-1.2833, lon:36.8167 },
    { name:'Westlands', lat:-1.2678, lon:36.8031 },
    { name:'Karen', lat:-1.3197, lon:36.7122 },
    { name:'Eastleigh', lat:-1.2756, lon:36.8494 },
    { name:'Kibera', lat:-1.3133, lon:36.7869 },
    { name:'Kasarani', lat:-1.2197, lon:36.8936 },
    { name:'Embakasi', lat:-1.3167, lon:36.9000 },
    { name:'Langata', lat:-1.3333, lon:36.7500 },
    { name:'Parklands', lat:-1.2600, lon:36.8200 },
    { name:'Kilimani', lat:-1.2900, lon:36.7800 },
    { name:'Thika Road', lat:-1.2333, lon:36.8667 },
    { name:'South B', lat:-1.3000, lon:36.8333 },
    { name:'Ruaraka', lat:-1.2333, lon:36.8833 },
    { name:'Dagoretti', lat:-1.2833, lon:36.7333 },
    { name:'Mathare', lat:-1.2667, lon:36.8500 },
  ],
  'Nakuru': [
    { name:'Nakuru Town', lat:-0.3031, lon:36.0800 },
    { name:'Naivasha', lat:-0.7167, lon:36.4333 },
    { name:'Gilgil', lat:-0.5000, lon:36.3167 },
    { name:'Molo', lat:-0.2500, lon:35.7333 },
    { name:'Njoro', lat:-0.3333, lon:35.9333 },
    { name:'Subukia', lat:0.0833, lon:36.1833 },
    { name:'Bahati', lat:-0.1667, lon:36.1833 },
    { name:'Rongai', lat:-0.1833, lon:35.8333 },
    { name:'Ol Kalou', lat:-0.2667, lon:36.3833 },
  ],
  'Nandi': [
    { name:'Kapsabet', lat:0.2000, lon:35.1000 },
    { name:'Nandi Hills', lat:0.1000, lon:35.1833 },
    { name:'Eldoret', lat:0.5143, lon:35.2698 },
    { name:'Mosoriot', lat:0.2833, lon:35.1000 },
    { name:'Kabiyet', lat:0.4333, lon:35.1500 },
    { name:'Chepterwai', lat:0.3167, lon:35.0500 },
  ],
  'Narok': [
    { name:'Narok Town', lat:-1.0833, lon:35.8667 },
    { name:'Kilgoris', lat:-1.0000, lon:34.8833 },
    { name:'Ewaso Ng\'iro', lat:-1.3500, lon:36.1167 },
    { name:'Suswa', lat:-1.1667, lon:36.3500 },
    { name:'Ololulung\'a', lat:-0.9000, lon:36.1000 },
  ],
  'Nyamira': [
    { name:'Nyamira Town', lat:-0.5667, lon:34.9333 },
    { name:'Keroka', lat:-0.6833, lon:34.9500 },
    { name:'Nyansiongo', lat:-0.7333, lon:34.9167 },
    { name:'Manga', lat:-0.5500, lon:34.9833 },
    { name:'Ekerenyo', lat:-0.5167, lon:35.0333 },
  ],
  'Nyandarua': [
    { name:'Ol Kalou', lat:-0.2667, lon:36.3833 },
    { name:'Ndaragwa', lat:-0.1167, lon:36.4167 },
    { name:'Engineer', lat:-0.6667, lon:36.4833 },
    { name:'Njabini', lat:-0.6167, lon:36.5333 },
    { name:'Mirangine', lat:-0.3500, lon:36.4167 },
  ],
  'Nyeri': [
    { name:'Nyeri Town', lat:-0.4167, lon:36.9500 },
    { name:'Karatina', lat:-0.4833, lon:37.1167 },
    { name:'Othaya', lat:-0.5667, lon:36.9333 },
    { name:'Mukurweini', lat:-0.7000, lon:37.1500 },
    { name:'Tetu', lat:-0.5167, lon:36.8833 },
    { name:'Kieni', lat:-0.2667, lon:37.0833 },
  ],
  'Samburu': [
    { name:'Maralal', lat:1.1000, lon:36.7000 },
    { name:'Baragoi', lat:1.7833, lon:36.7833 },
    { name:'Wamba', lat:0.9500, lon:37.3167 },
    { name:'Archer\'s Post', lat:0.6500, lon:37.6667 },
    { name:'Suguta Marmar', lat:1.4833, lon:36.6500 },
  ],
  'Siaya': [
    { name:'Siaya Town', lat:0.0667, lon:34.2833 },
    { name:'Bondo', lat:0.1333, lon:34.4667 },
    { name:'Ugunja', lat:0.1000, lon:34.3167 },
    { name:'Yala', lat:0.1500, lon:34.5333 },
    { name:'Ukwala', lat:0.2833, lon:34.3667 },
    { name:'Ndori', lat:0.0333, lon:34.1500 },
  ],
  'Taita-Taveta': [
    { name:'Voi', lat:-3.3833, lon:38.5667 },
    { name:'Wundanyi', lat:-3.3833, lon:38.3500 },
    { name:'Taveta', lat:-3.3833, lon:37.6833 },
    { name:'Mwatate', lat:-3.5000, lon:38.3833 },
    { name:'Moi\'s Bridge', lat:-3.2667, lon:38.1667 },
  ],
  'Tana River': [
    { name:'Hola', lat:-1.5000, lon:40.0333 },
    { name:'Garsen', lat:-2.2833, lon:40.1167 },
    { name:'Bura', lat:-1.1000, lon:39.9333 },
    { name:'Madogo', lat:-1.1833, lon:40.0167 },
  ],
  'Tharaka-Nithi': [
    { name:'Chuka', lat:-0.3333, lon:37.6500 },
    { name:'Marimanti', lat:0.0500, lon:37.9167 },
    { name:'Kathwana', lat:-0.2500, lon:37.8333 },
    { name:'Gatunga', lat:0.0333, lon:38.0500 },
  ],
  'Trans Nzoia': [
    { name:'Kitale', lat:1.0167, lon:35.0000 },
    { name:'Kiminini', lat:1.1333, lon:34.9833 },
    { name:'Saboti', lat:1.0667, lon:34.8333 },
    { name:'Endebess', lat:1.1167, lon:34.9000 },
    { name:'Kwanza', lat:1.0000, lon:35.1667 },
  ],
  'Turkana': [
    { name:'Lodwar', lat:3.1197, lon:35.5967 },
    { name:'Kakuma', lat:3.7167, lon:34.8500 },
    { name:'Lokichar', lat:2.4000, lon:35.6667 },
    { name:'Kalokol', lat:3.5333, lon:35.8333 },
    { name:'Lokichoggio', lat:4.2167, lon:34.3500 },
    { name:'Todonyang', lat:4.5000, lon:36.0000 },
  ],
  'Uasin Gishu': [
    { name:'Eldoret Town', lat:0.5143, lon:35.2698 },
    { name:'Langas', lat:0.5333, lon:35.2833 },
    { name:'Huruma', lat:0.5000, lon:35.2667 },
    { name:'Kapseret', lat:0.4667, lon:35.3167 },
    { name:'Pioneer', lat:0.5167, lon:35.2500 },
    { name:'Turbo', lat:0.6167, lon:35.0500 },
    { name:'Burnt Forest', lat:0.7167, lon:35.3833 },
  ],
  'Vihiga': [
    { name:'Vihiga Town', lat:0.0833, lon:34.7167 },
    { name:'Mbale', lat:0.0667, lon:34.7000 },
    { name:'Hamisi', lat:0.1500, lon:34.7667 },
    { name:'Luanda', lat:0.0333, lon:34.5667 },
    { name:'Majengo', lat:0.0500, lon:34.6833 },
  ],
  'Wajir': [
    { name:'Wajir Town', lat:1.7500, lon:40.0667 },
    { name:'Habaswein', lat:1.0167, lon:39.4833 },
    { name:'Tarbaj', lat:2.0000, lon:40.1167 },
    { name:'Bute', lat:3.0000, lon:40.0000 },
    { name:'El Wak', lat:2.8167, lon:40.9333 },
  ],
  'West Pokot': [
    { name:'Kapenguria', lat:1.2333, lon:35.1167 },
    { name:'Kitale', lat:1.0167, lon:35.0000 },
    { name:'Makutano', lat:1.3167, lon:35.1833 },
    { name:'Sigor', lat:1.5333, lon:35.3500 },
    { name:'Chepareria', lat:1.6833, lon:35.2833 },
  ],
  'Elgeyo-Marakwet': [
    { name:'Iten', lat:0.6700, lon:35.5100 },
    { name:'Kapsowar', lat:0.8333, lon:35.5500 },
    { name:'Tambach', lat:0.6000, lon:35.5667 },
    { name:'Chebara', lat:0.7167, lon:35.6167 },
  ],
};

// ── Populate county dropdown ──────────────────────────────────────────────
const countySelect      = document.getElementById('county-select');
const townSelect        = document.getElementById('town-select');
const dropdownSearchBtn = document.getElementById('dropdown-search-btn');

Object.keys(KENYA_TOWNS).sort().forEach(county => {
  const opt = document.createElement('option');
  opt.value = county;
  opt.textContent = county;
  countySelect.appendChild(opt);
});

countySelect.addEventListener('change', () => {
  const county = countySelect.value;
  townSelect.innerHTML = '<option value="">— Select Town —</option>';
  townSelect.disabled = true;
  dropdownSearchBtn.disabled = true;
  if (!county) return;
  KENYA_TOWNS[county].forEach(town => {
    const opt = document.createElement('option');
    opt.value = JSON.stringify({ lat: town.lat, lon: town.lon, name: town.name, county });
    opt.textContent = town.name;
    townSelect.appendChild(opt);
  });
  townSelect.disabled = false;
});

townSelect.addEventListener('change', () => {
  dropdownSearchBtn.disabled = !townSelect.value;
});

dropdownSearchBtn.addEventListener('click', () => {
  if (!townSelect.value) return;
  const { lat, lon, name, county } = JSON.parse(townSelect.value);
  fetchWeatherByCoords(lat, lon, `${name}, ${county}`);
});

// ── Tab switching ─────────────────────────────────────────────────────────
document.getElementById('tab-dropdown').addEventListener('click', () => {
  document.getElementById('tab-dropdown').classList.add('active');
  document.getElementById('tab-text').classList.remove('active');
  document.getElementById('search-dropdown-panel').classList.remove('hidden');
  document.getElementById('search-text-panel').classList.add('hidden');
});
document.getElementById('tab-text').addEventListener('click', () => {
  document.getElementById('tab-text').classList.add('active');
  document.getElementById('tab-dropdown').classList.remove('active');
  document.getElementById('search-text-panel').classList.remove('hidden');
  document.getElementById('search-dropdown-panel').classList.add('hidden');
});

// ── Peace mottos ──────────────────────────────────────────────────────────
const scoutMottos = [
  'Be Prepared — for peace starts with readiness',
  'Do a Good Turn Daily — build bridges, not walls',
  'Leave No Trace — in nature and in conflict',
  'Service Above Self — community first',
  'United in diversity, strong in peace',
  'A Scout listens, understands, and acts for peace',
  'Dialogue today, peaceful communities tomorrow',
];
document.getElementById('daily-motto').textContent =
  scoutMottos[new Date().getDay() % scoutMottos.length];

// ── Daily Peace Challenge ─────────────────────────────────────────────────
const peaceChallenges = [
  '🤝 Today\'s Mission: Introduce yourself to someone from a different community and learn one thing about their culture.',
  '📢 Today\'s Mission: Organize a 10-minute open dialogue session within your patrol about what peace means to each member.',
  '🌱 Today\'s Mission: Plant a tree or clean a public space as a symbol of your commitment to a peaceful environment.',
  '✉️ Today\'s Mission: Write a short message of unity and share it with a fellow scout or community member.',
  '👂 Today\'s Mission: Practice active listening — let someone share their story without interrupting.',
  '🎨 Today\'s Mission: Create a drawing, poem, or slogan that promotes peace in your community.',
  '📚 Today\'s Mission: Read or share one story of a young peacemaker who made a difference.',
];
document.getElementById('peace-challenge').textContent =
  peaceChallenges[new Date().getDay() % peaceChallenges.length];

// ── Scout helper functions ────────────────────────────────────────────────
function getCommunityPeaceIndex(weatherMain, temp, humidity) {
  const w = weatherMain.toLowerCase();
  if (w.includes('thunderstorm') || w.includes('tornado'))
    return { score:'⛔ Not Ideal', color:'#E05C7A', suggestion:'Severe weather — move all dialogue events indoors. Safety first!' };
  if (w.includes('rain') || temp >= 35 || temp <= 8)
    return { score:'🟡 Fair', color:'#E6C840', suggestion:'Challenging conditions — consider indoor venues for peace forums today.' };
  if (w.includes('clear') && temp >= 18 && temp <= 30 && humidity < 75)
    return { score:'🟢 Excellent', color:'#3A7D44', suggestion:'Perfect for outdoor community dialogue, peace walks, or tree planting drives!' };
  return { score:'🔵 Good', color:'#5BA368', suggestion:'Good conditions for community peace activities. Great day for a dialogue session.' };
}

function getPeaceActivity(weatherMain, temp) {
  const w = weatherMain.toLowerCase();
  if (w.includes('clear') && temp >= 20) return '☀️ Perfect for an outdoor peace walk, community tree planting, or an open-air dialogue forum.';
  if (w.includes('clear') && temp < 20)  return '🌤️ Cool clear day — great for a flag ceremony with a peace pledge or patrol unity exercise.';
  if (w.includes('cloud'))  return '⛅ Good for a community service patrol, neighbourhood clean-up, or peace mural painting.';
  if (w.includes('rain'))   return '🌧️ Indoor day — ideal for a peace dialogue workshop or conflict resolution training.';
  if (w.includes('drizzle'))return '🌦️ Light rain — fine for a short peace walk with rain gear or indoor youth empowerment session.';
  if (w.includes('thunder'))return '⛈️ Stay indoors — great time for scout peace badge study or writing peace letters.';
  if (w.includes('mist') || w.includes('fog')) return '🌫️ Reflective weather — perfect for journaling on what peace means to you.';
  return '🏕️ Check conditions and plan a community peace activity suited for today\'s weather.';
}

function getReadinessTip(weatherMain, temp, humidity, windSpeed) {
  const w = weatherMain.toLowerCase();
  if (w.includes('rain') || w.includes('drizzle')) return 'Pack waterproof gear and extra dry clothes. Ensure your patrol has a shelter plan.';
  if (w.includes('thunder')) return 'Avoid open fields and tall trees. Seek sturdy shelter immediately if caught outdoors.';
  if (temp >= 32) return 'Extreme heat! Carry at least 2L of water per scout, wear sun protection, and rest in shade.';
  if (temp <= 10) return 'Cold conditions! Layer up with moisture-wicking base layers and a windproof outer shell.';
  if (humidity > 80) return 'High humidity — watch for heat exhaustion. Keep scouts hydrated and take regular rest breaks.';
  if (windSpeed > 10) return 'Strong winds expected. Secure tents with extra guy ropes and avoid exposed ridgelines.';
  return 'Conditions look good! Do a standard kit check before any outdoor patrol activity.';
}

function getReadinessLevel(weatherMain, temp) {
  const w = weatherMain.toLowerCase();
  if (w.includes('thunder') || w.includes('storm')) return { label:'🔴 High Alert', color:'#E05C7A' };
  if (w.includes('rain') || temp >= 35 || temp <= 5)  return { label:'🟡 Caution',    color:'#B8860B' };
  return { label:'🟢 Go — Ready to Scout!', color:'#3A7D44' };
}

// ── DOM refs ──────────────────────────────────────────────────────────────
const cityInput  = document.getElementById('city-input');
const searchBtn  = document.getElementById('search-btn');
const resultDiv  = document.getElementById('weather-result');
const errorDiv   = document.getElementById('error-msg');
const errorText  = document.getElementById('error-text');
const loadingDiv = document.getElementById('loading');

searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });

function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) { showError('Please enter a city name.'); return; }
  fetchWeather(city);
}

async function fetchWeatherByCoords(lat, lon, label) {
  showLoading();
  try {
    const res = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    if (!res.ok) throw new Error('Location not found. Please try again.');
    const data = await res.json();
    data._customLabel = label;
    displayWeather(data);
  } catch (err) { showError(err.message); }
}

async function fetchWeather(city) {
  showLoading();
  try {
    const res = await fetch(`${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('City not found. Please check the spelling and try again.');
      if (res.status === 401) throw new Error('Invalid API key. Please check your OpenWeatherMap key.');
      throw new Error('Something went wrong. Please try again.');
    }
    const data = await res.json();
    displayWeather(data);
  } catch (err) { showError(err.message); }
}

function displayWeather(data) {
  hideAll();
  const { name, sys, main, weather, wind, visibility } = data;
  const displayName = data._customLabel || `${name}, ${sys.country}`;
  const iconUrl     = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  const tempC       = Math.round(main.temp);
  const feelsC      = Math.round(main.feels_like);
  const windKph     = Math.round(wind.speed * 3.6);
  const visKm       = visibility ? (visibility / 1000).toFixed(1) : 'N/A';
  const peaceAct    = getPeaceActivity(weather[0].main, tempC);
  const tip         = getReadinessTip(weather[0].main, tempC, main.humidity, wind.speed);
  const readiness   = getReadinessLevel(weather[0].main, tempC);
  const peaceIndex  = getCommunityPeaceIndex(weather[0].main, tempC, main.humidity);

  // Save to localStorage for offline page
  localStorage.setItem('flamingo_last_weather', JSON.stringify({
    location: displayName,
    temp: tempC,
    description: weather[0].description,
    humidity: main.humidity,
    wind: windKph,
    time: new Date().toLocaleString('en-GB')
  }));

  resultDiv.innerHTML = `
    <div class="weather-card">
      <div class="card-top">
        <div>
          <div class="city-name">${displayName}</div>
          <div class="city-country">${sys.country} · ${getLocalTime()}</div>
        </div>
        <div class="weather-icon-wrap">
          <img src="${iconUrl}" alt="${weather[0].description}">
        </div>
      </div>
      <div class="temp-row">
        <span class="temperature">${tempC}</span>
        <span class="temp-unit">°C</span>
      </div>
      <div class="description">${weather[0].description}</div>
      <div class="divider"></div>
      <div class="details-grid">
        <div class="detail-item"><span class="detail-icon">💧</span><div><div class="detail-label">Humidity</div><div class="detail-value">${main.humidity}%</div></div></div>
        <div class="detail-item"><span class="detail-icon">🌬️</span><div><div class="detail-label">Wind</div><div class="detail-value">${windKph} km/h</div></div></div>
        <div class="detail-item"><span class="detail-icon">🌡️</span><div><div class="detail-label">Feels Like</div><div class="detail-value">${feelsC}°C</div></div></div>
        <div class="detail-item"><span class="detail-icon">👁️</span><div><div class="detail-label">Visibility</div><div class="detail-value">${visKm} km</div></div></div>
        <div class="detail-item"><span class="detail-icon">📈</span><div><div class="detail-label">Pressure</div><div class="detail-value">${main.pressure} hPa</div></div></div>
        <div class="detail-item"><span class="detail-icon">🌡️</span><div><div class="detail-label">Min / Max</div><div class="detail-value">${Math.round(main.temp_min)}° / ${Math.round(main.temp_max)}°</div></div></div>
      </div>
      <div class="scout-section">
        <div class="scout-box readiness">
          <span class="scout-box-icon">🎖️</span>
          <div><div class="scout-box-label">Patrol Readiness</div>
          <div class="scout-box-text" style="font-weight:500;color:${readiness.color}">${readiness.label}</div></div>
        </div>
        <div class="scout-box peace-index">
          <span class="scout-box-icon">🕊️</span>
          <div><div class="scout-box-label">Community Peace Index</div>
          <div class="scout-box-text" style="font-weight:500;color:${peaceIndex.color};margin-bottom:4px">${peaceIndex.score}</div>
          <div class="scout-box-text">${peaceIndex.suggestion}</div></div>
        </div>
        <div class="scout-box activity">
          <span class="scout-box-icon">🌍</span>
          <div><div class="scout-box-label">Peace Activity for Today</div>
          <div class="scout-box-text">${peaceAct}</div></div>
        </div>
        <div class="scout-box tip">
          <span class="scout-box-icon">⚠️</span>
          <div><div class="scout-box-label">Scout Weather Tip</div>
          <div class="scout-box-text">${tip}</div></div>
        </div>
      </div>
    </div>
  `;
}

function getLocalTime() {
  return new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
}
function showLoading() {
  resultDiv.innerHTML = '';
  errorDiv.classList.add('hidden');
  loadingDiv.classList.remove('hidden');
}
function showError(msg) {
  hideAll();
  errorText.textContent = msg;
  errorDiv.classList.remove('hidden');
}
function hideAll() {
  loadingDiv.classList.add('hidden');
  errorDiv.classList.add('hidden');
}