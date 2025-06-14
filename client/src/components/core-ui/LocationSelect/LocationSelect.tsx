import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

const locations = [
  // Canada
  { id: 1, name: "Toronto, ON, Canada" },
  { id: 2, name: "Vancouver, BC, Canada" },
  { id: 3, name: "Montreal, QC, Canada" },
  { id: 4, name: "Calgary, AB, Canada" },
  { id: 5, name: "Ottawa, ON, Canada" },
  { id: 6, name: "Edmonton, AB, Canada" },
  { id: 7, name: "Winnipeg, MB, Canada" },
  { id: 8, name: "Quebec City, QC, Canada" },
  { id: 9, name: "Hamilton, ON, Canada" },
  { id: 10, name: "Kitchener, ON, Canada" },

  // United States
  { id: 11, name: "Albuquerque, New Mexico, USA" },
  { id: 12, name: "Alexandria, Virginia, USA" },
  { id: 13, name: "Anchorage, Alaska, USA" },
  { id: 14, name: "Arlington, Texas, USA" },
  { id: 15, name: "Arlington, Virginia, USA" },
  { id: 16, name: "Atlanta, Georgia, USA" },
  { id: 17, name: "Augusta, Georgia, USA" },
  { id: 18, name: "Austin, Texas, USA" },
  { id: 19, name: "Bakersfield, California, USA" },
  { id: 20, name: "Baltimore, Maryland, USA" },
  { id: 21, name: "Baton Rouge, Louisiana, USA" },
  { id: 22, name: "Bellevue, Washington, USA" },
  { id: 23, name: "Birmingham, Alabama, USA" },
  { id: 24, name: "Boise, Idaho, USA" },
  { id: 25, name: "Boston, Massachusetts, USA" },
  { id: 26, name: "Bridgeport, Connecticut, USA" },
  { id: 27, name: "Buffalo, New York, USA" },
  { id: 28, name: "Burlington, Vermont, USA" },
  { id: 29, name: "Cambridge, Massachusetts, USA" },
  { id: 30, name: "Cedar Rapids, Iowa, USA" },
  { id: 31, name: "Charleston, South Carolina, USA" },
  { id: 32, name: "Charleston, West Virginia, USA" },
  { id: 33, name: "Charlotte, North Carolina, USA" },
  { id: 34, name: "Chattanooga, Tennessee, USA" },
  { id: 35, name: "Chicago, Illinois, USA" },
  { id: 36, name: "Cincinnati, Ohio, USA" },
  { id: 37, name: "Cleveland, Ohio, USA" },
  { id: 38, name: "Colorado Springs, Colorado, USA" },
  { id: 39, name: "Columbia, South Carolina, USA" },
  { id: 40, name: "Columbus, Georgia, USA" },
  { id: 41, name: "Columbus, Ohio, USA" },
  { id: 42, name: "Concord, New Hampshire, USA" },
  { id: 43, name: "Dallas, Texas, USA" },
  { id: 44, name: "Dayton, Ohio, USA" },
  { id: 45, name: "Denver, Colorado, USA" },
  { id: 46, name: "Des Moines, Iowa, USA" },
  { id: 47, name: "Detroit, Michigan, USA" },
  { id: 48, name: "Dover, Delaware, USA" },
  { id: 49, name: "Durham, North Carolina, USA" },
  { id: 50, name: "El Paso, Texas, USA" },
  { id: 51, name: "Eugene, Oregon, USA" },
  { id: 52, name: "Evansville, Indiana, USA" },
  { id: 53, name: "Fargo, North Dakota, USA" },
  { id: 54, name: "Fayetteville, Arkansas, USA" },
  { id: 55, name: "Fort Collins, Colorado, USA" },
  { id: 56, name: "Fort Lauderdale, Florida, USA" },
  { id: 57, name: "Fort Worth, Texas, USA" },
  { id: 58, name: "Fresno, California, USA" },
  { id: 59, name: "Grand Rapids, Michigan, USA" },
  { id: 60, name: "Greensboro, North Carolina, USA" },
  { id: 61, name: "Greenville, South Carolina, USA" },
  { id: 62, name: "Hartford, Connecticut, USA" },
  { id: 63, name: "Harrisburg, Pennsylvania, USA" },
  { id: 64, name: "Honolulu, Hawaii, USA" },
  { id: 65, name: "Houston, Texas, USA" },
  { id: 66, name: "Indianapolis, Indiana, USA" },
  { id: 67, name: "Irvine, California, USA" },
  { id: 68, name: "Jackson, Mississippi, USA" },
  { id: 69, name: "Jacksonville, Florida, USA" },
  { id: 70, name: "Jersey City, New Jersey, USA" },
  { id: 71, name: "Kansas City, Missouri, USA" },
  { id: 72, name: "Knoxville, Tennessee, USA" },
  { id: 73, name: "Lafayette, Louisiana, USA" },
  { id: 74, name: "Lansing, Michigan, USA" },
  { id: 75, name: "Las Vegas, Nevada, USA" },
  { id: 76, name: "Lexington, Kentucky, USA" },
  { id: 77, name: "Lincoln, Nebraska, USA" },
  { id: 78, name: "Little Rock, Arkansas, USA" },
  { id: 79, name: "Long Beach, California, USA" },
  { id: 80, name: "Los Angeles, California, USA" },
  { id: 81, name: "Louisville, Kentucky, USA" },
  { id: 82, name: "Lubbock, Texas, USA" },
  { id: 83, name: "Madison, Wisconsin, USA" },
  { id: 84, name: "Manchester, New Hampshire, USA" },
  { id: 85, name: "Memphis, Tennessee, USA" },
  { id: 86, name: "Mesa, Arizona, USA" },
  { id: 87, name: "Miami, Florida, USA" },
  { id: 88, name: "Milwaukee, Wisconsin, USA" },
  { id: 89, name: "Minneapolis, Minnesota, USA" },
  { id: 90, name: "Mobile, Alabama, USA" },
  { id: 91, name: "Modesto, California, USA" },
  { id: 92, name: "Montgomery, Alabama, USA" },
  { id: 93, name: "Nashville, Tennessee, USA" },
  { id: 94, name: "New Haven, Connecticut, USA" },
  { id: 95, name: "New Orleans, Louisiana, USA" },
  { id: 96, name: "New York City, New York, USA" },
  { id: 97, name: "Newark, New Jersey, USA" },
  { id: 98, name: "Norfolk, Virginia, USA" },
  { id: 99, name: "Oakland, California, USA" },
  { id: 100, name: "Oklahoma City, Oklahoma, USA" },
  { id: 101, name: "Omaha, Nebraska, USA" },
  { id: 102, name: "Orlando, Florida, USA" },
  { id: 103, name: "Philadelphia, Pennsylvania, USA" },
  { id: 104, name: "Phoenix, Arizona, USA" },
  { id: 105, name: "Pittsburgh, Pennsylvania, USA" },
  { id: 106, name: "Portland, Maine, USA" },
  { id: 107, name: "Portland, Oregon, USA" },
  { id: 108, name: "Providence, Rhode Island, USA" },
  { id: 109, name: "Raleigh, North Carolina, USA" },
  { id: 110, name: "Reno, Nevada, USA" },
  { id: 111, name: "Richmond, Virginia, USA" },
  { id: 112, name: "Riverside, California, USA" },
  { id: 113, name: "Rochester, New York, USA" },
  { id: 114, name: "Sacramento, California, USA" },
  { id: 115, name: "Saint Louis, Missouri, USA" },
  { id: 116, name: "Saint Paul, Minnesota, USA" },
  { id: 117, name: "Salt Lake City, Utah, USA" },
  { id: 118, name: "San Antonio, Texas, USA" },
  { id: 119, name: "San Bernardino, California, USA" },
  { id: 120, name: "San Diego, California, USA" },
  { id: 121, name: "San Francisco, California, USA" },
  { id: 122, name: "San Jose, California, USA" },
  { id: 123, name: "Santa Ana, California, USA" },
  { id: 124, name: "Santa Fe, New Mexico, USA" },
  { id: 125, name: "Savannah, Georgia, USA" },
  { id: 126, name: "Scottsdale, Arizona, USA" },
  { id: 127, name: "Seattle, Washington, USA" },
  { id: 128, name: "Shreveport, Louisiana, USA" },
  { id: 129, name: "Sioux Falls, South Dakota, USA" },
  { id: 130, name: "Spokane, Washington, USA" },
  { id: 131, name: "Springfield, Illinois, USA" },
  { id: 132, name: "Springfield, Missouri, USA" },
  { id: 133, name: "St. Petersburg, Florida, USA" },
  { id: 134, name: "Stockton, California, USA" },
  { id: 135, name: "Syracuse, New York, USA" },
  { id: 136, name: "Tacoma, Washington, USA" },
  { id: 137, name: "Tallahassee, Florida, USA" },
  { id: 138, name: "Tampa, Florida, USA" },
  { id: 139, name: "Toledo, Ohio, USA" },
  { id: 140, name: "Topeka, Kansas, USA" },
  { id: 141, name: "Tucson, Arizona, USA" },
  { id: 142, name: "Tulsa, Oklahoma, USA" },
  { id: 143, name: "Virginia Beach, Virginia, USA" },
  { id: 144, name: "Washington, D.C., USA" },
  { id: 145, name: "Wichita, Kansas, USA" },
  { id: 146, name: "Wilmington, Delaware, USA" },
  { id: 147, name: "Winston-Salem, North Carolina, USA" },
  { id: 148, name: "Worcester, Massachusetts, USA" },
  { id: 149, name: "Yonkers, New York, USA" },

  // United Kingdom
  { id: 150, name: "London, UK" },
  { id: 151, name: "Birmingham, UK" },
  { id: 152, name: "Manchester, UK" },
  { id: 153, name: "Glasgow, UK" },
  { id: 154, name: "Edinburgh, UK" },

  // Europe
  // Austria
  { id: 155, name: "Vienna, Austria" },
  { id: 156, name: "Graz, Austria" },
  { id: 157, name: "Linz, Austria" },
  { id: 158, name: "Salzburg, Austria" },
  { id: 159, name: "Innsbruck, Austria" },

  // Belarus
  { id: 160, name: "Minsk, Belarus" },
  { id: 161, name: "Gomel, Belarus" },
  { id: 162, name: "Mogilev, Belarus" },
  { id: 163, name: "Vitebsk, Belarus" },
  { id: 164, name: "Brest, Belarus" },

  // Belgium
  { id: 165, name: "Brussels, Belgium" },
  { id: 166, name: "Antwerp, Belgium" },
  { id: 167, name: "Ghent, Belgium" },
  { id: 168, name: "Charleroi, Belgium" },
  { id: 169, name: "Liège, Belgium" },

  // Bulgaria
  { id: 170, name: "Sofia, Bulgaria" },
  { id: 171, name: "Plovdiv, Bulgaria" },
  { id: 172, name: "Varna, Bulgaria" },
  { id: 173, name: "Burgas, Bulgaria" },
  { id: 174, name: "Ruse, Bulgaria" },

  // Croatia
  { id: 175, name: "Zagreb, Croatia" },
  { id: 176, name: "Split, Croatia" },
  { id: 177, name: "Rijeka, Croatia" },
  { id: 178, name: "Osijek, Croatia" },
  { id: 179, name: "Zadar, Croatia" },

  // Cyprus
  { id: 180, name: "Nicosia, Cyprus" },
  { id: 181, name: "Limassol, Cyprus" },
  { id: 182, name: "Larnaca, Cyprus" },
  { id: 183, name: "Famagusta, Cyprus" },
  { id: 184, name: "Paphos, Cyprus" },

  // Czech Republic
  { id: 185, name: "Prague, Czech Republic" },
  { id: 186, name: "Brno, Czech Republic" },
  { id: 187, name: "Ostrava, Czech Republic" },
  { id: 188, name: "Plzeň, Czech Republic" },
  { id: 189, name: "Liberec, Czech Republic" },

  // Denmark
  { id: 190, name: "Copenhagen, Denmark" },
  { id: 191, name: "Aarhus, Denmark" },
  { id: 192, name: "Odense, Denmark" },
  { id: 193, name: "Aalborg, Denmark" },
  { id: 194, name: "Esbjerg, Denmark" },

  // Estonia
  { id: 195, name: "Tallinn, Estonia" },
  { id: 196, name: "Tartu, Estonia" },
  { id: 197, name: "Narva, Estonia" },
  { id: 198, name: "Pärnu, Estonia" },
  { id: 199, name: "Kohtla-Järve, Estonia" },

  // Finland
  { id: 200, name: "Helsinki, Finland" },
  { id: 201, name: "Espoo, Finland" },
  { id: 202, name: "Tampere, Finland" },
  { id: 203, name: "Vantaa, Finland" },
  { id: 204, name: "Turku, Finland" },

  // France
  { id: 205, name: "Paris, France" },
  { id: 206, name: "Marseille, France" },
  { id: 207, name: "Lyon, France" },
  { id: 208, name: "Toulouse, France" },
  { id: 209, name: "Nice, France" },

  // Germany
  { id: 210, name: "Berlin, Germany" },
  { id: 211, name: "Hamburg, Germany" },
  { id: 212, name: "Munich, Germany" },
  { id: 213, name: "Cologne, Germany" },
  { id: 214, name: "Frankfurt, Germany" },

  // Greece
  { id: 215, name: "Athens, Greece" },
  { id: 216, name: "Thessaloniki, Greece" },
  { id: 217, name: "Patras, Greece" },
  { id: 218, name: "Heraklion, Greece" },
  { id: 219, name: "Larissa, Greece" },

  // Hungary
  { id: 220, name: "Budapest, Hungary" },
  { id: 221, name: "Debrecen, Hungary" },
  { id: 222, name: "Szeged, Hungary" },
  { id: 223, name: "Miskolc, Hungary" },
  { id: 224, name: "Pécs, Hungary" },

  // Iceland
  { id: 225, name: "Reykjavik, Iceland" },
  { id: 226, name: "Akureyri, Iceland" },
  { id: 227, name: "Hafnarfjörður, Iceland" },
  { id: 228, name: "Kópavogur, Iceland" },
  { id: 229, name: "Egilsstaðir, Iceland" },

  // Ireland
  { id: 230, name: "Dublin, Ireland" },
  { id: 231, name: "Cork, Ireland" },
  { id: 232, name: "Limerick, Ireland" },
  { id: 233, name: "Galway, Ireland" },
  { id: 234, name: "Waterford, Ireland" },

  // Italy
  { id: 235, name: "Rome, Italy" },
  { id: 236, name: "Milan, Italy" },
  { id: 237, name: "Naples, Italy" },
  { id: 238, name: "Turin, Italy" },
  { id: 239, name: "Palermo, Italy" },

  // Latvia
  { id: 240, name: "Riga, Latvia" },
  { id: 241, name: "Daugavpils, Latvia" },
  { id: 242, name: "Liepāja, Latvia" },
  { id: 243, name: "Jelgava, Latvia" },
  { id: 244, name: "Jūrmala, Latvia" },

  // Lithuania
  { id: 245, name: "Vilnius, Lithuania" },
  { id: 246, name: "Kaunas, Lithuania" },
  { id: 247, name: "Klaipėda, Lithuania" },
  { id: 248, name: "Šiauliai, Lithuania" },
  { id: 249, name: "Panevėžys, Lithuania" },

  // Luxembourg
  { id: 250, name: "Luxembourg City, Luxembourg" },
  { id: 251, name: "Esch-sur-Alzette, Luxembourg" },
  { id: 252, name: "Differdange, Luxembourg" },
  { id: 253, name: "Dudelange, Luxembourg" },
  { id: 254, name: "Ettelbruck, Luxembourg" },

  // Malta
  { id: 255, name: "Valletta, Malta" },
  { id: 256, name: "Birkirkara, Malta" },
  { id: 257, name: "Mosta, Malta" },
  { id: 258, name: "Qormi, Malta" },
  { id: 259, name: "Sliema, Malta" },

  // Moldova
  { id: 260, name: "Chișinău, Moldova" },
  { id: 261, name: "Tiraspol, Moldova" },
  { id: 262, name: "Bălți, Moldova" },
  { id: 263, name: "Bender, Moldova" },
  { id: 264, name: "Cahul, Moldova" },

  // Montenegro
  { id: 265, name: "Podgorica, Montenegro" },
  { id: 266, name: "Nikšić, Montenegro" },
  { id: 267, name: "Herceg Novi, Montenegro" },
  { id: 268, name: "Bar, Montenegro" },
  { id: 269, name: "Budva, Montenegro" },

  // Netherlands
  { id: 270, name: "Amsterdam, Netherlands" },
  { id: 271, name: "Rotterdam, Netherlands" },
  { id: 272, name: "The Hague, Netherlands" },
  { id: 273, name: "Utrecht, Netherlands" },
  { id: 274, name: "Eindhoven, Netherlands" },

  // North Macedonia
  { id: 275, name: "Skopje, North Macedonia" },
  { id: 276, name: "Bitola, North Macedonia" },
  { id: 277, name: "Kumanovo, North Macedonia" },
  { id: 278, name: "Tetovo, North Macedonia" },
  { id: 279, name: "Ohrid, North Macedonia" },

  // Norway
  { id: 280, name: "Oslo, Norway" },
  { id: 281, name: "Bergen, Norway" },
  { id: 282, name: "Stavanger, Norway" },
  { id: 283, name: "Trondheim, Norway" },
  { id: 284, name: "Tromsø, Norway" },

  // Poland
  { id: 285, name: "Warsaw, Poland" },
  { id: 286, name: "Kraków, Poland" },
  { id: 287, name: "Łódź, Poland" },
  { id: 288, name: "Wrocław, Poland" },
  { id: 289, name: "Poznań, Poland" },

  // Portugal
  { id: 290, name: "Lisbon, Portugal" },
  { id: 291, name: "Porto, Portugal" },
  { id: 292, name: "Braga, Portugal" },
  { id: 293, name: "Coimbra, Portugal" },
  { id: 294, name: "Faro, Portugal" },

  // Romania
  { id: 295, name: "Bucharest, Romania" },
  { id: 296, name: "Cluj-Napoca, Romania" },
  { id: 297, name: "Timișoara, Romania" },
  { id: 298, name: "Iași, Romania" },
  { id: 299, name: "Constanța, Romania" },

  // Russia (European part)
  { id: 300, name: "Moscow, Russia" },
  { id: 301, name: "Saint Petersburg, Russia" },
  { id: 302, name: "Novgorod, Russia" },
  { id: 303, name: "Kaliningrad, Russia" },
  { id: 304, name: "Kazan, Russia" },

  // Serbia
  { id: 305, name: "Belgrade, Serbia" },
  { id: 306, name: "Novi Sad, Serbia" },
  { id: 307, name: "Niš, Serbia" },
  { id: 308, name: "Kragujevac, Serbia" },
  { id: 309, name: "Subotica, Serbia" },

  // Slovakia
  { id: 310, name: "Bratislava, Slovakia" },
  { id: 311, name: "Košice, Slovakia" },
  { id: 312, name: "Prešov, Slovakia" },
  { id: 313, name: "Žilina, Slovakia" },
  { id: 314, name: "Nitra, Slovakia" },

  // Slovenia
  { id: 315, name: "Ljubljana, Slovenia" },
  { id: 316, name: "Maribor, Slovenia" },
  { id: 317, name: "Celje, Slovenia" },
  { id: 318, name: "Kranj, Slovenia" },
  { id: 319, name: "Koper, Slovenia" },

  // Spain
  { id: 320, name: "Madrid, Spain" },
  { id: 321, name: "Barcelona, Spain" },
  { id: 322, name: "Valencia, Spain" },
  { id: 323, name: "Seville, Spain" },
  { id: 324, name: "Zaragoza, Spain" },

  // Sweden
  { id: 325, name: "Stockholm, Sweden" },
  { id: 326, name: "Gothenburg, Sweden" },
  { id: 327, name: "Malmö, Sweden" },
  { id: 328, name: "Uppsala, Sweden" },
  { id: 329, name: "Västerås, Sweden" },

  // Switzerland
  { id: 330, name: "Zurich, Switzerland" },
  { id: 331, name: "Geneva, Switzerland" },
  { id: 332, name: "Basel, Switzerland" },
  { id: 333, name: "Bern, Switzerland" },
  { id: 334, name: "Lausanne, Switzerland" },

  // Ukraine
  { id: 335, name: "Kyiv, Ukraine" },
  { id: 336, name: "Kharkiv, Ukraine" },
  { id: 337, name: "Odesa, Ukraine" },
  { id: 338, name: "Lviv, Ukraine" },
  { id: 339, name: "Dnipro, Ukraine" },

  // Kosovo
  { id: 340, name: "Pristina, Kosovo" },
  { id: 341, name: "Peja, Kosovo" },
  { id: 342, name: "Gjakova, Kosovo" },
  { id: 343, name: "Mitrovica, Kosovo" },
  { id: 344, name: "Prizren, Kosovo" },

  // Albania
  { id: 345, name: "Tirana, Albania" },
  { id: 346, name: "Durrës, Albania" },
  { id: 347, name: "Vlorë, Albania" },
  { id: 348, name: "Shkodër, Albania" },
  { id: 349, name: "Elbasan, Albania" },

  // India
  { id: 350, name: "Agartala, India" },
  { id: 351, name: "Agra, India" },
  { id: 352, name: "Ahmedabad, India" },
  { id: 353, name: "Aizawl, India" },
  { id: 354, name: "Ajmer, India" },
  { id: 355, name: "Aligarh, India" },
  { id: 356, name: "Allahabad (Prayagraj), India" },
  { id: 357, name: "Amravati, India" },
  { id: 358, name: "Amritsar, India" },
  { id: 359, name: "Asansol, India" },
  { id: 360, name: "Aurangabad, India" },
  { id: 361, name: "Bareilly, India" },
  { id: 362, name: "Belagavi (Belgaum), India" },
  { id: 363, name: "Bengaluru (Bangalore), India" },
  { id: 364, name: "Berhampur, India" },
  { id: 365, name: "Bhopal, India" },
  { id: 366, name: "Bhubaneswar, India" },
  { id: 367, name: "Bhilai, India" },
  { id: 368, name: "Bhiwadi, India" },
  { id: 369, name: "Bhiwandi, India" },
  { id: 370, name: "Bikaner, India" },
  { id: 371, name: "Bilaspur, India" },
  { id: 372, name: "Bokaro Steel City, India" },
  { id: 373, name: "Chandigarh, India" },
  { id: 374, name: "Chennai, India" },
  { id: 375, name: "Coimbatore, India" },
  { id: 376, name: "Cuttack, India" },
  { id: 377, name: "Darbhanga, India" },
  { id: 378, name: "Dehradun, India" },
  { id: 379, name: "Delhi (NCT), India" },
  { id: 380, name: "Dhanbad, India" },
  { id: 381, name: "Durgapur, India" },
  { id: 382, name: "Erode, India" },
  { id: 383, name: "Faridabad, India" },
  { id: 384, name: "Firozabad, India" },
  { id: 385, name: "Gandhinagar, India" },
  { id: 386, name: "Gaya, India" },
  { id: 387, name: "Ghaziabad, India" },
  { id: 388, name: "Gorakhpur, India" },
  { id: 389, name: "Guntur, India" },
  { id: 390, name: "Gurugram (Gurgaon), India" },
  { id: 391, name: "Guwahati, India" },
  { id: 392, name: "Gwalior, India" },
  { id: 393, name: "Haldwani, India" },
  { id: 394, name: "Hubballi-Dharwad, India" },
  { id: 395, name: "Hyderabad, India" },
  { id: 396, name: "Imphal, India" },
  { id: 397, name: "Indore, India" },
  { id: 398, name: "Jabalpur, India" },
  { id: 399, name: "Jaipur, India" },
  { id: 400, name: "Jalandhar, India" },
  { id: 401, name: "Jammu, India" },
  { id: 402, name: "Jamnagar, India" },
  { id: 403, name: "Jamshedpur, India" },
  { id: 404, name: "Jhansi, India" },
  { id: 405, name: "Jodhpur, India" },
  { id: 406, name: "Kakinada, India" },
  { id: 407, name: "Kalyan-Dombivli, India" },
  { id: 408, name: "Kanpur, India" },
  { id: 409, name: "Karnal, India" },
  { id: 410, name: "Kochi (Cochin), India" },
  { id: 411, name: "Kolhapur, India" },
  { id: 412, name: "Kolkata, India" },
  { id: 413, name: "Kollam, India" },
  { id: 414, name: "Kota, India" },
  { id: 415, name: "Kozhikode (Calicut), India" },
  { id: 416, name: "Kurnool, India" },
  { id: 417, name: "Latur, India" },
  { id: 418, name: "Lucknow, India" },
  { id: 419, name: "Ludhiana, India" },
  { id: 420, name: "Madurai, India" },
  { id: 421, name: "Malappuram, India" },
  { id: 422, name: "Mangaluru (Mangalore), India" },
  { id: 423, name: "Mathura, India" },
  { id: 424, name: "Meerut, India" },
  { id: 425, name: "Moradabad, India" },
  { id: 426, name: "Mumbai, India" },
  { id: 427, name: "Muzaffarpur, India" },
  { id: 428, name: "Mysuru (Mysore), India" },
  { id: 429, name: "Nagpur, India" },
  { id: 430, name: "Nanded, India" },
  { id: 431, name: "Nashik, India" },
  { id: 432, name: "Navi Mumbai, India" },
  { id: 433, name: "Noida, India" },
  { id: 434, name: "Panaji, India" },
  { id: 435, name: "Patiala, India" },
  { id: 436, name: "Patna, India" },
  { id: 437, name: "Pondicherry (Puducherry), India" },
  { id: 438, name: "Prayagraj (Allahabad), India" },
  { id: 439, name: "Pune, India" },
  { id: 440, name: "Raipur, India" },
  { id: 441, name: "Rajahmundry, India" },
  { id: 442, name: "Rajkot, India" },
  { id: 443, name: "Ranchi, India" },
  { id: 444, name: "Rourkela, India" },
  { id: 445, name: "Salem, India" },
  { id: 446, name: "Shimla, India" },
  { id: 447, name: "Srinagar, India" },
  { id: 448, name: "Surat, India" },
  { id: 449, name: "Thiruvananthapuram (Trivandrum), India" },

  // Asia Pacific
  { id: 450, name: "Singapore" },
  { id: 451, name: "Tokyo, Japan" },
  { id: 452, name: "Sydney, Australia" },
  { id: 453, name: "Melbourne, Australia" },
  { id: 454, name: "Hong Kong" },
  { id: 455, name: "Seoul, South Korea" },
  { id: 456, name: "Taipei, Taiwan" },
  { id: 457, name: "Shanghai, China" },
  { id: 458, name: "Beijing, China" },
  { id: 459, name: "Dubai, UAE" },

  // Other Major Cities
  { id: 460, name: "São Paulo, Brazil" },
  { id: 461, name: "Mexico City, Mexico" },
  { id: 462, name: "Buenos Aires, Argentina" },
  { id: 463, name: "Cape Town, South Africa" },
  { id: 464, name: "Tel Aviv, Israel" }
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface LocationSelectProps {
  onLocationChange?: (location: string | null) => void;
  initialValue?: string | null;
}

export default function LocationSelect({ onLocationChange, initialValue }: LocationSelectProps) {
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ id: number; name: string } | null>(
    initialValue ? locations.find(loc => loc.name === initialValue) || null : null
  );

  const filteredLocations =
    query === ""
      ? locations
      : locations.filter((location) => {
          return location.name.toLowerCase().includes(query.toLowerCase());
        });

  const handleLocationChange = (location: { id: number; name: string } | null) => {
    setSelectedLocation(location);
    onLocationChange?.(location?.name || null);
  };

  return (
    <Combobox as="div" value={selectedLocation} onChange={handleLocationChange}>
      <div className="relative">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 h-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(location: any) => location?.name || ""}
          placeholder="Select a location"
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredLocations.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredLocations.map((location) => (
              <Combobox.Option
                key={location.id}
                value={location}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-8 pr-4",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {location.name}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 left-0 flex items-center pl-1.5",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
